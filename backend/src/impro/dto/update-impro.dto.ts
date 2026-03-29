import { IsISO8601, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateImproDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  destinationStationId?: number;

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
