import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { VehicleController } from './vehicle.controller';
import { VehicleManagementGuard } from './vehicle-management.guard';
import { VehicleService } from './vehicle.service';

@Module({
  imports: [AuthModule],
  controllers: [VehicleController],
  providers: [VehicleService, VehicleManagementGuard],
  exports: [VehicleService],
})
export class VehicleModule {}