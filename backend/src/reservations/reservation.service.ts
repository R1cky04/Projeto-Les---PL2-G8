import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { AuthenticatedUserDto } from '../auth/auth.types';
import {
  RentalService,
  type RentalCustomer,
  type RentalRecord,
} from '../rentals/rental.service';
import { StationService } from '../station/station.service';
import { VehicleService, type Vehicle } from '../vehicle/vehicle.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

type ReservationStatus =
  | 'DRAFT'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW';

export interface ReservationRecord {
  id: number;
  reservationNumber: string;
  customerId: number;
  customerFullName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  customerDocumentNumber: string | null;
  stationId: number;
  stationName: string;
  returnStationId: number;
  returnStationName: string;
  vehicleId: number;
  vehiclePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  pickupAt: Date;
  expectedReturnAt: Date;
  status: ReservationStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ReservationContextResponse {
  customers: RentalCustomer[];
  stations: Awaited<ReturnType<StationService['findAll']>>;
  recentReservations: ReservationRecord[];
}

export interface ReservationAvailabilityVehicle extends Vehicle {
  stationName: string;
}

export interface ReservationAvailabilityResponse {
  pickupStationId: number;
  pickupAt: Date;
  expectedReturnAt: Date;
  availableVehicles: ReservationAvailabilityVehicle[];
  alternativeVehicles: ReservationAvailabilityVehicle[];
  suggestionMessage: string | null;
}

interface ReservationListOptions {
  search?: string;
  status?: string;
}

interface ReservationAvailabilityInput {
  pickupStationId?: string;
  pickupAt?: string;
  expectedReturnAt?: string;
  excludeReservationId?: string;
}

@Injectable()
export class ReservationService {
  private reservations: ReservationRecord[] = [];
  private nextReservationId = 1;

  constructor(
    private readonly stationService: StationService,
    private readonly vehicleService: VehicleService,
    private readonly rentalService: RentalService,
  ) {}

  async getContext(): Promise<ReservationContextResponse> {
    const [customers, stations, recentReservations] = await Promise.all([
      this.rentalService.listCustomers(),
      this.stationService.findAll(),
      this.findAll(),
    ]);

    return {
      customers,
      stations,
      recentReservations: recentReservations.slice(0, 6),
    };
  }

  async getAvailability(
    input: ReservationAvailabilityInput,
  ): Promise<ReservationAvailabilityResponse> {
    const pickupStationId = this.parsePositiveInteger(
      input.pickupStationId,
      'A estacao de levantamento e obrigatoria.',
      'INVALID_PICKUP_STATION',
    );
    const pickupAt = this.parseRequiredDate(
      input.pickupAt,
      'A data de levantamento e invalida.',
    );
    const expectedReturnAt = this.parseRequiredDate(
      input.expectedReturnAt,
      'A data de devolucao e invalida.',
    );
    const excludeReservationId = input.excludeReservationId
      ? this.parsePositiveInteger(
          input.excludeReservationId,
          'A reserva a excluir e invalida.',
          'INVALID_RESERVATION_ID',
        )
      : null;

    this.ensureReservationPeriod(pickupAt, expectedReturnAt);

    const [stations, vehicles, openRentals] = await Promise.all([
      this.stationService.findAll(),
      this.vehicleService.findAll(),
      this.rentalService.findAll({ status: 'OPEN' }),
    ]);
    const stationNameById = new Map(
      stations.map((station) => [station.id, station.name]),
    );
    const activeReservations = this.reservations.filter(
      (reservation) =>
        reservation.status === 'CONFIRMED' &&
        reservation.id !== excludeReservationId,
    );
    const availableVehicles: ReservationAvailabilityVehicle[] = [];
    const alternativeVehicles: ReservationAvailabilityVehicle[] = [];

    for (const vehicle of vehicles) {
      if (!this.canReserveVehicle(vehicle)) {
        continue;
      }

      if (
        !this.isVehicleFreeForPeriod(
          vehicle.id,
          pickupAt,
          expectedReturnAt,
          activeReservations,
          openRentals,
        )
      ) {
        continue;
      }

      const availabilityVehicle: ReservationAvailabilityVehicle = {
        ...vehicle,
        stationName: stationNameById.get(vehicle.stationId) || 'Estacao desconhecida',
      };

      if (vehicle.stationId === pickupStationId) {
        availableVehicles.push(availabilityVehicle);
      } else {
        alternativeVehicles.push(availabilityVehicle);
      }
    }

    availableVehicles.sort((left, right) =>
      left.plateNumber.localeCompare(right.plateNumber),
    );
    alternativeVehicles.sort((left, right) => {
      const stationComparison = left.stationName.localeCompare(right.stationName);
      return stationComparison !== 0
        ? stationComparison
        : left.plateNumber.localeCompare(right.plateNumber);
    });

    return {
      pickupStationId,
      pickupAt,
      expectedReturnAt,
      availableVehicles,
      alternativeVehicles,
      suggestionMessage: this.buildSuggestionMessage(
        availableVehicles.length,
        alternativeVehicles.length,
      ),
    };
  }

