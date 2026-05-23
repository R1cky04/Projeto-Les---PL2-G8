import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { AuthenticatedUserDto } from '../auth/auth.types';
import { ImproService } from '../impro/impro.service';
import { InternalUserRole } from '../internal-users/internal-user.enums';
import { RentalService, type RentalCustomer } from '../rentals/rental.service';
import { StationService } from '../station/station.service';
import { VehicleService, type Vehicle } from '../vehicle/vehicle.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

export type ReservationStatus =
  | 'DRAFT'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW';

export type ReservationPaymentStatus =
  | 'NONE'
  | 'PENDING'
  | 'PAID'
  | 'REFUND_REQUIRED';

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
  paymentStatus: ReservationPaymentStatus;
  financialReviewRequired: boolean;
  adminValidationRequired: boolean;
  cancellationWarnings: string[];
  cancelledAt: Date | null;
  cancelledBy: string | null;
  convertedToRentalAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ReservationAvailabilityVehicle extends Vehicle {
  stationName: string;
}

export interface ReservationAvailabilityResponse {
  pickupStationId: number;
  pickupAt: string;
  expectedReturnAt: string;
  availableVehicles: ReservationAvailabilityVehicle[];
  alternativeVehicles: ReservationAvailabilityVehicle[];
  suggestionMessage: string | null;
}

export interface ReservationContextResponse {
  customers: RentalCustomer[];
  stations: Awaited<ReturnType<StationService['findAll']>>;
  recentReservations: ReservationRecord[];
}

interface ReservationListOptions {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  pickupStationId?: string;
}

interface ReservationAvailabilityOptions {
  pickupStationId?: string;
  pickupAt?: string;
  expectedReturnAt?: string;
  excludeReservationId?: string;
}

interface ReservationCancelOptions {
  adminValidated?: boolean;
}

type StationRecord = Awaited<ReturnType<StationService['findOne']>>;

const ACTIVE_RESERVATION_STATUSES = new Set<ReservationStatus>([
  'DRAFT',
  'CONFIRMED',
]);

const CANCELLATION_ADMIN_ROLES = new Set<InternalUserRole>([
  InternalUserRole.IT,
  InternalUserRole.ADMIN,
  InternalUserRole.STAFF,
]);

