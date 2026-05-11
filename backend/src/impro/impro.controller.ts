import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthSessionGuard } from '../auth/auth-session.guard';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { CloseImproDto } from './dto/close-impro.dto';
import { CreateImproDto } from './dto/create-impro.dto';
import { UpdateImproDto } from './dto/update-impro.dto';
import { ImproGuard } from './impro.guard';
import {
  ImproListResponse,
  ImproFilters,
  ImproRecord,
  ImproService,
  TransferVehicle,
} from './impro.service';

@ApiTags('Impro/Fleet transfers')
@ApiBearerAuth()
@Controller('impros')
@UseGuards(AuthSessionGuard, ImproGuard)
export class ImproController {
  constructor(private readonly improService: ImproService) {}

  @Get('vehicles')
  @ApiOperation({ summary: 'Lista viaturas disponiveis para transferencias impro.' })
  @ApiQuery({ name: 'plate', required: false, example: 'AA' })
  @ApiOkResponse({ description: 'Lista de viaturas com estado de transferencia.' })
  @ApiForbiddenResponse({ description: 'Perfil sem permissao para impros.' })
  listVehicles(@Query('plate') plate?: string): Promise<TransferVehicle[]> {
    return this.improService.listVehicles(plate);
  }

  @Get('stations')
  @ApiOperation({ summary: 'Lista estacoes para origem e destino de impros.' })
  @ApiOkResponse({ description: 'Lista de estacoes.' })
  @ApiForbiddenResponse({ description: 'Perfil sem permissao para impros.' })
  listStations() {
    return this.improService.listStations();
  }

  @Post()
  @ApiOperation({ summary: 'Cria uma transferencia impro.' })
  @ApiBody({ type: CreateImproDto })
  @ApiCreatedResponse({ description: 'Impro criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados invalidos ou sem permissao de transferencia.' })
  @ApiForbiddenResponse({ description: 'Perfil sem permissao para impros.' })
  create(
    @Body() payload: CreateImproDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<ImproRecord> {
    return this.improService.create(payload, request.auth!.user);
  }

  @Get()
  @ApiOperation({ summary: 'Lista impros com filtros operacionais.' })
  @ApiQuery({ name: 'search', required: false, example: 'IMPRO-00001' })
  @ApiQuery({ name: 'vehiclePlate', required: false, example: 'AA-11' })
  @ApiQuery({ name: 'status', required: false, example: 'SCHEDULED' })
  @ApiQuery({ name: 'stationId', required: false, example: '1' })
  @ApiQuery({ name: 'fromDate', required: false, example: '2026-12-01' })
  @ApiQuery({ name: 'toDate', required: false, example: '2026-12-31' })
  @ApiOkResponse({ description: 'Lista paginavel de impros.' })
  @ApiBadRequestResponse({ description: 'Filtros invalidos.' })
  findAll(
    @Query('search') search?: string,
    @Query('vehiclePlate') vehiclePlate?: string,
    @Query('status') status?: string,
    @Query('stationId') stationId?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ): Promise<ImproListResponse> {
    const filters: ImproFilters = {
      search,
      vehiclePlate,
      status: status as ImproFilters['status'],
      stationId: stationId ? Number(stationId) : undefined,
      fromDate,
      toDate,
    };

    return this.improService.findAll(filters);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma transferencia impro aberta.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateImproDto })
  @ApiOkResponse({ description: 'Impro atualizado.' })
  @ApiBadRequestResponse({ description: 'Impro fechado ou dados invalidos.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateImproDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<ImproRecord> {
    return this.improService.update(id, payload, request.auth!.user);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Encerra uma transferencia impro.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: CloseImproDto })
  @ApiCreatedResponse({ description: 'Impro encerrado.' })
  @ApiBadRequestResponse({ description: 'Impro ja fechado ou dados invalidos.' })
  close(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: CloseImproDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<ImproRecord> {
    return this.improService.close(id, payload, request.auth!.user);
  }
}