  async findAll(options: ReservationListOptions = {}): Promise<ReservationRecord[]> {
    const normalizedStatus = this.normalizeStatusFilter(options.status);
    const normalizedSearch = options.search?.trim().toLowerCase() || '';

    return [...this.reservations]
      .filter(
        (reservation) =>
          !normalizedStatus || reservation.status === normalizedStatus,
      )
      .filter((reservation) => {
        if (!normalizedSearch) {
          return true;
        }

        return this.buildSearchableReservationText(reservation).includes(
          normalizedSearch,
        );
      })
      .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
  }

  async findOne(id: number): Promise<ReservationRecord> {
    const reservation = this.reservations.find((item) => item.id === id);

    if (!reservation) {
      throw new NotFoundException('Reserva nao encontrada.');
    }

    return reservation;
  }

  async create(
    payload: CreateReservationDto,
    actor?: AuthenticatedUserDto,
  ): Promise<ReservationRecord> {
    const pickupAt = this.parseRequiredDate(
      payload.pickupAt,
      'A data de levantamento e invalida.',
    );
    const expectedReturnAt = this.parseRequiredDate(
      payload.expectedReturnAt,
      'A data de devolucao e invalida.',
    );

    this.ensureReservationPeriod(pickupAt, expectedReturnAt);

    const [pickupStation, returnStation, vehicle] = await Promise.all([
      this.stationService.findOne(payload.pickupStationId),
      this.stationService.findOne(payload.returnStationId),
      this.vehicleService.findOne(payload.vehicleId),
    ]);
    const customerSelection = this.rentalService.resolveCustomerSelection(
      payload,
      actor,
    );

    if (vehicle.stationId !== pickupStation.id) {
      throw new BadRequestException({
        message:
          'O veiculo selecionado nao pertence a estacao de levantamento indicada.',
        code: 'VEHICLE_WRONG_STATION',
      });
    }

    if (
      !this.canReserveVehicle(vehicle) ||
      !(await this.isVehicleAvailableForPeriod(
        vehicle.id,
        pickupAt,
        expectedReturnAt,
      ))
    ) {
      throw await this.buildVehicleUnavailableException(
        pickupStation.id,
        pickupAt,
        expectedReturnAt,
      );
    }

    const now = new Date();
    const createdBy = this.resolveActorLabel(actor);
    const reservation: ReservationRecord = {
      id: this.nextReservationId++,
      reservationNumber: this.buildReservationNumber(),
      customerId: customerSelection.customer.id,
      customerFullName: this.buildCustomerName(customerSelection.customer),
      customerEmail: customerSelection.customer.email,
      customerPhone: customerSelection.customer.phone,
      customerDocumentNumber: customerSelection.customer.documentNumber,
      stationId: pickupStation.id,
      stationName: pickupStation.name,
      returnStationId: returnStation.id,
      returnStationName: returnStation.name,
      vehicleId: vehicle.id,
      vehiclePlate: vehicle.plateNumber,
      vehicleBrand: vehicle.brand,
      vehicleModel: vehicle.model,
      pickupAt,
      expectedReturnAt,
      status: 'CONFIRMED',
      notes: this.normalizeNullableText(payload.notes),
      createdAt: now,
      updatedAt: now,
      createdBy,
    };

    this.reservations.unshift(reservation);
    this.logAudit(
      'CREATE',
      reservation.id,
      createdBy,
      `Reserva ${reservation.reservationNumber} criada para ${reservation.customerFullName} com levantamento em ${reservation.stationName}.`,
    );

    return reservation;
  }

