export declare const VEHICLE_STATUSES: readonly ["AVAILABLE", "RESERVED", "RENTED", "MAINTENANCE", "INACTIVE"];
export declare const TRANSMISSION_TYPES: readonly ["MANUAL", "AUTOMATIC"];
export declare const FUEL_TYPES: readonly ["GASOLINE", "DIESEL", "ELECTRIC", "HYBRID"];
export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];
export type TransmissionType = (typeof TRANSMISSION_TYPES)[number];
export type FuelType = (typeof FUEL_TYPES)[number];
export declare class CreateVehicleDto {
    plateNumber: string;
    brand: string;
    model: string;
    category?: string;
    year?: number;
    seats?: number;
    transmission?: TransmissionType;
    fuelType?: FuelType;
    odometerKm?: number;
    dailyRate: number;
    status?: VehicleStatus;
}
