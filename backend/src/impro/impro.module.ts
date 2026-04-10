import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StationModule } from '../station/station.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { ImproController } from './impro.controller';
import { ImproGuard } from './impro.guard';
import { ImproService } from './impro.service';

@Module({
  imports: [AuthModule, StationModule, VehicleModule],
  controllers: [ImproController],
  providers: [ImproService, ImproGuard],
})
export class ImproModule {}
