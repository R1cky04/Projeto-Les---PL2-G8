import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StationModule } from '../station/station.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { RentalController } from './rental.controller';
import { RentalManagementGuard } from './rental-management.guard';
import { RentalService } from './rental.service';

@Module({
  imports: [AuthModule, StationModule, VehicleModule],
  controllers: [RentalController],
  providers: [RentalService, RentalManagementGuard],
  exports: [RentalService],
})
export class RentalModule {}
