"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItMasterGuard = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let ItMasterGuard = class ItMasterGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const actorRole = request.auth?.user.role;
        if (actorRole !== client_1.InternalUserRole.IT) {
            throw new common_1.ForbiddenException({
                message: 'Apenas o IT pode gerir utilizadores internos.',
                code: 'IT_ROLE_REQUIRED',
            });
        }
        return true;
    }
};
exports.ItMasterGuard = ItMasterGuard;
exports.ItMasterGuard = ItMasterGuard = __decorate([
    (0, common_1.Injectable)()
], ItMasterGuard);
//# sourceMappingURL=it-master.guard.js.map