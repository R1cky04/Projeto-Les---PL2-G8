import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);

  constructor(private prisma: PrismaService) {}

  async listMakes(query?: string, limit = 20) {
    try {
      const q = (query || '').trim().toLowerCase();
      // If the `Make` table exists use it, otherwise return empty list.
      const exists = await this.prisma.$queryRaw`
        SELECT to_regclass('public."Make"') IS NOT NULL as exists`;
      if (!exists || !exists[0] || !exists[0].exists) return [];

      if (q) {
        return this.prisma.make.findMany({
          where: { name: { contains: q, mode: 'insensitive' } },
          take: Number(limit),
          orderBy: { name: 'asc' },
        });
      }

      return this.prisma.make.findMany({ take: Number(limit), orderBy: { name: 'asc' } });
    } catch (e) {
      this.logger.warn('listMakes fallback due to missing table or error', e as any);
      return [];
    }
  }

  async listModels(makeId?: string, query?: string, year?: number, limit = 50) {
    try {
      const q = (query || '').trim().toLowerCase();
      const exists = await this.prisma.$queryRaw`
        SELECT to_regclass('public."VehicleModel"') IS NOT NULL as exists`;
      if (!exists || !exists[0] || !exists[0].exists) return [];

      const where: any = {};

      if (makeId) {
        where.makeId = makeId;
      }

      if (q) {
        where.OR = [
          { name: { contains: q, mode: 'insensitive' } },
          { make: { name: { contains: q, mode: 'insensitive' } } },
        ];
      }

      if (Number.isFinite(year)) {
        where.AND = [
          {
            OR: [{ yearFrom: null }, { yearFrom: { lte: Number(year) } }],
          },
          {
            OR: [{ yearTo: null }, { yearTo: { gte: Number(year) } }],
          },
        ];
      }

      return this.prisma.vehicleModel.findMany({
        where,
        take: Number(limit),
        orderBy: [{ name: 'asc' }],
        include: {
          make: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (e) {
      this.logger.warn('listModels fallback due to missing table or error', e as any);
      return [];
    }
  }

  async listVariants(modelId: string, query?: string, limit = 50) {
    try {
      const q = (query || '').trim().toLowerCase();
      const exists = await this.prisma.$queryRaw`
        SELECT to_regclass('public."Variant"') IS NOT NULL as exists`;
      if (!exists || !exists[0] || !exists[0].exists) return [];

      const where: any = { modelId };
      if (q) where.name = { contains: q, mode: 'insensitive' };

      return this.prisma.variant.findMany({ where, take: Number(limit), orderBy: { name: 'asc' } });
    } catch (e) {
      this.logger.warn('listVariants fallback due to missing table or error', e as any);
      return [];
    }
  }

  async vinLookup(vin: string) {
    try {
      vin = (vin || '').trim();
      if (!vin) return null;

      // Prefer exact vehicle match by VIN
      const vehicle = await this.prisma.vehicle.findFirst({ where: { vin } as any });
      if (vehicle) {
        return {
          source: 'vehicle_table',
          vin: vehicle.vin,
          plateNumber: vehicle.plateNumber,
          brand: vehicle.brand,
          model: vehicle.model,
          makeId: vehicle.makeId,
          modelId: vehicle.modelId,
          variantId: vehicle.variantId,
        };
      }

      // Fallback: no vehicle record. Try to decode via Variant.externalId matching prefix
      const prefix = vin.substring(0, 11);
      const variants = await this.prisma.variant.findMany({ where: { externalId: { startsWith: prefix } as any }, take: 5 });
      if (variants && variants.length > 0) {
        return { source: 'variant_prefix', variants };
      }

      return null;
    } catch (e) {
      this.logger.warn('vinLookup fallback due to missing table or error', e as any);
      return null;
    }
  }
}
