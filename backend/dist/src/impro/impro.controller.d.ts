import type { AuthenticatedRequest } from '../auth/auth.types';
import { CloseImproDto } from './dto/close-impro.dto';
import { CreateImproDto } from './dto/create-impro.dto';
import { UpdateImproDto } from './dto/update-impro.dto';
import { ImproListResponse, ImproRecord, ImproService, TransferVehicle } from './impro.service';
export declare class ImproController {
    private readonly improService;
    constructor(improService: ImproService);
    listVehicles(plate?: string): Promise<TransferVehicle[]>;
    listStations(): Promise<import("../station/station.service").Station[]>;
    create(payload: CreateImproDto, request: AuthenticatedRequest): Promise<ImproRecord>;
    findAll(search?: string, vehiclePlate?: string, status?: string, stationId?: string, fromDate?: string, toDate?: string): Promise<ImproListResponse>;
    update(id: number, payload: UpdateImproDto, request: AuthenticatedRequest): Promise<ImproRecord>;
    close(id: number, payload: CloseImproDto, request: AuthenticatedRequest): Promise<ImproRecord>;
}
