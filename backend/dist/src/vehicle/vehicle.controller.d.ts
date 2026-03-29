import type { AuthenticatedRequest } from '../auth/auth.types';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleService, type Vehicle } from './vehicle.service';
export declare class VehicleController {
    private readonly vehicleService;
    constructor(vehicleService: VehicleService);
    create(createVehicleDto: CreateVehicleDto, request: AuthenticatedRequest): Promise<Vehicle>;
    search(searchTerm: string): Promise<Vehicle[]>;
    findOne(id: number): Promise<Vehicle>;
    findAll(): Promise<Vehicle[]>;
    update(id: number, updateVehicleDto: UpdateVehicleDto, request: AuthenticatedRequest): Promise<Vehicle>;
    delete(id: number, request: AuthenticatedRequest): Promise<Vehicle>;
}
