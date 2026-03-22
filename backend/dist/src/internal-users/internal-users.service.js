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
                    role: created.internalRole ?? internal_user_enums_1.InternalUserRole.STAFF,
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
                role: user.internalRole ?? internal_user_enums_1.InternalUserRole.STAFF,
                status: user.internalStatus,
                permissions: user.permissions,
                requiresItValidation: user.requiresItValidation,
                isActive: user.isActive,
                createdAt: user.createdAt,
            },
        };
    }
    async ensureUserIdIsUnique(userId) {
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
        if (existingUser) {
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
                id: row.id,
                userId: row.userId,
                internalRole: row.internalRole,
                internalStatus: (row.internalStatus === 'PENDING_IT_VALIDATION'
                    ? 'PENDING_IT_VALIDATION'
                    : 'ACTIVE'),
                permissions: parseInternalPermissions(row.permissions),
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
    async remove(id, actor) {
        const user = this.prisma.user
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
//# sourceMappingURL=internal-users.service.js.map