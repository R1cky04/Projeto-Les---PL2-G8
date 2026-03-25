"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var InternalUsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalUsersService = void 0;
const common_1 = require("@nestjs/common");
const internal_user_enums_1 = require("./internal-user.enums");
const prisma_service_1 = require("../prisma/prisma.service");
const internal_user_access_1 = require("./internal-user-access");
const internal_user_management_validation_1 = require("./internal-user-management-validation");
const internal_user_validation_1 = require("./internal-user-validation");
const password_hasher_service_1 = require("./password-hasher.service");
let InternalUsersService = class InternalUsersService {
    static { InternalUsersService_1 = this; }
    prisma;
    passwordHasher;
    static DEFAULT_PAGE = 1;
    static DEFAULT_PAGE_SIZE = 10;
    static MAX_PAGE_SIZE = 20;
    logger = new common_1.Logger(InternalUsersService_1.name);
    constructor(prisma, passwordHasher) {
        this.prisma = prisma;
        this.passwordHasher = passwordHasher;
    }
    async create(payload) {
        const input = (0, internal_user_validation_1.normalizeCreateInternalUserInput)(payload);
        await this.ensureUserIdIsUnique(input.userId);
        const permissions = (0, internal_user_access_1.getPermissionsForRole)(input.role);
        const pendingValidation = (0, internal_user_access_1.requiresItValidation)(input.role);
        const passwordHash = this.passwordHasher.hash(input.password);
        if (!this.prisma.user) {
            const createdRows = await this.prisma.$queryRaw `
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
          ${(0, internal_user_access_1.getInitialStatusForRole)(input.role)}::"InternalUserStatus",
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
                    role: normalizeInternalUserRole(created.internalRole ?? internal_user_enums_1.InternalUserRole.STAFF),
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
                fullName: input.userId,
                isInternal: true,
                internalRole: input.role,
                internalStatus: (0, internal_user_access_1.getInitialStatusForRole)(input.role),
                permissions,
                requiresItValidation: pendingValidation,
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
                role: normalizeInternalUserRole((user.internalRole ?? internal_user_enums_1.InternalUserRole.STAFF)),
                status: normalizeInternalUserStatus(user.internalStatus),
                permissions: (0, internal_user_access_1.filterPermissionsForRole)(normalizeInternalUserRole((user.internalRole ?? internal_user_enums_1.InternalUserRole.STAFF)), normalizeInternalPermissions(user.permissions)),
                requiresItValidation: user.requiresItValidation,
                isActive: user.isActive,
                createdAt: user.createdAt,
            },
        };
    }
    async ensureUserIdIsUnique(userId, ignoreUserId) {
        const existingUser = this.prisma.user
            ? await this.prisma.user.findUnique({
                where: { userId },
                select: { id: true },
            })
            : (await this.prisma.$queryRaw `
            SELECT id
            FROM "User"
            WHERE "userId" = ${userId}
            LIMIT 1
          `)[0];
        if (existingUser && existingUser.id !== ignoreUserId) {
            throw new common_1.ConflictException({
                message: 'O User ID indicado ja existe.',
                code: 'USER_ID_ALREADY_EXISTS',
            });
        }
    }
    async findAll(pageInput, pageSizeInput, searchInput) {
        const page = normalizePositiveInteger(pageInput, InternalUsersService_1.DEFAULT_PAGE);
        const pageSize = Math.min(normalizePositiveInteger(pageSizeInput, InternalUsersService_1.DEFAULT_PAGE_SIZE), InternalUsersService_1.MAX_PAGE_SIZE);
        const searchTerm = normalizeSearchTerm(searchInput);
        const skip = (page - 1) * pageSize;
        const where = buildInternalUserDirectoryWhere(searchTerm);
        if (!this.prisma.user) {
            const likeSearch = searchTerm ? `%${searchTerm}%` : null;
            const countRows = likeSearch
                ? await this.prisma.$queryRaw `
            SELECT COUNT(*)::bigint AS total
            FROM "User"
            WHERE "isInternal" = true
              AND "userId" ILIKE ${likeSearch}
          `
                : await this.prisma.$queryRaw `
            SELECT COUNT(*)::bigint AS total
            FROM "User"
            WHERE "isInternal" = true
          `;
            const rows = likeSearch
                ? await this.prisma.$queryRaw `
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
                : await this.prisma.$queryRaw `
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
                    ? (0, internal_user_access_1.filterPermissionsForRole)(normalizeInternalUserRole(row.internalRole), parseInternalPermissions(row.permissions))
                    : [],
            })).map((row) => ({
                id: row.id,
                userId: row.userId,
                internalRole: row.role,
                internalStatus: (row.internalStatus === 'PENDING_IT_VALIDATION'
                    ? 'PENDING_IT_VALIDATION'
                    : 'ACTIVE'),
                permissions: row.permissions,
                requiresItValidation: row.requiresItValidation,
                isActive: row.isActive,
                createdAt: row.createdAt,
            }));
            this.logger.log(`Found ${items.length} internal users on page ${page} of ${totalPages}${searchTerm ? ` for search "${searchTerm}"` : ''}.`);
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
                ? normalizeInternalUserRole(row.internalRole)
                : null,
            permissions: row.internalRole
                ? (0, internal_user_access_1.filterPermissionsForRole)(normalizeInternalUserRole(row.internalRole), normalizeInternalPermissions(row.permissions))
                : [],
        })).map((row) => ({
            id: row.id,
            userId: row.userId,
            internalRole: row.role,
            internalStatus: normalizeInternalUserStatus(row.internalStatus),
            permissions: row.permissions,
            requiresItValidation: row.requiresItValidation,
            isActive: row.isActive,
            createdAt: row.createdAt,
        }));
        this.logger.log(`Found ${items.length} internal users on page ${page} of ${totalPages}${searchTerm ? ` for search "${searchTerm}"` : ''}.`);
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
    async getInternalUserManagementSnapshot(id) {
        if (!this.prisma.user) {
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
                internalRole: normalizeInternalUserRole(user.internalRole),
                internalStatus: normalizeInternalUserStatus(user.internalStatus),
                permissions: (0, internal_user_access_1.filterPermissionsForRole)(normalizeInternalUserRole(user.internalRole), normalizeInternalPermissions(user.permissions)),
                requiresItValidation: user.requiresItValidation,
                isActive: user.isActive,
                createdAt: user.createdAt,
                hasActiveReservations: user.createdReservations.some((reservation) => reservation.status === 'CONFIRMED' || reservation.status === 'DRAFT'),
                hasActiveRentals: user.createdRentals.some((rental) => rental.status === 'OPEN'),
                hasActiveTransfers: user.createdTransfers.some((transfer) => transfer.status === 'PENDING' || transfer.status === 'IN_TRANSIT'),
            };
        }
        catch (error) {
            this.logger.warn(`Falling back to raw SQL for internal user management snapshot ${id}: ${String(error)}`);
            return this.getInternalUserManagementSnapshotRaw(id);
        }
    }
    async getInternalUserManagementSnapshotRaw(id) {
        const rows = await this.prisma.$queryRaw `
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
            permissions: (0, internal_user_access_1.filterPermissionsForRole)(normalizeInternalUserRole(row.internalRole), normalizeMaybeInternalPermissions(row.permissions)),
            requiresItValidation: row.requiresItValidation,
            isActive: row.isActive,
            createdAt: row.createdAt,
            hasActiveReservations: Number(row.activeReservations) > 0,
            hasActiveRentals: Number(row.activeRentals) > 0,
            hasActiveTransfers: Number(row.activeTransfers) > 0,
        };
    }
    async updateInternalUserRaw(id, data, revokeSessions) {
        const rows = data.passwordHash
            ? await this.prisma.$queryRaw `
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
            : await this.prisma.$queryRaw `
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
            await this.prisma.$executeRaw `
        UPDATE "InternalSession"
        SET "revokedAt" = NOW(), "updatedAt" = NOW()
        WHERE "userId" = ${id}
          AND "revokedAt" IS NULL
      `;
        }
        return rows[0];
    }
    async updateInternalUserWithPrisma(id, data, revokeSessions) {
        const operations = [
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
            operations.push(this.prisma.internalSession.updateMany({
                where: { userId: id, revokedAt: null },
                data: { revokedAt: new Date() },
            }));
        }
        const [updatedUser] = await this.prisma.$transaction(operations);
        return {
            id: updatedUser.id,
            userId: updatedUser.userId,
            internalRole: updatedUser.internalRole,
            internalStatus: updatedUser.internalStatus,
            permissions: toPgInternalPermissionArrayLiteral(updatedUser.permissions),
            requiresItValidation: updatedUser.requiresItValidation,
            isActive: updatedUser.isActive,
            createdAt: updatedUser.createdAt,
        };
    }
    async recordManagementAudit(actor, targetUserId, targetUserIdentifier, outcome, summary) {
        if (!this.prisma.internalUserManagementAuditLog) {
            await this.prisma.$executeRaw `
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
    async update(id, payload, actor) {
        if (id === actor.id) {
            throw new common_1.ConflictException('Nao e permitido alterar a conta atualmente autenticada nesta operacao.');
        }
        const input = (0, internal_user_management_validation_1.normalizeUpdateInternalUserInput)(payload);
        const currentUser = await this.getInternalUserManagementSnapshot(id);
        if (!currentUser) {
            throw new common_1.NotFoundException('Utilizador interno nao encontrado.');
        }
        await this.ensureUserIdIsUnique(input.userId, currentUser.id);
        const warnings = [];
        const currentPermissions = [...currentUser.permissions];
        let nextRole = input.role;
        let nextStatus = input.status;
        let nextIsActive = input.isActive;
        let nextPermissions = (0, internal_user_access_1.getPermissionsForRole)(nextRole);
        const requestedProtectedChanges = input.role !== currentUser.internalRole ||
            input.status !== currentUser.internalStatus ||
            input.isActive !== currentUser.isActive;
        if (currentUser.internalRole === internal_user_enums_1.InternalUserRole.IT) {
            nextRole = currentUser.internalRole;
            nextStatus = internal_user_enums_1.InternalUserStatus.ACTIVE;
            nextIsActive = true;
            nextPermissions = currentPermissions;
            if (requestedProtectedChanges) {
                warnings.push('As contas com perfil IT sao reservadas. O tipo, o estado, a ativacao e as permissoes herdadas dessa conta foram preservados.');
            }
        }
        else if (input.role === internal_user_enums_1.InternalUserRole.IT) {
            nextRole = currentUser.internalRole;
            nextPermissions = currentPermissions;
            warnings.push('A promocao para IT e reservada ao administrador master. O tipo de utilizador foi preservado.');
        }
        if (nextRole !== internal_user_enums_1.InternalUserRole.IT &&
            !(0, internal_user_access_1.requiresItValidation)(nextRole) &&
            nextStatus === internal_user_enums_1.InternalUserStatus.PENDING_IT_VALIDATION) {
            nextStatus = internal_user_enums_1.InternalUserStatus.ACTIVE;
            warnings.push('O perfil selecionado nao suporta estado pendente. A conta permaneceu ativa.');
        }
        if (hasActiveOperationalRecords(currentUser)) {
            if (nextRole !== currentUser.internalRole) {
                nextRole = currentUser.internalRole;
                nextPermissions = currentPermissions;
                warnings.push('O tipo de utilizador foi preservado porque a conta ainda possui contratos, reservas ou transferencias ativas.');
            }
            if (nextStatus !== currentUser.internalStatus) {
                nextStatus = currentUser.internalStatus;
                warnings.push('O estado da conta foi preservado porque existem registos operacionais ativos associados ao utilizador.');
            }
            if (nextIsActive !== currentUser.isActive) {
                nextIsActive = currentUser.isActive;
                warnings.push('A ativacao da conta foi preservada porque existem registos operacionais ativos associados ao utilizador.');
            }
        }
        const passwordHash = input.password
            ? this.passwordHasher.hash(input.password)
            : null;
        const nextRequiresItValidation = (0, internal_user_access_1.requiresItValidation)(nextRole);
        const updateData = {
            userId: input.userId,
            passwordHash,
            internalRole: nextRole,
            internalStatus: nextStatus,
            permissions: nextPermissions,
            requiresItValidation: nextRequiresItValidation,
            isActive: nextIsActive,
        };
        const accessChanges = currentUser.internalRole !== updateData.internalRole ||
            currentUser.internalStatus !== updateData.internalStatus ||
            currentUser.isActive !== updateData.isActive ||
            !haveSamePermissions(currentUser.permissions, updateData.permissions);
        const userChanged = currentUser.userId !== updateData.userId;
        const passwordChanged = Boolean(updateData.passwordHash);
        const hasAppliedChanges = accessChanges || userChanged || passwordChanged;
        const revokeSessions = accessChanges || userChanged || passwordChanged;
        const outcome = warnings.length > 0 ? 'PARTIAL' : 'UPDATED';
        const updatedUser = !this.prisma.user
            ? await this.updateInternalUserRaw(currentUser.id, updateData, revokeSessions)
            : await this.updateInternalUserWithPrisma(currentUser.id, updateData, revokeSessions);
        const message = buildInternalUserUpdateMessage(hasAppliedChanges, outcome);
        const summary = buildInternalUserManagementSummary(currentUser, updatedUser, warnings, hasAppliedChanges, passwordChanged);
        await this.recordManagementAudit(actor, updatedUser.id, updatedUser.userId ?? currentUser.userId ?? currentUser.id, outcome, summary);
        return {
            message,
            outcome,
            warnings,
            user: {
                id: updatedUser.id,
                userId: updatedUser.userId ?? '',
                internalRole: updatedUser.internalRole
                    ? normalizeInternalUserRole(updatedUser.internalRole)
                    : currentUser.internalRole,
                internalStatus: normalizeInternalUserStatus(updatedUser.internalStatus),
                permissions: (0, internal_user_access_1.filterPermissionsForRole)(updatedUser.internalRole
                    ? normalizeInternalUserRole(updatedUser.internalRole)
                    : currentUser.internalRole, normalizeMaybeInternalPermissions(updatedUser.permissions)),
                requiresItValidation: updatedUser.requiresItValidation,
                isActive: updatedUser.isActive,
                createdAt: updatedUser.createdAt,
            },
        };
    }
    async remove(id, actor) {
        if (id === actor.id) {
            throw new common_1.ConflictException('Nao e permitido remover a conta atualmente autenticada.');
        }
        let user;
        if (this.prisma.user) {
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
            }
            catch (error) {
                this.logger.warn(`Falling back to raw SQL for internal user deletion snapshot ${id}: ${String(error)}`);
                user = await this.getInternalUserDeletionSnapshotRaw(id);
            }
        }
        else {
            user = await this.getInternalUserDeletionSnapshotRaw(id);
        }
        if (!user) {
            throw new common_1.NotFoundException('Utilizador interno nao encontrado.');
        }
        if (!user.isActive) {
            throw new common_1.NotFoundException('O utilizador indicado ja foi removido ou desativado.');
        }
        const hasActiveReservations = 'createdReservations' in user
            ? user.createdReservations.some((res) => res.status === 'CONFIRMED' || res.status === 'DRAFT')
            : user.hasActiveReservations;
        const hasActiveRentals = 'createdRentals' in user
            ? user.createdRentals.some((rental) => rental.status === 'OPEN')
            : user.hasActiveRentals;
        const hasActiveTransfers = 'createdTransfers' in user
            ? user.createdTransfers.some((transfer) => transfer.status === 'PENDING' || transfer.status === 'IN_TRANSIT')
            : user.hasActiveTransfers;
        if (hasActiveReservations || hasActiveRentals || hasActiveTransfers) {
            throw new common_1.ConflictException('Nao foi possivel eliminar ou desativar: o utilizador possui contratos ou reservas ativas.');
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
    async softDeleteUser(id, targetUserId, actor) {
        if (!this.prisma.user) {
            await this.prisma.$executeRaw `
        UPDATE "User"
        SET "isActive" = false, "updatedAt" = NOW()
        WHERE id = ${id}
      `;
            await this.prisma.$executeRaw `
        UPDATE "InternalSession"
        SET "revokedAt" = NOW(), "updatedAt" = NOW()
        WHERE "userId" = ${id}
          AND "revokedAt" IS NULL
      `;
            await this.prisma.$executeRaw `
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
            this.logger.log(`Internal user ${targetUserId} (${id}) was deactivated by ${actor.userId}.`);
            return {
                message: 'Utilizador desativado temporariamente devido a retencao de historico.',
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
                    summary: 'Conta desativada para reter historico existente e remover o acesso imediato.',
                }),
            }),
        ]);
        this.logger.log(`Internal user ${targetUserId} (${id}) was deactivated by ${actor.userId}.`);
        return {
            message: 'Utilizador desativado temporariamente devido a retencao de historico.',
            mode: 'DEACTIVATED',
            userId: targetUserId,
        };
    }
    async deleteUser(id, targetUserId, actor) {
        if (!this.prisma.user) {
            await this.prisma.$executeRaw `
        UPDATE "InternalSession"
        SET "revokedAt" = NOW(), "updatedAt" = NOW()
        WHERE "userId" = ${id}
          AND "revokedAt" IS NULL
      `;
            await this.prisma.$executeRaw `
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
            await this.prisma.$executeRaw `
        DELETE FROM "User"
        WHERE id = ${id}
      `;
            this.logger.log(`Internal user ${targetUserId} (${id}) was permanently deleted by ${actor.userId}.`);
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
                    summary: 'Conta eliminada permanentemente por nao possuir historico a reter.',
                }),
            }),
            this.prisma.user.delete({ where: { id } }),
        ]);
        this.logger.log(`Internal user ${targetUserId} (${id}) was permanently deleted by ${actor.userId}.`);
        return {
            message: 'Utilizador removido permanentemente com sucesso.',
            mode: 'DELETED',
            userId: targetUserId,
        };
    }
    buildDeletionAuditEntry(input) {
        return {
            actorUserId: input.actor.id,
            actorUserIdentifier: input.actor.userId,
            targetUserId: input.targetUserId,
            targetUserIdentifier: input.targetUserIdentifier,
            mode: toDeletionAuditMode(input.mode),
            summary: input.summary,
        };
    }
    async getInternalUserDeletionSnapshotRaw(id) {
        const rows = await this.prisma.$queryRaw `
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
};
exports.InternalUsersService = InternalUsersService;
exports.InternalUsersService = InternalUsersService = InternalUsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        password_hasher_service_1.PasswordHasherService])
], InternalUsersService);
function parseInternalPermissions(raw) {
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
        .filter((permission) => Object.values(internal_user_enums_1.InternalPermission).includes(permission));
}
function toPgInternalPermissionArrayLiteral(permissions) {
    if (permissions.length === 0) {
        return '{}';
    }
    return `{${permissions.join(',')}}`;
}
function getCreationMessage(role) {
    return (0, internal_user_access_1.requiresItValidation)(role)
        ? 'Utilizador criado com sucesso, mas a conta fica pendente de validacao do IT.'
        : 'Utilizador criado com sucesso.';
}
function toDeletionAuditMode(mode) {
    return mode === 'DEACTIVATED'
        ? 'DEACTIVATED'
        : 'DELETED';
}
function normalizePositiveInteger(input, fallback) {
    const normalizedValue = typeof input === 'string' ? Number.parseInt(input, 10) : input;
    if (typeof normalizedValue === 'number' &&
        Number.isInteger(normalizedValue) &&
        normalizedValue > 0) {
        return normalizedValue;
    }
    return fallback;
}
function normalizeSearchTerm(input) {
    if (typeof input !== 'string') {
        return undefined;
    }
    const normalizedValue = input.trim();
    return normalizedValue ? normalizedValue : undefined;
}
function normalizeInternalUserRole(value) {
    return Object.values(internal_user_enums_1.InternalUserRole).includes(value)
        ? value
        : internal_user_enums_1.InternalUserRole.STAFF;
}
function normalizeInternalUserStatus(value) {
    return value === internal_user_enums_1.InternalUserStatus.PENDING_IT_VALIDATION
        ? internal_user_enums_1.InternalUserStatus.PENDING_IT_VALIDATION
        : internal_user_enums_1.InternalUserStatus.ACTIVE;
}
function normalizeInternalPermissions(values) {
    return values.filter((value) => Object.values(internal_user_enums_1.InternalPermission).includes(value));
}
function normalizeMaybeInternalPermissions(values) {
    if (Array.isArray(values)) {
        return normalizeInternalPermissions(values);
    }
    if (typeof values === 'string') {
        return parseInternalPermissions(values);
    }
    return [];
}
function buildInternalUserDirectoryWhere(searchTerm) {
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
function hasActiveOperationalRecords(snapshot) {
    return (snapshot.hasActiveReservations ||
        snapshot.hasActiveRentals ||
        snapshot.hasActiveTransfers);
}
function haveSamePermissions(left, right) {
    const normalizedLeft = Array.from(new Set(left)).sort();
    const normalizedRight = Array.from(new Set(right)).sort();
    if (normalizedLeft.length !== normalizedRight.length) {
        return false;
    }
    return normalizedLeft.every((permission, index) => permission === normalizedRight[index]);
}
function buildInternalUserUpdateMessage(hasAppliedChanges, outcome) {
    if (!hasAppliedChanges) {
        return 'O pedido foi validado, mas nao existiam alteracoes efetivas para aplicar.';
    }
    return outcome === 'PARTIAL'
        ? 'Utilizador atualizado com limitacoes aplicadas pelas regras do sistema.'
        : 'Utilizador atualizado com sucesso.';
}
function buildInternalUserManagementSummary(currentUser, updatedUser, warnings, hasAppliedChanges, passwordChanged) {
    const updatedPermissions = normalizeMaybeInternalPermissions(updatedUser.permissions);
    const updatedRole = updatedUser.internalRole
        ? normalizeInternalUserRole(updatedUser.internalRole)
        : currentUser.internalRole;
    const updatedStatus = normalizeInternalUserStatus(updatedUser.internalStatus);
    const changes = [];
    if ((updatedUser.userId ?? '') !== (currentUser.userId ?? '')) {
        changes.push(`User ID ${currentUser.userId ?? currentUser.id} -> ${updatedUser.userId ?? currentUser.id}`);
    }
    if (updatedRole !== currentUser.internalRole) {
        changes.push(`perfil ${currentUser.internalRole} -> ${updatedRole}`);
    }
    if (updatedStatus !== currentUser.internalStatus) {
        changes.push(`estado ${currentUser.internalStatus} -> ${updatedStatus}`);
    }
    if (updatedUser.isActive !== currentUser.isActive) {
        changes.push(`ativacao ${currentUser.isActive ? 'ativa' : 'desativada'} -> ${updatedUser.isActive ? 'ativa' : 'desativada'}`);
    }
    if (passwordChanged) {
        changes.push('password atualizada');
    }
    if (!haveSamePermissions(updatedPermissions, currentUser.permissions)) {
        changes.push(`permissoes ajustadas para ${updatedPermissions.join(', ') || 'sem permissoes'}`);
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
//# sourceMappingURL=internal-users.service.js.map