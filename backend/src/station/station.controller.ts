import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
// Importamos o Service e a Interface Station que agora está exportada
import { StationService, Station } from './station.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { AuthSessionGuard } from '../auth/auth-session.guard';
import { ItStationManagementGuard } from './it-station-management.guard';
import type { AuthenticatedRequest } from '../auth/auth.types';

@ApiTags('Stations')
@ApiBearerAuth()
@Controller('stations')
@UseGuards(AuthSessionGuard, ItStationManagementGuard)
export class StationController {
  constructor(private readonly stationService: StationService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova estacao.' })
  @ApiBody({ type: CreateStationDto })
  @ApiCreatedResponse({ description: 'Estacao criada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados invalidos.' })
  @ApiConflictResponse({ description: 'Nome da estacao ja existe.' })
  @ApiForbiddenResponse({ description: 'Apenas IT pode gerir estacoes.' })
  async create(
    @Body() createStationDto: CreateStationDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<Station> {
    const createdBy =
      request.auth?.user.userId || request.auth?.user.id || 'IT-User';
    return this.stationService.create(createStationDto, createdBy);
  }

  @Get('search/:searchTerm')
  @ApiOperation({ summary: 'Pesquisa estacoes por nome ou localizacao.' })
  @ApiParam({ name: 'searchTerm', example: 'central' })
  @ApiOkResponse({ description: 'Lista de estacoes encontradas.' })
  @ApiForbiddenResponse({ description: 'Apenas IT pode gerir estacoes.' })
  async search(@Param('searchTerm') searchTerm: string): Promise<Station[]> {
    return this.stationService.search(searchTerm);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulta uma estacao pelo ID.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ description: 'Detalhe da estacao.' })
  @ApiNotFoundResponse({ description: 'Estacao nao encontrada.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Station> {
    return this.stationService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as estacoes.' })
  @ApiOkResponse({ description: 'Lista de estacoes.' })
  @ApiForbiddenResponse({ description: 'Apenas IT pode gerir estacoes.' })
  async findAll(): Promise<Station[]> {
    return this.stationService.findAll();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma estacao.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateStationDto })
  @ApiOkResponse({ description: 'Estacao atualizada.' })
  @ApiBadRequestResponse({ description: 'Dados invalidos.' })
  @ApiConflictResponse({ description: 'Nome da estacao ja existe.' })
  @ApiNotFoundResponse({ description: 'Estacao nao encontrada.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStationDto: UpdateStationDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<Station> {
    const updatedBy =
      request.auth?.user.userId || request.auth?.user.id || 'IT-User';
    return this.stationService.update(id, updateStationDto, updatedBy);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina uma estacao.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ description: 'Estacao eliminada.' })
  @ApiNotFoundResponse({ description: 'Estacao nao encontrada.' })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ): Promise<Station> {
    const deletedBy =
      request.auth?.user.userId || request.auth?.user.id || 'IT-User';
    return this.stationService.delete(id, deletedBy);
  }
}
