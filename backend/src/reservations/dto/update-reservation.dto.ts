import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateReservationDto {
  @IsOptional()
  @IsString()
  expectedReturnAt?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  returnStationId?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerEmail?: string;
}
