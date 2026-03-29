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
  ];

  private nextId = 3;

  async create(createVehicleDto: CreateVehicleDto, createdBy?: string): Promise<Vehicle> {
    const { validUpdates, errors } = this.validateVehiclePayload(createVehicleDto, null);

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Dados invalidos para criar veiculo.',
        details: errors,
      });
    }

    const normalizedPlate = validUpdates.plateNumber!;
    const existingPlate = this.vehicles.find(
      (vehicle) => vehicle.plateNumber.toLowerCase() === normalizedPlate.toLowerCase(),
    );

    if (existingPlate) {
      throw new ConflictException('Ja existe um veiculo com essa matricula.');
    }

    const vehicle: Vehicle = {
      id: this.nextId++,
      plateNumber: validUpdates.plateNumber!,
      brand: validUpdates.brand!,
      model: validUpdates.model!,
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
    this.logAudit('CREATE', vehicle.id, createdBy || 'desconhecido', `Veiculo criado: ${vehicle.plateNumber}`);

    return vehicle;
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicles;
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
        vehicle.model.toLowerCase().includes(term),
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

    if (validUpdates.plateNumber && validUpdates.plateNumber !== currentVehicle.plateNumber) {
      const plateExists = this.vehicles.find(
        (item) =>
          item.id !== id &&
          item.plateNumber.toLowerCase() === validUpdates.plateNumber!.toLowerCase(),
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
      category: validUpdates.category === undefined ? currentVehicle.category : validUpdates.category,
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
    this.logAudit('DELETE', id, deletedBy || 'desconhecido', `Veiculo removido: ${vehicle.plateNumber}`);

    return vehicle;
  }

  private validateVehiclePayload(
    payload: {
      plateNumber?: unknown;
      brand?: unknown;
      model?: unknown;
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
      if (typeof payload.plateNumber !== 'string' || !payload.plateNumber.trim()) {
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
      if (!Number.isInteger(payload.odometerKm) || Number(payload.odometerKm) < 0) {
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
      } else if (payload.transmission !== 'MANUAL' && payload.transmission !== 'AUTOMATIC') {
        errors.push('Transmissao invalida. Valores permitidos: MANUAL, AUTOMATIC.');
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

  private logAudit(operation: string, vehicleId: number, userId: string, details: string): void {
    const timestamp = new Date().toISOString();
    console.log(
      `[AUDITORIA] ${timestamp} - ${operation} - Veiculo ID: ${vehicleId} - Usuario: ${userId} - ${details}`,
    );
  }
}