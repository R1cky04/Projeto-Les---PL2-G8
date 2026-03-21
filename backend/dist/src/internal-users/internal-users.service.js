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
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const internal_user_access_1 = require("./internal-user-access");
const internal_user_validation_1 = require("./internal-user-validation");
const password_hasher_service_1 = require("./password-hasher.service");
let InternalUsersService = InternalUsersService_1 = class InternalUsersService {
    prisma;
    passwordHasher;
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
                role: user.internalRole ?? client_1.InternalUserRole.STAFF,
                status: user.internalStatus,
                permissions: user.permissions,
                requiresItValidation: user.requiresItValidation,
                isActive: user.isActive,
                createdAt: user.createdAt,
            },
        };
    }
    async ensureUserIdIsUnique(userId) {
        const existingUser = await this.prisma.user.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (existingUser) {
            throw new common_1.ConflictException({
                message: 'O User ID indicado ja existe.',
                code: 'USER_ID_ALREADY_EXISTS',
            });
        }
    }
    async findAll() {
        const users = await this.prisma.user.findMany({
            where: { isInternal: true },
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
        });
        this.logger.log(`Found ${users.length} internal users.`);
        return users;
    }
    async remove(id, actor) {
        const user = await this.prisma.user.findFirst({
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
        if (!user) {
            throw new common_1.NotFoundException('Utilizador interno nao encontrado.');
        }
        if (!user.isActive) {
            throw new common_1.NotFoundException('O utilizador indicado ja foi removido ou desativado.');
        }
        const hasActiveReservations = user.createdReservations.some((res) => res.status === 'CONFIRMED' || res.status === 'DRAFT');
        const hasActiveRentals = user.createdRentals.some((rental) => rental.status === 'OPEN');
        const hasActiveTransfers = user.createdTransfers.some((transfer) => transfer.status === 'PENDING' || transfer.status === 'IN_TRANSIT');
        if (hasActiveReservations || hasActiveRentals || hasActiveTransfers) {
            throw new common_1.ConflictException('Nao foi possivel eliminar ou desativar: o utilizador possui contratos ou reservas ativas.');
        }
        const targetUserId = user.userId ?? id;
        const hasHistory = user.createdReservations.length > 0 ||
            user.createdRentals.length > 0 ||
            user.createdTransfers.length > 0;
        if (hasHistory) {
            return this.softDeleteUser(id, targetUserId, actor);
        }
        return this.deleteUser(id, targetUserId, actor);
    }
    async softDeleteUser(id, targetUserId, actor) {
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
};
exports.InternalUsersService = InternalUsersService;
exports.InternalUsersService = InternalUsersService = InternalUsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        password_hasher_service_1.PasswordHasherService])
], InternalUsersService);
function getCreationMessage(role) {
    return (0, internal_user_access_1.requiresItValidation)(role)
        ? 'Utilizador criado com sucesso, mas a conta fica pendente de validacao do IT.'
        : 'Utilizador criado com sucesso.';
}
function toDeletionAuditMode(mode) {
    return mode === 'DEACTIVATED'
        ? client_1.InternalUserDeletionAuditMode.DEACTIVATED
        : client_1.InternalUserDeletionAuditMode.DELETED;
}
//# sourceMappingURL=internal-users.service.js.map