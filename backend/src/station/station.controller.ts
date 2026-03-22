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
// Importamos o Service e a Interface Station que agora está exportada
import { StationService, Station } from './station.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { AuthSessionGuard } from '../auth/auth-session.guard';
import { ItStationManagementGuard } from './it-station-management.guard';
import type { AuthenticatedRequest } from '../auth/auth.types';

@Controller('stations')
@UseGuards(AuthSessionGuard, ItStationManagementGuard)
export class StationController {
  constructor(private readonly stationService: StationService) {}

  @Post()
  async create(
    @Body() createStationDto: CreateStationDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<Station> {
    const createdBy = request.auth?.user.userId || request.auth?.user.id || 'IT-User';
    return this.stationService.create(createStationDto, createdBy);
  }

  @Get('search/:searchTerm')
  async search(@Param('searchTerm') searchTerm: string): Promise<Station[]> {
    return this.stationService.search(searchTerm);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Station> {
    return this.stationService.findOne(id);
  }

  @Get()
  async findAll(): Promise<Station[]> {
    return this.stationService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStationDto: UpdateStationDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<Station> {
    const updatedBy = request.auth?.user.userId || request.auth?.user.id || 'IT-User';
    return this.stationService.update(id, updateStationDto, updatedBy);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ): Promise<Station> {
    const deletedBy = request.auth?.user.userId || request.auth?.user.id || 'IT-User';
    return this.stationService.delete(id, deletedBy);
  }
}