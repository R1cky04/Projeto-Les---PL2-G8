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
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
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
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Sistema',
    },
    {
      id: 2,
      name: 'Estação Norte',
      location: 'Zona Norte',
      capacity: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Sistema',
    },
  ];

  private nextId = 3;

  async create(createStationDto: CreateStationDto, createdBy?: string): Promise<Station> {
    if (createStationDto.capacity <= 0) {
      throw new BadRequestException('Capacidade deve ser um número positivo.');
    }

    const existingStation = this.stations.find(s => s.name === createStationDto.name);
    if (existingStation) {
      throw new ConflictException('Já existe uma estação com este nome.');
    }

    const station: Station = {
      id: this.nextId++,
      name: createStationDto.name,
      location: createStationDto.location,
      capacity: createStationDto.capacity,
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

    if (updateStationDto.capacity !== undefined && updateStationDto.capacity <= 0) {
      throw new BadRequestException('Capacidade deve ser um número positivo.');
    }

    if (updateStationDto.name && updateStationDto.name !== station.name) {
      const nameExists = this.stations.find(s => s.name === updateStationDto.name && s.id !== id);
      if (nameExists) {
        throw new ConflictException('Já existe uma estação com este nome.');
      }
    }

    const updatedStation = {
      ...station,
      ...updateStationDto,
      updatedAt: new Date(),
    };

    this.stations[stationIndex] = updatedStation;
    this.logAudit('UPDATE', id, updatedBy || 'desconhecido', `Estação atualizada: ${updatedStation.name}`);

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