import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { AuthenticatedUserDto } from '../auth/auth.types';
import { StationService } from '../station/station.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

export interface ReservationRecord {
  id: number;
  reservationNumber: string;
  customerName: string;
  customerEmail: string | null;
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
  status: 'DRAFT' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

interface ReservationListOptions {
  search?: string;
  status?: string;
}

@Injectable()
export class ReservationService {
  private reservations: ReservationRecord[] = [];
  private nextReservationId = 1;

  constructor(
    private readonly stationService: StationService,
    private readonly vehicleService: VehicleService,
  ) {}

  async findAll(options: ReservationListOptions = {}): Promise<ReservationRecord[]> {
    const normalizedStatus = options.status?.trim().toUpperCase() || '';
    const normalizedSearch = options.search?.trim().toLowerCase() || '';

    return [...this.reservations]
      .filter((reservation) => !normalizedStatus || reservation.status === normalizedStatus)
      .filter((reservation) => {
        if (!normalizedSearch) {
          return true;
        }

        const searchable = [
          reservation.reservationNumber,
          reservation.customerName,
          reservation.customerEmail,
          reservation.vehiclePlate,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchable.includes(normalizedSearch);
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

  async create(payload: CreateReservationDto, actor?: AuthenticatedUserDto): Promise<ReservationRecord> {
    const station = await this.stationService.findOne(payload.stationId);
    const vehicle = await this.vehicleService.findOne(payload.vehicleId);

    const pickupAt = this.parseDate(payload.pickupAt, 'A data de inicio e invalida.');
    const expectedReturnAt = this.parseDate(
      payload.expectedReturnAt,
      'A data de fim e invalida.',
    );

    if (expectedReturnAt.getTime() <= pickupAt.getTime()) {
      throw new BadRequestException('A data de fim tem de ser posterior a data de inicio.');
    }

    if (vehicle.stationId !== station.id) {
      throw new BadRequestException('O veiculo selecionado nao pertence a estacao indicada.');
    }

    const now = new Date();
    const reservation: ReservationRecord = {
      id: this.nextReservationId++,
      reservationNumber: this.buildReservationNumber(),
      customerName: payload.customerName?.trim() || 'Cliente sem nome',
      customerEmail: this.normalizeNullableText(payload.customerEmail),
      stationId: station.id,
      stationName: station.name,
      returnStationId: station.id,
      returnStationName: station.name,
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
      createdBy: this.resolveActorLabel(actor),
    };

    this.reservations.unshift(reservation);
    return reservation;
  }

  async update(id: number, payload: UpdateReservationDto): Promise<ReservationRecord> {
    const index = this.reservations.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new NotFoundException('Reserva nao encontrada.');
    }

    const current = this.reservations[index];

    if (current.status === 'CANCELLED' || current.status === 'COMPLETED') {
      throw new BadRequestException('A reserva selecionada ja nao pode ser alterada.');
    }

    let returnStation = null;

    if (payload.returnStationId) {
      returnStation = await this.stationService.findOne(payload.returnStationId);
    }

    const nextExpectedReturnAt = payload.expectedReturnAt
      ? this.parseDate(payload.expectedReturnAt, 'A data de fim e invalida.')
      : current.expectedReturnAt;

    if (nextExpectedReturnAt.getTime() <= current.pickupAt.getTime()) {
      throw new BadRequestException('A data de fim tem de ser posterior a data de inicio.');
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
      customerName:
        payload.customerName !== undefined
          ? payload.customerName.trim() || current.customerName
          : current.customerName,
      customerEmail:
        payload.customerEmail !== undefined
          ? this.normalizeNullableText(payload.customerEmail)
          : current.customerEmail,
      updatedAt: new Date(),
    };

    this.reservations[index] = updated;
    return updated;
  }

  async cancel(id: number, actor?: AuthenticatedUserDto): Promise<ReservationRecord> {
    const index = this.reservations.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new NotFoundException('Reserva nao encontrada.');
    }

    const current = this.reservations[index];

    if (current.status === 'CANCELLED') {
      throw new BadRequestException('A reserva ja foi cancelada.');
    }

    if (current.status === 'COMPLETED') {
      throw new BadRequestException('A reserva ja foi concluida e nao pode ser cancelada.');
    }

    const cancelled: ReservationRecord = {
      ...current,
      status: 'CANCELLED',
      updatedAt: new Date(),
    };

    this.reservations[index] = cancelled;
    void actor;
    return cancelled;
  }

  private parseDate(value: string | undefined, fallbackMessage: string): Date {
    if (!value) {
      throw new BadRequestException(fallbackMessage);
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(fallbackMessage);
    }

    return parsed;
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

  private normalizeNullableText(value?: string | null): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
  }

  private resolveActorLabel(actor?: AuthenticatedUserDto): string {
    if (actor?.fullName?.trim()) {
      return actor.fullName.trim();
    }

    if (actor?.userId?.trim()) {
      return actor.userId.trim();
    }

    return 'Sistema';
  }
}