  async update(
    id: number,
    payload: UpdateReservationDto,
    actor?: AuthenticatedUserDto,
  ): Promise<ReservationRecord> {
    const reservationIndex = this.reservations.findIndex((item) => item.id === id);

    if (reservationIndex === -1) {
      throw new NotFoundException('Reserva nao encontrada.');
    }

    const currentReservation = this.reservations[reservationIndex];

    if (
      currentReservation.status === 'CANCELLED' ||
      currentReservation.status === 'COMPLETED'
    ) {
      throw new BadRequestException({
        message: 'A reserva selecionada ja nao pode ser alterada.',
        code: 'RESERVATION_NOT_EDITABLE',
      });
    }

    const changedFields: string[] = [];
    const updatedAt = new Date();
    const reservationChanges: Partial<ReservationRecord> = {};

    const nextExpectedReturnAt =
      payload.expectedReturnAt !== undefined
        ? this.parseRequiredDate(
            payload.expectedReturnAt,
            'A data de devolucao e invalida.',
          )
        : currentReservation.expectedReturnAt;

    this.ensureReservationPeriod(currentReservation.pickupAt, nextExpectedReturnAt);

    if (
      payload.expectedReturnAt !== undefined &&
      nextExpectedReturnAt.getTime() !==
        currentReservation.expectedReturnAt.getTime()
    ) {
      const vehicleAvailable = await this.isVehicleAvailableForPeriod(
        currentReservation.vehicleId,
        currentReservation.pickupAt,
        nextExpectedReturnAt,
        currentReservation.id,
      );

      if (!vehicleAvailable) {
        throw await this.buildVehicleUnavailableException(
          currentReservation.stationId,
          currentReservation.pickupAt,
          nextExpectedReturnAt,
          currentReservation.id,
        );
      }

      reservationChanges.expectedReturnAt = nextExpectedReturnAt;
      changedFields.push(
        `periodo ${currentReservation.expectedReturnAt.toISOString()} -> ${nextExpectedReturnAt.toISOString()}`,
      );
    }

    if (payload.returnStationId !== undefined) {
      const returnStation = await this.stationService.findOne(payload.returnStationId);

      if (returnStation.id !== currentReservation.returnStationId) {
        reservationChanges.returnStationId = returnStation.id;
        reservationChanges.returnStationName = returnStation.name;
        changedFields.push(
          `estacao de devolucao ${currentReservation.returnStationName} -> ${returnStation.name}`,
        );
      }
    }

    if (payload.notes !== undefined) {
      const normalizedNotes = this.normalizeNullableText(payload.notes);

      if (normalizedNotes !== currentReservation.notes) {
        reservationChanges.notes = normalizedNotes;
        changedFields.push(
          `notas ${this.describeNullableValue(currentReservation.notes)} -> ${this.describeNullableValue(normalizedNotes)}`,
        );
      }
    }

    const currentCustomer = this.splitCustomerName(currentReservation.customerFullName);
    const nextCustomerFirstName =
      payload.customerFirstName !== undefined
        ? this.normalizeRequiredText(
            payload.customerFirstName,
            'O nome do cliente e invalido.',
          )
        : currentCustomer.firstName;
    const nextCustomerLastName =
      payload.customerLastName !== undefined
        ? this.normalizeRequiredText(
            payload.customerLastName,
            'O apelido do cliente e invalido.',
          )
        : currentCustomer.lastName;
    const nextCustomerEmail =
      payload.customerEmail !== undefined
        ? this.normalizeNullableText(payload.customerEmail)?.toLowerCase() || null
        : currentReservation.customerEmail;
    const nextCustomerPhone =
      payload.customerPhone !== undefined
        ? this.normalizeNullableText(payload.customerPhone)
        : currentReservation.customerPhone;
    const nextCustomerDocumentNumber =
      payload.customerDocumentNumber !== undefined
        ? this.normalizeNullableText(payload.customerDocumentNumber)
        : currentReservation.customerDocumentNumber;
    const nextCustomerFullName = `${nextCustomerFirstName} ${nextCustomerLastName}`.trim();

    if (nextCustomerFullName !== currentReservation.customerFullName) {
      reservationChanges.customerFullName = nextCustomerFullName;
      changedFields.push(
        `cliente ${currentReservation.customerFullName} -> ${nextCustomerFullName}`,
      );
    }

    if (nextCustomerEmail !== currentReservation.customerEmail) {
      reservationChanges.customerEmail = nextCustomerEmail;
      changedFields.push(
        `email ${this.describeNullableValue(currentReservation.customerEmail)} -> ${this.describeNullableValue(nextCustomerEmail)}`,
      );
    }

    if (nextCustomerPhone !== currentReservation.customerPhone) {
      reservationChanges.customerPhone = nextCustomerPhone;
      changedFields.push(
        `telefone ${this.describeNullableValue(currentReservation.customerPhone)} -> ${this.describeNullableValue(nextCustomerPhone)}`,
      );
    }

    if (
      nextCustomerDocumentNumber !== currentReservation.customerDocumentNumber
    ) {
      reservationChanges.customerDocumentNumber = nextCustomerDocumentNumber;
      changedFields.push(
        `documento ${this.describeNullableValue(currentReservation.customerDocumentNumber)} -> ${this.describeNullableValue(nextCustomerDocumentNumber)}`,
      );
    }

    if (changedFields.length === 0) {
      throw new BadRequestException({
        message: 'Sem alteracoes validas para atualizar a reserva.',
        code: 'NO_RESERVATION_CHANGES',
      });
    }

    const updatedReservation: ReservationRecord = {
      ...currentReservation,
      ...reservationChanges,
      updatedAt,
    };

    this.reservations[reservationIndex] = updatedReservation;
    this.logAudit(
      'UPDATE',
      updatedReservation.id,
      this.resolveActorLabel(actor),
      `Reserva ${updatedReservation.reservationNumber} atualizada: ${changedFields.join('; ')}.`,
    );

    return updatedReservation;
  }