const LATE_CANCELLATION_WINDOW_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class ReservationService {
  private reservations: ReservationRecord[] = [];
  private nextReservationId = 1;

  constructor(
    private readonly stationService: StationService,
    private readonly vehicleService: VehicleService,
    private readonly rentalService: RentalService,
    @Optional() private readonly improService?: ImproService,
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
    options: ReservationAvailabilityOptions,
  ): Promise<ReservationAvailabilityResponse> {
    const pickupStationId = this.parsePositiveInteger(
      options.pickupStationId,
      'A estacao de levantamento e invalida.',
      'INVALID_PICKUP_STATION',
    );
    const pickupAt = this.parseDate(
      options.pickupAt,
      'A data de levantamento e invalida.',
    );
    const expectedReturnAt = this.parseDate(
      options.expectedReturnAt,
      'A data de devolucao e invalida.',
    );
    const excludeReservationId = this.parseOptionalPositiveInteger(
      options.excludeReservationId,
      'A reserva excluida e invalida.',
      'INVALID_EXCLUDED_RESERVATION',
    );

    this.ensureValidPeriod(pickupAt, expectedReturnAt);

    const stationMap = await this.buildStationNameMap();
    const vehicles = await this.vehicleService.findAll();
    const availableVehicles = vehicles
      .filter((vehicle) => vehicle.status === 'AVAILABLE')
      .filter((vehicle) =>
        this.isVehicleAvailableForPeriod(
          vehicle.id,
          pickupAt,
          expectedReturnAt,
          excludeReservationId,
        ),
      )
      .filter(
        (vehicle) =>
          !this.isVehicleBlockedByImpro(
            vehicle.id,
            vehicle.stationId,
            pickupAt,
            expectedReturnAt,
          ),
      )
      .map((vehicle) => ({
        ...vehicle,
        stationName:
          stationMap.get(vehicle.stationId) || 'Estacao desconhecida',
      }));

    const localVehicles = availableVehicles.filter(
      (vehicle) => vehicle.stationId === pickupStationId,
    );
    const alternativeVehicles = availableVehicles.filter(
      (vehicle) => vehicle.stationId !== pickupStationId,
    );

    return {
      pickupStationId,
      pickupAt: pickupAt.toISOString(),
      expectedReturnAt: expectedReturnAt.toISOString(),
      availableVehicles: localVehicles,
      alternativeVehicles,
      suggestionMessage:
        localVehicles.length === 0 && alternativeVehicles.length > 0
          ? 'Nao existem viaturas na estacao selecionada. Foram encontradas alternativas noutras estacoes.'
          : null,
    };
  }

  async findAll(
    options: ReservationListOptions = {},
  ): Promise<ReservationRecord[]> {
    const normalizedStatus = this.normalizeStatusFilter(options.status);
    const normalizedSearch = options.search?.trim().toLowerCase() || '';
    const pickupStationId = this.parseOptionalPositiveInteger(
      options.pickupStationId,
      'A estacao do filtro e invalida.',
      'INVALID_RESERVATION_STATION_FILTER',
    );
    const startDate = this.parseOptionalDate(
      options.startDate,
      'A data inicial do filtro e invalida.',
    );
    const endDate = this.parseOptionalDate(
      options.endDate,
      'A data final do filtro e invalida.',
    );

    if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
      throw new BadRequestException({
        message: 'O intervalo de datas para consulta de reservas e invalido.',
        code: 'INVALID_RESERVATION_DATE_RANGE',
      });
    }

    return [...this.reservations]
      .filter(
        (reservation) =>
          !normalizedStatus || reservation.status === normalizedStatus,
      )
      .filter(
        (reservation) =>
          pickupStationId === null || reservation.stationId === pickupStationId,
      )
      .filter((reservation) =>
        this.matchesPickupDateRange(reservation, startDate, endDate),
      )
      .filter((reservation) => {
        if (!normalizedSearch) {
          return true;
        }

        return this.buildSearchableReservationText(reservation).includes(
          normalizedSearch,
        );
      })
      .sort(
        (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
      );
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
    const pickupStation = await this.stationService.findOne(
      payload.pickupStationId,
    );
    const returnStation = await this.stationService.findOne(
      payload.returnStationId,
    );
    const vehicle = await this.vehicleService.findOne(payload.vehicleId);
    const pickupAt = this.parseDate(
      payload.pickupAt,
      'A data de levantamento e invalida.',
    );
    const expectedReturnAt = this.parseDate(
      payload.expectedReturnAt,
      'A data de devolucao e invalida.',
    );

    this.ensureValidPeriod(pickupAt, expectedReturnAt);

    if (vehicle.stationId !== pickupStation.id) {
      throw new BadRequestException({
        message: 'O veiculo selecionado nao pertence a estacao indicada.',
        code: 'VEHICLE_WRONG_STATION',
      });
    }

    if (vehicle.status !== 'AVAILABLE') {
      throw new BadRequestException({
        message:
          'O veiculo selecionado ja nao esta disponivel no periodo indicado. Escolha outra viatura.',
        code: 'VEHICLE_UNAVAILABLE',
        alternatives: [],
      });
    }

    if (
      this.isVehicleBlockedByImpro(
        vehicle.id,
        pickupStation.id,
        pickupAt,
        expectedReturnAt,
      )
    ) {
      throw new BadRequestException({
        message:
          'O veiculo selecionado esta em transferencia impro no periodo indicado. Escolha outra viatura.',
        code: 'VEHICLE_IN_IMPRO_TRANSFER',
        alternatives: [],
      });
    }

    if (
      !this.isVehicleAvailableForPeriod(
        vehicle.id,
        pickupAt,
        expectedReturnAt,
        null,
      )
    ) {
      const availability = await this.getAvailability({
        pickupStationId: String(payload.pickupStationId),
        pickupAt: pickupAt.toISOString(),
        expectedReturnAt: expectedReturnAt.toISOString(),
      });

      throw new BadRequestException({
        message:
          'O veiculo selecionado ja nao esta disponivel no periodo indicado. Escolha outra viatura.',
        code: 'VEHICLE_UNAVAILABLE',
        alternatives: availability.alternativeVehicles,
      });
    }

    const customerSelection = this.rentalService.resolveCustomerSelection(
      payload,
      actor,
    );
    const now = new Date();
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
      paymentStatus: 'NONE',
      financialReviewRequired: false,
      adminValidationRequired: false,
      cancellationWarnings: [],
      cancelledAt: null,
      cancelledBy: null,
      convertedToRentalAt: null,
      notes: this.normalizeNullableText(payload.notes),
      createdAt: now,
      updatedAt: now,
      createdBy: this.resolveActorLabel(actor),
    };

    this.reservations.unshift(reservation);
    this.logAudit(
      'CREATE',
      reservation.id,
      this.resolveActorLabel(actor),
      `Reserva ${reservation.reservationNumber} criada para ${reservation.customerFullName}.`,
    );

    return reservation;
  }

  async update(
    id: number,
    payload: UpdateReservationDto,
    actor?: AuthenticatedUserDto,
  ): Promise<ReservationRecord> {
    const index = this.reservations.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new NotFoundException('Reserva nao encontrada.');
    }

    const current = this.reservations[index];

    if (!ACTIVE_RESERVATION_STATUSES.has(current.status)) {
      throw new BadRequestException({
        message: 'A reserva selecionada ja nao pode ser alterada.',
        code: 'RESERVATION_NOT_EDITABLE',
      });
    }

    const returnStation = payload.returnStationId
      ? await this.stationService.findOne(payload.returnStationId)
      : null;
    const nextExpectedReturnAt = payload.expectedReturnAt
      ? this.parseDate(
          payload.expectedReturnAt,
          'A data de devolucao e invalida.',
        )
      : current.expectedReturnAt;

    this.ensureValidPeriod(current.pickupAt, nextExpectedReturnAt);

    if (
      !this.isVehicleAvailableForPeriod(
        current.vehicleId,
        current.pickupAt,
        nextExpectedReturnAt,
        current.id,
      )
    ) {
      throw new BadRequestException({
        message:
          'A reserva ja nao pode usar a viatura selecionada no periodo indicado.',
        code: 'VEHICLE_UNAVAILABLE',
      });
    }

    const updated: ReservationRecord = {
      ...current,
      expectedReturnAt: nextExpectedReturnAt,
      returnStationId: returnStation?.id || current.returnStationId,
      returnStationName: returnStation?.name || current.returnStationName,
      notes:
        payload.notes !== undefined
          ? this.normalizeNullableText(payload.notes)
          : current.notes,
      ...this.buildCustomerSnapshotUpdate(current, payload),
      updatedAt: new Date(),
    };

    this.reservations[index] = updated;
    this.logAudit(
      'UPDATE',
      updated.id,
      this.resolveActorLabel(actor),
      `Reserva ${updated.reservationNumber} atualizada.`,
    );
    return updated;
  }

  async cancel(
    id: number,
    actor?: AuthenticatedUserDto,
    options: ReservationCancelOptions = {},
  ): Promise<ReservationRecord> {
    const index = this.reservations.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new NotFoundException('Reserva nao encontrada.');
    }

    const current = this.reservations[index];

    if (current.status === 'CANCELLED') {
      throw new BadRequestException({
        message: 'A reserva ja foi cancelada.',
        code: 'RESERVATION_ALREADY_CANCELLED',
      });
    }

    if (current.status === 'COMPLETED' || current.convertedToRentalAt) {
      throw new BadRequestException({
        message:
          'A reserva ja foi convertida em contrato e nao pode ser cancelada.',
        code: 'RESERVATION_ALREADY_CONVERTED',
      });
    }

    const now = new Date();

    if (current.pickupAt.getTime() <= now.getTime()) {
      throw new BadRequestException({
        message:
          'A reserva ja atingiu o inicio do contrato e nao pode ser cancelada.',
        code: 'RESERVATION_ALREADY_STARTED',
      });
    }

    const requiresAdminValidation = this.requiresAdminValidation(actor);

    if (requiresAdminValidation && !options.adminValidated) {
      throw new ForbiddenException({
        message:
          'O cancelamento desta reserva exige validacao adicional de Admin.',
        code: 'ADMIN_VALIDATION_REQUIRED',
      });
    }

    const cancellationWarnings = this.buildCancellationWarnings(current, now);
    const cancelled: ReservationRecord = {
      ...current,
      status: 'CANCELLED',
      financialReviewRequired: this.requiresFinancialReview(current),
      adminValidationRequired: requiresAdminValidation,
      cancellationWarnings,
      cancelledAt: now,
      cancelledBy: this.resolveActorLabel(actor),
      updatedAt: now,
    };

    this.reservations[index] = cancelled;
    this.logAudit(
      'CANCEL',
      cancelled.id,
      this.resolveActorLabel(actor),
      `Reserva ${cancelled.reservationNumber} cancelada. Avisos: ${cancellationWarnings.join(' | ') || 'sem avisos'}.`,
    );

    return cancelled;
  }

  async markAsConvertedToContract(
    id: number,
    actor?: AuthenticatedUserDto,
  ): Promise<ReservationRecord> {
    const index = this.reservations.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new NotFoundException('Reserva nao encontrada.');
    }

    const now = new Date();
    const converted: ReservationRecord = {
      ...this.reservations[index],
      status: 'COMPLETED',
      convertedToRentalAt: now,
      updatedAt: now,
    };

    this.reservations[index] = converted;
    this.logAudit(
      'CONVERT',
      converted.id,
      this.resolveActorLabel(actor),
      `Reserva ${converted.reservationNumber} convertida em contrato.`,
    );

    return converted;
  }

  private async buildStationNameMap(): Promise<Map<number, string>> {
    const stations = await this.stationService.findAll();
    return new Map(stations.map((station) => [station.id, station.name]));
  }

  private isVehicleAvailableForPeriod(
    vehicleId: number,
    pickupAt: Date,
    expectedReturnAt: Date,
    excludeReservationId: number | null,
  ): boolean {
    // Cancelled and completed reservations no longer hold a vehicle slot.
    return !this.reservations.some((reservation) => {
      if (
        reservation.id === excludeReservationId ||
        reservation.vehicleId !== vehicleId ||
        !ACTIVE_RESERVATION_STATUSES.has(reservation.status)
      ) {
        return false;
      }

      return this.periodsOverlap(
        pickupAt,
        expectedReturnAt,
        reservation.pickupAt,
        reservation.expectedReturnAt,
      );
    });
  }

  private isVehicleBlockedByImpro(
    vehicleId: number,
    pickupStationId: number,
    pickupAt: Date,
    expectedReturnAt: Date,
  ): boolean {
    return (
      this.improService?.blocksVehicleReservation(
        vehicleId,
        pickupStationId,
        pickupAt,
        expectedReturnAt,
      ) ?? false
    );
  }

  private periodsOverlap(
    leftStart: Date,
    leftEnd: Date,
    rightStart: Date,
    rightEnd: Date,
  ): boolean {
    return (
      leftStart.getTime() < rightEnd.getTime() &&
      rightStart.getTime() < leftEnd.getTime()
    );
  }

  private matchesPickupDateRange(
    reservation: ReservationRecord,
    startDate: Date | null,
    endDate: Date | null,
  ): boolean {
    const pickupTime = reservation.pickupAt.getTime();

    if (startDate && pickupTime < startDate.getTime()) {
      return false;
    }

    if (endDate && pickupTime > endDate.getTime()) {
      return false;
    }

    return true;
  }

  private buildSearchableReservationText(
    reservation: ReservationRecord,
  ): string {
    return [
      reservation.reservationNumber,
      reservation.customerFullName,
      reservation.customerEmail,
      reservation.customerPhone,
      reservation.customerDocumentNumber,
      reservation.vehiclePlate,
      reservation.vehicleBrand,
      reservation.vehicleModel,
      reservation.stationName,
      reservation.returnStationName,
      reservation.status,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
  }

  private buildCustomerSnapshotUpdate(
    current: ReservationRecord,
    payload: UpdateReservationDto,
  ): Partial<ReservationRecord> {
    const firstName = payload.customerFirstName?.trim();
    const lastName = payload.customerLastName?.trim();
    const hasNameUpdate =
      payload.customerFirstName !== undefined ||
      payload.customerLastName !== undefined;

    if (!hasNameUpdate) {
      return {
        customerEmail:
          payload.customerEmail !== undefined
            ? this.normalizeNullableText(payload.customerEmail)
            : current.customerEmail,
        customerPhone:
          payload.customerPhone !== undefined
            ? this.normalizeNullableText(payload.customerPhone)
            : current.customerPhone,
        customerDocumentNumber:
          payload.customerDocumentNumber !== undefined
            ? this.normalizeNullableText(payload.customerDocumentNumber)
            : current.customerDocumentNumber,
      };
    }

    const currentNameParts = current.customerFullName.split(/\s+/);
    const nextFirstName = firstName || currentNameParts[0] || '';
    const nextLastName = lastName || currentNameParts.slice(1).join(' ');
    const nextFullName = `${nextFirstName} ${nextLastName}`.trim();

    return {
      customerFullName: nextFullName || current.customerFullName,
      customerEmail:
        payload.customerEmail !== undefined
          ? this.normalizeNullableText(payload.customerEmail)
          : current.customerEmail,
      customerPhone:
        payload.customerPhone !== undefined
          ? this.normalizeNullableText(payload.customerPhone)
          : current.customerPhone,
      customerDocumentNumber:
        payload.customerDocumentNumber !== undefined
          ? this.normalizeNullableText(payload.customerDocumentNumber)
          : current.customerDocumentNumber,
    };
  }

  private buildCancellationWarnings(
    reservation: ReservationRecord,
    cancelledAt: Date,
  ): string[] {
    const warnings: string[] = [];
    const millisecondsUntilPickup =
      reservation.pickupAt.getTime() - cancelledAt.getTime();

    if (
      millisecondsUntilPickup > 0 &&
      millisecondsUntilPickup <= LATE_CANCELLATION_WINDOW_MS
    ) {
      warnings.push(
        'Cancelamento proximo da data de inicio. Rever possivel penalizacao interna.',
      );
    }

    if (this.requiresFinancialReview(reservation)) {
      warnings.push(
        'Reserva com pagamento associado. Necessario tratamento financeiro.',
      );
    }

    return warnings;
  }

  private requiresFinancialReview(reservation: ReservationRecord): boolean {
    return (
      reservation.paymentStatus === 'PAID' ||
      reservation.paymentStatus === 'REFUND_REQUIRED'
    );
  }

  private requiresAdminValidation(actor?: AuthenticatedUserDto): boolean {
    if (!actor) {
      return false;
    }

    return (
      actor.accessLevel === 'LIMITED' ||
      !CANCELLATION_ADMIN_ROLES.has(actor.role)
    );
  }

  private normalizeStatusFilter(status?: string): ReservationStatus | null {
    if (!status || !status.trim()) {
      return null;
    }

    const normalized = status.trim().toUpperCase();

    if (
      normalized === 'DRAFT' ||
      normalized === 'CONFIRMED' ||
      normalized === 'CANCELLED' ||
      normalized === 'COMPLETED' ||
      normalized === 'NO_SHOW'
    ) {
      return normalized;
    }

    throw new BadRequestException({
      message: 'O estado da reserva e invalido.',
      code: 'INVALID_RESERVATION_STATUS',
    });
  }

  private parseDate(value: string | undefined, fallbackMessage: string): Date {
    if (!value || !value.trim()) {
      throw new BadRequestException({
        message: fallbackMessage,
        code: 'INVALID_RESERVATION_DATE',
      });
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException({
        message: fallbackMessage,
        code: 'INVALID_RESERVATION_DATE',
      });
    }

    return parsed;
  }

  private parseOptionalDate(
    value: string | undefined,
    fallbackMessage: string,
  ): Date | null {
    if (!value || !value.trim()) {
      return null;
    }

    return this.parseDate(value, fallbackMessage);
  }

  private parsePositiveInteger(
    value: string | undefined,
    message: string,
    code: string,
  ): number {
    const parsed = this.parseOptionalPositiveInteger(value, message, code);

    if (parsed === null) {
      throw new BadRequestException({
        message,
        code,
      });
    }

    return parsed;
  }

  private parseOptionalPositiveInteger(
    value: string | undefined,
    message: string,
    code: string,
  ): number | null {
    if (!value || !value.trim()) {
      return null;
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed < 1) {
      throw new BadRequestException({
        message,
        code,
      });
    }

    return parsed;
  }

  private ensureValidPeriod(pickupAt: Date, expectedReturnAt: Date): void {
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

  private normalizeNullableText(value?: string | null): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
  }

  private resolveActorLabel(actor?: AuthenticatedUserDto): string {
    return actor?.userId || actor?.fullName || actor?.id || 'Sistema';
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
