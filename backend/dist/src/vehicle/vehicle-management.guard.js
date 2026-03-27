"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleManagementGuard = void 0;
const common_1 = require("@nestjs/common");
const internal_user_enums_1 = require("../internal-users/internal-user.enums");
const MANAGE_ROLES = new Set([
    internal_user_enums_1.InternalUserRole.IT,
    internal_user_enums_1.InternalUserRole.ADMIN,
    internal_user_enums_1.InternalUserRole.STAFF,
    internal_user_enums_1.InternalUserRole.FLEET,
]);
const IT_ONLY_METHODS = new Set(['POST', 'DELETE']);
let VehicleManagementGuard = class VehicleManagementGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const actorRole = request.auth?.user.role;
        const method = request.method.toUpperCase();
        if (!actorRole || !MANAGE_ROLES.has(actorRole)) {
            throw new common_1.ForbiddenException({
                message: 'Apenas perfis IT, ADMIN, STAFF e FLEET podem gerir o modulo de veiculos.',
                code: 'VEHICLE_MANAGEMENT_ROLE_REQUIRED',
            });
        }
        if (IT_ONLY_METHODS.has(method) && actorRole !== internal_user_enums_1.InternalUserRole.IT) {
            throw new common_1.ForbiddenException({
                message: 'Apenas o perfil IT pode criar ou eliminar veiculos.',
                code: 'VEHICLE_CREATE_DELETE_IT_ONLY',
            });
        }
        return true;
    }
};
exports.VehicleManagementGuard = VehicleManagementGuard;
exports.VehicleManagementGuard = VehicleManagementGuard = __decorate([
    (0, common_1.Injectable)()
], VehicleManagementGuard);
//# sourceMappingURL=vehicle-management.guard.js.map