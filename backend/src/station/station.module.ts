import { Module } from '@nestjs/common';
import { StationService } from './station.service';
import { StationController } from './station.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Importa o PrismaModule para acesso ao DB
  controllers: [StationController],
  providers: [StationService],
  exports: [StationService], // Exporta o service se necessário em outros módulos
})
export class StationModule {}