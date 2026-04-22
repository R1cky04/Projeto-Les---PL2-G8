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
import { AuthSessionGuard } from '../auth/auth-session.guard';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationManagementGuard } from './reservation-management.guard';
import {
  ReservationRecord,
  ReservationService,
  ReservationAvailabilityResponse,
  ReservationContextResponse,
} from './reservation.service';

@Controller('reservations')
@UseGuards(AuthSessionGuard, ReservationManagementGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('context')
  async getContext(): Promise<ReservationContextResponse> {
    return this.reservationService.getContext();
  }

  @Get('availability')
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
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReservationRecord> {
    return this.reservationService.findOne(id);
  }

  @Post()
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<ReservationRecord> {
    return this.reservationService.create(createReservationDto, request.auth?.user);
  }

  @Patch(':id')
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
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ): Promise<ReservationRecord> {
    return this.reservationService.cancel(id, request.auth?.user);
  }
}
