import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export const VEHICLE_STATUSES = [
  'AVAILABLE',
  'RESERVED',
  'RENTED',
  'MAINTENANCE',
  'INACTIVE',
] as const;

export const TRANSMISSION_TYPES = ['MANUAL', 'AUTOMATIC'] as const;

export const FUEL_TYPES = ['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID'] as const;

export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];
export type TransmissionType = (typeof TRANSMISSION_TYPES)[number];
export type FuelType = (typeof FUEL_TYPES)[number];

export class CreateVehicleDto {
  @IsString()
  plateNumber: string;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsInt()
  @Min(1980)
  year?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  seats?: number;

  @IsOptional()
  @IsEnum(TRANSMISSION_TYPES)
  transmission?: TransmissionType;

  @IsOptional()
  @IsEnum(FUEL_TYPES)
  fuelType?: FuelType;

  @IsOptional()
  @IsInt()
  @Min(0)
  odometerKm?: number;

  @IsNumber()
  @Min(0.01)
  dailyRate: number;

  @IsOptional()
  @IsEnum(VEHICLE_STATUSES)
  status?: VehicleStatus;
}