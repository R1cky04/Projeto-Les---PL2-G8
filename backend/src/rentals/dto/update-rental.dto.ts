import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRentalDto {
  @ApiPropertyOptional({ example: '2026-09-18T09:00:00.000Z' })
  @IsOptional()
  @IsString()
  expectedReturnAt?: string;

  @ApiPropertyOptional({ example: 2, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  returnStationId?: number;

  @ApiPropertyOptional({ example: 'Cliente prolongou o contrato.' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'Ines' })
  @IsOptional()
  @IsString()
  customerFirstName?: string;

  @ApiPropertyOptional({ example: 'Almeida' })
  @IsOptional()
  @IsString()
  customerLastName?: string;

  @ApiPropertyOptional({ example: 'ines.updated@example.com' })
  @IsOptional()
  @IsString()
  customerEmail?: string;

  @ApiPropertyOptional({ example: '+351900000000' })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiPropertyOptional({ example: '987654321' })
  @IsOptional()
  @IsString()
  customerDocumentNumber?: string;
}
