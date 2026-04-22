import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateReservationDto {
  @IsInt()
  @Min(1)
  pickupStationId: number;

  @IsInt()
  @Min(1)
  returnStationId: number;

  @IsInt()
  @Min(1)
  vehicleId: number;

  @IsString()
  pickupAt: string;

  @IsString()
  expectedReturnAt: string;

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

  @IsOptional()
  @IsString()
  notes?: string;
}
