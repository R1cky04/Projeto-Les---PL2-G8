import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateVehicleDto,
  type FuelType,
  type TransmissionType,
  type VehicleStatus,
} from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

export interface Vehicle {
  id: number;
  plateNumber: string;
  brand: string;
  model: string;
  submodel: string | null;
  stationId: number;
  category: string | null;
  year: number | null;
  seats: number | null;
  transmission: TransmissionType | null;
  fuelType: FuelType | null;
  odometerKm: number;
  dailyRate: number;
  status: VehicleStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
  partialWarnings?: string[];
}

@Injectable()
export class VehicleService {
  private vehicles: Vehicle[] = [
    {
      id: 1,
      plateNumber: 'AA-11-BB',
      brand: 'Toyota',
      model: 'Corolla',
      submodel: 'Hybrid',
      stationId: 1,
      category: 'Compacto',
      year: 2021,
      seats: 5,
      transmission: 'AUTOMATIC',
      fuelType: 'HYBRID',
      odometerKm: 46300,
      dailyRate: 54.9,
      status: 'AVAILABLE',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Sistema',
    },
    {
      id: 2,
      plateNumber: '23-CD-45',
      brand: 'Renault',
      model: 'Clio',
      submodel: 'Techno',
      stationId: 2,
      category: 'Economico',
      year: 2020,
      seats: 5,
      transmission: 'MANUAL',
      fuelType: 'DIESEL',
      odometerKm: 69020,
      dailyRate: 39.5,
      status: 'MAINTENANCE',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Sistema',
    },
    {
      id: 3,
      plateNumber: '11-XY-22',
      brand: 'Volkswagen',
      model: 'Golf',
      submodel: 'Life',
      stationId: 1,
      category: 'Hatchback',
      year: 2019,
      seats: 5,
      transmission: 'MANUAL',
      fuelType: 'GASOLINE',
      odometerKm: 78200,
      dailyRate: 44.0,
      status: 'AVAILABLE',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Seed',
    },
    {
      id: 4,
      plateNumber: '98-ZZ-77',
      brand: 'Peugeot',
      model: '208',
      submodel: 'Allure',
      stationId: 2,
      category: 'City',
      year: 2022,
      seats: 5,
      transmission: 'AUTOMATIC',
      fuelType: 'GASOLINE',
      odometerKm: 15000,
      dailyRate: 46.5,
      status: 'AVAILABLE',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Seed',
    },
    {
      id: 5,
      plateNumber: '45-RT-12',
      brand: 'Ford',
      model: 'Focus',
      submodel: 'Titanium',
      stationId: 3,
      category: 'Compacto',
      year: 2018,
      seats: 5,
      transmission: 'MANUAL',
      fuelType: 'DIESEL',
      odometerKm: 120400,
      dailyRate: 37.0,
      status: 'RENTED',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Seed',
    },
    {
      id: 6,
      plateNumber: '66-AA-00',
      brand: 'Tesla',
      model: 'Model 3',
      submodel: 'RWD',
      stationId: 1,
      category: 'Sedan',
      year: 2023,
      seats: 5,
      transmission: 'AUTOMATIC',
      fuelType: 'ELECTRIC',
      odometerKm: 5200,
      dailyRate: 89.99,
      status: 'AVAILABLE',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Seed',
    },
    {
      id: 7,
      plateNumber: '77-BB-11',
      brand: 'BMW',
      model: '3 Series',
      submodel: '320i',
      stationId: 2,
      category: 'Executive',
      year: 2020,
      seats: 5,
      transmission: 'AUTOMATIC',
      fuelType: 'GASOLINE',
      odometerKm: 32000,
      dailyRate: 95.0,
      status: 'MAINTENANCE',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Seed',
    },
  ];

  private nextId = 8;

