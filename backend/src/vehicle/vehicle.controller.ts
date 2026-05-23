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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthSessionGuard } from '../auth/auth-session.guard';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleManagementGuard } from './vehicle-management.guard';
import { VehicleService, type Vehicle } from './vehicle.service';

@ApiTags('Vehicles')
@ApiBearerAuth()
@Controller('vehicles')
@UseGuards(AuthSessionGuard, VehicleManagementGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova viatura.' })
  @ApiBody({ type: CreateVehicleDto })
  @ApiCreatedResponse({ description: 'Viatura criada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados invalidos.' })
  @ApiConflictResponse({ description: 'Matricula ja existente.' })
  @ApiForbiddenResponse({ description: 'Criacao reservada ao perfil IT.' })
  async create(
    @Body() createVehicleDto: CreateVehicleDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<Vehicle> {
    const createdBy =
      request.auth?.user.userId || request.auth?.user.id || 'IT-User';
    return this.vehicleService.create(createVehicleDto, createdBy);
  }

  @Get('search/:searchTerm')
  @ApiOperation({ summary: 'Pesquisa viaturas por matricula, marca ou modelo.' })
  @ApiParam({ name: 'searchTerm', example: 'toyota' })
  @ApiOkResponse({ description: 'Lista de viaturas encontradas.' })
  async search(@Param('searchTerm') searchTerm: string): Promise<Vehicle[]> {
    return this.vehicleService.search(searchTerm);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulta uma viatura pelo ID.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ description: 'Detalhe da viatura.' })
  @ApiNotFoundResponse({ description: 'Viatura nao encontrada.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Vehicle> {
    return this.vehicleService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as viaturas.' })
  @ApiOkResponse({ description: 'Lista de viaturas.' })
  @ApiForbiddenResponse({ description: 'Perfil sem permissao de gestao.' })
  async findAll(): Promise<Vehicle[]> {
    return this.vehicleService.findAll();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza dados operacionais de uma viatura.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateVehicleDto })
  @ApiOkResponse({ description: 'Viatura atualizada.' })
  @ApiBadRequestResponse({ description: 'Dados invalidos.' })
  @ApiConflictResponse({ description: 'Matricula ja existente.' })
  @ApiNotFoundResponse({ description: 'Viatura nao encontrada.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<Vehicle> {
    const updatedBy =
      request.auth?.user.userId || request.auth?.user.id || 'Internal-User';
    return this.vehicleService.update(id, updateVehicleDto, updatedBy);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina uma viatura.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ description: 'Viatura eliminada.' })
  @ApiForbiddenResponse({ description: 'Eliminacao reservada ao perfil IT.' })
  @ApiNotFoundResponse({ description: 'Viatura nao encontrada.' })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ): Promise<Vehicle> {
    const deletedBy =
      request.auth?.user.userId || request.auth?.user.id || 'IT-User';
    return this.vehicleService.delete(id, deletedBy);
  }
}
