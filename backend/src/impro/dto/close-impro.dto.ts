import { IsBoolean, IsISO8601, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CloseImproDto {
  @ApiPropertyOptional({ example: '2026-12-01T14:00:00.000Z' })
  @IsOptional()
  @IsISO8601()
  actualArrivalDate?: string;

  @ApiPropertyOptional({ example: 'Veiculo entregue na estacao destino.' })
  @IsOptional()
  @IsString()
  closureNotes?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  vehicleDamaged?: boolean;
}
