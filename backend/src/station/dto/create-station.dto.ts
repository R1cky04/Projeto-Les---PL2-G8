import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';

/**
 * DTO para criação de uma nova estação.
 * Inclui validações básicas para garantir dados consistentes.
 */
export class CreateStationDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Nome da estação (único)

  @IsString()
  @IsNotEmpty()
  location: string; // Endereço/localização

  @IsInt()
  @Min(1)
  capacity: number; // Capacidade máxima de veículos (deve ser positiva)

  @IsOptional()
  @IsInt()
  @Min(0)
  allocatedVehicles: number; // Veículos atualmente alocados (>=0 e <= capacity)
}