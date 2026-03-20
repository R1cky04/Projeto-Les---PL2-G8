import { PrismaService } from '../prisma/prisma.service';
import { CreateStationDto } from './dto/create-station.dto';
export declare class StationService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createStationDto: CreateStationDto, createdBy?: string): Promise<import("../prisma/prisma.service").StationRecord>;
    findAll(): Promise<import("../prisma/prisma.service").StationRecord[]>;
    findOne(id: number): Promise<import("../prisma/prisma.service").StationRecord | null>;
}