  async create(
    createVehicleDto: CreateVehicleDto,
    createdBy?: string,
  ): Promise<Vehicle> {
    const { validUpdates, errors } = this.validateVehiclePayload(
      createVehicleDto,
      null,
    );

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Dados invalidos para criar veiculo.',
        details: errors,
      });
    }

    const normalizedPlate = validUpdates.plateNumber!;
    const existingPlate = this.vehicles.find(
      (vehicle) =>
        vehicle.plateNumber.toLowerCase() === normalizedPlate.toLowerCase(),
    );

    if (existingPlate) {
      throw new ConflictException('Ja existe um veiculo com essa matricula.');
    }

    const vehicle: Vehicle = {
      id: this.nextId++,
      plateNumber: validUpdates.plateNumber!,
      brand: validUpdates.brand!,
      model: validUpdates.model!,
      submodel: validUpdates.submodel ?? null,
      stationId: 1,
      category: validUpdates.category ?? null,
      year: validUpdates.year ?? null,
      seats: validUpdates.seats ?? null,
      transmission: validUpdates.transmission ?? null,
      fuelType: validUpdates.fuelType ?? null,
      odometerKm: validUpdates.odometerKm ?? 0,
      dailyRate: validUpdates.dailyRate!,
      status: validUpdates.status ?? 'AVAILABLE',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: createdBy || 'Sistema',
    };

    this.vehicles.push(vehicle);
    this.logAudit(
      'CREATE',
      vehicle.id,
      createdBy || 'desconhecido',
      `Veiculo criado: ${vehicle.plateNumber}`,
    );

    return vehicle;
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicles;
  }

  async findAvailable(stationId?: number): Promise<Vehicle[]> {
    return this.vehicles.filter(
      (vehicle) =>
        vehicle.status === 'AVAILABLE' &&
        (stationId === undefined || vehicle.stationId === stationId),
    );
  }

  async markAsRented(id: number, updatedBy?: string): Promise<Vehicle> {
    const vehicle = await this.findOne(id);

    if (vehicle.status !== 'AVAILABLE') {
      throw new BadRequestException(
        'O veiculo selecionado nao esta disponivel para aluguer.',
      );
    }

    return this.update(id, { status: 'RENTED' }, updatedBy);
  }

  async transferToStation(
    id: number,
    stationId: number,
    updatedBy?: string,
  ): Promise<Vehicle> {
    const vehicleIndex = this.vehicles.findIndex((item) => item.id === id);

    if (vehicleIndex === -1) {
      throw new NotFoundException('Veiculo nao encontrado');
    }

    if (!Number.isInteger(stationId) || stationId < 1) {
      throw new BadRequestException('Estacao de destino invalida.');
    }

    const currentVehicle = this.vehicles[vehicleIndex];
    const updatedVehicle: Vehicle = {
      ...currentVehicle,
      stationId,
      updatedAt: new Date(),
    };

    this.vehicles[vehicleIndex] = updatedVehicle;
    this.logAudit(
      'UPDATE',
      id,
      updatedBy || 'desconhecido',
      `Veiculo transferido de estacao ${currentVehicle.stationId} para ${stationId}`,
    );

    return updatedVehicle;
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = this.vehicles.find((item) => item.id === id);
    if (!vehicle) {
      throw new NotFoundException('Veiculo nao encontrado');
    }

    return vehicle;
  }

  async search(searchTerm: string): Promise<Vehicle[]> {
    const term = searchTerm.trim().toLowerCase();
    return this.vehicles.filter(
      (vehicle) =>
        vehicle.plateNumber.toLowerCase().includes(term) ||
        vehicle.brand.toLowerCase().includes(term) ||
        vehicle.model.toLowerCase().includes(term) ||
        (vehicle.submodel || '').toLowerCase().includes(term),
    );
  }

  async update(
    id: number,
    updateVehicleDto: UpdateVehicleDto,
    updatedBy?: string,
  ): Promise<Vehicle> {
    const vehicleIndex = this.vehicles.findIndex((item) => item.id === id);
    if (vehicleIndex === -1) {
      throw new NotFoundException('Veiculo nao encontrado');
    }

    const currentVehicle = this.vehicles[vehicleIndex];
    const { validUpdates, errors } = this.validateVehiclePayload(
      updateVehicleDto,
      currentVehicle,
    );

    if (
      validUpdates.plateNumber &&
      validUpdates.plateNumber !== currentVehicle.plateNumber
    ) {
      const plateExists = this.vehicles.find(
        (item) =>
          item.id !== id &&
          item.plateNumber.toLowerCase() ===
            validUpdates.plateNumber!.toLowerCase(),
      );

      if (plateExists) {
        throw new ConflictException('Ja existe um veiculo com essa matricula.');
      }
    }

    if (Object.keys(validUpdates).length === 0 && errors.length > 0) {
      throw new BadRequestException({
        message: 'Sem alteracoes validas para aplicar.',
        details: errors,
      });
    }

    const previousVehicle = { ...currentVehicle };

    const updatedVehicle: Vehicle = {
      ...currentVehicle,
      ...validUpdates,
      stationId: currentVehicle.stationId,
      category: validUpdates.category === undefined ? currentVehicle.category : validUpdates.category,
      submodel:
        validUpdates.submodel === undefined ? currentVehicle.submodel : validUpdates.submodel,
      updatedAt: new Date(),
      partialWarnings: errors.length > 0 ? errors : undefined,
    };

    this.vehicles[vehicleIndex] = updatedVehicle;
    this.logAudit(
      'UPDATE',
      id,
      updatedBy || 'desconhecido',
      `Veiculo atualizado: ${previousVehicle.plateNumber} -> ${updatedVehicle.plateNumber}`,
    );

    return updatedVehicle;
  }

  async delete(id: number, deletedBy?: string): Promise<Vehicle> {
    const vehicleIndex = this.vehicles.findIndex((item) => item.id === id);
    if (vehicleIndex === -1) {
      throw new NotFoundException('Veiculo nao encontrado');
    }

    const vehicle = this.vehicles[vehicleIndex];
    this.vehicles.splice(vehicleIndex, 1);
    this.logAudit(
      'DELETE',
      id,
      deletedBy || 'desconhecido',
      `Veiculo removido: ${vehicle.plateNumber}`,
    );

    return vehicle;
  }

  private validateVehiclePayload(
    payload: {
      plateNumber?: unknown;
      brand?: unknown;
      model?: unknown;
      submodel?: unknown;
      category?: unknown;
      year?: unknown;
      seats?: unknown;
      transmission?: unknown;
      fuelType?: unknown;
      odometerKm?: unknown;
      dailyRate?: unknown;
      status?: unknown;
    },
    current: Vehicle | null,
  ): { validUpdates: Partial<Vehicle>; errors: string[] } {
    const validUpdates: Partial<Vehicle> = {};
    const errors: string[] = [];

    if (payload.plateNumber !== undefined) {
      if (
        typeof payload.plateNumber !== 'string' ||
        !payload.plateNumber.trim()
      ) {
        errors.push('Matricula invalida: deve ser texto nao vazio.');
      } else {
        validUpdates.plateNumber = payload.plateNumber.trim().toUpperCase();
      }
    }

    if (payload.brand !== undefined) {
      if (typeof payload.brand !== 'string' || !payload.brand.trim()) {
        errors.push('Marca invalida: deve ser texto nao vazio.');
      } else {
        validUpdates.brand = payload.brand.trim();
      }
    }

    if (payload.model !== undefined) {
      if (typeof payload.model !== 'string' || !payload.model.trim()) {
        errors.push('Modelo invalido: deve ser texto nao vazio.');
      } else {
        validUpdates.model = payload.model.trim();
      }
    }

    if (payload.submodel !== undefined) {
      if (payload.submodel === null || payload.submodel === '') {
        validUpdates.submodel = null;
      } else if (typeof payload.submodel !== 'string' || !payload.submodel.trim()) {
        errors.push('Submodelo invalido: deve ser texto nao vazio quando indicado.');
      } else {
        validUpdates.submodel = payload.submodel.trim();
      }
    }

    if (payload.category !== undefined) {
      if (payload.category === null || payload.category === '') {
        validUpdates.category = null;
      } else if (typeof payload.category !== 'string') {
        errors.push('Categoria invalida: deve ser texto quando indicada.');
      } else {
        validUpdates.category = payload.category.trim();
      }
    }

    if (payload.year !== undefined) {
      if (!Number.isInteger(payload.year) || Number(payload.year) < 1980) {
        errors.push('Ano invalido: indique um inteiro >= 1980.');
      } else {
        validUpdates.year = Number(payload.year);
      }
    }

    if (payload.seats !== undefined) {
      if (!Number.isInteger(payload.seats) || Number(payload.seats) < 1) {
        errors.push('Lugares invalidos: indique um inteiro >= 1.');
      } else {
        validUpdates.seats = Number(payload.seats);
      }
    }

    if (payload.odometerKm !== undefined) {
      if (
        !Number.isInteger(payload.odometerKm) ||
        Number(payload.odometerKm) < 0
      ) {
        errors.push('Quilometragem invalida: indique um inteiro >= 0.');
      } else {
        validUpdates.odometerKm = Number(payload.odometerKm);
      }
    }

    if (payload.dailyRate !== undefined) {
      const numericRate = Number(payload.dailyRate);
      if (!Number.isFinite(numericRate) || numericRate <= 0) {
        errors.push('Preco diario invalido: deve ser superior a 0.');
      } else {
        validUpdates.dailyRate = Number(numericRate.toFixed(2));
      }
    }

    if (payload.transmission !== undefined) {
      if (payload.transmission === null || payload.transmission === '') {
        validUpdates.transmission = null;
      } else if (
        payload.transmission !== 'MANUAL' &&
        payload.transmission !== 'AUTOMATIC'
      ) {
        errors.push(
          'Transmissao invalida. Valores permitidos: MANUAL, AUTOMATIC.',
        );
      } else {
        validUpdates.transmission = payload.transmission;
      }
    }

    if (payload.fuelType !== undefined) {
      if (payload.fuelType === null || payload.fuelType === '') {
        validUpdates.fuelType = null;
      } else if (
        payload.fuelType !== 'GASOLINE' &&
        payload.fuelType !== 'DIESEL' &&
        payload.fuelType !== 'ELECTRIC' &&
        payload.fuelType !== 'HYBRID'
      ) {
        errors.push(
          'Combustivel invalido. Valores permitidos: GASOLINE, DIESEL, ELECTRIC, HYBRID.',
        );
      } else {
        validUpdates.fuelType = payload.fuelType;
      }
    }

    if (payload.status !== undefined) {
      if (
        payload.status !== 'AVAILABLE' &&
        payload.status !== 'RESERVED' &&
        payload.status !== 'RENTED' &&
        payload.status !== 'MAINTENANCE' &&
        payload.status !== 'INACTIVE'
      ) {
        errors.push(
          'Estado invalido. Valores permitidos: AVAILABLE, RESERVED, RENTED, MAINTENANCE, INACTIVE.',
        );
      } else {
        validUpdates.status = payload.status;
      }
    }

    if (current === null) {
      if (validUpdates.plateNumber === undefined) {
        errors.push('Matricula obrigatoria para criar veiculo.');
      }
      if (validUpdates.brand === undefined) {
        errors.push('Marca obrigatoria para criar veiculo.');
      }
      if (validUpdates.model === undefined) {
        errors.push('Modelo obrigatorio para criar veiculo.');
      }
      if (validUpdates.dailyRate === undefined) {
        errors.push('Preco diario obrigatorio para criar veiculo.');
      }
    }

    return { validUpdates, errors };
  }

  private logAudit(
    operation: string,
    vehicleId: number,
    userId: string,
    details: string,
  ): void {
    const timestamp = new Date().toISOString();
    console.log(
      `[AUDITORIA] ${timestamp} - ${operation} - Veiculo ID: ${vehicleId} - Usuario: ${userId} - ${details}`,
    );
  }
}
