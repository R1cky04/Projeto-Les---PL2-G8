import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateReservationDto {
  @IsInt()
  @Min(1)
  stationId: number;

  @IsInt()
  @Min(1)
  vehicleId: number;

  @IsString()
  pickupAt: string;

  @IsString()
  expectedReturnAt: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
