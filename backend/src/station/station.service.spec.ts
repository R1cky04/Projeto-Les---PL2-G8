import { Test, TestingModule } from '@nestjs/testing';
import { StationService } from './station.service';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('StationService', () => {
  let service: StationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StationService],
    }).compile();

    service = module.get<StationService>(StationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a station with valid data', async () => {
      const dto = { name: 'Estação Teste', location: 'Rua Teste', capacity: 10 };
      const result = await service.create(dto, 'test-user');

      expect(result).toMatchObject({
        name: dto.name,
        location: dto.location,
        capacity: dto.capacity,
        createdBy: 'test-user',
      });
      expect(result.id).toBeDefined();
    });

    it('should throw BadRequestException for non-positive capacity', async () => {
      // O teu service original valida: if (createStationDto.capacity <= 0)
      await expect(
        service.create({ name: 'X', location: 'Y', capacity: 0 }, 'test-user'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException for duplicate name', async () => {
      // "Estação Central" já existe no array inicial do teu service
      await expect(
        service.create({ name: 'Estação Central', location: 'Rua A', capacity: 10 }, 'test-user'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a station by id', async () => {
      const station = await service.findOne(1);
      expect(station.id).toBe(1);
    });

    it('should throw NotFoundException when station does not exist', async () => {
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an existing station', async () => {
      const updateDto = { name: 'Nome Atualizado' };
      const result = await service.update(1, updateDto, 'admin');
      expect(result.name).toBe('Nome Atualizado');
    });

    it('should throw ConflictException when updating to an existing name', async () => {
      // Tentar mudar a Estação 1 para o nome da Estação 2 ("Estação Norte")
      await expect(
        service.update(1, { name: 'Estação Norte' }, 'admin'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('delete', () => {
    it('should delete an existing station', async () => {
      const result = await service.delete(2, 'admin');
      expect(result.id).toBe(2);
      // Verificar se foi mesmo removida
      await expect(service.findOne(2)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for invalid id', async () => {
      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('search', () => {
    it('should find stations by name', async () => {
      const results = await service.search('Central');
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Estação Central');
    });

    it('should be case insensitive', async () => {
      const results = await service.search('central');
      expect(results.length).toBe(1);
    });
  });
});