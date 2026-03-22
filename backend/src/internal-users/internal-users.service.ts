import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  InternalPermission,
  InternalUserRole,
  InternalUserStatus,
} from './internal-user.enums';
import { AuthenticatedUserDto } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInternalUserDto } from './dto/create-internal-user.dto';
import { CreateInternalUserResponseDto } from './dto/create-internal-user-response.dto';
import {
  DeleteInternalUserResponseDto,
  InternalUserDeletionMode,
} from './dto/delete-internal-user-response.dto';
import { ListInternalUsersResponseDto } from './dto/list-internal-users-response.dto';
import {
  getInitialStatusForRole,
  getPermissionsForRole,
  requiresItValidation,
} from './internal-user-access';
import { normalizeCreateInternalUserInput } from './internal-user-validation';
import { PasswordHasherService } from './password-hasher.service';

type DbInternalUserListRow = {
  id: string;
  userId: string | null;
  internalRole: InternalUserRole | null;
  internalStatus: string;
  permissions: string | null;
  requiresItValidation: boolean;
  isActive: boolean;
  createdAt: Date;
};

type DbCreatedInternalUserRow = {
  id: string;
  userId: string | null;
  internalRole: InternalUserRole | null;
  internalStatus: InternalUserStatus;
  requiresItValidation: boolean;
  isActive: boolean;
  createdAt: Date;
};

type InternalUserDeletionSnapshot = {
  id: string;
  userId: string | null;
  isActive: boolean;
  hasActiveReservations: boolean;
  hasActiveRentals: boolean;
  hasActiveTransfers: boolean;
  historyReservations: number;
  historyRentals: number;
  historyTransfers: number;
};

// Application service for internal-user provisioning and lifecycle actions.
@Injectable()
export class InternalUsersService {
  private static readonly DEFAULT_PAGE = 1;
  private static readonly DEFAULT_PAGE_SIZE = 10;
  private static readonly MAX_PAGE_SIZE = 20;
  private readonly logger = new Logger(InternalUsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordHasher: PasswordHasherService,
  ) {}

