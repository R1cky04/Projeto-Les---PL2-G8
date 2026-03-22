"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItStationManagementGuard = void 0;
const common_1 = require("@nestjs/common");
const internal_user_enums_1 = require("../internal-users/internal-user.enums");
let ItStationManagementGuard = class ItStationManagementGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const actorRole = request.auth?.user.role;
        if (actorRole !== internal_user_enums_1.InternalUserRole.IT) {
            throw new common_1.ForbiddenException({
                message: 'Apenas o IT pode gerir estacoes.',
                code: 'IT_ROLE_REQUIRED',
            });
        }
        return true;
    }
};
exports.ItStationManagementGuard = ItStationManagementGuard;
exports.ItStationManagementGuard = ItStationManagementGuard = __decorate([
    (0, common_1.Injectable)()
], ItStationManagementGuard);
//# sourceMappingURL=it-station-management.guard.js.map