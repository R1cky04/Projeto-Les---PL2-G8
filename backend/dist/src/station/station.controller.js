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
exports.StationController = void 0;
const common_1 = require("@nestjs/common");
const station_service_1 = require("./station.service");
const create_station_dto_1 = require("./dto/create-station.dto");
const update_station_dto_1 = require("./dto/update-station.dto");
const auth_session_guard_1 = require("../auth/auth-session.guard");
const it_station_management_guard_1 = require("./it-station-management.guard");
let StationController = class StationController {
    stationService;
    constructor(stationService) {
        this.stationService = stationService;
    }
    async create(createStationDto, request) {
        const createdBy = request.auth?.user.userId || request.auth?.user.id || 'IT-User';
        return this.stationService.create(createStationDto, createdBy);
    }
    async search(searchTerm) {
        return this.stationService.search(searchTerm);
    }
    async findOne(id) {
        return this.stationService.findOne(id);
    }
    async findAll() {
        return this.stationService.findAll();
    }
    async update(id, updateStationDto, request) {
        const updatedBy = request.auth?.user.userId || request.auth?.user.id || 'IT-User';
        return this.stationService.update(id, updateStationDto, updatedBy);
    }
    async delete(id, request) {
        const deletedBy = request.auth?.user.userId || request.auth?.user.id || 'IT-User';
        return this.stationService.delete(id, deletedBy);
    }
};
exports.StationController = StationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_station_dto_1.CreateStationDto, Object]),
    __metadata("design:returntype", Promise)
], StationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('search/:searchTerm'),
    __param(0, (0, common_1.Param)('searchTerm')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StationController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_station_dto_1.UpdateStationDto, Object]),
    __metadata("design:returntype", Promise)
], StationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], StationController.prototype, "delete", null);
exports.StationController = StationController = __decorate([
    (0, common_1.Controller)('stations'),
    (0, common_1.UseGuards)(auth_session_guard_1.AuthSessionGuard, it_station_management_guard_1.ItStationManagementGuard),
    __metadata("design:paramtypes", [station_service_1.StationService])
], StationController);
//# sourceMappingURL=station.controller.js.map