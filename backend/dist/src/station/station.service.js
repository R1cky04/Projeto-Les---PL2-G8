"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StationService = void 0;
const common_1 = require("@nestjs/common");
let StationService = class StationService {
    stations = [
        {
            id: 1,
            name: 'Estação Central',
            location: 'Centro da Cidade',
            capacity: 50,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'Sistema',
        },
        {
            id: 2,
            name: 'Estação Norte',
            location: 'Zona Norte',
            capacity: 30,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'Sistema',
        },
    ];
    nextId = 3;
    async create(createStationDto, createdBy) {
        if (createStationDto.capacity <= 0) {
            throw new common_1.BadRequestException('Capacidade deve ser um número positivo.');
        }
        const existingStation = this.stations.find(s => s.name === createStationDto.name);
        if (existingStation) {
            throw new common_1.ConflictException('Já existe uma estação com este nome.');
        }
        const station = {
            id: this.nextId++,
            name: createStationDto.name,
            location: createStationDto.location,
            capacity: createStationDto.capacity,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: createdBy || 'Sistema',
        };
        this.stations.push(station);
        this.logAudit('CREATE', station.id, createdBy || 'desconhecido', `Estação criada: ${station.name}`);
        return station;
    }
    async findAll() {
        return this.stations;
    }
    async findOne(id) {
        const station = this.stations.find(s => s.id === id);
        if (!station) {
            throw new common_1.NotFoundException('Estação não encontrada');
        }
        return station;
    }
    async search(searchTerm) {
        const term = searchTerm.toLowerCase();
        return this.stations.filter(s => s.name.toLowerCase().includes(term) ||
            s.location.toLowerCase().includes(term));
    }
    async update(id, updateStationDto, updatedBy) {
        const stationIndex = this.stations.findIndex(s => s.id === id);
        if (stationIndex === -1) {
            throw new common_1.NotFoundException('Estação não encontrada');
        }
        const station = this.stations[stationIndex];
        if (updateStationDto.capacity !== undefined && updateStationDto.capacity <= 0) {
            throw new common_1.BadRequestException('Capacidade deve ser um número positivo.');
        }
        if (updateStationDto.name && updateStationDto.name !== station.name) {
            const nameExists = this.stations.find(s => s.name === updateStationDto.name && s.id !== id);
            if (nameExists) {
                throw new common_1.ConflictException('Já existe uma estação com este nome.');
            }
        }
        const updatedStation = {
            ...station,
            ...updateStationDto,
            updatedAt: new Date(),
        };
        this.stations[stationIndex] = updatedStation;
        this.logAudit('UPDATE', id, updatedBy || 'desconhecido', `Estação atualizada: ${updatedStation.name}`);
        return updatedStation;
    }
    async delete(id, deletedBy) {
        const stationIndex = this.stations.findIndex(s => s.id === id);
        if (stationIndex === -1) {
            throw new common_1.NotFoundException('Estação não encontrada');
        }
        const station = this.stations[stationIndex];
        this.stations.splice(stationIndex, 1);
        this.logAudit('DELETE', id, deletedBy || 'desconhecido', `Estação eliminada: ${station.name}`);
        return station;
    }
    logAudit(operation, stationId, userId, details) {
        const timestamp = new Date().toISOString();
        console.log(`[AUDITORIA] ${timestamp} - ${operation} - Estação ID: ${stationId} - Usuário: ${userId} - ${details}`);
    }
};
exports.StationService = StationService;
exports.StationService = StationService = __decorate([
    (0, common_1.Injectable)()
], StationService);
//# sourceMappingURL=station.service.js.map