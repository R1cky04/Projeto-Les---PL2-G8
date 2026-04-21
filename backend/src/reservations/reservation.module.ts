import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RentalModule } from '../rentals/rental.module';
import { StationModule } from '../station/station.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { ReservationController } from './reservation.controller';
import { ReservationManagementGuard } from './reservation-management.guard';
import { ReservationService } from './reservation.service';

@Module({
  imports: [AuthModule, RentalModule, StationModule, VehicleModule],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationManagementGuard],
})
export class ReservationModule {}
