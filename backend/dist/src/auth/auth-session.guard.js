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
exports.AuthSessionGuard = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
let AuthSessionGuard = class AuthSessionGuard {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authorizationHeader = request.headers.authorization;
        const token = this.extractBearerToken(authorizationHeader);
        if (!token) {
            throw new common_1.UnauthorizedException({
                message: 'Sessao em falta ou invalida.',
                code: 'SESSION_REQUIRED',
            });
        }
        request.auth = await this.authService.authenticateSessionToken(token);
        return true;
    }
    extractBearerToken(authorizationHeader) {
        const normalizedHeader = Array.isArray(authorizationHeader)
            ? authorizationHeader[0]
            : authorizationHeader;
        if (!normalizedHeader) {
            return null;
        }
        const [scheme, credentials] = normalizedHeader.split(' ');
        return scheme === 'Bearer' && credentials ? credentials : null;
    }
};
exports.AuthSessionGuard = AuthSessionGuard;
exports.AuthSessionGuard = AuthSessionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthSessionGuard);
//# sourceMappingURL=auth-session.guard.js.map