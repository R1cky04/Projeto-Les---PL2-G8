"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImproModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const station_module_1 = require("../station/station.module");
const impro_controller_1 = require("./impro.controller");
const impro_guard_1 = require("./impro.guard");
const impro_service_1 = require("./impro.service");
let ImproModule = class ImproModule {
};
exports.ImproModule = ImproModule;
exports.ImproModule = ImproModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, station_module_1.StationModule],
        controllers: [impro_controller_1.ImproController],
        providers: [impro_service_1.ImproService, impro_guard_1.ImproGuard],
    })
], ImproModule);
//# sourceMappingURL=impro.module.js.map