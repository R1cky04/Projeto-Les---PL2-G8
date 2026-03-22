/**
 * DTO para atualização de estação
 * Define os campos opcionais que podem ser atualizados
 */
export class UpdateStationDto {
  /**
   * Nome da estação (opcional)
   */
  name?: string;

  /**
   * Localização/endereço da estação (opcional)
   */
  location?: string;

  /**
   * Capacidade máxima de veículos (opcional)
   */
  capacity?: number;

  /**
   * Veículos atualmente alocados (opcional)
   */
  allocatedVehicles?: number;
}
