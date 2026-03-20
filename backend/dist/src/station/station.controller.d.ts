import { StationService } from './station.service';
import { CreateStationDto } from './dto/create-station.dto';
export declare class StationController {
    private readonly stationService;
    constructor(stationService: StationService);
    create(createStationDto: CreateStationDto): Promise<import("../prisma/prisma.service").StationRecord>;
    findAll(): Promise<import("../prisma/prisma.service").StationRecord[]>;
    findOne(id: number): Promise<import("../prisma/prisma.service").StationRecord | null>;
}
