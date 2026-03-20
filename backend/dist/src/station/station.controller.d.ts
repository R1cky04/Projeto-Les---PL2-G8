import { StationService, Station } from './station.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
export declare class StationController {
    private readonly stationService;
    constructor(stationService: StationService);
    create(createStationDto: CreateStationDto): Promise<Station>;
    search(searchTerm: string): Promise<Station[]>;
    findOne(id: number): Promise<Station>;
    findAll(): Promise<Station[]>;
    update(id: number, updateStationDto: UpdateStationDto): Promise<Station>;
    delete(id: number): Promise<Station>;
}
