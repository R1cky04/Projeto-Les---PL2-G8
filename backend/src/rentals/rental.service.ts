import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { AuthenticatedUserDto } from '../auth/auth.types';
import { StationService } from '../station/station.service';
import { VehicleService, type Vehicle } from '../vehicle/vehicle.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { CloseRentalDto } from './dto/close-rental.dto';

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
  customerPhone: string | null;
  customerDocumentNumber: string | null;
  vehicleId: number;
  vehiclePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  stationId: number;
  stationName: string;
  returnStationId: number;
  returnStationName: string;
  pickupAt: Date;
  expectedReturnAt: Date;
  pickupOdometerKm: number;
  estimatedDays: number;
  estimatedAmount: number;
  dailyRate: number;
  vehicleCondition: string;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  notes: string | null;
  returnOdometerKm: number | null;
  closedAt: Date | null;
  finalAmount: number | null;
  finalNotes: string | null;
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

export interface CustomerSelectionPayload {
  customerId?: number;
  customerFirstName?: string;
  customerLastName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerDocumentNumber?: string;
}

export interface CustomerSelectionResult {
  customer: RentalCustomer;
  created: boolean;
}

interface RentalListOptions {
  search?: string;
  status?: string;
}

interface CustomerUpdateResult {
  changedCustomer: RentalCustomer;
  changedFields: string[];
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
        stationName: stationMap.get(vehicle.stationId) || 'Estacao desconhecida',
      })),
      recentRentals: recentRentals.slice(0, 6),
    };
  }

  async listCustomers(search?: string): Promise<RentalCustomer[]> {
    const normalizedSearch = search?.trim().toLowerCase() || '';

    return [...this.customers]
      .filter((customer) => {
        if (!normalizedSearch) {
          return true;
        }

        return this.buildSearchableCustomerText(customer).includes(
          normalizedSearch,
        );
      })
      .sort((left, right) =>
        this.buildCustomerName(left).localeCompare(this.buildCustomerName(right)),
      );
  }

  async findAll(options: RentalListOptions = {}): Promise<RentalRecord[]> {
    const normalizedStatus = this.normalizeStatusFilter(options.status);
    const normalizedSearch = options.search?.trim().toLowerCase() || '';

    return [...this.rentals]
      .filter((rental) => !normalizedStatus || rental.status === normalizedStatus)
      .filter((rental) => {
        if (!normalizedSearch) {
          return true;
        }

        return this.buildSearchableRentalText(rental).includes(normalizedSearch);
      })
      .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
  }

  async findOne(id: number): Promise<RentalRecord> {
    const rental = this.rentals.find((item) => item.id === id);

    if (!rental) {
      throw new NotFoundException('Contrato nao encontrado.');
    }

    return rental;
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
      errors.push('A estacao selecionada e invalida.');
    }

    if (!Number.isInteger(payload.vehicleId) || payload.vehicleId < 1) {
      errors.push('O veiculo selecionado e invalido.');
    }

    if (!Number.isInteger(payload.pickupOdometerKm) || payload.pickupOdometerKm < 0) {
      errors.push('A quilometragem inicial tem de ser um inteiro maior ou igual a zero.');
    }

    if (!payload.vehicleCondition || !payload.vehicleCondition.trim()) {
      errors.push('O estado inicial do veiculo e obrigatorio.');
    }

    const pickupAt = this.parseDate(payload.pickupAt, 'A data de inicio e invalida.');
    const expectedReturnAt = this.parseDate(
      payload.expectedReturnAt,
      'A data de fim e invalida.',
    );

    if (pickupAt && expectedReturnAt && expectedReturnAt.getTime() <= pickupAt.getTime()) {
      errors.push('A data de fim tem de ser posterior a data de inicio.');
    }

    if (errors.length > 0 || !pickupAt || !expectedReturnAt) {
      throw new BadRequestException({
        message: 'Dados invalidos para criar contrato.',
        details: errors,
      });
    }

    const station = await this.stationService.findOne(payload.stationId);
    const vehicle = await this.vehicleService.findOne(payload.vehicleId);
    const customerSelection = this.resolveCustomerSelection(payload, actor);

    if (vehicle.stationId !== station.id) {
      throw new BadRequestException({
        message: 'O veiculo selecionado nao pertence a estacao indicada.',
        code: 'VEHICLE_WRONG_STATION',
      });
    }

    if (vehicle.status !== 'AVAILABLE') {
      throw new BadRequestException({
        message: 'O veiculo selecionado ja nao esta disponivel. Escolha outra viatura.',
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
      customerPhone: customerSelection.customer.phone,
      customerDocumentNumber: customerSelection.customer.documentNumber,
      vehicleId: vehicle.id,
      vehiclePlate: vehicle.plateNumber,
      vehicleBrand: vehicle.brand,
      vehicleModel: vehicle.model,
      stationId: station.id,
      stationName: station.name,
      returnStationId: station.id,
      returnStationName: station.name,
      pickupAt,
      expectedReturnAt,
      pickupOdometerKm: payload.pickupOdometerKm,
      estimatedDays,
      estimatedAmount,
      dailyRate: vehicle.dailyRate,
      vehicleCondition: payload.vehicleCondition.trim(),
      status: 'OPEN',
      notes: this.normalizeNullableText(payload.notes),
      returnOdometerKm: null,
      closedAt: null,
      finalAmount: null,
      finalNotes: null,
      createdAt: now,
      updatedAt: now,
      createdBy,
    };

    this.rentals.unshift(rental);
    this.logAudit(
      'CREATE',
      rental.id,
      createdBy,
      `Contrato ${rental.contractNumber} criado para ${rental.customerFullName} com devolucao prevista em ${rental.returnStationName}.`,
    );

    return rental;
  }

  async update(
    id: number,
    payload: UpdateRentalDto,
    actor?: AuthenticatedUserDto,
  ): Promise<RentalRecord> {
    const rentalIndex = this.rentals.findIndex((item) => item.id === id);

    if (rentalIndex === -1) {
      throw new NotFoundException('Contrato nao encontrado.');
    }

    const currentRental = this.rentals[rentalIndex];

    if (currentRental.status !== 'OPEN') {
      throw new BadRequestException({
        message: 'Apenas contratos ativos podem ser atualizados.',
        code: 'RENTAL_NOT_ACTIVE',
      });
    }

    const now = new Date();
    const actorLabel = this.resolveActorLabel(actor);
    const currentCustomer = this.findCustomerById(currentRental.customerId);
    const changedFields: string[] = [];
    const rentalChanges: Partial<RentalRecord> = {};

    // Keep the update surface explicit so active contracts only change
    // through fields that operations staff are allowed to edit.
    if (payload.expectedReturnAt !== undefined) {
      const nextExpectedReturnAt = this.parseDate(
        payload.expectedReturnAt,
        'A data de fim e invalida.',
      );

      if (!nextExpectedReturnAt) {
        throw new BadRequestException('A data de fim e obrigatoria.');
      }

      if (nextExpectedReturnAt.getTime() <= currentRental.pickupAt.getTime()) {
        throw new BadRequestException({
          message: 'A data de fim tem de ser posterior a data de inicio.',
          code: 'INVALID_RENTAL_PERIOD',
        });
      }

      if (nextExpectedReturnAt.getTime() !== currentRental.expectedReturnAt.getTime()) {
        const estimatedDays = this.calculateRentalDays(
          currentRental.pickupAt,
          nextExpectedReturnAt,
        );

        rentalChanges.expectedReturnAt = nextExpectedReturnAt;
        rentalChanges.estimatedDays = estimatedDays;
        rentalChanges.estimatedAmount = Number(
          (estimatedDays * currentRental.dailyRate).toFixed(2),
        );
        changedFields.push(
          `periodo ${this.formatAuditDate(currentRental.expectedReturnAt)} -> ${this.formatAuditDate(nextExpectedReturnAt)}`,
        );
      }
    }

    if (payload.returnStationId !== undefined) {
      const returnStation = await this.stationService.findOne(payload.returnStationId);

      if (returnStation.id !== currentRental.returnStationId) {
        rentalChanges.returnStationId = returnStation.id;
        rentalChanges.returnStationName = returnStation.name;
        changedFields.push(
          `estacao de devolucao ${currentRental.returnStationName} -> ${returnStation.name}`,
        );
      }
    }

    if (payload.notes !== undefined) {
      const normalizedNotes = this.normalizeNullableText(payload.notes);

      if (normalizedNotes !== currentRental.notes) {
        rentalChanges.notes = normalizedNotes;
        changedFields.push(
          `notas ${this.describeNullableValue(currentRental.notes)} -> ${this.describeNullableValue(normalizedNotes)}`,
        );
      }
    }

    const customerUpdateResult = this.updateCustomerForRental(
      currentCustomer,
      payload,
      now,
    );

    changedFields.push(...customerUpdateResult.changedFields);

    if (changedFields.length === 0) {
      throw new BadRequestException({
        message: 'Sem alteracoes validas para atualizar o contrato.',
        code: 'NO_RENTAL_CHANGES',
      });
    }

    const updatedRental: RentalRecord = {
      ...currentRental,
      ...rentalChanges,
      customerFullName: this.buildCustomerName(customerUpdateResult.changedCustomer),
      customerEmail: customerUpdateResult.changedCustomer.email,
      customerPhone: customerUpdateResult.changedCustomer.phone,
      customerDocumentNumber: customerUpdateResult.changedCustomer.documentNumber,
      updatedAt: now,
    };

    this.rentals[rentalIndex] = updatedRental;
    this.syncCustomerSnapshots(customerUpdateResult.changedCustomer, updatedRental.id);
    this.logAudit(
      'UPDATE',
      updatedRental.id,
      actorLabel,
      `Contrato ${updatedRental.contractNumber} atualizado: ${changedFields.join('; ')}.`,
    );

    return updatedRental;
  }

  async close(
    id: number,
    payload: CloseRentalDto,
    actor?: AuthenticatedUserDto,
  ): Promise<RentalRecord> {
    const rentalIndex = this.rentals.findIndex((item) => item.id === id);

    if (rentalIndex === -1) {
      throw new NotFoundException('Contrato nao encontrado.');
    }

    const currentRental = this.rentals[rentalIndex];

    if (currentRental.status !== 'OPEN') {
      throw new BadRequestException({
        message: 'Apenas contratos ativos podem ser encerrados.',
        code: 'RENTAL_NOT_ACTIVE',
      });
    }

    const now = new Date();
    const actorLabel = this.resolveActorLabel(actor);
    const returnStation = payload.actualReturnStationId
      ? await this.stationService.findOne(payload.actualReturnStationId)
      : null;

    const actualDays = this.calculateRentalDays(currentRental.pickupAt, now);
    const finalAmount = Number((actualDays * currentRental.dailyRate).toFixed(2));

    const closedRental: RentalRecord = {
      ...currentRental,
      status: 'CLOSED',
      returnOdometerKm: payload.returnOdometerKm,
      closedAt: now,
      finalAmount,
      finalNotes: this.normalizeNullableText(payload.finalNotes),
      ...(returnStation
        ? { returnStationId: returnStation.id, returnStationName: returnStation.name }
        : {}),
      updatedAt: now,
    };

    this.rentals[rentalIndex] = closedRental;

    await this.vehicleService.update(currentRental.vehicleId, { status: 'AVAILABLE' }, actorLabel);

    try {
      await this.stationService.adjustAllocatedVehicles(
        closedRental.returnStationId,
        1,
        actorLabel,
      );
    } catch {
      // Best-effort station adjustment; do not roll back the close itself.
    }

    this.logAudit(
      'CLOSE',
      closedRental.id,
      actorLabel,
      `Contrato ${closedRental.contractNumber} encerrado. Km devolucao: ${payload.returnOdometerKm}. Valor final: ${finalAmount}.`,
    );

    return closedRental;
  }

  resolveCustomerSelection(
    payload: CustomerSelectionPayload,
    actor?: AuthenticatedUserDto,
  ): CustomerSelectionResult {
    if (payload.customerId !== undefined) {
      const existingCustomer = this.customers.find((customer) => customer.id === payload.customerId);

      if (!existingCustomer) {
        throw new NotFoundException('O cliente selecionado nao existe.');
      }

      return { customer: existingCustomer, created: false };
    }

    const firstName = payload.customerFirstName?.trim();
    const lastName = payload.customerLastName?.trim();

    if (!firstName || !lastName) {
      throw new BadRequestException({
        message: 'E necessario selecionar um cliente existente ou preencher o novo cliente.',
        code: 'CUSTOMER_REQUIRED',
      });
    }

    const normalizedEmail = this.normalizeEmail(payload.customerEmail);
    const normalizedDocument = this.normalizeNullableText(payload.customerDocumentNumber);

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
      phone: this.normalizeNullableText(payload.customerPhone),
      documentNumber: normalizedDocument,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: this.resolveActorLabel(actor),
    };

    this.customers.unshift(createdCustomer);
    return { customer: createdCustomer, created: true };
  }

  private updateCustomerForRental(
    customer: RentalCustomer,
    payload: UpdateRentalDto,
    updatedAt: Date,
  ): CustomerUpdateResult {
    const changedFields: string[] = [];
    const customerChanges: Partial<RentalCustomer> = {};

    if (payload.customerFirstName !== undefined) {
      const nextFirstName = this.normalizeRequiredCustomerField(
        payload.customerFirstName,
        'O nome do cliente e invalido.',
      );

      if (nextFirstName !== customer.firstName) {
        customerChanges.firstName = nextFirstName;
        changedFields.push(`nome ${customer.firstName} -> ${nextFirstName}`);
      }
    }

    if (payload.customerLastName !== undefined) {
      const nextLastName = this.normalizeRequiredCustomerField(
        payload.customerLastName,
        'O apelido do cliente e invalido.',
      );

      if (nextLastName !== customer.lastName) {
        customerChanges.lastName = nextLastName;
        changedFields.push(`apelido ${customer.lastName} -> ${nextLastName}`);
      }
    }

    if (payload.customerEmail !== undefined) {
      const nextEmail = this.normalizeEmail(payload.customerEmail);
      this.ensureUniqueCustomerField(customer.id, 'email', nextEmail);

      if (nextEmail !== customer.email) {
        customerChanges.email = nextEmail;
        changedFields.push(
          `email ${this.describeNullableValue(customer.email)} -> ${this.describeNullableValue(nextEmail)}`,
        );
      }
    }

    if (payload.customerPhone !== undefined) {
      const nextPhone = this.normalizeNullableText(payload.customerPhone);

      if (nextPhone !== customer.phone) {
        customerChanges.phone = nextPhone;
        changedFields.push(
          `telefone ${this.describeNullableValue(customer.phone)} -> ${this.describeNullableValue(nextPhone)}`,
        );
      }
    }

    if (payload.customerDocumentNumber !== undefined) {
      const nextDocumentNumber = this.normalizeNullableText(payload.customerDocumentNumber);
      this.ensureUniqueCustomerField(customer.id, 'document', nextDocumentNumber);

      if (nextDocumentNumber !== customer.documentNumber) {
        customerChanges.documentNumber = nextDocumentNumber;
        changedFields.push(
          `documento ${this.describeNullableValue(customer.documentNumber)} -> ${this.describeNullableValue(nextDocumentNumber)}`,
        );
      }
    }

    if (Object.keys(customerChanges).length === 0) {
      return {
        changedCustomer: customer,
        changedFields,
      };
    }

    const updatedCustomer: RentalCustomer = {
      ...customer,
      ...customerChanges,
      updatedAt,
    };

    this.customers = this.customers.map((item) =>
      item.id === customer.id ? updatedCustomer : item,
    );

    return {
      changedCustomer: updatedCustomer,
      changedFields,
    };
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

  private buildSearchableCustomerText(customer: RentalCustomer): string {
    return [
      this.buildCustomerName(customer),
      customer.email,
      customer.phone,
      customer.documentNumber,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
  }

  private buildSearchableRentalText(rental: RentalRecord): string {
    return [
      rental.contractNumber,
      rental.customerFullName,
      rental.customerEmail,
      rental.customerPhone,
      rental.customerDocumentNumber,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
  }

  private normalizeStatusFilter(
    status?: string,
  ): RentalRecord['status'] | undefined {
    if (!status) {
      return undefined;
    }

    if (status === 'OPEN' || status === 'CLOSED' || status === 'CANCELLED') {
      return status;
    }

    throw new BadRequestException({
      message: 'O estado do contrato e invalido.',
      code: 'INVALID_RENTAL_STATUS',
    });
  }

  private normalizeRequiredCustomerField(value: string, message: string): string {
    const normalized = value.trim();

    if (!normalized) {
      throw new BadRequestException({
        message,
        code: 'INVALID_CUSTOMER_FIELD',
      });
    }

    return normalized;
  }

  private normalizeNullableText(value?: string | null): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
  }

  private normalizeEmail(value?: string | null): string | null {
    const normalized = this.normalizeNullableText(value);
    return normalized ? normalized.toLowerCase() : null;
  }

  private ensureUniqueCustomerField(
    customerId: number,
    field: 'email' | 'document',
    value: string | null,
  ): void {
    if (!value) {
      return;
    }

    const duplicateCustomer = this.customers.find((customer) => {
      if (customer.id === customerId) {
        return false;
      }

      if (field === 'email') {
        return customer.email?.toLowerCase() === value.toLowerCase();
      }

      return customer.documentNumber === value;
    });

    if (!duplicateCustomer) {
      return;
    }

    throw new ConflictException({
      message:
        field === 'email'
          ? 'Ja existe outro cliente com o email indicado.'
          : 'Ja existe outro cliente com o documento indicado.',
      code: field === 'email' ? 'CUSTOMER_EMAIL_CONFLICT' : 'CUSTOMER_DOCUMENT_CONFLICT',
    });
  }

  private syncCustomerSnapshots(customer: RentalCustomer, skipRentalId?: number): void {
    // Rentals keep a customer snapshot for list/search views, so customer edits
    // need to refresh the cached fields without rewriting unrelated timestamps.
    for (let index = 0; index < this.rentals.length; index += 1) {
      const rental = this.rentals[index];

      if (rental.customerId !== customer.id || rental.id === skipRentalId) {
        continue;
      }

      this.rentals[index] = {
        ...rental,
        customerFullName: this.buildCustomerName(customer),
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerDocumentNumber: customer.documentNumber,
      };
    }
  }

  private findCustomerById(customerId: number): RentalCustomer {
    const customer = this.customers.find((item) => item.id === customerId);

    if (!customer) {
      throw new NotFoundException('O cliente associado ao contrato nao existe.');
    }

    return customer;
  }

  private resolveActorLabel(actor?: AuthenticatedUserDto): string {
    return actor?.userId || actor?.fullName || actor?.id || 'desconhecido';
  }

  private formatAuditDate(value: Date): string {
    return value.toISOString();
  }

  private describeNullableValue(value: string | null): string {
    return value === null ? 'vazio' : value;
  }

  private logAudit(operation: string, rentalId: number, userId: string, details: string): void {
    const timestamp = new Date().toISOString();
    console.log(
      `[AUDITORIA] ${timestamp} - ${operation} - Contrato ID: ${rentalId} - Usuario: ${userId} - ${details}`,
    );
  }
}
