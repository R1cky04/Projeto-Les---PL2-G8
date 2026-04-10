import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthSessionGuard } from '../auth/auth-session.guard';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { CreateRentalDto } from './dto/create-rental.dto';
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
  async findAll(): Promise<RentalRecord[]> {
    return this.rentalService.findAll();
  }

  @Post()
  async create(
    @Body() createRentalDto: CreateRentalDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<RentalRecord> {
    return this.rentalService.create(createRentalDto, request.auth?.user);
  }
}