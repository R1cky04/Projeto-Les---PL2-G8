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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const internal_user_enums_1 = require("../internal-users/internal-user.enums");
const prisma_service_1 = require("../prisma/prisma.service");
const internal_user_access_1 = require("../internal-users/internal-user-access");
const password_hasher_service_1 = require("../internal-users/password-hasher.service");
const auth_feature_policy_1 = require("./auth-feature-policy");
const auth_token_service_1 = require("./auth-token.service");
const auth_validation_1 = require("./auth-validation");
let AuthService = class AuthService {
    prisma;
    passwordHasher;
    authTokenService;
    constructor(prisma, passwordHasher, authTokenService) {
        this.prisma = prisma;
        this.passwordHasher = passwordHasher;
        this.authTokenService = authTokenService;
    }
    async login(payload, userAgent) {
        const input = (0, auth_validation_1.normalizeLoginInput)(payload);
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
        if (!user ||
            !user.isInternal ||
            !user.userId ||
            !user.passwordHash ||
            !user.internalRole) {
            throw this.createInvalidCredentialsException();
        }
        if (!this.passwordHasher.verify(input.password, user.passwordHash)) {
            throw this.createInvalidCredentialsException();
        }
        if (!user.isActive) {
            throw new common_1.ForbiddenException({
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
                permissions: user.permissions.length > 0
                    ? user.permissions
                    : (0, internal_user_access_1.getPermissionsForRole)(user.internalRole),
            },
        });
        return this.toResponse(context, this.getLoginSuccessMessage(accessLevel), issuedToken.rawToken);
    }
    async authenticateSessionToken(rawToken) {
        const parsedToken = this.authTokenService.parseToken(rawToken);
        if (!parsedToken) {
            throw new common_1.UnauthorizedException({
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
        if (!session ||
            session.revokedAt ||
            session.expiresAt <= new Date() ||
            !this.authTokenService.verifySecret(parsedToken.secret, session.tokenHash) ||
            !session.user.isInternal ||
            !session.user.userId ||
            !session.user.internalRole) {
            throw new common_1.UnauthorizedException({
                message: 'Sessao invalida ou expirada.',
                code: 'INVALID_SESSION',
            });
        }
        if (!session.user.isActive) {
            throw new common_1.ForbiddenException({
                message: 'A conta encontra-se bloqueada ou desativada.',
                code: 'ACCOUNT_BLOCKED',
            });
        }
        const concurrentSessionCount = await this.countActiveSessions(session.user.id, session.tokenId);
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
                permissions: session.user.permissions.length > 0
                    ? session.user.permissions
                    : (0, internal_user_access_1.getPermissionsForRole)(session.user.internalRole),
            },
        });
    }
    getCurrentSession(context) {
        return this.toResponse(context, 'Sessao restaurada com sucesso.');
    }
    async logoutCurrentSession(context) {
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
    buildAuthenticatedContext(base) {
        const disabledFeatures = (0, auth_feature_policy_1.parseDisabledFeaturesFromEnvironment)();
        const features = (0, auth_feature_policy_1.buildFeatureCatalog)(base.user, base.user.accessLevel, disabledFeatures);
        const warnings = this.buildWarnings(base.user.accessLevel, base.concurrentSessionCount, features.some((feature) => feature.status === 'TEMPORARILY_DISABLED'));
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
    toResponse(context, message, token) {
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
    buildWarnings(accessLevel, concurrentSessionCount, hasTemporarilyDisabledFeatures) {
        const warnings = [];
        if (accessLevel === 'LIMITED') {
            warnings.push('Conta autenticada com acesso limitado enquanto aguarda validacao final do IT ou administrador.');
        }
        if (concurrentSessionCount > 0) {
            warnings.push('Ja existe pelo menos uma sessao ativa com o mesmo User ID noutro dispositivo.');
        }
        if (hasTemporarilyDisabledFeatures) {
            warnings.push('Algumas funcionalidades estao temporariamente indisponiveis.');
        }
        return warnings;
    }
    async countActiveSessions(userId, excludeTokenId) {
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
    getAccessLevel(status) {
        return status === internal_user_enums_1.InternalUserStatus.PENDING_IT_VALIDATION
            ? 'LIMITED'
            : 'FULL';
    }
    getLoginSuccessMessage(accessLevel) {
        return accessLevel === 'LIMITED'
            ? 'Login efetuado com acesso limitado.'
            : 'Login efetuado com sucesso.';
    }
    createInvalidCredentialsException() {
        return new common_1.UnauthorizedException({
            message: 'Credenciais invalidas.',
            code: 'INVALID_CREDENTIALS',
        });
    }
    createSessionExpiry() {
        const configuredHours = Number(process.env.INTERNAL_SESSION_TTL_HOURS ?? 12);
        const ttlHours = Number.isFinite(configuredHours) && configuredHours > 0
            ? configuredHours
            : 12;
        return new Date(Date.now() + ttlHours * 60 * 60 * 1000);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        password_hasher_service_1.PasswordHasherService,
        auth_token_service_1.AuthTokenService])
], AuthService);
//# sourceMappingURL=auth.service.js.map