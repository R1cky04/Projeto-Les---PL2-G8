import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthSessionGuard } from '../auth/auth-session.guard';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleManagementGuard } from './vehicle-management.guard';
import { VehicleService, type Vehicle } from './vehicle.service';

@Controller('vehicles')
@UseGuards(AuthSessionGuard, VehicleManagementGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  async create(
    @Body() createVehicleDto: CreateVehicleDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<Vehicle> {
    const createdBy = request.auth?.user.userId || request.auth?.user.id || 'IT-User';
    return this.vehicleService.create(createVehicleDto, createdBy);
  }

  @Get('search/:searchTerm')
  async search(@Param('searchTerm') searchTerm: string): Promise<Vehicle[]> {
    return this.vehicleService.search(searchTerm);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Vehicle> {
    return this.vehicleService.findOne(id);
  }

  @Get()
  async findAll(): Promise<Vehicle[]> {
    return this.vehicleService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<Vehicle> {
    const updatedBy = request.auth?.user.userId || request.auth?.user.id || 'Internal-User';
    return this.vehicleService.update(id, updateVehicleDto, updatedBy);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ): Promise<Vehicle> {
    const deletedBy = request.auth?.user.userId || request.auth?.user.id || 'IT-User';
    return this.vehicleService.delete(id, deletedBy);
  }
}