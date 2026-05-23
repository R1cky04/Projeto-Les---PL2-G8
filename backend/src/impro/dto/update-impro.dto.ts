import { IsISO8601, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateImproDto {
  @ApiPropertyOptional({ example: 2, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  destinationStationId?: number;

  @ApiPropertyOptional({ example: '2026-12-01T10:00:00.000Z' })
  @IsOptional()
  @IsISO8601()
  transferDate?: string;

  @ApiPropertyOptional({ example: '2026-12-01T13:00:00.000Z' })
  @IsOptional()
  @IsISO8601()
  plannedArrivalDate?: string;

  @ApiPropertyOptional({ example: 'Chegada prevista atualizada.' })
  @IsOptional()
  @IsString()
  notes?: string;
}
