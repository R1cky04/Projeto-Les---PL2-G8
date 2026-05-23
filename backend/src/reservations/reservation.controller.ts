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
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationManagementGuard } from './reservation-management.guard';
import {
  ReservationRecord,
  ReservationService,
  ReservationAvailabilityResponse,
  ReservationContextResponse,
} from './reservation.service';

@ApiTags('Reservations')
@ApiBearerAuth()
@Controller('reservations')
@UseGuards(AuthSessionGuard, ReservationManagementGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('context')
  @ApiOperation({ summary: 'Devolve dados de apoio para criar reservas.' })
  @ApiOkResponse({ description: 'Clientes, estacoes e reservas recentes.' })
  @ApiForbiddenResponse({ description: 'Perfil sem permissao para reservas.' })
  async getContext(): Promise<ReservationContextResponse> {
    return this.reservationService.getContext();
  }

  @Get('availability')
  @ApiOperation({ summary: 'Consulta disponibilidade de viaturas para uma reserva.' })
  @ApiQuery({ name: 'pickupStationId', required: false, example: '1' })
  @ApiQuery({
    name: 'pickupAt',
    required: false,
    example: '2026-09-15T09:00:00.000Z',
  })
  @ApiQuery({
    name: 'expectedReturnAt',
    required: false,
    example: '2026-09-17T09:00:00.000Z',
  })
  @ApiQuery({ name: 'excludeReservationId', required: false, example: '1' })
  @ApiOkResponse({ description: 'Viaturas disponiveis e alternativas.' })
  @ApiBadRequestResponse({ description: 'Periodo ou estacao invalidos.' })
  async getAvailability(
    @Query('pickupStationId') pickupStationId?: string,
    @Query('pickupAt') pickupAt?: string,
    @Query('expectedReturnAt') expectedReturnAt?: string,
    @Query('excludeReservationId') excludeReservationId?: string,
  ): Promise<ReservationAvailabilityResponse> {
    return this.reservationService.getAvailability({
      pickupStationId,
      pickupAt,
      expectedReturnAt,
      excludeReservationId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Lista reservas com filtros operacionais.' })
  @ApiQuery({ name: 'search', required: false, example: 'RSV-2026' })
  @ApiQuery({ name: 'status', required: false, example: 'CONFIRMED' })
  @ApiQuery({ name: 'startDate', required: false, example: '2026-09-01' })
  @ApiQuery({ name: 'endDate', required: false, example: '2026-09-30' })
  @ApiQuery({ name: 'pickupStationId', required: false, example: '1' })
  @ApiOkResponse({ description: 'Lista de reservas filtradas.' })
  @ApiBadRequestResponse({ description: 'Filtro invalido.' })
  async findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('pickupStationId') pickupStationId?: string,
  ): Promise<ReservationRecord[]> {
    return this.reservationService.findAll({
      search,
      status,
      startDate,
      endDate,
      pickupStationId,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulta o detalhe de uma reserva.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ description: 'Detalhe da reserva.' })
  @ApiNotFoundResponse({ description: 'Reserva nao encontrada.' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReservationRecord> {
    return this.reservationService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cria uma reserva confirmada.' })
  @ApiBody({ type: CreateReservationDto })
  @ApiCreatedResponse({ description: 'Reserva criada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados invalidos ou viatura indisponivel.' })
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<ReservationRecord> {
    return this.reservationService.create(
      createReservationDto,
      request.auth?.user,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma reserva antes de ser convertida.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateReservationDto })
  @ApiOkResponse({ description: 'Reserva atualizada.' })
  @ApiBadRequestResponse({ description: 'Reserva ja convertida ou dados invalidos.' })
  @ApiNotFoundResponse({ description: 'Reserva nao encontrada.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservationDto: UpdateReservationDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<ReservationRecord> {
    return this.reservationService.update(
      id,
      updateReservationDto,
      request.auth?.user,
    );
  }

  @Patch(':id/cancel')
  @ApiOperation({
    summary: 'Cancela uma reserva e liberta a viatura para nova disponibilidade.',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: CancelReservationDto, required: false })
  @ApiOkResponse({ description: 'Reserva cancelada.' })
  @ApiBadRequestResponse({
    description: 'Reserva inexistente, convertida ou sem validacao exigida.',
  })
  @ApiNotFoundResponse({ description: 'Reserva nao encontrada.' })
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() cancelReservationDto: CancelReservationDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<ReservationRecord> {
    return this.reservationService.cancel(id, request.auth?.user, {
      adminValidated: cancelReservationDto?.adminValidated,
    });
  }
}
