import { CreateVehicleDto, type FuelType, type TransmissionType, type VehicleStatus } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
export interface Vehicle {
    id: number;
    plateNumber: string;
    brand: string;
    model: string;
    category: string | null;
    year: number | null;
    seats: number | null;
    transmission: TransmissionType | null;
    fuelType: FuelType | null;
    odometerKm: number;
    dailyRate: number;
    status: VehicleStatus;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string | null;
    partialWarnings?: string[];
}
export declare class VehicleService {
    private vehicles;
    private nextId;
    create(createVehicleDto: CreateVehicleDto, createdBy?: string): Promise<Vehicle>;
    findAll(): Promise<Vehicle[]>;
    findOne(id: number): Promise<Vehicle>;
    search(searchTerm: string): Promise<Vehicle[]>;
    update(id: number, updateVehicleDto: UpdateVehicleDto, updatedBy?: string): Promise<Vehicle>;
    delete(id: number, deletedBy?: string): Promise<Vehicle>;
    private validateVehiclePayload;
    private logAudit;
}
