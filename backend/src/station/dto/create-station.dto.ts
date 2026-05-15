import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

// Request contract for POST /stations.
export class CreateStationDto {
  @ApiProperty({
    example: 'Estacao Aeroporto',
    description: 'Nome unico da estacao.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Aeroporto de Faro',
    description: 'Localizacao operacional da estacao.',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    example: 40,
    minimum: 1,
    description: 'Capacidade maxima de veiculos.',
  })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiPropertyOptional({
    example: 12,
    minimum: 0,
    description: 'Numero de veiculos atualmente alocados.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  allocatedVehicles: number;
}
