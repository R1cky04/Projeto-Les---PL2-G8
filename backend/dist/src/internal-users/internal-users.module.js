"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalUsersModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const internal_users_controller_1 = require("./internal-users.controller");
const internal_users_service_1 = require("./internal-users.service");
const it_master_guard_1 = require("./it-master.guard");
const password_hasher_service_1 = require("./password-hasher.service");
let InternalUsersModule = class InternalUsersModule {
};
exports.InternalUsersModule = InternalUsersModule;
exports.InternalUsersModule = InternalUsersModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [internal_users_controller_1.InternalUsersController],
        providers: [internal_users_service_1.InternalUsersService, password_hasher_service_1.PasswordHasherService, it_master_guard_1.ItMasterGuard],
    })
], InternalUsersModule);
//# sourceMappingURL=internal-users.module.js.map