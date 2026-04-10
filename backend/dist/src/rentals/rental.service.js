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
exports.RentalService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const station_service_1 = require("../station/station.service");
const vehicle_service_1 = require("../vehicle/vehicle.service");
let RentalService = class RentalService {
    stationService;
    vehicleService;
    customers = [
        {
            id: 1,
            firstName: 'Ines',
            lastName: 'Almeida',
            email: 'ines.almeida@example.com',
            phone: '+351912345678',
            documentNumber: '123456789',
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'Sistema',
        },
        {
            id: 2,
            firstName: 'Daniel',
            lastName: 'Costa',
            email: 'daniel.costa@example.com',
            phone: '+351934567890',
            documentNumber: '987654321',
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'Sistema',
        },
    ];
    rentals = [];
    nextCustomerId = 3;
    nextRentalId = 1;
    constructor(stationService, vehicleService) {
        this.stationService = stationService;
        this.vehicleService = vehicleService;
    }
    async getContext() {
        const [stations, availableVehicles, recentRentals] = await Promise.all([
            this.stationService.findAll(),
            this.listAvailableVehicles(),
            this.findAll(),
        ]);
        const stationMap = new Map(stations.map((station) => [station.id, station.name]));
        return {
            customers: [...this.customers],
            stations,
            availableVehicles: availableVehicles.map((vehicle) => ({
                ...vehicle,
                stationName: stationMap.get(vehicle.stationId) || 'Estação desconhecida',
            })),
            recentRentals: recentRentals.slice(0, 6),
        };
    }
    async findAll() {
        return [...this.rentals].sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
    }
    async listAvailableVehicles(stationId) {
        return this.vehicleService.findAvailable(stationId);
    }
    async create(payload, actor) {
        const errors = [];
        if (!Number.isInteger(payload.stationId) || payload.stationId < 1) {
            errors.push('A estação selecionada é inválida.');
        }
        if (!Number.isInteger(payload.vehicleId) || payload.vehicleId < 1) {
            errors.push('O veículo selecionado é inválido.');
        }
        if (!Number.isInteger(payload.pickupOdometerKm) || payload.pickupOdometerKm < 0) {
            errors.push('A quilometragem inicial tem de ser um inteiro maior ou igual a zero.');
        }
        if (!payload.vehicleCondition || !payload.vehicleCondition.trim()) {
            errors.push('O estado inicial do veículo é obrigatório.');
        }
        const pickupAt = this.parseDate(payload.pickupAt, 'A data de início é inválida.');
        const expectedReturnAt = this.parseDate(payload.expectedReturnAt, 'A data de fim é inválida.');
        if (pickupAt && expectedReturnAt && expectedReturnAt.getTime() <= pickupAt.getTime()) {
            errors.push('A data de fim tem de ser posterior à data de início.');
        }
        if (errors.length > 0 || !pickupAt || !expectedReturnAt) {
            throw new common_1.BadRequestException({
                message: 'Dados inválidos para criar contrato.',
                details: errors,
            });
        }
        const station = await this.stationService.findOne(payload.stationId);
        const vehicle = await this.vehicleService.findOne(payload.vehicleId);
        const customerSelection = this.resolveCustomer(payload, actor);
        if (vehicle.stationId !== station.id) {
            throw new common_1.BadRequestException({
                message: 'O veículo selecionado não pertence à estação indicada.',
                code: 'VEHICLE_WRONG_STATION',
            });
        }
        if (vehicle.status !== 'AVAILABLE') {
            throw new common_1.BadRequestException({
                message: 'O veículo selecionado já não está disponível. Escolha outra viatura.',
                code: 'VEHICLE_UNAVAILABLE',
            });
        }
        const createdBy = this.resolveActorLabel(actor);
        const estimatedDays = this.calculateRentalDays(pickupAt, expectedReturnAt);
        const estimatedAmount = Number((estimatedDays * vehicle.dailyRate).toFixed(2));
        const contractNumber = this.buildContractNumber();
        const now = new Date();
        await this.vehicleService.markAsRented(vehicle.id, createdBy);
        try {
            await this.stationService.adjustAllocatedVehicles(station.id, -1, createdBy);
        }
        catch (error) {
            await this.vehicleService.update(vehicle.id, { status: 'AVAILABLE' }, createdBy);
            throw error;
        }
        const rental = {
            id: this.nextRentalId++,
            contractNumber,
            customerId: customerSelection.customer.id,
            customerFullName: this.buildCustomerName(customerSelection.customer),
            customerEmail: customerSelection.customer.email,
            vehicleId: vehicle.id,
            vehiclePlate: vehicle.plateNumber,
            vehicleBrand: vehicle.brand,
            vehicleModel: vehicle.model,
            stationId: station.id,
            stationName: station.name,
            pickupAt,
            expectedReturnAt,
            pickupOdometerKm: payload.pickupOdometerKm,
            estimatedDays,
            estimatedAmount,
            vehicleCondition: payload.vehicleCondition.trim(),
            status: 'OPEN',
            notes: payload.notes?.trim() || null,
            createdAt: now,
            updatedAt: now,
            createdBy,
        };
        this.rentals.unshift(rental);
        return rental;
    }
    resolveCustomer(payload, actor) {
        if (payload.customerId !== undefined) {
            const existingCustomer = this.customers.find((customer) => customer.id === payload.customerId);
            if (!existingCustomer) {
                throw new common_1.NotFoundException('O cliente selecionado não existe.');
            }
            return { customer: existingCustomer, created: false };
        }
        const firstName = payload.customerFirstName?.trim();
        const lastName = payload.customerLastName?.trim();
        if (!firstName || !lastName) {
            throw new common_1.BadRequestException({
                message: 'É necessário selecionar um cliente existente ou preencher o novo cliente.',
                code: 'CUSTOMER_REQUIRED',
            });
        }
        const normalizedEmail = payload.customerEmail?.trim().toLowerCase() || null;
        const normalizedDocument = payload.customerDocumentNumber?.trim() || null;
        const existingCustomer = this.customers.find((customer) => {
            const matchesEmail = normalizedEmail !== null &&
                customer.email !== null &&
                customer.email.toLowerCase() === normalizedEmail;
            const matchesDocument = normalizedDocument !== null &&
                customer.documentNumber !== null &&
                customer.documentNumber === normalizedDocument;
            return matchesEmail || matchesDocument;
        });
        if (existingCustomer) {
            return { customer: existingCustomer, created: false };
        }
        const createdCustomer = {
            id: this.nextCustomerId++,
            firstName,
            lastName,
            email: normalizedEmail,
            phone: payload.customerPhone?.trim() || null,
            documentNumber: normalizedDocument,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: this.resolveActorLabel(actor),
        };
        this.customers.unshift(createdCustomer);
        return { customer: createdCustomer, created: true };
    }
    calculateRentalDays(startDate, endDate) {
        const differenceMs = endDate.getTime() - startDate.getTime();
        return Math.max(1, Math.ceil(differenceMs / (1000 * 60 * 60 * 24)));
    }
    parseDate(value, fallbackMessage) {
        if (!value) {
            return null;
        }
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) {
            throw new common_1.BadRequestException({
                message: fallbackMessage,
                code: 'INVALID_DATE',
            });
        }
        return parsed;
    }
    buildContractNumber() {
        const stamp = new Date()
            .toISOString()
            .replace(/[-:]/g, '')
            .replace(/\..+/, '')
            .replace('T', '');
        const suffix = (0, crypto_1.randomUUID)().replace(/-/g, '').slice(0, 6).toUpperCase();
        return `CTR-${stamp}-${suffix}`;
    }
    buildCustomerName(customer) {
        return `${customer.firstName} ${customer.lastName}`.trim();
    }
    resolveActorLabel(actor) {
        return actor?.userId || actor?.fullName || actor?.id || 'desconhecido';
    }
};
exports.RentalService = RentalService;
exports.RentalService = RentalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [station_service_1.StationService,
        vehicle_service_1.VehicleService])
], RentalService);
//# sourceMappingURL=rental.service.js.map