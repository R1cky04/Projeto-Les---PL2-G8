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
import { UpdateInternalUserDto } from './dto/update-internal-user.dto';
import {
  InternalUserUpdateOutcome,
  UpdateInternalUserResponseDto,
} from './dto/update-internal-user-response.dto';
import {
  filterPermissionsForRole,
  getInitialStatusForRole,
  getPermissionsForRole,
  requiresItValidation,
} from './internal-user-access';
import { normalizeUpdateInternalUserInput } from './internal-user-management-validation';
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

type DbUpdatedInternalUserRow = {
  id: string;
  userId: string | null;
  internalRole: InternalUserRole | null;
  internalStatus: string;
  permissions: string[] | string | null;
  requiresItValidation: boolean;
  isActive: boolean;
  createdAt: Date;
};

type InternalUserManagementSnapshot = {
  id: string;
  userId: string | null;
  internalRole: InternalUserRole;
  internalStatus: InternalUserStatus;
  permissions: InternalPermission[];
  requiresItValidation: boolean;
  isActive: boolean;
  createdAt: Date;
  hasActiveReservations: boolean;
  hasActiveRentals: boolean;
  hasActiveTransfers: boolean;
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
          role: normalizeInternalUserRole(
            created.internalRole ?? InternalUserRole.STAFF,
          ),
          status: normalizeInternalUserStatus(created.internalStatus),
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
        role: normalizeInternalUserRole(
          (user.internalRole ?? InternalUserRole.STAFF) as string,
        ),
        status: normalizeInternalUserStatus(user.internalStatus as string),
        permissions: filterPermissionsForRole(
          normalizeInternalUserRole(
            (user.internalRole ?? InternalUserRole.STAFF) as string,
          ),
          normalizeInternalPermissions(user.permissions as string[]),
        ),
        requiresItValidation: user.requiresItValidation,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    };
  }

  private async ensureUserIdIsUnique(
    userId: string,
    ignoreUserId?: string,
  ) {
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

    if (existingUser && existingUser.id !== ignoreUserId) {
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
        ...row,
        role: row.internalRole
          ? normalizeInternalUserRole(row.internalRole)
          : null,
        permissions: row.internalRole
          ? filterPermissionsForRole(
              normalizeInternalUserRole(row.internalRole),
              parseInternalPermissions(row.permissions),
            )
          : [],
      })).map((row) => ({
        id: row.id,
        userId: row.userId,
        internalRole: row.role,
        internalStatus: (
          row.internalStatus === 'PENDING_IT_VALIDATION'
            ? 'PENDING_IT_VALIDATION'
            : 'ACTIVE'
        ) as InternalUserStatus,
        permissions: row.permissions,
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
    const [totalItems, rows] = await this.prisma.$transaction([
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
    const items = rows.map((row) => ({
      ...row,
      role: row.internalRole
        ? normalizeInternalUserRole(row.internalRole as string)
        : null,
      permissions: row.internalRole
        ? filterPermissionsForRole(
            normalizeInternalUserRole(row.internalRole as string),
            normalizeInternalPermissions(row.permissions as string[]),
          )
        : [],
    })).map((row) => ({
      id: row.id,
      userId: row.userId,
      internalRole: row.role,
      internalStatus: normalizeInternalUserStatus(row.internalStatus as string),
      permissions: row.permissions,
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

  private async getInternalUserManagementSnapshot(
    id: string,
  ): Promise<InternalUserManagementSnapshot | null> {
    if (!(this.prisma as any).user) {
      return this.getInternalUserManagementSnapshotRaw(id);
    }

    try {
      const user = await this.prisma.user.findFirst({
        where: { id, isInternal: true },
        select: {
          id: true,
          userId: true,
          internalRole: true,
          internalStatus: true,
          permissions: true,
          requiresItValidation: true,
          isActive: true,
          createdAt: true,
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
      });

      if (!user || !user.internalRole) {
        return null;
      }

      return {
        id: user.id,
        userId: user.userId,
        internalRole: normalizeInternalUserRole(user.internalRole as string),
        internalStatus: normalizeInternalUserStatus(
          user.internalStatus as string,
        ),
        permissions: filterPermissionsForRole(
          normalizeInternalUserRole(user.internalRole as string),
          normalizeInternalPermissions(user.permissions as string[]),
        ),
        requiresItValidation: user.requiresItValidation,
        isActive: user.isActive,
        createdAt: user.createdAt,
        hasActiveReservations: user.createdReservations.some(
          (reservation) =>
            reservation.status === 'CONFIRMED' || reservation.status === 'DRAFT',
        ),
        hasActiveRentals: user.createdRentals.some(
          (rental) => rental.status === 'OPEN',
        ),
        hasActiveTransfers: user.createdTransfers.some(
          (transfer) =>
            transfer.status === 'PENDING' || transfer.status === 'IN_TRANSIT',
        ),
      };
    } catch (error) {
      this.logger.warn(
        `Falling back to raw SQL for internal user management snapshot ${id}: ${String(error)}`,
      );

      return this.getInternalUserManagementSnapshotRaw(id);
    }
  }

  private async getInternalUserManagementSnapshotRaw(
    id: string,
  ): Promise<InternalUserManagementSnapshot | null> {
    const rows = await this.prisma.$queryRaw<
      Array<
        DbUpdatedInternalUserRow & {
          activeReservations: bigint;
          activeRentals: bigint;
          activeTransfers: bigint;
        }
      >
    >`
      SELECT
        u.id,
        u."userId",
        u."internalRole",
        u."internalStatus",
        u.permissions,
        u."requiresItValidation",
        u."isActive",
        u."createdAt",
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
        ) AS "activeTransfers"
      FROM "User" u
      WHERE u.id = ${id}
        AND u."isInternal" = true
      LIMIT 1
    `;
    const row = rows[0];

    if (!row || !row.internalRole) {
      return null;
    }

    return {
      id: row.id,
      userId: row.userId,
      internalRole: normalizeInternalUserRole(row.internalRole),
      internalStatus: normalizeInternalUserStatus(row.internalStatus),
      permissions: filterPermissionsForRole(
        normalizeInternalUserRole(row.internalRole),
        normalizeMaybeInternalPermissions(row.permissions),
      ),
      requiresItValidation: row.requiresItValidation,
      isActive: row.isActive,
      createdAt: row.createdAt,
      hasActiveReservations: Number(row.activeReservations) > 0,
      hasActiveRentals: Number(row.activeRentals) > 0,
      hasActiveTransfers: Number(row.activeTransfers) > 0,
    };
  }

  private async updateInternalUserRaw(
    id: string,
    data: {
      userId: string;
      passwordHash: string | null;
      internalRole: InternalUserRole;
      internalStatus: InternalUserStatus;
      permissions: InternalPermission[];
      requiresItValidation: boolean;
      isActive: boolean;
    },
    revokeSessions: boolean,
  ): Promise<DbUpdatedInternalUserRow> {
    const rows = data.passwordHash
      ? await this.prisma.$queryRaw<DbUpdatedInternalUserRow[]>`
          UPDATE "User"
          SET
            "userId" = ${data.userId},
            "passwordHash" = ${data.passwordHash},
            "fullName" = ${data.userId},
            "internalRole" = ${data.internalRole}::"InternalUserRole",
            "internalStatus" = ${data.internalStatus}::"InternalUserStatus",
            permissions = ${toPgInternalPermissionArrayLiteral(data.permissions)}::"InternalPermission"[],
            "requiresItValidation" = ${data.requiresItValidation},
            "isActive" = ${data.isActive},
            "updatedAt" = NOW()
          WHERE id = ${id}
          RETURNING
            id,
            "userId",
            "internalRole",
            "internalStatus",
            permissions,
            "requiresItValidation",
            "isActive",
            "createdAt"
        `
      : await this.prisma.$queryRaw<DbUpdatedInternalUserRow[]>`
          UPDATE "User"
          SET
            "userId" = ${data.userId},
            "fullName" = ${data.userId},
            "internalRole" = ${data.internalRole}::"InternalUserRole",
            "internalStatus" = ${data.internalStatus}::"InternalUserStatus",
            permissions = ${toPgInternalPermissionArrayLiteral(data.permissions)}::"InternalPermission"[],
            "requiresItValidation" = ${data.requiresItValidation},
            "isActive" = ${data.isActive},
            "updatedAt" = NOW()
          WHERE id = ${id}
          RETURNING
            id,
            "userId",
            "internalRole",
            "internalStatus",
            permissions,
            "requiresItValidation",
            "isActive",
            "createdAt"
        `;

    if (revokeSessions) {
      await this.prisma.$executeRaw`
        UPDATE "InternalSession"
        SET "revokedAt" = NOW(), "updatedAt" = NOW()
        WHERE "userId" = ${id}
          AND "revokedAt" IS NULL
      `;
    }

    return rows[0];
  }

  private async updateInternalUserWithPrisma(
    id: string,
    data: {
      userId: string;
      passwordHash: string | null;
      internalRole: InternalUserRole;
      internalStatus: InternalUserStatus;
      permissions: InternalPermission[];
      requiresItValidation: boolean;
      isActive: boolean;
    },
    revokeSessions: boolean,
  ): Promise<DbUpdatedInternalUserRow> {
    const operations: any[] = [
      this.prisma.user.update({
        where: { id },
        data: {
          userId: data.userId,
          ...(data.passwordHash
            ? {
                passwordHash: data.passwordHash,
              }
            : {}),
          fullName: data.userId,
          internalRole: data.internalRole,
          internalStatus: data.internalStatus,
          permissions: data.permissions,
          requiresItValidation: data.requiresItValidation,
          isActive: data.isActive,
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
      }),
    ];

    if (revokeSessions) {
      operations.push(
        this.prisma.internalSession.updateMany({
          where: { userId: id, revokedAt: null },
          data: { revokedAt: new Date() },
        }),
      );
    }

    const [updatedUser] = await this.prisma.$transaction(operations as any);

    return {
      id: updatedUser.id,
      userId: updatedUser.userId,
      internalRole: updatedUser.internalRole,
      internalStatus: updatedUser.internalStatus as string,
      permissions: toPgInternalPermissionArrayLiteral(
        updatedUser.permissions as InternalPermission[],
      ),
      requiresItValidation: updatedUser.requiresItValidation,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
    };
  }

  private async recordManagementAudit(
    actor: AuthenticatedUserDto,
    targetUserId: string,
    targetUserIdentifier: string,
    outcome: InternalUserUpdateOutcome,
    summary: string,
  ) {
    if (!(this.prisma as any).internalUserManagementAuditLog) {
      await this.prisma.$executeRaw`
        INSERT INTO "InternalUserManagementAuditLog" (
          id,
          outcome,
          "actorUserId",
          "actorUserIdentifier",
          "targetUserId",
          "targetUserIdentifier",
          summary,
          "createdAt"
        )
        VALUES (
          md5(random()::text || clock_timestamp()::text),
          ${outcome}::"InternalUserManagementAuditOutcome",
          ${actor.id},
          ${actor.userId},
          ${targetUserId},
          ${targetUserIdentifier},
          ${summary},
          NOW()
        )
      `;

      return;
    }

    await this.prisma.internalUserManagementAuditLog.create({
      data: {
        actorUserId: actor.id,
        actorUserIdentifier: actor.userId,
        targetUserId,
        targetUserIdentifier,
        outcome,
        summary,
      },
    });
  }

  async update(
    id: string,
    payload: UpdateInternalUserDto,
    actor: AuthenticatedUserDto,
  ): Promise<UpdateInternalUserResponseDto> {
    if (id === actor.id) {
      throw new ConflictException(
        'Nao e permitido alterar a conta atualmente autenticada nesta operacao.',
      );
    }

    const input = normalizeUpdateInternalUserInput(payload);
    const currentUser = await this.getInternalUserManagementSnapshot(id);

    if (!currentUser) {
      throw new NotFoundException('Utilizador interno nao encontrado.');
    }

    await this.ensureUserIdIsUnique(input.userId, currentUser.id);

    const warnings: string[] = [];
    const currentPermissions = [...currentUser.permissions];
    let nextRole = input.role;
    let nextStatus = input.status;
    let nextIsActive = input.isActive;
    let nextPermissions = getPermissionsForRole(nextRole);
    const requestedProtectedChanges =
      input.role !== currentUser.internalRole ||
      input.status !== currentUser.internalStatus ||
      input.isActive !== currentUser.isActive;

    if (currentUser.internalRole === InternalUserRole.IT) {
      nextRole = currentUser.internalRole;
      nextStatus = InternalUserStatus.ACTIVE;
      nextIsActive = true;
      nextPermissions = currentPermissions;

      if (requestedProtectedChanges) {
        warnings.push(
          'As contas com perfil IT sao reservadas. O tipo, o estado, a ativacao e as permissoes herdadas dessa conta foram preservados.',
        );
      }
    } else if (input.role === InternalUserRole.IT) {
      nextRole = currentUser.internalRole;
      nextPermissions = currentPermissions;
      warnings.push(
        'A promocao para IT e reservada ao administrador master. O tipo de utilizador foi preservado.',
      );
    }

    if (
      nextRole !== InternalUserRole.IT &&
      !requiresItValidation(nextRole) &&
      nextStatus === InternalUserStatus.PENDING_IT_VALIDATION
    ) {
      nextStatus = InternalUserStatus.ACTIVE;
      warnings.push(
        'O perfil selecionado nao suporta estado pendente. A conta permaneceu ativa.',
      );
    }

    if (hasActiveOperationalRecords(currentUser)) {
      if (nextRole !== currentUser.internalRole) {
        nextRole = currentUser.internalRole;
        nextPermissions = currentPermissions;
        warnings.push(
          'O tipo de utilizador foi preservado porque a conta ainda possui contratos, reservas ou transferencias ativas.',
        );
      }

      if (nextStatus !== currentUser.internalStatus) {
        nextStatus = currentUser.internalStatus;
        warnings.push(
          'O estado da conta foi preservado porque existem registos operacionais ativos associados ao utilizador.',
        );
      }

      if (nextIsActive !== currentUser.isActive) {
        nextIsActive = currentUser.isActive;
        warnings.push(
          'A ativacao da conta foi preservada porque existem registos operacionais ativos associados ao utilizador.',
        );
      }
    }

    const passwordHash = input.password
      ? this.passwordHasher.hash(input.password)
      : null;
    const nextRequiresItValidation = requiresItValidation(nextRole);
    const updateData = {
      userId: input.userId,
      passwordHash,
      internalRole: nextRole,
      internalStatus: nextStatus,
      permissions: nextPermissions,
      requiresItValidation: nextRequiresItValidation,
      isActive: nextIsActive,
    };
    const accessChanges =
      currentUser.internalRole !== updateData.internalRole ||
      currentUser.internalStatus !== updateData.internalStatus ||
      currentUser.isActive !== updateData.isActive ||
      !haveSamePermissions(currentUser.permissions, updateData.permissions);
    const userChanged = currentUser.userId !== updateData.userId;
    const passwordChanged = Boolean(updateData.passwordHash);
    const hasAppliedChanges = accessChanges || userChanged || passwordChanged;
    const revokeSessions = accessChanges || userChanged || passwordChanged;
    const outcome: InternalUserUpdateOutcome =
      warnings.length > 0 ? 'PARTIAL' : 'UPDATED';

    const updatedUser = !(this.prisma as any).user
      ? await this.updateInternalUserRaw(
          currentUser.id,
          updateData,
          revokeSessions,
        )
      : await this.updateInternalUserWithPrisma(
          currentUser.id,
          updateData,
          revokeSessions,
        );

    const message = buildInternalUserUpdateMessage(hasAppliedChanges, outcome);
    const summary = buildInternalUserManagementSummary(
      currentUser,
      updatedUser,
      warnings,
      hasAppliedChanges,
      passwordChanged,
    );

    await this.recordManagementAudit(
      actor,
      updatedUser.id,
      updatedUser.userId ?? currentUser.userId ?? currentUser.id,
      outcome,
      summary,
    );

    return {
      message,
      outcome,
      warnings,
      user: {
        id: updatedUser.id,
        userId: updatedUser.userId ?? '',
        internalRole: updatedUser.internalRole
          ? normalizeInternalUserRole(updatedUser.internalRole as string)
          : currentUser.internalRole,
        internalStatus: normalizeInternalUserStatus(
          updatedUser.internalStatus as string,
        ),
        permissions: filterPermissionsForRole(
          updatedUser.internalRole
            ? normalizeInternalUserRole(updatedUser.internalRole as string)
            : currentUser.internalRole,
          normalizeMaybeInternalPermissions(updatedUser.permissions),
        ),
        requiresItValidation: updatedUser.requiresItValidation,
        isActive: updatedUser.isActive,
        createdAt: updatedUser.createdAt,
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

    let user;

    if ((this.prisma as any).user) {
      try {
        user = await this.prisma.user.findFirst({
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
        });
      } catch (error) {
        this.logger.warn(
          `Falling back to raw SQL for internal user deletion snapshot ${id}: ${String(error)}`,
        );
        user = await this.getInternalUserDeletionSnapshotRaw(id);
      }
    } else {
      user = await this.getInternalUserDeletionSnapshotRaw(id);
    }

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

function normalizeInternalUserRole(value: string): InternalUserRole {
  return Object.values(InternalUserRole).includes(value as InternalUserRole)
    ? (value as InternalUserRole)
    : InternalUserRole.STAFF;
}

function normalizeInternalUserStatus(value: string): InternalUserStatus {
  return value === InternalUserStatus.PENDING_IT_VALIDATION
    ? InternalUserStatus.PENDING_IT_VALIDATION
    : InternalUserStatus.ACTIVE;
}

function normalizeInternalPermissions(values: string[]): InternalPermission[] {
  return values.filter((value): value is InternalPermission =>
    Object.values(InternalPermission).includes(value as InternalPermission),
  );
}

function normalizeMaybeInternalPermissions(
  values: string[] | string | null,
): InternalPermission[] {
  if (Array.isArray(values)) {
    return normalizeInternalPermissions(values);
  }

  if (typeof values === 'string') {
    return parseInternalPermissions(values);
  }

  return [];
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

function hasActiveOperationalRecords(
  snapshot: InternalUserManagementSnapshot,
): boolean {
  return (
    snapshot.hasActiveReservations ||
    snapshot.hasActiveRentals ||
    snapshot.hasActiveTransfers
  );
}

function haveSamePermissions(
  left: InternalPermission[],
  right: InternalPermission[],
): boolean {
  const normalizedLeft = Array.from(new Set(left)).sort();
  const normalizedRight = Array.from(new Set(right)).sort();

  if (normalizedLeft.length !== normalizedRight.length) {
    return false;
  }

  return normalizedLeft.every(
    (permission, index) => permission === normalizedRight[index],
  );
}

function buildInternalUserUpdateMessage(
  hasAppliedChanges: boolean,
  outcome: InternalUserUpdateOutcome,
): string {
  if (!hasAppliedChanges) {
    return 'O pedido foi validado, mas nao existiam alteracoes efetivas para aplicar.';
  }

  return outcome === 'PARTIAL'
    ? 'Utilizador atualizado com limitacoes aplicadas pelas regras do sistema.'
    : 'Utilizador atualizado com sucesso.';
}

function buildInternalUserManagementSummary(
  currentUser: InternalUserManagementSnapshot,
  updatedUser: DbUpdatedInternalUserRow,
  warnings: string[],
  hasAppliedChanges: boolean,
  passwordChanged: boolean,
): string {
  const updatedPermissions = normalizeMaybeInternalPermissions(
    updatedUser.permissions,
  );
  const updatedRole = updatedUser.internalRole
    ? normalizeInternalUserRole(updatedUser.internalRole)
    : currentUser.internalRole;
  const updatedStatus = normalizeInternalUserStatus(updatedUser.internalStatus);
  const changes: string[] = [];

  if ((updatedUser.userId ?? '') !== (currentUser.userId ?? '')) {
    changes.push(
      `User ID ${currentUser.userId ?? currentUser.id} -> ${updatedUser.userId ?? currentUser.id}`,
    );
  }

  if (updatedRole !== currentUser.internalRole) {
    changes.push(`perfil ${currentUser.internalRole} -> ${updatedRole}`);
  }

  if (updatedStatus !== currentUser.internalStatus) {
    changes.push(`estado ${currentUser.internalStatus} -> ${updatedStatus}`);
  }

  if (updatedUser.isActive !== currentUser.isActive) {
    changes.push(
      `ativacao ${currentUser.isActive ? 'ativa' : 'desativada'} -> ${
        updatedUser.isActive ? 'ativa' : 'desativada'
      }`,
    );
  }

  if (passwordChanged) {
    changes.push('password atualizada');
  }

  if (!haveSamePermissions(updatedPermissions, currentUser.permissions)) {
    changes.push(
      `permissoes ajustadas para ${updatedPermissions.join(', ') || 'sem permissoes'}`,
    );
  }

  const summaryParts = [
    hasAppliedChanges
      ? `Atualizacao aplicada: ${changes.join('; ')}.`
      : 'Pedido validado sem alteracoes efetivas.',
  ];

  if (warnings.length > 0) {
    summaryParts.push(`Limitacoes: ${warnings.join(' ')}`);
  }

  return summaryParts.join(' ');
}
