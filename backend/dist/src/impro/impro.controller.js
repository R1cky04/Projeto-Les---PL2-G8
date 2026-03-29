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
exports.ImproController = void 0;
const common_1 = require("@nestjs/common");
const auth_session_guard_1 = require("../auth/auth-session.guard");
const close_impro_dto_1 = require("./dto/close-impro.dto");
const create_impro_dto_1 = require("./dto/create-impro.dto");
const update_impro_dto_1 = require("./dto/update-impro.dto");
const impro_guard_1 = require("./impro.guard");
const impro_service_1 = require("./impro.service");
let ImproController = class ImproController {
    improService;
    constructor(improService) {
        this.improService = improService;
    }
    listVehicles(plate) {
        return this.improService.listVehicles(plate);
    }
    listStations() {
        return this.improService.listStations();
    }
    create(payload, request) {
        return this.improService.create(payload, request.auth.user);
    }
    findAll(search, vehiclePlate, status, stationId, fromDate, toDate) {
        const filters = {
            search,
            vehiclePlate,
            status: status,
            stationId: stationId ? Number(stationId) : undefined,
            fromDate,
            toDate,
        };
        return this.improService.findAll(filters);
    }
    update(id, payload, request) {
        return this.improService.update(id, payload, request.auth.user);
    }
    close(id, payload, request) {
        return this.improService.close(id, payload, request.auth.user);
    }
};
exports.ImproController = ImproController;
__decorate([
    (0, common_1.Get)('vehicles'),
    __param(0, (0, common_1.Query)('plate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImproController.prototype, "listVehicles", null);
__decorate([
    (0, common_1.Get)('stations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ImproController.prototype, "listStations", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_impro_dto_1.CreateImproDto, Object]),
    __metadata("design:returntype", Promise)
], ImproController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('vehiclePlate')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('stationId')),
    __param(4, (0, common_1.Query)('fromDate')),
    __param(5, (0, common_1.Query)('toDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ImproController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_impro_dto_1.UpdateImproDto, Object]),
    __metadata("design:returntype", Promise)
], ImproController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/close'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, close_impro_dto_1.CloseImproDto, Object]),
    __metadata("design:returntype", Promise)
], ImproController.prototype, "close", null);
exports.ImproController = ImproController = __decorate([
    (0, common_1.Controller)('impros'),
    (0, common_1.UseGuards)(auth_session_guard_1.AuthSessionGuard, impro_guard_1.ImproGuard),
    __metadata("design:paramtypes", [impro_service_1.ImproService])
], ImproController);
//# sourceMappingURL=impro.controller.js.map