import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InternalPermission } from '../internal-users/internal-user.enums';
import type { AuthenticatedUserDto } from '../auth/auth.types';
import { StationService } from '../station/station.service';
import { CloseImproDto } from './dto/close-impro.dto';
import { CreateImproDto } from './dto/create-impro.dto';
import { UpdateImproDto } from './dto/update-impro.dto';

export type ImproStatus = 'SCHEDULED' | 'IN_TRANSFER' | 'CLOSED';
export type VehicleTransferStatus = 'AVAILABLE' | 'IN_TRANSFER' | 'MAINTENANCE';

export interface ImproFilters {
  search?: string;
  vehiclePlate?: string;
  stationId?: number;
  status?: ImproStatus;
  fromDate?: string;
  toDate?: string;
}

export interface TransferVehicle {
  id: number;
  plate: string;
  model: string;
  currentStationId: number;
  status: VehicleTransferStatus;
  hasActiveContract: boolean;
  maintenanceScheduledAt?: Date | null;
}

export interface ImproHistoryEntry {
  timestamp: Date;
  actor: string;
  action: 'CREATED' | 'UPDATED' | 'CLOSED';
  details: string;
}

export interface ImproRecord {
  id: number;
  improCode: string;
  vehicleId: number;
  vehiclePlate: string;
  originStationId: number;
  destinationStationId: number;
  transferDate: Date;
  plannedArrivalDate: Date | null;
  actualArrivalDate: Date | null;
  status: ImproStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  warnings: string[];
  history: ImproHistoryEntry[];
}

export interface ImproListResponse {
  items: ImproRecord[];
  totalItems: number;
}

@Injectable()
export class ImproService {
  private impros: ImproRecord[] = [];

  private vehicles: TransferVehicle[] = [
    {
      id: 101,
      plate: 'AA-11-BB',
      model: 'Toyota Corolla',
      currentStationId: 1,
      status: 'AVAILABLE',
      hasActiveContract: false,
      maintenanceScheduledAt: null,
    },
    {
      id: 102,
      plate: 'CC-22-DD',
      model: 'Renault Clio',
      currentStationId: 2,
      status: 'AVAILABLE',
      hasActiveContract: false,
      maintenanceScheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    },
    {
      id: 103,
      plate: 'EE-33-FF',
      model: 'Peugeot 208',
      currentStationId: 1,
      status: 'AVAILABLE',
      hasActiveContract: true,
      maintenanceScheduledAt: null,
    },
  ];

  private nextImproId = 1;

  constructor(private readonly stationService: StationService) {}

  async listVehicles(plate?: string): Promise<TransferVehicle[]> {
    const normalizedPlate = (plate || '').trim().toLowerCase();

    if (!normalizedPlate) {
      return this.vehicles;
    }

    return this.vehicles.filter((vehicle) =>
      vehicle.plate.toLowerCase().includes(normalizedPlate),
    );
  }

  async listStations() {
    return this.stationService.findAll();
  }

