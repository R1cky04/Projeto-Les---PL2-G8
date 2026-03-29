import { type FuelType, type TransmissionType, type VehicleStatus } from './create-vehicle.dto';
export declare class UpdateVehicleDto {
    plateNumber?: string;
    brand?: string;
    model?: string;
    category?: string;
    year?: number;
    seats?: number;
    transmission?: TransmissionType;
    fuelType?: FuelType;
    odometerKm?: number;
    dailyRate?: number;
    status?: VehicleStatus;
}
