import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  VEHICLE_STATUSES,
  type FuelType,
  type TransmissionType,
  type VehicleStatus,
} from './create-vehicle.dto';

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  plateNumber?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

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

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  dailyRate?: number;

  @IsOptional()
  @IsEnum(VEHICLE_STATUSES)
  status?: VehicleStatus;
}