  async cancel(
    id: number,
    actor?: AuthenticatedUserDto,
  ): Promise<ReservationRecord> {
    const reservationIndex = this.reservations.findIndex((item) => item.id === id);

    if (reservationIndex === -1) {
      throw new NotFoundException('Reserva nao encontrada.');
    }

    const currentReservation = this.reservations[reservationIndex];

    if (currentReservation.status === 'CANCELLED') {
      throw new BadRequestException({
        message: 'A reserva ja foi cancelada.',
        code: 'RESERVATION_ALREADY_CANCELLED',
      });
    }

    if (currentReservation.status === 'COMPLETED') {
      throw new BadRequestException({
        message: 'A reserva ja foi concluida e nao pode ser cancelada.',
        code: 'RESERVATION_COMPLETED',
      });
    }

    const cancelledReservation: ReservationRecord = {
      ...currentReservation,
      status: 'CANCELLED',
      updatedAt: new Date(),
    };

    this.reservations[reservationIndex] = cancelledReservation;
    this.logAudit(
      'CANCEL',
      cancelledReservation.id,
      this.resolveActorLabel(actor),
      `Reserva ${cancelledReservation.reservationNumber} cancelada.`,
    );

    return cancelledReservation;
  }

  private async isVehicleAvailableForPeriod(
    vehicleId: number,
    pickupAt: Date,
    expectedReturnAt: Date,
    excludeReservationId?: number,
  ): Promise<boolean> {
    const openRentals = await this.rentalService.findAll({ status: 'OPEN' });
    const activeReservations = this.reservations.filter(
      (reservation) =>
        reservation.status === 'CONFIRMED' &&
        reservation.id !== excludeReservationId,
    );

    return this.isVehicleFreeForPeriod(
      vehicleId,
      pickupAt,
      expectedReturnAt,
      activeReservations,
      openRentals,
    );
  }

  private isVehicleFreeForPeriod(
    vehicleId: number,
    pickupAt: Date,
    expectedReturnAt: Date,
    activeReservations: ReservationRecord[],
    openRentals: RentalRecord[],
  ): boolean {
    const hasReservationConflict = activeReservations.some(
      (reservation) =>
        reservation.vehicleId === vehicleId &&
        this.periodsOverlap(
          pickupAt,
          expectedReturnAt,
          reservation.pickupAt,
          reservation.expectedReturnAt,
        ),
    );

    if (hasReservationConflict) {
      return false;
    }

    return !openRentals.some(
      (rental) =>
        rental.vehicleId === vehicleId &&
        this.periodsOverlap(
          pickupAt,
          expectedReturnAt,
          rental.pickupAt,
          rental.expectedReturnAt,
        ),
    );
  }

  private canReserveVehicle(vehicle: Vehicle): boolean {
    return vehicle.status === 'AVAILABLE';
  }

  private periodsOverlap(
    leftStart: Date,
    leftEnd: Date,
    rightStart: Date,
    rightEnd: Date,
  ): boolean {
    return leftStart.getTime() < rightEnd.getTime() &&
      rightStart.getTime() < leftEnd.getTime();
  }

