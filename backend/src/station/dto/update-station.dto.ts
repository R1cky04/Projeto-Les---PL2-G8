import { ApiPropertyOptional } from '@nestjs/swagger';

// Request contract for PUT /stations/:id.
export class UpdateStationDto {
  @ApiPropertyOptional({ example: 'Estacao Central Atualizada' })
  name?: string;

  @ApiPropertyOptional({ example: 'Centro de Faro' })
  location?: string;

  @ApiPropertyOptional({ example: 55, minimum: 1 })
  capacity?: number;

  @ApiPropertyOptional({ example: 25, minimum: 0 })
  allocatedVehicles?: number;
}
