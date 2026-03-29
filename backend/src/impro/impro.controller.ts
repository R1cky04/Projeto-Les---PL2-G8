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

@Controller('impros')
@UseGuards(AuthSessionGuard, ImproGuard)
export class ImproController {
  constructor(private readonly improService: ImproService) {}

  @Get('vehicles')
  listVehicles(@Query('plate') plate?: string): Promise<TransferVehicle[]> {
    return this.improService.listVehicles(plate);
  }

  @Get('stations')
  listStations() {
    return this.improService.listStations();
  }

  @Post()
  create(
    @Body() payload: CreateImproDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<ImproRecord> {
    return this.improService.create(payload, request.auth!.user);
  }

  @Get()
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateImproDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<ImproRecord> {
    return this.improService.update(id, payload, request.auth!.user);
  }

  @Post(':id/close')
  close(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: CloseImproDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<ImproRecord> {
    return this.improService.close(id, payload, request.auth!.user);
  }
}
