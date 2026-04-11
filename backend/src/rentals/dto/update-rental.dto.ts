import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateRentalDto {
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
