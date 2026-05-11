import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRentalDto {
  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  stationId: number;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  vehicleId: number;

  @ApiProperty({ example: '2026-09-15T09:00:00.000Z' })
  @IsString()
  pickupAt: string;

  @ApiProperty({ example: '2026-09-17T09:00:00.000Z' })
  @IsString()
  expectedReturnAt: string;

  @ApiProperty({ example: 46300, minimum: 0 })
  @IsInt()
  @Min(0)
  pickupOdometerKm: number;

  @ApiProperty({ example: 'Sem danos visiveis' })
  @IsString()
  vehicleCondition: string;

  @ApiPropertyOptional({ example: 'Cliente pediu cadeira de bebe.' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    example: 1,
    minimum: 1,
    description: 'Cliente existente. Em alternativa, preencher dados do novo cliente.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  customerId?: number;

  @ApiPropertyOptional({ example: 'Ines' })
  @IsOptional()
  @IsString()
  customerFirstName?: string;

  @ApiPropertyOptional({ example: 'Almeida' })
  @IsOptional()
  @IsString()
  customerLastName?: string;

  @ApiPropertyOptional({ example: 'ines.almeida@example.com' })
  @IsOptional()
  @IsString()
  customerEmail?: string;

  @ApiPropertyOptional({ example: '+351912345678' })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiPropertyOptional({ example: '123456789' })
  @IsOptional()
  @IsString()
  customerDocumentNumber?: string;
}
