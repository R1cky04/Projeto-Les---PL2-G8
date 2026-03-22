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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalUsersService = void 0;
const common_1 = require("@nestjs/common");
const internal_user_enums_1 = require("./internal-user.enums");
const prisma_service_1 = require("../prisma/prisma.service");
const internal_user_access_1 = require("./internal-user-access");
const internal_user_validation_1 = require("./internal-user-validation");
const password_hasher_service_1 = require("./password-hasher.service");
let InternalUsersService = class InternalUsersService {
    prisma;
    passwordHasher;
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
                isActive: !pendingValidation,
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
};
exports.InternalUsersService = InternalUsersService;
exports.InternalUsersService = InternalUsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        password_hasher_service_1.PasswordHasherService])
], InternalUsersService);
function getCreationMessage(role) {
    return (0, internal_user_access_1.requiresItValidation)(role)
        ? 'Utilizador criado com sucesso, mas a conta fica pendente de validacao do IT.'
        : 'Utilizador criado com sucesso.';
}
//# sourceMappingURL=internal-users.service.js.map