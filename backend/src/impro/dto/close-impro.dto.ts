import { IsBoolean, IsISO8601, IsOptional, IsString } from 'class-validator';

export class CloseImproDto {
  @IsOptional()
  @IsISO8601()
  actualArrivalDate?: string;

  @IsOptional()
  @IsString()
  closureNotes?: string;

  @IsOptional()
  @IsBoolean()
  vehicleDamaged?: boolean;
}
