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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalUsersController = void 0;
const common_1 = require("@nestjs/common");
const auth_session_guard_1 = require("../auth/auth-session.guard");
const create_internal_user_dto_1 = require("./dto/create-internal-user.dto");
const internal_users_service_1 = require("./internal-users.service");
const it_master_guard_1 = require("./it-master.guard");
let InternalUsersController = class InternalUsersController {
    internalUsersService;
    constructor(internalUsersService) {
        this.internalUsersService = internalUsersService;
    }
    create(payload) {
        return this.internalUsersService.create(payload);
    }
    findAll() {
        return this.internalUsersService.findAll();
    }
    remove(id, request) {
        return this.internalUsersService.remove(id, request.auth.user);
    }
};
exports.InternalUsersController = InternalUsersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_internal_user_dto_1.CreateInternalUserDto]),
    __metadata("design:returntype", Promise)
], InternalUsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InternalUsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InternalUsersController.prototype, "remove", null);
exports.InternalUsersController = InternalUsersController = __decorate([
    (0, common_1.Controller)('internal-users'),
    (0, common_1.UseGuards)(auth_session_guard_1.AuthSessionGuard, it_master_guard_1.ItMasterGuard),
    __metadata("design:paramtypes", [internal_users_service_1.InternalUsersService])
], InternalUsersController);
//# sourceMappingURL=internal-users.controller.js.map