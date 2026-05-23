import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  VEHICLE_STATUSES,
  type FuelType,
  type TransmissionType,
  type VehicleStatus,
} from './create-vehicle.dto';

export class UpdateVehicleDto {
  @ApiPropertyOptional({ example: 'AA-22-CC' })
  @IsOptional()
  @IsString()
  plateNumber?: string;

  @ApiPropertyOptional({ example: 'Renault' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: 'Clio' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: 'Economico' })
  @IsOptional()
  @IsString()
  submodel?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 2020, minimum: 1980 })
  @IsOptional()
  @IsInt()
  @Min(1980)
  year?: number;

  @ApiPropertyOptional({ example: 5, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  seats?: number;

  @ApiPropertyOptional({ enum: TRANSMISSION_TYPES, example: 'MANUAL' })
  @IsOptional()
  @IsEnum(TRANSMISSION_TYPES)
  transmission?: TransmissionType;

  @ApiPropertyOptional({ enum: FUEL_TYPES, example: 'DIESEL' })
  @IsOptional()
  @IsEnum(FUEL_TYPES)
  fuelType?: FuelType;

  @ApiPropertyOptional({ example: 69020, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  odometerKm?: number;

  @ApiPropertyOptional({ example: 39.5, minimum: 0.01 })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  dailyRate?: number;

  @ApiPropertyOptional({ enum: VEHICLE_STATUSES, example: 'MAINTENANCE' })
  @IsOptional()
  @IsEnum(VEHICLE_STATUSES)
  status?: VehicleStatus;
}
