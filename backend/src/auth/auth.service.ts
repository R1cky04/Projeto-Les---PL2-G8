import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InternalUserStatus } from '../internal-users/internal-user.enums';
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
    const user = await this.prisma.user.findUnique({
      where: { userId: input.userId },
      select: {
        id: true,
        userId: true,
        fullName: true,
        passwordHash: true,
        isInternal: true,
        isActive: true,
        internalRole: true,
        internalStatus: true,
        permissions: true,
      },
    });

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

    const session = await this.prisma.internalSession.create({
      data: {
        tokenId: issuedToken.tokenId,
        tokenHash: issuedToken.tokenHash,
        userId: user.id,
        userAgent: userAgent ?? null,
        expiresAt,
      },
      select: {
        id: true,
      },
    });

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
          user.permissions.length > 0
            ? user.permissions
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

    const session = await this.prisma.internalSession.findUnique({
      where: { tokenId: parsedToken.tokenId },
      select: {
        id: true,
        tokenId: true,
        tokenHash: true,
        expiresAt: true,
        revokedAt: true,
        user: {
          select: {
            id: true,
            userId: true,
            fullName: true,
            isActive: true,
            isInternal: true,
            internalRole: true,
            internalStatus: true,
            permissions: true,
          },
        },
      },
    });

    if (
      !session ||
      session.revokedAt ||
      session.expiresAt <= new Date() ||
      !this.authTokenService.verifySecret(parsedToken.secret, session.tokenHash) ||
      !session.user.isInternal ||
      !session.user.userId ||
      !session.user.internalRole
    ) {
      throw new UnauthorizedException({
        message: 'Sessao invalida ou expirada.',
        code: 'INVALID_SESSION',
      });
    }

    if (!session.user.isActive) {
      throw new ForbiddenException({
        message: 'A conta encontra-se bloqueada ou desativada.',
        code: 'ACCOUNT_BLOCKED',
      });
    }

    const concurrentSessionCount = await this.countActiveSessions(
      session.user.id,
      session.tokenId,
    );

    await this.prisma.internalSession.update({
      where: { tokenId: session.tokenId },
      data: {
        lastSeenAt: new Date(),
      },
    });

    return this.buildAuthenticatedContext({
      sessionId: session.id,
      tokenId: session.tokenId,
      expiresAt: session.expiresAt,
      concurrentSessionCount,
      user: {
        id: session.user.id,
        userId: session.user.userId,
        fullName: session.user.fullName,
        role: session.user.internalRole,
        status: session.user.internalStatus,
        isActive: session.user.isActive,
        accessLevel: this.getAccessLevel(session.user.internalStatus),
        permissions:
          session.user.permissions.length > 0
            ? session.user.permissions
            : getPermissionsForRole(session.user.internalRole),
      },
    });
  }

  getCurrentSession(
    context: AuthenticatedSessionContext,
  ): AuthSessionResponseDto {
    return this.toResponse(context, 'Sessao restaurada com sucesso.');
  }

  async logoutCurrentSession(
    context: AuthenticatedSessionContext,
  ): Promise<{ message: string }> {
    await this.prisma.internalSession.update({
      where: { id: context.sessionId },
      data: {
        revokedAt: new Date(),
      },
    });

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
    return this.prisma.internalSession.count({
      where: {
        userId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
        ...(excludeTokenId
          ? {
              NOT: {
                tokenId: excludeTokenId,
              },
            }
          : {}),
      },
    });
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
