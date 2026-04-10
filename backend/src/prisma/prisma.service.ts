import 'dotenv/config';
import { join } from 'node:path';
import { PrismaPg } from '@prisma/adapter-pg';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

const { PrismaClient } = require(join(process.cwd(), 'generated', 'prisma')) as {
  PrismaClient: new (...args: any[]) => any;
};

// Prisma bootstrap for PostgreSQL.
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  [key: string]: any;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is not configured.');
    }

    super({
      adapter: new PrismaPg({ connectionString }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
