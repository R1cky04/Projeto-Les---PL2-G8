import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
export interface Station {
    id: number;
    name: string;
    location: string;
    capacity: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string | null;
}
export declare class StationService {
    private stations;
    private nextId;
    create(createStationDto: CreateStationDto, createdBy?: string): Promise<Station>;
    findAll(): Promise<Station[]>;
    findOne(id: number): Promise<Station>;
    search(searchTerm: string): Promise<Station[]>;
    update(id: number, updateStationDto: UpdateStationDto, updatedBy?: string): Promise<Station>;
    delete(id: number, deletedBy?: string): Promise<Station>;
    private logAudit;
}
