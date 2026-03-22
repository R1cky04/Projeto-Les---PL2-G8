import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  InternalPermission,
  InternalUserRole,
  InternalUserStatus,
} from '../internal-users/internal-user.enums';
import { PrismaService } from '../prisma/prisma.service';
import { getPermissionsForRole } from '../internal-users/internal-user-access';
import { PasswordHasherService } from '../internal-users/password-hasher.service';
import {
  AuthenticatedSessionContext,
  AuthenticatedUserDto,
  AuthSessionResponseDto,
  SessionAccessLevel,
} from './auth.types';
import { buildFeatureCatalog, parseDisabledFeaturesFromEnvironment } from './auth-feature-policy';
import { AuthTokenService } from './auth-token.service';
import { normalizeLoginInput } from './auth-validation';
import { LoginDto } from './dto/login.dto';

type DbUserRow = {
  id: string;
  userId: string | null;
  fullName: string | null;
  passwordHash: string | null;
  isInternal: boolean;
  isActive: boolean;
  internalRole: InternalUserRole | null;
  internalStatus: InternalUserStatus;
  permissions: InternalPermission[] | string | null;
};

type DbSessionWithUserRow = {
  sessionId: string;
  tokenId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  userPkId: string;
  userId: string | null;
  fullName: string | null;
  isActive: boolean;
  isInternal: boolean;
  internalRole: InternalUserRole | null;
  internalStatus: InternalUserStatus;
  permissions: InternalPermission[] | string | null;
};

