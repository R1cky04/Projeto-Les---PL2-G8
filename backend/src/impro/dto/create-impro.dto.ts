import { IsInt, IsISO8601, IsOptional, IsString, Min } from 'class-validator';

export class CreateImproDto {
  @IsInt()
  @Min(1)
  vehicleId: number;

  @IsInt()
  @Min(1)
  originStationId: number;

  @IsInt()
  @Min(1)
  destinationStationId: number;

  @IsOptional()
  @IsISO8601()
  transferDate?: string;

  @IsOptional()
  @IsISO8601()
  plannedArrivalDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