  async create(payload: CreateImproDto, actor: AuthenticatedUserDto): Promise<ImproRecord> {
    this.ensureTransferPermissions(actor);

    if (payload.originStationId === payload.destinationStationId) {
      throw new BadRequestException({
        message: 'A estacao de origem e destino nao podem ser iguais.',
        code: 'SAME_STATION',
      });
    }

    await this.ensureStationExists(payload.originStationId);
    await this.ensureStationExists(payload.destinationStationId);

    const vehicle = this.getVehicleOrFail(payload.vehicleId);

    if (vehicle.hasActiveContract) {
      throw new BadRequestException({
        message: 'O veiculo tem contrato ativo e nao pode ser transferido.',
        code: 'ACTIVE_CONTRACT',
      });
    }

    if (vehicle.status === 'IN_TRANSFER') {
      throw new BadRequestException({
        message: 'O veiculo ja se encontra em transferencia.',
        code: 'VEHICLE_ALREADY_IN_TRANSFER',
      });
    }

    if (vehicle.currentStationId !== payload.originStationId) {
      throw new BadRequestException({
        message: 'O veiculo nao pertence atualmente a estacao de origem selecionada.',
        code: 'INVALID_ORIGIN_STATION',
      });
    }

    const transferDate = payload.transferDate
      ? new Date(payload.transferDate)
      : new Date();

    if (Number.isNaN(transferDate.getTime())) {
      throw new BadRequestException({
        message: 'Data de transferencia invalida.',
        code: 'INVALID_TRANSFER_DATE',
      });
    }

    const plannedArrivalDate = payload.plannedArrivalDate
      ? new Date(payload.plannedArrivalDate)
      : null;

    if (plannedArrivalDate && Number.isNaN(plannedArrivalDate.getTime())) {
      throw new BadRequestException({
        message: 'Data prevista de chegada invalida.',
        code: 'INVALID_ARRIVAL_DATE',
      });
    }

    const warnings: string[] = [];

    if (transferDate.getTime() > Date.now()) {
      warnings.push('Transferencia agendada para data futura.');
    }

    if (vehicle.maintenanceScheduledAt) {
      warnings.push('Aviso: o veiculo tem manutencao programada.');
    }

    const now = new Date();
    const improCode = this.buildImproCode(this.nextImproId);
    const status: ImproStatus =
      transferDate.getTime() > now.getTime() ? 'SCHEDULED' : 'IN_TRANSFER';

    const impro: ImproRecord = {
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

    vehicle.status = status === 'IN_TRANSFER' ? 'IN_TRANSFER' : 'AVAILABLE';

    return impro;
  }

  async findAll(filters: ImproFilters = {}): Promise<ImproListResponse> {
    const normalizedSearch = (filters.search || '').trim().toLowerCase();
    const normalizedPlate = (filters.vehiclePlate || '').trim().toLowerCase();
    const normalizedStatus = (filters.status || '').trim().toUpperCase() as ImproStatus;

    const fromDate = this.parseFilterDate(filters.fromDate, 'INVALID_FROM_DATE');
    const toDate = this.parseFilterDate(filters.toDate, 'INVALID_TO_DATE');

    if (fromDate && toDate && fromDate.getTime() > toDate.getTime()) {
      throw new BadRequestException({
        message: 'Intervalo de datas invalido. A data inicial deve ser inferior a final.',
        code: 'INVALID_DATE_RANGE',
      });
    }

    if (
      filters.stationId !== undefined &&
      (!Number.isInteger(filters.stationId) || filters.stationId < 1)
    ) {
      throw new BadRequestException({
        message: 'ID da estacao invalido no filtro.',
        code: 'INVALID_STATION_FILTER',
      });
    }

    const items = this.impros.filter((impro) => {
      if (normalizedSearch) {
        const matchesSearch =
          impro.improCode.toLowerCase().includes(normalizedSearch) ||
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

      if (
        normalizedStatus &&
        normalizedStatus !== 'SCHEDULED' &&
        normalizedStatus !== 'IN_TRANSFER' &&
        normalizedStatus !== 'CLOSED'
      ) {
        throw new BadRequestException({
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

  async update(id: number, payload: UpdateImproDto, actor: AuthenticatedUserDto): Promise<ImproRecord> {
    this.ensureTransferPermissions(actor);

    const impro = this.getImproOrFail(id);

    if (impro.status === 'CLOSED') {
      throw new BadRequestException({
        message: 'Nao e possivel atualizar um impro encerrado.',
        code: 'IMPRO_CLOSED',
      });
    }

    const warnings: string[] = [];

    if (payload.destinationStationId !== undefined) {
      if (payload.destinationStationId === impro.originStationId) {
        throw new BadRequestException({
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
        throw new BadRequestException({
          message: 'Data de transferencia invalida.',
          code: 'INVALID_TRANSFER_DATE',
        });
      }

      impro.transferDate = transferDate;

      const vehicle = this.getVehicleOrFail(impro.vehicleId);
      if (transferDate.getTime() > Date.now()) {
        impro.status = 'SCHEDULED';
        if (vehicle.status !== 'MAINTENANCE') {
          vehicle.status = 'AVAILABLE';
        }
        warnings.push('Transferencia atualizada para data futura.');
      } else {
        impro.status = 'IN_TRANSFER';
        if (vehicle.status !== 'MAINTENANCE') {
          vehicle.status = 'IN_TRANSFER';
        }
      }
    }

    if (payload.plannedArrivalDate !== undefined) {
      const plannedArrivalDate = new Date(payload.plannedArrivalDate);
      if (Number.isNaN(plannedArrivalDate.getTime())) {
        throw new BadRequestException({
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

  async close(id: number, payload: CloseImproDto, actor: AuthenticatedUserDto): Promise<ImproRecord> {
    this.ensureTransferPermissions(actor);

    const impro = this.getImproOrFail(id);

    if (impro.status === 'CLOSED') {
      throw new BadRequestException({
        message: 'Este impro ja se encontra encerrado.',
        code: 'IMPRO_ALREADY_CLOSED',
      });
    }

    const actualArrivalDate = payload.actualArrivalDate
      ? new Date(payload.actualArrivalDate)
      : new Date();

    if (Number.isNaN(actualArrivalDate.getTime())) {
      throw new BadRequestException({
        message: 'Data real de chegada invalida.',
        code: 'INVALID_ACTUAL_ARRIVAL_DATE',
      });
    }

    const vehicle = this.getVehicleOrFail(impro.vehicleId);
    vehicle.currentStationId = impro.destinationStationId;

    const closureWarnings: string[] = [];
    const arrivedLate =
      Boolean(impro.plannedArrivalDate) &&
      actualArrivalDate.getTime() > new Date(impro.plannedArrivalDate as Date).getTime();

    if (arrivedLate) {
      closureWarnings.push('Veiculo chegou com atraso face a chegada prevista.');
    }

    if (payload.vehicleDamaged) {
      vehicle.status = 'MAINTENANCE';
      closureWarnings.push('Veiculo com danos foi encaminhado para manutencao.');
    } else {
      vehicle.status = 'AVAILABLE';
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

  private buildImproCode(sequence: number): string {
    return `IMPRO-${String(sequence).padStart(5, '0')}`;
  }

  private getImproOrFail(id: number): ImproRecord {
    const impro = this.impros.find((item) => item.id === id);

    if (!impro) {
      throw new NotFoundException({
        message: 'Impro nao encontrado.',
        code: 'IMPRO_NOT_FOUND',
      });
    }

    return impro;
  }

  private getVehicleOrFail(id: number): TransferVehicle {
    const vehicle = this.vehicles.find((item) => item.id === id);

    if (!vehicle) {
      throw new NotFoundException({
        message: 'Veiculo nao encontrado.',
        code: 'VEHICLE_NOT_FOUND',
      });
    }

    return vehicle;
  }

  private async ensureStationExists(id: number): Promise<void> {
    await this.stationService.findOne(id);
  }

  private parseFilterDate(value: string | undefined, code: string): Date | null {
    if (!value) {
      return null;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException({
        message: 'Data invalida no filtro.',
        code,
      });
    }

    return parsed;
  }

  private resolveActorLabel(actor: AuthenticatedUserDto): string {
    return actor.userId || actor.id;
  }

  private ensureTransferPermissions(actor: AuthenticatedUserDto): void {
    if (!actor.permissions.includes(InternalPermission.TRANSFER_WRITE)) {
      throw new BadRequestException({
        message: 'Sem permissao para operacoes de transferencia.',
        code: 'TRANSFER_PERMISSION_REQUIRED',
      });
    }
  }
}
