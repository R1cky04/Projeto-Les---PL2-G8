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
import { CloseRentalDto } from './dto/close-rental.dto';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { RentalManagementGuard } from './rental-management.guard';
import { RentalService, type RentalRecord, type RentalContextResponse } from './rental.service';

@Controller('rentals')
@UseGuards(AuthSessionGuard, RentalManagementGuard)
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Get('context')
  async getContext(): Promise<RentalContextResponse> {
    return this.rentalService.getContext();
  }

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
  ): Promise<RentalRecord[]> {
    return this.rentalService.findAll({ search, status });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<RentalRecord> {
    return this.rentalService.findOne(id);
  }

  @Post()
  async create(
    @Body() createRentalDto: CreateRentalDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<RentalRecord> {
    return this.rentalService.create(createRentalDto, request.auth?.user);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRentalDto: UpdateRentalDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<RentalRecord> {
    return this.rentalService.update(id, updateRentalDto, request.auth?.user);
  }

  @Patch(':id/close')
  async close(
    @Param('id', ParseIntPipe) id: number,
    @Body() closeRentalDto: CloseRentalDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<RentalRecord> {
    return this.rentalService.close(id, closeRentalDto, request.auth?.user);
  }
}