  async create(
    payload: CreateInternalUserDto,
  ): Promise<CreateInternalUserResponseDto> {
    const input = normalizeCreateInternalUserInput(payload);

    await this.ensureUserIdIsUnique(input.userId);

    const permissions = getPermissionsForRole(input.role);
    const pendingValidation = requiresItValidation(input.role);
    const passwordHash = this.passwordHasher.hash(input.password);

    if (!(this.prisma as any).user) {
      const createdRows = await this.prisma.$queryRaw<DbCreatedInternalUserRow[]>`
        INSERT INTO "User" (
          id,
          "userId",
          "passwordHash",
          "fullName",
          "isInternal",
          "internalRole",
          "internalStatus",
          permissions,
          "requiresItValidation",
          "isActive",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          md5(random()::text || clock_timestamp()::text),
          ${input.userId},
          ${passwordHash},
          ${input.userId},
          true,
          ${input.role}::"InternalUserRole",
          ${getInitialStatusForRole(input.role)}::"InternalUserStatus",
          ${toPgInternalPermissionArrayLiteral(permissions)}::"InternalPermission"[],
          ${pendingValidation},
          true,
          NOW(),
          NOW()
        )
        RETURNING
          id,
          "userId",
          "internalRole",
          "internalStatus",
          "requiresItValidation",
          "isActive",
          "createdAt"
      `;

      const created = createdRows[0];

      return {
        message: getCreationMessage(input.role),
        user: {
          id: created.id,
          userId: created.userId ?? '',
          role: created.internalRole ?? InternalUserRole.STAFF,
          status: created.internalStatus,
          permissions,
          requiresItValidation: created.requiresItValidation,
          isActive: created.isActive,
          createdAt: created.createdAt,
        },
      };
    }

    const user = await this.prisma.user.create({
      data: {
        userId: input.userId,
        passwordHash,
        // The flow does not collect a display name yet; keep a stable placeholder.
        fullName: input.userId,
        isInternal: true,
        internalRole: input.role,
        internalStatus: getInitialStatusForRole(input.role),
        permissions,
        requiresItValidation: pendingValidation,
        // Pending validation users can authenticate with limited access; blocked
        // accounts are represented separately through isActive = false.
        isActive: true,
      },
      select: {
        id: true,
        userId: true,
        internalRole: true,
        internalStatus: true,
        permissions: true,
        requiresItValidation: true,
        isActive: true,
        createdAt: true,
      },
    });

    return {
      message: getCreationMessage(input.role),
      user: {
        id: user.id,
        userId: user.userId ?? '',
        role: user.internalRole ?? InternalUserRole.STAFF,
        status: user.internalStatus,
        permissions: user.permissions,
        requiresItValidation: user.requiresItValidation,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    };
  }

  private async ensureUserIdIsUnique(userId: string) {
    // Keep the failure deterministic and user-friendly before hitting the unique index.
    const existingUser = (this.prisma as any).user
      ? await this.prisma.user.findUnique({
          where: { userId },
          select: { id: true },
        })
      : (
          await this.prisma.$queryRaw<{ id: string }[]>`
            SELECT id
            FROM "User"
            WHERE "userId" = ${userId}
            LIMIT 1
          `
        )[0];

    if (existingUser) {
      throw new ConflictException({
        message: 'O User ID indicado ja existe.',
        code: 'USER_ID_ALREADY_EXISTS',
      });
    }
  }

  async findAll(
    pageInput?: number | string,
    pageSizeInput?: number | string,
    searchInput?: string,
  ): Promise<ListInternalUsersResponseDto> {
    const page = normalizePositiveInteger(
      pageInput,
      InternalUsersService.DEFAULT_PAGE,
    );
    const pageSize = Math.min(
      normalizePositiveInteger(
        pageSizeInput,
        InternalUsersService.DEFAULT_PAGE_SIZE,
      ),
      InternalUsersService.MAX_PAGE_SIZE,
    );
    const searchTerm = normalizeSearchTerm(searchInput);
    const skip = (page - 1) * pageSize;
    const where = buildInternalUserDirectoryWhere(searchTerm);

    if (!(this.prisma as any).user) {
      const likeSearch = searchTerm ? `%${searchTerm}%` : null;
      const countRows = likeSearch
        ? await this.prisma.$queryRaw<{ total: bigint }[]>`
            SELECT COUNT(*)::bigint AS total
            FROM "User"
            WHERE "isInternal" = true
              AND "userId" ILIKE ${likeSearch}
          `
        : await this.prisma.$queryRaw<{ total: bigint }[]>`
            SELECT COUNT(*)::bigint AS total
            FROM "User"
            WHERE "isInternal" = true
          `;

      const rows = likeSearch
        ? await this.prisma.$queryRaw<DbInternalUserListRow[]>`
            SELECT
              id,
              "userId",
              "internalRole",
              "internalStatus",
              permissions,
              "requiresItValidation",
              "isActive",
              "createdAt"
            FROM "User"
            WHERE "isInternal" = true
              AND "userId" ILIKE ${likeSearch}
            ORDER BY "createdAt" DESC
            OFFSET ${skip}
            LIMIT ${pageSize}
          `
        : await this.prisma.$queryRaw<DbInternalUserListRow[]>`
            SELECT
              id,
              "userId",
              "internalRole",
              "internalStatus",
              permissions,
              "requiresItValidation",
              "isActive",
              "createdAt"
            FROM "User"
            WHERE "isInternal" = true
            ORDER BY "createdAt" DESC
            OFFSET ${skip}
            LIMIT ${pageSize}
          `;

      const totalItems = Number(countRows[0]?.total ?? 0n);
      const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

      const items = rows.map((row) => ({
        id: row.id,
        userId: row.userId,
        internalRole: row.internalRole,
        internalStatus: (
          row.internalStatus === 'PENDING_IT_VALIDATION'
            ? 'PENDING_IT_VALIDATION'
            : 'ACTIVE'
        ) as InternalUserStatus,
        permissions: parseInternalPermissions(row.permissions),
        requiresItValidation: row.requiresItValidation,
        isActive: row.isActive,
        createdAt: row.createdAt,
      }));

      this.logger.log(
        `Found ${items.length} internal users on page ${page} of ${totalPages}${searchTerm ? ` for search "${searchTerm}"` : ''}.`,
      );

      return {
        items,
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages,
          hasPreviousPage: page > 1,
          hasNextPage: page < totalPages,
        },
      };
    }

    // The IT directory can grow large, so the API returns both the current slice
    // and enough metadata for the client to page or search without loading
    // every account into the browser first.
    const [totalItems, items] = await this.prisma.$transaction([
      this.prisma.user.count({
        where,
      }),
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          userId: true,
          internalRole: true,
          internalStatus: true,
          permissions: true,
          requiresItValidation: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    this.logger.log(
      `Found ${items.length} internal users on page ${page} of ${totalPages}${searchTerm ? ` for search "${searchTerm}"` : ''}.`,
    );

    return {
      items,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };
  }

  async remove(
    id: string,
    actor: AuthenticatedUserDto,
  ): Promise<DeleteInternalUserResponseDto> {
    if (id === actor.id) {
      throw new ConflictException(
        'Nao e permitido remover a conta atualmente autenticada.',
      );
    }

    const user = (this.prisma as any).user
      ? await this.prisma.user.findFirst({
          where: { id, isInternal: true },
          select: {
            id: true,
            userId: true,
            isActive: true,
            createdReservations: {
              select: { id: true, status: true },
            },
            createdRentals: {
              select: { id: true, status: true },
            },
            createdTransfers: {
              select: { id: true, status: true },
            },
          },
        })
      : await this.getInternalUserDeletionSnapshotRaw(id);

    if (!user) {
      throw new NotFoundException('Utilizador interno nao encontrado.');
    }

    if (!user.isActive) {
      throw new NotFoundException(
        'O utilizador indicado ja foi removido ou desativado.',
      );
    }

    const hasActiveReservations = 'createdReservations' in user
      ? user.createdReservations.some(
          (res) => res.status === 'CONFIRMED' || res.status === 'DRAFT',
        )
      : user.hasActiveReservations;
    const hasActiveRentals = 'createdRentals' in user
      ? user.createdRentals.some((rental) => rental.status === 'OPEN')
      : user.hasActiveRentals;
    const hasActiveTransfers = 'createdTransfers' in user
      ? user.createdTransfers.some(
          (transfer) =>
            transfer.status === 'PENDING' || transfer.status === 'IN_TRANSIT',
        )
      : user.hasActiveTransfers;

    if (hasActiveReservations || hasActiveRentals || hasActiveTransfers) {
      throw new ConflictException(
        'Nao foi possivel eliminar ou desativar: o utilizador possui contratos ou reservas ativas.',
      );
    }

    const targetUserId = user.userId ?? id;
    const hasHistory = 'createdReservations' in user
      ?
          user.createdReservations.length > 0 ||
          user.createdRentals.length > 0 ||
          user.createdTransfers.length > 0
      :
          user.historyReservations > 0 ||
          user.historyRentals > 0 ||
          user.historyTransfers > 0;

    if (hasHistory) {
      return this.softDeleteUser(id, targetUserId, actor);
    }

    return this.deleteUser(id, targetUserId, actor);
  }

  private async softDeleteUser(
    id: string,
    targetUserId: string,
    actor: AuthenticatedUserDto,
  ): Promise<DeleteInternalUserResponseDto> {
    if (!(this.prisma as any).user) {
      await this.prisma.$executeRaw`
        UPDATE "User"
        SET "isActive" = false, "updatedAt" = NOW()
        WHERE id = ${id}
      `;

      await this.prisma.$executeRaw`
        UPDATE "InternalSession"
        SET "revokedAt" = NOW(), "updatedAt" = NOW()
        WHERE "userId" = ${id}
          AND "revokedAt" IS NULL
      `;

      await this.prisma.$executeRaw`
        INSERT INTO "InternalUserDeletionAuditLog" (
          id,
          mode,
          "actorUserId",
          "actorUserIdentifier",
          "targetUserId",
          "targetUserIdentifier",
          summary,
          "createdAt"
        )
        VALUES (
          md5(random()::text || clock_timestamp()::text),
          ${toDeletionAuditMode('DEACTIVATED')}::"InternalUserDeletionAuditMode",
          ${actor.id},
          ${actor.userId},
          ${id},
          ${targetUserId},
          'Conta desativada para reter historico existente e remover o acesso imediato.',
          NOW()
        )
      `;

      this.logger.log(
        `Internal user ${targetUserId} (${id}) was deactivated by ${actor.userId}.`,
      );

      return {
        message:
          'Utilizador desativado temporariamente devido a retencao de historico.',
        mode: 'DEACTIVATED',
        userId: targetUserId,
      };
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id },
        data: { isActive: false },
      }),
      this.prisma.internalSession.updateMany({
        where: { userId: id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
      this.prisma.internalUserDeletionAuditLog.create({
        data: this.buildDeletionAuditEntry({
          actor,
          targetUserId: id,
          targetUserIdentifier: targetUserId,
          mode: 'DEACTIVATED',
          summary:
            'Conta desativada para reter historico existente e remover o acesso imediato.',
        }),
      }),
    ]);

    this.logger.log(
      `Internal user ${targetUserId} (${id}) was deactivated by ${actor.userId}.`,
    );

    return {
      message:
        'Utilizador desativado temporariamente devido a retencao de historico.',
      mode: 'DEACTIVATED',
      userId: targetUserId,
    };
  }

  private async deleteUser(
    id: string,
    targetUserId: string,
    actor: AuthenticatedUserDto,
  ): Promise<DeleteInternalUserResponseDto> {
    if (!(this.prisma as any).user) {
      await this.prisma.$executeRaw`
        UPDATE "InternalSession"
        SET "revokedAt" = NOW(), "updatedAt" = NOW()
        WHERE "userId" = ${id}
          AND "revokedAt" IS NULL
      `;

      await this.prisma.$executeRaw`
        INSERT INTO "InternalUserDeletionAuditLog" (
          id,
          mode,
          "actorUserId",
          "actorUserIdentifier",
          "targetUserId",
          "targetUserIdentifier",
          summary,
          "createdAt"
        )
        VALUES (
          md5(random()::text || clock_timestamp()::text),
          ${toDeletionAuditMode('DELETED')}::"InternalUserDeletionAuditMode",
          ${actor.id},
          ${actor.userId},
          ${id},
          ${targetUserId},
          'Conta eliminada permanentemente por nao possuir historico a reter.',
          NOW()
        )
      `;

      await this.prisma.$executeRaw`
        DELETE FROM "User"
        WHERE id = ${id}
      `;

      this.logger.log(
        `Internal user ${targetUserId} (${id}) was permanently deleted by ${actor.userId}.`,
      );

      return {
        message: 'Utilizador removido permanentemente com sucesso.',
        mode: 'DELETED',
        userId: targetUserId,
      };
    }

    await this.prisma.$transaction([
      this.prisma.internalSession.updateMany({
        where: { userId: id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
      this.prisma.internalUserDeletionAuditLog.create({
        data: this.buildDeletionAuditEntry({
          actor,
          targetUserId: id,
          targetUserIdentifier: targetUserId,
          mode: 'DELETED',
          summary:
            'Conta eliminada permanentemente por nao possuir historico a reter.',
        }),
      }),
      this.prisma.user.delete({ where: { id } }),
    ]);

    this.logger.log(
      `Internal user ${targetUserId} (${id}) was permanently deleted by ${actor.userId}.`,
    );

    return {
      message: 'Utilizador removido permanentemente com sucesso.',
      mode: 'DELETED',
      userId: targetUserId,
    };
  }

  private buildDeletionAuditEntry(input: {
    actor: AuthenticatedUserDto;
    targetUserId: string;
    targetUserIdentifier: string;
    mode: InternalUserDeletionMode;
    summary: string;
  }) {
    return {
      actorUserId: input.actor.id,
      actorUserIdentifier: input.actor.userId,
      targetUserId: input.targetUserId,
      targetUserIdentifier: input.targetUserIdentifier,
      mode: toDeletionAuditMode(input.mode),
      summary: input.summary,
    };
  }

  private async getInternalUserDeletionSnapshotRaw(
    id: string,
  ): Promise<InternalUserDeletionSnapshot | null> {
    const rows = await this.prisma.$queryRaw<
      Array<
        InternalUserDeletionSnapshot & {
          activeReservations: bigint;
          activeRentals: bigint;
          activeTransfers: bigint;
          totalReservations: bigint;
          totalRentals: bigint;
          totalTransfers: bigint;
        }
      >
    >`
      SELECT
        u.id,
        u."userId",
        u."isActive",
        (
          SELECT COUNT(*)::bigint
          FROM "Reservation" r
          WHERE r."createdById" = u.id
            AND r.status IN ('CONFIRMED', 'DRAFT')
        ) AS "activeReservations",
        (
          SELECT COUNT(*)::bigint
          FROM "Rental" rt
          WHERE rt."createdById" = u.id
            AND rt.status = 'OPEN'
        ) AS "activeRentals",
        (
          SELECT COUNT(*)::bigint
          FROM "VehicleTransfer" vt
          WHERE vt."createdById" = u.id
            AND vt.status IN ('PENDING', 'IN_TRANSIT')
        ) AS "activeTransfers",
        (
          SELECT COUNT(*)::bigint
          FROM "Reservation" r
          WHERE r."createdById" = u.id
        ) AS "totalReservations",
        (
          SELECT COUNT(*)::bigint
          FROM "Rental" rt
          WHERE rt."createdById" = u.id
        ) AS "totalRentals",
        (
          SELECT COUNT(*)::bigint
          FROM "VehicleTransfer" vt
          WHERE vt."createdById" = u.id
        ) AS "totalTransfers"
      FROM "User" u
      WHERE u.id = ${id}
        AND u."isInternal" = true
      LIMIT 1
    `;

    const row = rows[0];

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      userId: row.userId,
      isActive: row.isActive,
      hasActiveReservations: Number(row.activeReservations) > 0,
      hasActiveRentals: Number(row.activeRentals) > 0,
      hasActiveTransfers: Number(row.activeTransfers) > 0,
      historyReservations: Number(row.totalReservations),
      historyRentals: Number(row.totalRentals),
      historyTransfers: Number(row.totalTransfers),
    };
  }
}

function parseInternalPermissions(raw: string | null): InternalPermission[] {
  if (!raw) {
    return [];
  }

  const trimmed = raw.trim();

  if (trimmed === '{}' || trimmed.length === 0) {
    return [];
  }

  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
    return [];
  }

  return trimmed
    .slice(1, -1)
    .split(',')
    .map((permission) => permission.trim())
    .filter(
      (permission): permission is InternalPermission =>
        Object.values(InternalPermission).includes(
          permission as InternalPermission,
        ),
    );
}

function toPgInternalPermissionArrayLiteral(
  permissions: InternalPermission[],
): string {
  if (permissions.length === 0) {
    return '{}';
  }

  return `{${permissions.join(',')}}`;
}

function getCreationMessage(role: InternalUserRole): string {
  return requiresItValidation(role)
    ? 'Utilizador criado com sucesso, mas a conta fica pendente de validacao do IT.'
    : 'Utilizador criado com sucesso.';
}

function toDeletionAuditMode(
  mode: InternalUserDeletionMode,
): 'DEACTIVATED' | 'DELETED' {
  return mode === 'DEACTIVATED'
    ? 'DEACTIVATED'
    : 'DELETED';
}

function normalizePositiveInteger(
  input: number | string | undefined,
  fallback: number,
): number {
  const normalizedValue =
    typeof input === 'string' ? Number.parseInt(input, 10) : input;

  if (
    typeof normalizedValue === 'number' &&
    Number.isInteger(normalizedValue) &&
    normalizedValue > 0
  ) {
    return normalizedValue;
  }

  return fallback;
}

function normalizeSearchTerm(input: string | undefined): string | undefined {
  if (typeof input !== 'string') {
    return undefined;
  }

  const normalizedValue = input.trim();

  return normalizedValue ? normalizedValue : undefined;
}

function buildInternalUserDirectoryWhere(
  searchTerm?: string,
): Record<string, unknown> {
  if (!searchTerm) {
    return {
      isInternal: true,
    };
  }

  return {
    isInternal: true,
    userId: {
      contains: searchTerm,
      mode: 'insensitive',
    },
  };
}
