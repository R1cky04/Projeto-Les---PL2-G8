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
import { ReservationRecord, ReservationService } from './reservation.service';

@Controller('reservations')
@UseGuards(AuthSessionGuard, ReservationManagementGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
  ): Promise<ReservationRecord[]> {
    return this.reservationService.findAll({ search, status });
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
  ): Promise<ReservationRecord> {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Patch(':id/cancel')
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ): Promise<ReservationRecord> {
    return this.reservationService.cancel(id, request.auth?.user);
  }
}
