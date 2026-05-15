import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CloseRentalDto {
  @ApiProperty({ example: 46500, minimum: 0 })
  @IsInt()
  @Min(0)
  returnOdometerKm: number;

  @ApiPropertyOptional({ example: 2, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  actualReturnStationId?: number;

  @ApiPropertyOptional({ example: 'Contrato encerrado sem incidentes.' })
  @IsOptional()
  @IsString()
  finalNotes?: string;
}
