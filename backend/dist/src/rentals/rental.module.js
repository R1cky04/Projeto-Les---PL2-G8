"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const station_module_1 = require("../station/station.module");
const vehicle_module_1 = require("../vehicle/vehicle.module");
const rental_controller_1 = require("./rental.controller");
const rental_management_guard_1 = require("./rental-management.guard");
const rental_service_1 = require("./rental.service");
let RentalModule = class RentalModule {
};
exports.RentalModule = RentalModule;
exports.RentalModule = RentalModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, station_module_1.StationModule, vehicle_module_1.VehicleModule],
        controllers: [rental_controller_1.RentalController],
        providers: [rental_service_1.RentalService, rental_management_guard_1.RentalManagementGuard],
    })
], RentalModule);
//# sourceMappingURL=rental.module.js.map