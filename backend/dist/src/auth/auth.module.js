"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const password_hasher_service_1 = require("../internal-users/password-hasher.service");
const auth_bootstrap_service_1 = require("./auth-bootstrap.service");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const auth_session_guard_1 = require("./auth-session.guard");
const auth_token_service_1 = require("./auth-token.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            auth_session_guard_1.AuthSessionGuard,
            auth_token_service_1.AuthTokenService,
            auth_bootstrap_service_1.AuthBootstrapService,
            password_hasher_service_1.PasswordHasherService,
        ],
        exports: [auth_service_1.AuthService, auth_session_guard_1.AuthSessionGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map