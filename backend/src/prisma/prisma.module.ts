import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// Expose PrismaService application-wide without repeated imports.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
