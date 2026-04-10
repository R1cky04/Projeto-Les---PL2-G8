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
exports.RentalController = void 0;
const common_1 = require("@nestjs/common");
const auth_session_guard_1 = require("../auth/auth-session.guard");
const create_rental_dto_1 = require("./dto/create-rental.dto");
const rental_management_guard_1 = require("./rental-management.guard");
const rental_service_1 = require("./rental.service");
let RentalController = class RentalController {
    rentalService;
    constructor(rentalService) {
        this.rentalService = rentalService;
    }
    async getContext() {
        return this.rentalService.getContext();
    }
    async findAll() {
        return this.rentalService.findAll();
    }
    async create(createRentalDto, request) {
        return this.rentalService.create(createRentalDto, request.auth?.user);
    }
};
exports.RentalController = RentalController;
__decorate([
    (0, common_1.Get)('context'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RentalController.prototype, "getContext", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RentalController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_rental_dto_1.CreateRentalDto, Object]),
    __metadata("design:returntype", Promise)
], RentalController.prototype, "create", null);
exports.RentalController = RentalController = __decorate([
    (0, common_1.Controller)('rentals'),
    (0, common_1.UseGuards)(auth_session_guard_1.AuthSessionGuard, rental_management_guard_1.RentalManagementGuard),
    __metadata("design:paramtypes", [rental_service_1.RentalService])
], RentalController);
//# sourceMappingURL=rental.controller.js.map