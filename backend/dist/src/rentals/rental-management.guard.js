"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalManagementGuard = void 0;
const common_1 = require("@nestjs/common");
const internal_user_enums_1 = require("../internal-users/internal-user.enums");
const MANAGE_ROLES = new Set([
    internal_user_enums_1.InternalUserRole.IT,
    internal_user_enums_1.InternalUserRole.ADMIN,
    internal_user_enums_1.InternalUserRole.STAFF,
    internal_user_enums_1.InternalUserRole.FLEET,
]);
let RentalManagementGuard = class RentalManagementGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const actorRole = request.auth?.user.role;
        if (!actorRole || !MANAGE_ROLES.has(actorRole)) {
            throw new common_1.ForbiddenException({
                message: 'Apenas perfis IT, ADMIN, STAFF e FLEET podem gerir contratos.',
                code: 'RENTAL_MANAGEMENT_ROLE_REQUIRED',
            });
        }
        return true;
    }
};
exports.RentalManagementGuard = RentalManagementGuard;
exports.RentalManagementGuard = RentalManagementGuard = __decorate([
    (0, common_1.Injectable)()
], RentalManagementGuard);
//# sourceMappingURL=rental-management.guard.js.map