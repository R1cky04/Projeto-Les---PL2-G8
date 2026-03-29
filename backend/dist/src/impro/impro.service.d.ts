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
export declare class ImproService {
    private readonly stationService;
    private impros;
    private vehicles;
    private nextImproId;
    constructor(stationService: StationService);
    listVehicles(plate?: string): Promise<TransferVehicle[]>;
    listStations(): Promise<import("../station/station.service").Station[]>;
    create(payload: CreateImproDto, actor: AuthenticatedUserDto): Promise<ImproRecord>;
    findAll(filters?: ImproFilters): Promise<ImproListResponse>;
    update(id: number, payload: UpdateImproDto, actor: AuthenticatedUserDto): Promise<ImproRecord>;
    close(id: number, payload: CloseImproDto, actor: AuthenticatedUserDto): Promise<ImproRecord>;
    private buildImproCode;
    private getImproOrFail;
    private getVehicleOrFail;
    private ensureStationExists;
    private parseFilterDate;
    private resolveActorLabel;
    private ensureTransferPermissions;
}
