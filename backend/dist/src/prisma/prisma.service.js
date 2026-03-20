"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
let PrismaService = class PrismaService {
    stations = [];
    nextId = 1;
    station = {
        findUnique: async ({ where }) => {
            if (where.name)
                return this.stations.find((s) => s.name === where.name) ?? null;
            if (where.id)
                return this.stations.find((s) => s.id === where.id) ?? null;
            return null;
        },
        findMany: async () => this.stations,
        create: async ({ data }) => {
            const now = new Date();
            const station = {
                id: this.nextId++,
                createdAt: now,
                updatedAt: now,
                ...data,
            };
            this.stations.push(station);
            return station;
        },
    };
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map