  private ensureReservationPeriod(pickupAt: Date, expectedReturnAt: Date): void {
    if (expectedReturnAt.getTime() <= pickupAt.getTime()) {
      throw new BadRequestException({
        message:
          'A data de devolucao tem de ser posterior a data de levantamento.',
        code: 'INVALID_RESERVATION_PERIOD',
      });
    }
  }

  private buildReservationNumber(): string {
    const stamp = new Date()
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '')
      .replace('T', '');
    const suffix = randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();

    return `RSV-${stamp}-${suffix}`;
  }

  private buildCustomerName(customer: RentalCustomer): string {
    return `${customer.firstName} ${customer.lastName}`.trim();
  }

  private buildSearchableReservationText(reservation: ReservationRecord): string {
    return [
      reservation.reservationNumber,
      reservation.customerFullName,
      reservation.customerEmail,
      reservation.customerPhone,
      reservation.customerDocumentNumber,
      reservation.vehiclePlate,
      reservation.stationName,
      reservation.returnStationName,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
  }

  private normalizeStatusFilter(status?: string): ReservationStatus | undefined {
    if (!status) {
      return undefined;
    }

    const normalizedStatus = status.trim().toUpperCase();
    const allowedStatuses = new Set<ReservationStatus>([
      'DRAFT',
      'CONFIRMED',
      'CANCELLED',
      'COMPLETED',
      'NO_SHOW',
    ]);

    if (!allowedStatuses.has(normalizedStatus as ReservationStatus)) {
      throw new BadRequestException({
        message: 'O estado da reserva e invalido.',
        code: 'INVALID_RESERVATION_STATUS',
      });
    }

    return normalizedStatus as ReservationStatus;
  }

  private parseRequiredDate(value: string | undefined, message: string): Date {
    if (!value) {
      throw new BadRequestException({
        message,
        code: 'INVALID_DATE',
      });
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException({
        message,
        code: 'INVALID_DATE',
      });
    }

    return parsed;
  }

  private parsePositiveInteger(
    value: string | undefined,
    message: string,
    code: string,
  ): number {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed < 1) {
      throw new BadRequestException({
        message,
        code,
      });
    }

    return parsed;
  }

  private normalizeNullableText(value?: string | null): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
  }

  private normalizeRequiredText(value: string, message: string): string {
    const normalized = value.trim();

    if (!normalized) {
      throw new BadRequestException({
        message,
        code: 'INVALID_CUSTOMER_FIELD',
      });
    }

    return normalized;
  }

  private splitCustomerName(fullName: string): {
    firstName: string;
    lastName: string;
  } {
    const nameParts = fullName.trim().split(/\s+/).filter(Boolean);

    return {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
    };
  }

  private describeNullableValue(value: string | null): string {
    return value === null ? 'vazio' : value;
  }

  private buildSuggestionMessage(
    availableVehiclesCount: number,
    alternativeVehiclesCount: number,
  ): string | null {
    if (availableVehiclesCount > 0) {
      return null;
    }

    if (alternativeVehiclesCount > 0) {
      return 'Nao existem viaturas disponiveis na estacao selecionada para o periodo indicado. O sistema encontrou alternativas noutras estacoes.';
    }

    return 'Nao existem viaturas disponiveis para o periodo selecionado.';
  }

  private async buildVehicleUnavailableException(
    pickupStationId: number,
    pickupAt: Date,
    expectedReturnAt: Date,
    excludeReservationId?: number,
  ): Promise<BadRequestException> {
    const availability = await this.getAvailability({
      pickupStationId: String(pickupStationId),
      pickupAt: pickupAt.toISOString(),
      expectedReturnAt: expectedReturnAt.toISOString(),
      excludeReservationId:
        excludeReservationId === undefined ? undefined : String(excludeReservationId),
    });

    return new BadRequestException({
      message:
        'O veiculo selecionado ja nao esta disponivel no periodo indicado. Escolha outra viatura.',
      code: 'VEHICLE_UNAVAILABLE',
      alternatives: [
        ...availability.availableVehicles,
        ...availability.alternativeVehicles,
      ].slice(0, 6),
    });
  }

  private resolveActorLabel(actor?: AuthenticatedUserDto): string {
    return actor?.userId || actor?.fullName || actor?.id || 'desconhecido';
  }

  private logAudit(
    operation: string,
    reservationId: number,
    userId: string,
    details: string,
  ): void {
    const timestamp = new Date().toISOString();
    console.log(
      `[AUDITORIA] ${timestamp} - ${operation} - Reserva ID: ${reservationId} - Usuario: ${userId} - ${details}`,
    );
  }
}
