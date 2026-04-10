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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImproService = void 0;
const common_1 = require("@nestjs/common");
const internal_user_enums_1 = require("../internal-users/internal-user.enums");
const station_service_1 = require("../station/station.service");
const vehicle_service_1 = require("../vehicle/vehicle.service");
let ImproService = class ImproService {
    stationService;
    vehicleService;
    impros = [];
    nextImproId = 1;
    constructor(stationService, vehicleService) {
        this.stationService = stationService;
        this.vehicleService = vehicleService;
    }
    async listVehicles(plate) {
        const vehicles = (await this.vehicleService.findAll()).map((vehicle) => this.toTransferVehicle(vehicle));
        const normalizedPlate = (plate || '').trim().toLowerCase();
        if (!normalizedPlate) {
            return vehicles;
        }
        return vehicles.filter((vehicle) => vehicle.plate.toLowerCase().includes(normalizedPlate));
    }
    async listStations() {
        return this.stationService.findAll();
    }
    async create(payload, actor) {
        this.ensureTransferPermissions(actor);
        if (payload.originStationId === payload.destinationStationId) {
            throw new common_1.BadRequestException({
                message: 'A estacao de origem e destino nao podem ser iguais.',
                code: 'SAME_STATION',
            });
        }
        await this.ensureStationExists(payload.originStationId);
        await this.ensureStationExists(payload.destinationStationId);
        const vehicleContext = await this.getVehicleOrFail(payload.vehicleId);
        const vehicle = vehicleContext.transfer;
        if (vehicle.hasActiveContract) {
            throw new common_1.BadRequestException({
                message: 'O veiculo tem contrato ativo e nao pode ser transferido.',
                code: 'ACTIVE_CONTRACT',
            });
        }
        if (vehicle.status === 'IN_TRANSFER') {
            throw new common_1.BadRequestException({
                message: 'O veiculo ja se encontra em transferencia.',
                code: 'VEHICLE_ALREADY_IN_TRANSFER',
            });
        }
        if (vehicle.currentStationId !== payload.originStationId) {
            throw new common_1.BadRequestException({
                message: 'O veiculo nao pertence atualmente a estacao de origem selecionada.',
                code: 'INVALID_ORIGIN_STATION',
            });
        }
        const transferDate = payload.transferDate
            ? new Date(payload.transferDate)
            : new Date();
        if (Number.isNaN(transferDate.getTime())) {
            throw new common_1.BadRequestException({
                message: 'Data de transferencia invalida.',
                code: 'INVALID_TRANSFER_DATE',
            });
        }
        const plannedArrivalDate = payload.plannedArrivalDate
            ? new Date(payload.plannedArrivalDate)
            : null;
        if (plannedArrivalDate && Number.isNaN(plannedArrivalDate.getTime())) {
            throw new common_1.BadRequestException({
                message: 'Data prevista de chegada invalida.',
                code: 'INVALID_ARRIVAL_DATE',
            });
        }
        const warnings = [];
        if (transferDate.getTime() > Date.now()) {
            warnings.push('Transferencia agendada para data futura.');
        }
        if (vehicle.maintenanceScheduledAt) {
            warnings.push('Aviso: o veiculo tem manutencao programada.');
        }
        const now = new Date();
        const improCode = this.buildImproCode(this.nextImproId);
        const status = transferDate.getTime() > now.getTime() ? 'SCHEDULED' : 'IN_TRANSFER';
        const impro = {
            id: this.nextImproId,
            improCode,
            vehicleId: vehicle.id,
            vehiclePlate: vehicle.plate,
            originStationId: payload.originStationId,
            destinationStationId: payload.destinationStationId,
            transferDate,
            plannedArrivalDate,
            actualArrivalDate: null,
            status,
            notes: payload.notes?.trim() || null,
            createdAt: now,
            updatedAt: now,
            createdBy: this.resolveActorLabel(actor),
            updatedBy: this.resolveActorLabel(actor),
            warnings,
            history: [
                {
                    timestamp: now,
                    actor: this.resolveActorLabel(actor),
                    action: 'CREATED',
                    details: `Impro criado (${status}) para o veiculo ${vehicle.plate}.`,
                },
            ],
        };
        this.impros.push(impro);
        this.nextImproId += 1;
        if (status === 'IN_TRANSFER') {
            await this.vehicleService.update(vehicle.id, { status: 'RESERVED' }, this.resolveActorLabel(actor));
        }
        else if (vehicle.status !== 'MAINTENANCE') {
            await this.vehicleService.update(vehicle.id, { status: 'AVAILABLE' }, this.resolveActorLabel(actor));
        }
        return impro;
    }
    async findAll(filters = {}) {
        const normalizedSearch = (filters.search || '').trim().toLowerCase();
        const normalizedPlate = (filters.vehiclePlate || '').trim().toLowerCase();
        const normalizedStatus = (filters.status || '').trim().toUpperCase();
        const fromDate = this.parseFilterDate(filters.fromDate, 'INVALID_FROM_DATE');
        const toDate = this.parseFilterDate(filters.toDate, 'INVALID_TO_DATE');
        if (fromDate && toDate && fromDate.getTime() > toDate.getTime()) {
            throw new common_1.BadRequestException({
                message: 'Intervalo de datas invalido. A data inicial deve ser inferior a final.',
                code: 'INVALID_DATE_RANGE',
            });
        }
        if (filters.stationId !== undefined &&
            (!Number.isInteger(filters.stationId) || filters.stationId < 1)) {
            throw new common_1.BadRequestException({
                message: 'ID da estacao invalido no filtro.',
                code: 'INVALID_STATION_FILTER',
            });
        }
        const items = this.impros.filter((impro) => {
            if (normalizedSearch) {
                const matchesSearch = impro.improCode.toLowerCase().includes(normalizedSearch) ||
                    impro.vehiclePlate.toLowerCase().includes(normalizedSearch) ||
                    String(impro.vehicleId).includes(normalizedSearch) ||
                    impro.status.toLowerCase().includes(normalizedSearch);
                if (!matchesSearch) {
                    return false;
                }
            }
            if (normalizedPlate && !impro.vehiclePlate.toLowerCase().includes(normalizedPlate)) {
                return false;
            }
            if (filters.stationId &&
                impro.originStationId !== filters.stationId &&
                impro.destinationStationId !== filters.stationId) {
                return false;
            }
            if (normalizedStatus &&
                normalizedStatus !== 'SCHEDULED' &&
                normalizedStatus !== 'IN_TRANSFER' &&
                normalizedStatus !== 'CLOSED') {
                throw new common_1.BadRequestException({
                    message: 'Estado de impro invalido no filtro.',
                    code: 'INVALID_IMPRO_STATUS_FILTER',
                });
            }
            if (normalizedStatus && impro.status !== normalizedStatus) {
                return false;
            }
            if (fromDate && impro.transferDate.getTime() < fromDate.getTime()) {
                return false;
            }
            if (toDate && impro.transferDate.getTime() > toDate.getTime()) {
                return false;
            }
            return true;
        });
        return {
            items: [...items].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
            totalItems: items.length,
        };
    }
    async update(id, payload, actor) {
        this.ensureTransferPermissions(actor);
        const impro = this.getImproOrFail(id);
        if (impro.status === 'CLOSED') {
            throw new common_1.BadRequestException({
                message: 'Nao e possivel atualizar um impro encerrado.',
                code: 'IMPRO_CLOSED',
            });
        }
        const warnings = [];
        if (payload.destinationStationId !== undefined) {
            if (payload.destinationStationId === impro.originStationId) {
                throw new common_1.BadRequestException({
                    message: 'A estacao de destino nao pode ser igual a origem.',
                    code: 'SAME_STATION',
                });
            }
            await this.ensureStationExists(payload.destinationStationId);
            impro.destinationStationId = payload.destinationStationId;
        }
        if (payload.transferDate !== undefined) {
            const transferDate = new Date(payload.transferDate);
            if (Number.isNaN(transferDate.getTime())) {
                throw new common_1.BadRequestException({
                    message: 'Data de transferencia invalida.',
                    code: 'INVALID_TRANSFER_DATE',
                });
            }
            impro.transferDate = transferDate;
            const vehicle = (await this.getVehicleOrFail(impro.vehicleId)).transfer;
            if (transferDate.getTime() > Date.now()) {
                impro.status = 'SCHEDULED';
                if (vehicle.status !== 'MAINTENANCE') {
                    await this.vehicleService.update(vehicle.id, { status: 'AVAILABLE' }, this.resolveActorLabel(actor));
                }
                warnings.push('Transferencia atualizada para data futura.');
            }
            else {
                impro.status = 'IN_TRANSFER';
                if (vehicle.status !== 'MAINTENANCE') {
                    await this.vehicleService.update(vehicle.id, { status: 'RESERVED' }, this.resolveActorLabel(actor));
                }
            }
        }
        if (payload.plannedArrivalDate !== undefined) {
            const plannedArrivalDate = new Date(payload.plannedArrivalDate);
            if (Number.isNaN(plannedArrivalDate.getTime())) {
                throw new common_1.BadRequestException({
                    message: 'Data prevista de chegada invalida.',
                    code: 'INVALID_ARRIVAL_DATE',
                });
            }
            impro.plannedArrivalDate = plannedArrivalDate;
        }
        if (payload.notes !== undefined) {
            impro.notes = payload.notes.trim() || null;
        }
        impro.updatedAt = new Date();
        impro.updatedBy = this.resolveActorLabel(actor);
        impro.warnings = warnings;
        impro.history.push({
            timestamp: impro.updatedAt,
            actor: impro.updatedBy,
            action: 'UPDATED',
            details: 'Impro atualizado com sucesso.',
        });
        return impro;
    }
    async close(id, payload, actor) {
        this.ensureTransferPermissions(actor);
        const impro = this.getImproOrFail(id);
        if (impro.status === 'CLOSED') {
            throw new common_1.BadRequestException({
                message: 'Este impro ja se encontra encerrado.',
                code: 'IMPRO_ALREADY_CLOSED',
            });
        }
        const actualArrivalDate = payload.actualArrivalDate
            ? new Date(payload.actualArrivalDate)
            : new Date();
        if (Number.isNaN(actualArrivalDate.getTime())) {
            throw new common_1.BadRequestException({
                message: 'Data real de chegada invalida.',
                code: 'INVALID_ACTUAL_ARRIVAL_DATE',
            });
        }
        const vehicle = (await this.getVehicleOrFail(impro.vehicleId)).transfer;
        await this.vehicleService.transferToStation(vehicle.id, impro.destinationStationId, this.resolveActorLabel(actor));
        const closureWarnings = [];
        const arrivedLate = Boolean(impro.plannedArrivalDate) &&
            actualArrivalDate.getTime() > new Date(impro.plannedArrivalDate).getTime();
        if (arrivedLate) {
            closureWarnings.push('Veiculo chegou com atraso face a chegada prevista.');
        }
        if (payload.vehicleDamaged) {
            await this.vehicleService.update(vehicle.id, { status: 'MAINTENANCE' }, this.resolveActorLabel(actor));
            closureWarnings.push('Veiculo com danos foi encaminhado para manutencao.');
        }
        else {
            await this.vehicleService.update(vehicle.id, { status: 'AVAILABLE' }, this.resolveActorLabel(actor));
        }
        impro.actualArrivalDate = actualArrivalDate;
        impro.status = 'CLOSED';
        impro.updatedAt = new Date();
        impro.updatedBy = this.resolveActorLabel(actor);
        impro.warnings = closureWarnings;
        if (payload.closureNotes?.trim()) {
            impro.notes = [impro.notes, payload.closureNotes.trim()]
                .filter(Boolean)
                .join(' | ');
        }
        impro.history.push({
            timestamp: impro.updatedAt,
            actor: impro.updatedBy,
            action: 'CLOSED',
            details: payload.vehicleDamaged
                ? `Impro encerrado. Veiculo entregue na estacao ${impro.destinationStationId} e encaminhado para manutencao.`
                : `Impro encerrado. Veiculo entregue na estacao ${impro.destinationStationId}.`,
        });
        return impro;
    }
    buildImproCode(sequence) {
        return `IMPRO-${String(sequence).padStart(5, '0')}`;
    }
    getImproOrFail(id) {
        const impro = this.impros.find((item) => item.id === id);
        if (!impro) {
            throw new common_1.NotFoundException({
                message: 'Impro nao encontrado.',
                code: 'IMPRO_NOT_FOUND',
            });
        }
        return impro;
    }
    async getVehicleOrFail(id) {
        const vehicle = await this.vehicleService.findOne(id);
        const transferVehicle = this.toTransferVehicle(vehicle);
        return {
            source: vehicle,
            transfer: transferVehicle,
        };
    }
    toTransferVehicle(vehicle) {
        return {
            id: vehicle.id,
            plate: vehicle.plateNumber,
            model: `${vehicle.brand} ${vehicle.model}`,
            currentStationId: vehicle.stationId,
            status: this.toTransferStatus(vehicle.status),
            hasActiveContract: vehicle.status === 'RENTED',
            maintenanceScheduledAt: null,
        };
    }
    toTransferStatus(status) {
        if (status === 'RESERVED') {
            return 'IN_TRANSFER';
        }
        if (status === 'MAINTENANCE') {
            return 'MAINTENANCE';
        }
        return 'AVAILABLE';
    }
    async ensureStationExists(id) {
        await this.stationService.findOne(id);
    }
    parseFilterDate(value, code) {
        if (!value) {
            return null;
        }
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) {
            throw new common_1.BadRequestException({
                message: 'Data invalida no filtro.',
                code,
            });
        }
        return parsed;
    }
    resolveActorLabel(actor) {
        return actor.userId || actor.id;
    }
    ensureTransferPermissions(actor) {
        if (!actor.permissions.includes(internal_user_enums_1.InternalPermission.TRANSFER_WRITE)) {
            throw new common_1.BadRequestException({
                message: 'Sem permissao para operacoes de transferencia.',
                code: 'TRANSFER_PERMISSION_REQUIRED',
            });
        }
    }
};
exports.ImproService = ImproService;
exports.ImproService = ImproService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [station_service_1.StationService,
        vehicle_service_1.VehicleService])
], ImproService);
//# sourceMappingURL=impro.service.js.map