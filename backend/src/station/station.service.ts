import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStationDto } from './dto/create-station.dto';

@Injectable()
export class StationService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma nova estação na base de dados.
   * Valida a unicidade do nome e a validade da capacidade.
   * @param createStationDto Dados para criar a estação
   * @param createdBy ID do usuário que está criando (para auditoria)
   * @returns A estação criada
   */
  async create(createStationDto: CreateStationDto, createdBy?: string) {
    // Validação: Capacidade deve ser positiva
    if (createStationDto.capacity <= 0) {
      throw new BadRequestException('Capacidade deve ser um número positivo.');
    }

    // Verificar unicidade do nome
    const existingStation = await this.prisma.station.findUnique({
      where: { name: createStationDto.name },
    });
    if (existingStation) {
      throw new ConflictException('Já existe uma estação com este nome.');
    }

    // Criar a estação
    const station = await this.prisma.station.create({
      data: {
        name: createStationDto.name,
        location: createStationDto.location,
        capacity: createStationDto.capacity,
        createdBy,
      },
    });

    // Log de auditoria (simples, poderia ser mais avançado)
    console.log(`Estação criada: ${station.name} por ${createdBy || 'desconhecido'}`);

    return station;
  }

  /**
   * Busca todas as estações (para listagem, se necessário)
   */
  async findAll() {
    return this.prisma.station.findMany();
  }

  /**
   * Busca uma estação por ID
   */
  async findOne(id: number) {
    return this.prisma.station.findUnique({
      where: { id },
    });
  }
}