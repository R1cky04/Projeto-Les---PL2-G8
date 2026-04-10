import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { AuthenticatedUserDto } from '../auth/auth.types';
import { StationService } from '../station/station.service';
import { VehicleService, type Vehicle } from '../vehicle/vehicle.service';
import { CreateRentalDto } from './dto/create-rental.dto';

export interface RentalCustomer {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  documentNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface RentalRecord {
  id: number;
  contractNumber: string;
  customerId: number;
  customerFullName: string;
  customerEmail: string | null;
  vehicleId: number;
  vehiclePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  stationId: number;
  stationName: string;
  pickupAt: Date;
  expectedReturnAt: Date;
  pickupOdometerKm: number;
  estimatedDays: number;
  estimatedAmount: number;
  vehicleCondition: string;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface RentalContextResponse {
  customers: RentalCustomer[];
  stations: Awaited<ReturnType<StationService['findAll']>>;
  availableVehicles: (Vehicle & { stationName: string })[];
  recentRentals: RentalRecord[];
}

interface CustomerSelectionResult {
  customer: RentalCustomer;
  created: boolean;
}

@Injectable()
export class RentalService {
  private customers: RentalCustomer[] = [
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

  private rentals: RentalRecord[] = [];
  private nextCustomerId = 3;
  private nextRentalId = 1;

  constructor(
    private readonly stationService: StationService,
    private readonly vehicleService: VehicleService,
  ) {}

  async getContext(): Promise<RentalContextResponse> {
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

  async findAll(): Promise<RentalRecord[]> {
    return [...this.rentals].sort(
      (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
    );
  }

  async listAvailableVehicles(stationId?: number): Promise<Vehicle[]> {
    return this.vehicleService.findAvailable(stationId);
  }

  async create(
    payload: CreateRentalDto,
    actor?: AuthenticatedUserDto,
  ): Promise<RentalRecord> {
    const errors: string[] = [];

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
    const expectedReturnAt = this.parseDate(
      payload.expectedReturnAt,
      'A data de fim é inválida.',
    );

    if (pickupAt && expectedReturnAt && expectedReturnAt.getTime() <= pickupAt.getTime()) {
      errors.push('A data de fim tem de ser posterior à data de início.');
    }

    if (errors.length > 0 || !pickupAt || !expectedReturnAt) {
      throw new BadRequestException({
        message: 'Dados inválidos para criar contrato.',
        details: errors,
      });
    }

    const station = await this.stationService.findOne(payload.stationId);
    const vehicle = await this.vehicleService.findOne(payload.vehicleId);
    const customerSelection = this.resolveCustomer(payload, actor);

    if (vehicle.stationId !== station.id) {
      throw new BadRequestException({
        message: 'O veículo selecionado não pertence à estação indicada.',
        code: 'VEHICLE_WRONG_STATION',
      });
    }

    if (vehicle.status !== 'AVAILABLE') {
      throw new BadRequestException({
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
    } catch (error) {
      await this.vehicleService.update(vehicle.id, { status: 'AVAILABLE' }, createdBy);
      throw error;
    }

    const rental: RentalRecord = {
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

  private resolveCustomer(
    payload: CreateRentalDto,
    actor?: AuthenticatedUserDto,
  ): CustomerSelectionResult {
    if (payload.customerId !== undefined) {
      const existingCustomer = this.customers.find((customer) => customer.id === payload.customerId);

      if (!existingCustomer) {
        throw new NotFoundException('O cliente selecionado não existe.');
      }

      return { customer: existingCustomer, created: false };
    }

    const firstName = payload.customerFirstName?.trim();
    const lastName = payload.customerLastName?.trim();

    if (!firstName || !lastName) {
      throw new BadRequestException({
        message: 'É necessário selecionar um cliente existente ou preencher o novo cliente.',
        code: 'CUSTOMER_REQUIRED',
      });
    }

    const normalizedEmail = payload.customerEmail?.trim().toLowerCase() || null;
    const normalizedDocument = payload.customerDocumentNumber?.trim() || null;

    const existingCustomer = this.customers.find((customer) => {
      const matchesEmail =
        normalizedEmail !== null &&
        customer.email !== null &&
        customer.email.toLowerCase() === normalizedEmail;
      const matchesDocument =
        normalizedDocument !== null &&
        customer.documentNumber !== null &&
        customer.documentNumber === normalizedDocument;

      return matchesEmail || matchesDocument;
    });

    if (existingCustomer) {
      return { customer: existingCustomer, created: false };
    }

    const createdCustomer: RentalCustomer = {
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

  private calculateRentalDays(startDate: Date, endDate: Date): number {
    const differenceMs = endDate.getTime() - startDate.getTime();
    return Math.max(1, Math.ceil(differenceMs / (1000 * 60 * 60 * 24)));
  }

  private parseDate(value: string | undefined, fallbackMessage: string): Date | null {
    if (!value) {
      return null;
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException({
        message: fallbackMessage,
        code: 'INVALID_DATE',
      });
    }

    return parsed;
  }

  private buildContractNumber(): string {
    const stamp = new Date()
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '')
      .replace('T', '');
    const suffix = randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();

    return `CTR-${stamp}-${suffix}`;
  }

  private buildCustomerName(customer: RentalCustomer): string {
    return `${customer.firstName} ${customer.lastName}`.trim();
  }

  private resolveActorLabel(actor?: AuthenticatedUserDto): string {
    return actor?.userId || actor?.fullName || actor?.id || 'desconhecido';
  }
}