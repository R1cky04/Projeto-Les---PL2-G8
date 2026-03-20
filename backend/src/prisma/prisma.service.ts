import { Injectable } from '@nestjs/common';

export interface StationRecord {
  id: number;
  name: string;
  location: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

@Injectable()
export class PrismaService {
  private stations: StationRecord[] = [];
  private nextId = 1;

  station = {
    findUnique: async ({ where }: { where: { name?: string; id?: number } }) => {
      if (where.name) return this.stations.find((s) => s.name === where.name) ?? null;
      if (where.id) return this.stations.find((s) => s.id === where.id) ?? null;
      return null;
    },
    findMany: async () => this.stations,
    create: async ({ data }: { data: Omit<StationRecord, 'id' | 'createdAt' | 'updatedAt'> }) => {
      const now = new Date();
      const station: StationRecord = {
        id: this.nextId++,
        createdAt: now,
        updatedAt: now,
        ...data,
      };
      this.stations.push(station);
      return station;
    },
  };
}
