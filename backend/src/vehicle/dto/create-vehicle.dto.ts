import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiProperty({ example: 'AA-11-BB', description: 'Matricula do veiculo.' })
  @IsString()
  plateNumber: string;

  @ApiProperty({ example: 'Toyota' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 'Corolla' })
  @IsString()
  model: string;

  @ApiPropertyOptional({ example: 'Compacto' })
  @IsOptional()
  @IsString()
  submodel?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 2021, minimum: 1980 })
  @IsOptional()
  @IsInt()
  @Min(1980)
  year?: number;

  @ApiPropertyOptional({ example: 5, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  seats?: number;

  @ApiPropertyOptional({ enum: TRANSMISSION_TYPES, example: 'AUTOMATIC' })
  @IsOptional()
  @IsEnum(TRANSMISSION_TYPES)
  transmission?: TransmissionType;

  @ApiPropertyOptional({ enum: FUEL_TYPES, example: 'HYBRID' })
  @IsOptional()
  @IsEnum(FUEL_TYPES)
  fuelType?: FuelType;

  @ApiPropertyOptional({ example: 46300, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  odometerKm?: number;

  @ApiProperty({ example: 54.9, minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  dailyRate: number;

  @ApiPropertyOptional({ enum: VEHICLE_STATUSES, example: 'AVAILABLE' })
  @IsOptional()
  @IsEnum(VEHICLE_STATUSES)
  status?: VehicleStatus;
}