// Central application service for login, session restore and logout.
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordHasher: PasswordHasherService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  async login(
    payload: LoginDto,
    userAgent?: string,
  ): Promise<AuthSessionResponseDto> {
    const input = normalizeLoginInput(payload);
    const userRows = await this.prisma.$queryRaw<DbUserRow[]>`
      SELECT
        id,
        "userId",
        "fullName",
        "passwordHash",
        "isInternal",
        "isActive",
        "internalRole",
        "internalStatus",
        permissions
      FROM "User"
      WHERE "userId" = ${input.userId}
      LIMIT 1
    `;
    const user = userRows[0];

    if (
      !user ||
      !user.isInternal ||
      !user.userId ||
      !user.passwordHash ||
      !user.internalRole
    ) {
      throw this.createInvalidCredentialsException();
    }

    if (!this.passwordHasher.verify(input.password, user.passwordHash)) {
      throw this.createInvalidCredentialsException();
    }

    if (!user.isActive) {
      throw new ForbiddenException({
        message: 'A conta encontra-se bloqueada ou desativada.',
        code: 'ACCOUNT_BLOCKED',
      });
    }

    const accessLevel = this.getAccessLevel(user.internalStatus);
    const concurrentSessionCount = await this.countActiveSessions(user.id);
    const issuedToken = this.authTokenService.issueToken();
    const expiresAt = this.createSessionExpiry();

    const createdSessionRows = await this.prisma.$queryRaw<{ id: string }[]>`
      INSERT INTO "InternalSession" (
        id,
        "tokenId",
        "tokenHash",
        "userId",
        "userAgent",
        "expiresAt",
        "createdAt",
        "updatedAt",
        "lastSeenAt"
      )
      VALUES (
        md5(random()::text || clock_timestamp()::text),
        ${issuedToken.tokenId},
        ${issuedToken.tokenHash},
        ${user.id},
        ${userAgent ?? null},
        ${expiresAt},
        NOW(),
        NOW(),
        NOW()
      )
      RETURNING id
    `;
    const session = createdSessionRows[0];

    const context = this.buildAuthenticatedContext({
      sessionId: session.id,
      tokenId: issuedToken.tokenId,
      expiresAt,
      concurrentSessionCount,
      user: {
        id: user.id,
        userId: user.userId,
        fullName: user.fullName,
        role: user.internalRole,
        status: user.internalStatus,
        isActive: user.isActive,
        accessLevel,
        permissions:
          this.normalizePermissions(user.permissions).length > 0
            ? this.normalizePermissions(user.permissions)
            : getPermissionsForRole(user.internalRole),
      },
    });

    return this.toResponse(
      context,
      this.getLoginSuccessMessage(accessLevel),
      issuedToken.rawToken,
    );
  }

  async authenticateSessionToken(
    rawToken: string,
  ): Promise<AuthenticatedSessionContext> {
    const parsedToken = this.authTokenService.parseToken(rawToken);

    if (!parsedToken) {
      throw new UnauthorizedException({
        message: 'Sessao invalida ou expirada.',
        code: 'INVALID_SESSION',
      });
    }

    const sessionRows = await this.prisma.$queryRaw<DbSessionWithUserRow[]>`
      SELECT
        s.id AS "sessionId",
        s."tokenId",
        s."tokenHash",
        s."expiresAt",
        s."revokedAt",
        u.id AS "userPkId",
        u."userId",
        u."fullName",
        u."isActive",
        u."isInternal",
        u."internalRole",
        u."internalStatus",
        u.permissions
      FROM "InternalSession" s
      INNER JOIN "User" u ON u.id = s."userId"
      WHERE s."tokenId" = ${parsedToken.tokenId}
      LIMIT 1
    `;
    const session = sessionRows[0];

    if (
      !session ||
      session.revokedAt ||
      session.expiresAt <= new Date() ||
      !this.authTokenService.verifySecret(parsedToken.secret, session.tokenHash) ||
      !session.isInternal ||
      !session.userId ||
      !session.internalRole
    ) {
      throw new UnauthorizedException({
        message: 'Sessao invalida ou expirada.',
        code: 'INVALID_SESSION',
      });
    }

    if (!session.isActive) {
      throw new ForbiddenException({
        message: 'A conta encontra-se bloqueada ou desativada.',
        code: 'ACCOUNT_BLOCKED',
      });
    }

    const concurrentSessionCount = await this.countActiveSessions(
      session.userPkId,
      session.tokenId,
    );

    await this.prisma.$executeRaw`
      UPDATE "InternalSession"
      SET "lastSeenAt" = NOW(), "updatedAt" = NOW()
      WHERE "tokenId" = ${session.tokenId}
    `;

    return this.buildAuthenticatedContext({
      sessionId: session.sessionId,
      tokenId: session.tokenId,
      expiresAt: session.expiresAt,
      concurrentSessionCount,
      user: {
        id: session.userPkId,
        userId: session.userId,
        fullName: session.fullName,
        role: session.internalRole,
        status: session.internalStatus,
        isActive: session.isActive,
        accessLevel: this.getAccessLevel(session.internalStatus),
        permissions:
          this.normalizePermissions(session.permissions).length > 0
            ? this.normalizePermissions(session.permissions)
            : getPermissionsForRole(session.internalRole),
      },
    });
  }

  private normalizePermissions(
    permissions: InternalPermission[] | string | null | undefined,
  ): InternalPermission[] {
    if (Array.isArray(permissions)) {
      return permissions;
    }

    if (typeof permissions !== 'string') {
      return [];
    }

    const trimmed = permissions.trim();

    if (trimmed === '{}' || trimmed.length === 0) {
      return [];
    }

    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return trimmed
        .slice(1, -1)
        .split(',')
        .map((entry) => entry.trim())
        .filter((entry): entry is InternalPermission =>
          Object.values(InternalPermission).includes(
            entry as InternalPermission,
          ),
        );
    }

    return [];
  }

  getCurrentSession(
    context: AuthenticatedSessionContext,
  ): AuthSessionResponseDto {
    return this.toResponse(context, 'Sessao restaurada com sucesso.');
  }

  async logoutCurrentSession(
    context: AuthenticatedSessionContext,
  ): Promise<{ message: string }> {
    await this.prisma.$executeRaw`
      UPDATE "InternalSession"
      SET "revokedAt" = NOW(), "updatedAt" = NOW()
      WHERE id = ${context.sessionId}
    `;

    return {
      message: 'Sessao terminada com sucesso.',
    };
  }

  private buildAuthenticatedContext(base: {
    sessionId: string;
    tokenId: string;
    expiresAt: Date;
    concurrentSessionCount: number;
    user: AuthenticatedUserDto;
  }): AuthenticatedSessionContext {
    const disabledFeatures = parseDisabledFeaturesFromEnvironment();
    const features = buildFeatureCatalog(
      base.user,
      base.user.accessLevel,
      disabledFeatures,
    );
    const warnings = this.buildWarnings(
      base.user.accessLevel,
      base.concurrentSessionCount,
      features.some((feature) => feature.status === 'TEMPORARILY_DISABLED'),
    );

    return {
      sessionId: base.sessionId,
      tokenId: base.tokenId,
      expiresAt: base.expiresAt,
      concurrentSessionCount: base.concurrentSessionCount,
      warnings,
      user: base.user,
      features,
    };
  }

  private toResponse(
    context: AuthenticatedSessionContext,
    message: string,
    token?: string,
  ): AuthSessionResponseDto {
    return {
      message,
      session: {
        token,
        expiresAt: context.expiresAt,
        concurrentSessionCount: context.concurrentSessionCount,
        warnings: context.warnings,
      },
      user: context.user,
      features: context.features,
    };
  }

  private buildWarnings(
    accessLevel: SessionAccessLevel,
    concurrentSessionCount: number,
    hasTemporarilyDisabledFeatures: boolean,
  ): string[] {
    const warnings: string[] = [];

    if (accessLevel === 'LIMITED') {
      warnings.push(
        'Conta autenticada com acesso limitado enquanto aguarda validacao final do IT ou administrador.',
      );
    }

    if (concurrentSessionCount > 0) {
      warnings.push(
        'Ja existe pelo menos uma sessao ativa com o mesmo User ID noutro dispositivo.',
      );
    }

    if (hasTemporarilyDisabledFeatures) {
      warnings.push(
        'Algumas funcionalidades estao temporariamente indisponiveis.',
      );
    }

    return warnings;
  }

  private async countActiveSessions(
    userId: string,
    excludeTokenId?: string,
  ): Promise<number> {
    const rows = excludeTokenId
      ? await this.prisma.$queryRaw<{ total: bigint }[]>`
          SELECT COUNT(*)::bigint AS total
          FROM "InternalSession"
          WHERE "userId" = ${userId}
            AND "revokedAt" IS NULL
            AND "expiresAt" > NOW()
            AND "tokenId" <> ${excludeTokenId}
        `
      : await this.prisma.$queryRaw<{ total: bigint }[]>`
          SELECT COUNT(*)::bigint AS total
          FROM "InternalSession"
          WHERE "userId" = ${userId}
            AND "revokedAt" IS NULL
            AND "expiresAt" > NOW()
        `;

    return Number(rows[0]?.total ?? 0n);
  }

  private getAccessLevel(status: InternalUserStatus): SessionAccessLevel {
    return status === InternalUserStatus.PENDING_IT_VALIDATION
      ? 'LIMITED'
      : 'FULL';
  }

  private getLoginSuccessMessage(accessLevel: SessionAccessLevel): string {
    return accessLevel === 'LIMITED'
      ? 'Login efetuado com acesso limitado.'
      : 'Login efetuado com sucesso.';
  }

  private createInvalidCredentialsException(): UnauthorizedException {
    return new UnauthorizedException({
      message: 'Credenciais invalidas.',
      code: 'INVALID_CREDENTIALS',
    });
  }

  private createSessionExpiry(): Date {
    const configuredHours = Number(process.env.INTERNAL_SESSION_TTL_HOURS ?? 12);
    const ttlHours = Number.isFinite(configuredHours) && configuredHours > 0
      ? configuredHours
      : 12;

    return new Date(Date.now() + ttlHours * 60 * 60 * 1000);
  }
}
