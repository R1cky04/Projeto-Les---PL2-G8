import { Module } from '@nestjs/common';
import { StationService } from './station.service';
import { StationController } from './station.controller';
import { ItStationManagementGuard } from './it-station-management.guard';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [AuthModule],
  controllers: [StationController],
  providers: [StationService, ItStationManagementGuard],
  exports: [StationService], // Exporta o service se necessário em outros módulos
})
export class StationModule {}