import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StationService } from './station.service';
import { CreateStationDto } from './dto/create-station.dto';

@Controller('stations')
export class StationController {
  constructor(private readonly stationService: StationService) {}

  /**
   * Endpoint para criar uma nova estação.
   * Requer autenticação e permissões de IT (não implementado aqui, assumir middleware).
   * @param createStationDto Dados da estação a criar
   * @returns A estação criada
   */
  @Post()
  async create(@Body() createStationDto: CreateStationDto) {
    // TODO: Obter createdBy do contexto de autenticação (ex: req.user.id)
    const createdBy = 'IT-User'; // Placeholder
    return this.stationService.create(createStationDto, createdBy);
  }

  /**
   * Endpoint para listar todas as estações.
   */
  @Get()
  async findAll() {
    return this.stationService.findAll();
  }

  /**
   * Endpoint para obter uma estação por ID.
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.stationService.findOne(id);
  }
}