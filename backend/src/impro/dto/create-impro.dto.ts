import { IsInt, IsISO8601, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateImproDto {
  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  vehicleId: number;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  originStationId: number;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  destinationStationId: number;

  @ApiPropertyOptional({ example: '2026-12-01T09:00:00.000Z' })
  @IsOptional()
  @IsISO8601()
  transferDate?: string;

  @ApiPropertyOptional({ example: '2026-12-01T12:00:00.000Z' })
  @IsOptional()
  @IsISO8601()
  plannedArrivalDate?: string;

  @ApiPropertyOptional({
    example: 'Transferencia programada para equilibrar disponibilidade.',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
