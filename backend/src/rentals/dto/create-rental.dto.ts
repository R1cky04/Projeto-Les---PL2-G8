import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateRentalDto {
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

  @IsInt()
  @Min(0)
  pickupOdometerKm: number;

  @IsString()
  vehicleCondition: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  customerId?: number;

  @IsOptional()
  @IsString()
  customerFirstName?: string;

  @IsOptional()
  @IsString()
  customerLastName?: string;

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  customerDocumentNumber?: string;
}