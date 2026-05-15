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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthSessionGuard } from '../auth/auth-session.guard';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { CloseRentalDto } from './dto/close-rental.dto';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { RentalManagementGuard } from './rental-management.guard';
import {
  RentalService,
  type RentalRecord,
  type RentalContextResponse,
} from './rental.service';

@ApiTags('Rentals')
@ApiBearerAuth()
@Controller('rentals')
@UseGuards(AuthSessionGuard, RentalManagementGuard)
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Get('context')
  @ApiOperation({ summary: 'Devolve dados de apoio para criar contratos.' })
  @ApiOkResponse({ description: 'Clientes, estacoes, viaturas disponiveis e contratos recentes.' })
  @ApiForbiddenResponse({ description: 'Perfil sem permissao para contratos.' })
  async getContext(): Promise<RentalContextResponse> {
    return this.rentalService.getContext();
  }

  @Get()
  @ApiOperation({ summary: 'Lista contratos com filtros operacionais.' })
  @ApiQuery({ name: 'search', required: false, example: 'CTR-2026' })
  @ApiQuery({ name: 'status', required: false, example: 'OPEN' })
  @ApiQuery({ name: 'createdFrom', required: false, example: '2026-09-01' })
  @ApiQuery({ name: 'createdTo', required: false, example: '2026-09-30' })
  @ApiOkResponse({ description: 'Lista de contratos filtrados.' })
  @ApiBadRequestResponse({ description: 'Filtro invalido.' })
  async findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('createdFrom') createdFrom?: string,
    @Query('createdTo') createdTo?: string,
  ): Promise<RentalRecord[]> {
    return this.rentalService.findAll({
      search,
      status,
      createdFrom,
      createdTo,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulta o detalhe de um contrato.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ description: 'Detalhe do contrato.' })
  @ApiNotFoundResponse({ description: 'Contrato nao encontrado.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<RentalRecord> {
    return this.rentalService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cria um contrato ativo.' })
  @ApiBody({ type: CreateRentalDto })
  @ApiCreatedResponse({ description: 'Contrato criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados invalidos ou viatura indisponivel.' })
  async create(
    @Body() createRentalDto: CreateRentalDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<RentalRecord> {
    return this.rentalService.create(createRentalDto, request.auth?.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um contrato ativo.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateRentalDto })
  @ApiOkResponse({ description: 'Contrato atualizado.' })
  @ApiBadRequestResponse({ description: 'Contrato fechado ou dados invalidos.' })
  @ApiNotFoundResponse({ description: 'Contrato nao encontrado.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRentalDto: UpdateRentalDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<RentalRecord> {
    return this.rentalService.update(id, updateRentalDto, request.auth?.user);
  }

  @Patch(':id/close')
  @ApiOperation({ summary: 'Encerra um contrato ativo.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: CloseRentalDto })
  @ApiOkResponse({ description: 'Contrato encerrado.' })
  @ApiBadRequestResponse({ description: 'Contrato nao ativo ou dados invalidos.' })
  @ApiNotFoundResponse({ description: 'Contrato nao encontrado.' })
  async close(
    @Param('id', ParseIntPipe) id: number,
    @Body() closeRentalDto: CloseRentalDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<RentalRecord> {
    return this.rentalService.close(id, closeRentalDto, request.auth?.user);
  }
}
