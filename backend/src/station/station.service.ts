import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';

// O EXPORT AQUI É FUNDAMENTAL para o Controller conseguir reconhecer o tipo
export interface Station {
  id: number;
  name: string;
  location: string;
  capacity: number;
  allocatedVehicles: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
  partialWarnings?: string[];
}

@Injectable()
export class StationService {
  // Dados em memória para teste
  private stations: Station[] = [
    {
      id: 1,
      name: 'Estação Central',
      location: 'Centro da Cidade',
      capacity: 50,
      allocatedVehicles: 24,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Sistema',
    },
    {
      id: 2,
      name: 'Estação Norte',
      location: 'Zona Norte',
      capacity: 30,
      allocatedVehicles: 11,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Sistema',
    },
  ];

  private nextId = 3;

  private validateStationPayload(
    payload: {
      name?: unknown;
      location?: unknown;
      capacity?: unknown;
      allocatedVehicles?: unknown;
    },
    current: Station | null,
  ): {
    validUpdates: Partial<Station>;
    errors: string[];
  } {
    const validUpdates: Partial<Station> = {};
    const errors: string[] = [];

    if (payload.name !== undefined) {
      if (typeof payload.name !== 'string' || !payload.name.trim()) {
        errors.push('Nome invalido: deve ser texto nao vazio.');
      } else {
        validUpdates.name = payload.name.trim();
      }
    }

    if (payload.location !== undefined) {
      if (typeof payload.location !== 'string' || payload.location.trim().length < 3) {
        errors.push('Localizacao invalida: indique pelo menos 3 caracteres.');
      } else {
        validUpdates.location = payload.location.trim();
      }
    }

    if (payload.capacity !== undefined) {
      if (!Number.isInteger(payload.capacity) || Number(payload.capacity) <= 0) {
        errors.push('Capacidade invalida: deve ser um numero inteiro positivo.');
      } else {
        validUpdates.capacity = Number(payload.capacity);
      }
    }

    if (payload.allocatedVehicles !== undefined) {
      if (!Number.isInteger(payload.allocatedVehicles) || Number(payload.allocatedVehicles) < 0) {
        errors.push('Veiculos alocados invalidos: deve ser um inteiro >= 0.');
      } else {
        validUpdates.allocatedVehicles = Number(payload.allocatedVehicles);
      }
    }

    const effectiveCapacity =
      validUpdates.capacity ?? current?.capacity ?? Number(payload.capacity);
    const effectiveAllocatedVehicles =
      validUpdates.allocatedVehicles ?? current?.allocatedVehicles ?? Number(payload.allocatedVehicles);

    if (
      Number.isFinite(effectiveCapacity) &&
      Number.isFinite(effectiveAllocatedVehicles) &&
      effectiveAllocatedVehicles > effectiveCapacity
    ) {
      if (validUpdates.allocatedVehicles !== undefined) {
        delete validUpdates.allocatedVehicles;
      }
      errors.push('Veiculos alocados nao podem exceder a capacidade da estacao.');
    }

    return { validUpdates, errors };
  }

  async create(createStationDto: CreateStationDto, createdBy?: string): Promise<Station> {
    const { validUpdates, errors } = this.validateStationPayload(
      {
        name: createStationDto.name,
        location: createStationDto.location,
        capacity: createStationDto.capacity,
        allocatedVehicles: createStationDto.allocatedVehicles,
      },
      null,
    );

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Dados invalidos para criar estacao.',
        details: errors,
      });
    }

    const normalizedName = validUpdates.name!;

    const existingStation = this.stations.find(s => s.name.toLowerCase() === normalizedName.toLowerCase());
    if (existingStation) {
      throw new ConflictException('Já existe uma estação com este nome.');
    }

    const station: Station = {
      id: this.nextId++,
      name: validUpdates.name!,
      location: validUpdates.location!,
      capacity: validUpdates.capacity!,
      allocatedVehicles: validUpdates.allocatedVehicles ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: createdBy || 'Sistema',
    };

    this.stations.push(station);
    this.logAudit('CREATE', station.id, createdBy || 'desconhecido', `Estação criada: ${station.name}`);

    return station;
  }

  async findAll(): Promise<Station[]> {
    return this.stations;
  }

  async findOne(id: number): Promise<Station> {
    const station = this.stations.find(s => s.id === id);
    if (!station) {
      throw new NotFoundException('Estação não encontrada');
    }
    return station;
  }

  async search(searchTerm: string): Promise<Station[]> {
    const term = searchTerm.toLowerCase();
    return this.stations.filter(
      s => s.name.toLowerCase().includes(term) ||
           s.location.toLowerCase().includes(term)
    );
  }

  async update(id: number, updateStationDto: UpdateStationDto, updatedBy?: string): Promise<Station> {
    const stationIndex = this.stations.findIndex(s => s.id === id);
    if (stationIndex === -1) {
      throw new NotFoundException('Estação não encontrada');
    }

    const station = this.stations[stationIndex];

    const { validUpdates, errors } = this.validateStationPayload(
      {
        name: updateStationDto.name,
        location: updateStationDto.location,
        capacity: updateStationDto.capacity,
        allocatedVehicles: updateStationDto.allocatedVehicles,
      },
      station,
    );

    if (validUpdates.name && validUpdates.name !== station.name) {
      const nameExists = this.stations.find(
        s => s.name.toLowerCase() === validUpdates.name!.toLowerCase() && s.id !== id,
      );
      if (nameExists) {
        throw new ConflictException('Já existe uma estação com este nome.');
      }
    }

    if (Object.keys(validUpdates).length === 0 && errors.length > 0) {
      throw new BadRequestException({
        message: 'Sem alteracoes validas para aplicar.',
        details: errors,
      });
    }

    const previousStation = { ...station };

    const updatedStation = {
      ...station,
      ...validUpdates,
      updatedAt: new Date(),
      partialWarnings: errors.length > 0 ? errors : undefined,
    };

    this.stations[stationIndex] = updatedStation;
    this.logAudit(
      'UPDATE',
      id,
      updatedBy || 'desconhecido',
      `Estacao atualizada: ${previousStation.name} -> ${updatedStation.name}; localizacao: ${previousStation.location} -> ${updatedStation.location}; capacidade: ${previousStation.capacity} -> ${updatedStation.capacity}; alocados: ${previousStation.allocatedVehicles} -> ${updatedStation.allocatedVehicles}`,
    );

    return updatedStation;
  }

  async delete(id: number, deletedBy?: string): Promise<Station> {
    const stationIndex = this.stations.findIndex(s => s.id === id);
    if (stationIndex === -1) {
      throw new NotFoundException('Estação não encontrada');
    }

    const station = this.stations[stationIndex];
    this.stations.splice(stationIndex, 1);
    this.logAudit('DELETE', id, deletedBy || 'desconhecido', `Estação eliminada: ${station.name}`);

    return station;
  }

  private logAudit(operation: string, stationId: number, userId: string, details: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[AUDITORIA] ${timestamp} - ${operation} - Estação ID: ${stationId} - Usuário: ${userId} - ${details}`);
  }
}