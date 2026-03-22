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
exports.AuthBootstrapService = void 0;
const common_1 = require("@nestjs/common");
const internal_user_enums_1 = require("../internal-users/internal-user.enums");
const internal_user_access_1 = require("../internal-users/internal-user-access");
const password_hasher_service_1 = require("../internal-users/password-hasher.service");
const prisma_service_1 = require("../prisma/prisma.service");
const DEFAULT_MASTER_IT_USER_ID = 'it.master';
const DEFAULT_MASTER_IT_PASSWORD = 'ItMaster1!';
let AuthBootstrapService = class AuthBootstrapService {
    prisma;
    passwordHasher;
    constructor(prisma, passwordHasher) {
        this.prisma = prisma;
        this.passwordHasher = passwordHasher;
    }
    async onApplicationBootstrap() {
        if (!this.shouldBootstrapMasterIt()) {
            return;
        }
        if (!this.prisma.user) {
            return;
        }
        const userId = (process.env.MASTER_IT_USER_ID ?? DEFAULT_MASTER_IT_USER_ID).trim().toLowerCase();
        const password = process.env.MASTER_IT_PASSWORD ?? DEFAULT_MASTER_IT_PASSWORD;
        const existingUser = await this.prisma.user.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (existingUser) {
            return;
        }
        await this.prisma.user.create({
            data: {
                userId,
                passwordHash: this.passwordHasher.hash(password),
                fullName: 'Master IT',
                isInternal: true,
                isActive: true,
                internalRole: internal_user_enums_1.InternalUserRole.IT,
                internalStatus: internal_user_enums_1.InternalUserStatus.ACTIVE,
                requiresItValidation: false,
                permissions: (0, internal_user_access_1.getPermissionsForRole)(internal_user_enums_1.InternalUserRole.IT),
            },
        });
    }
    shouldBootstrapMasterIt() {
        if (process.env.NODE_ENV === 'test') {
            return false;
        }
        const configuredValue = process.env.ENABLE_MASTER_IT_BOOTSTRAP;
        if (configuredValue === undefined) {
            return process.env.NODE_ENV !== 'production';
        }
        return configuredValue.trim().toLowerCase() === 'true';
    }
};
exports.AuthBootstrapService = AuthBootstrapService;
exports.AuthBootstrapService = AuthBootstrapService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        password_hasher_service_1.PasswordHasherService])
], AuthBootstrapService);
//# sourceMappingURL=auth-bootstrap.service.js.map