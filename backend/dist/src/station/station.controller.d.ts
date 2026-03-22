import { StationService, Station } from './station.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import type { AuthenticatedRequest } from '../auth/auth.types';
export declare class StationController {
    private readonly stationService;
    constructor(stationService: StationService);
    create(createStationDto: CreateStationDto, request: AuthenticatedRequest): Promise<Station>;
    search(searchTerm: string): Promise<Station[]>;
    findOne(id: number): Promise<Station>;
    findAll(): Promise<Station[]>;
    update(id: number, updateStationDto: UpdateStationDto, request: AuthenticatedRequest): Promise<Station>;
    delete(id: number, request: AuthenticatedRequest): Promise<Station>;
}
