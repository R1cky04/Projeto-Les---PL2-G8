import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { AuthenticatedUserDto } from '../auth/auth.types';
import { InternalPermission, InternalUserRole, InternalUserStatus } from '../internal-users/internal-user.enums';
import { StationService } from '../station/station.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { RentalService } from './rental.service';

function buildActor(): AuthenticatedUserDto {
  return {
    id: 'auth-staff-1',
    userId: 'staff.member',
    fullName: 'Staff Member',
    role: InternalUserRole.STAFF,
    status: InternalUserStatus.ACTIVE,
    isActive: true,
    accessLevel: 'FULL',
    permissions: [InternalPermission.RENTAL_READ],
  };
}

describe('RentalService', () => {
  let service: RentalService;

  beforeEach(() => {
    service = new RentalService(new StationService(), new VehicleService());
  });

  it('creates a rental contract and marks the vehicle as rented', async () => {
    const rental = await service.create(
      {
        stationId: 1,
        vehicleId: 1,
        customerId: 1,
        pickupAt: new Date().toISOString(),
        expectedReturnAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
        pickupOdometerKm: 46300,
        vehicleCondition: 'Limpo e em bom estado',
      },
      buildActor(),
    );

    expect(rental.contractNumber.startsWith('CTR-')).toBe(true);
    expect(rental.estimatedDays).toBe(2);
    expect(rental.estimatedAmount).toBeGreaterThan(0);

    const vehicles = await service.listAvailableVehicles();
    expect(vehicles.find((vehicle) => vehicle.id === 1)).toBeUndefined();
  });

  it('creates a customer inline when no existing customer is selected', async () => {
    const rental = await service.create(
      {
        stationId: 1,
        vehicleId: 1,
        pickupAt: new Date().toISOString(),
        expectedReturnAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        pickupOdometerKm: 46300,
        vehicleCondition: 'Pronto a sair',
        customerFirstName: 'Maria',
        customerLastName: 'Santos',
        customerEmail: 'maria.santos@example.com',
      },
      buildActor(),
    );

    expect(rental.customerFullName).toBe('Maria Santos');
  });

  it('rejects rentals for unavailable vehicles', async () => {
    await service.create(
      {
        stationId: 1,
        vehicleId: 1,
        customerId: 1,
        pickupAt: new Date().toISOString(),
        expectedReturnAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        pickupOdometerKm: 46300,
        vehicleCondition: 'OK',
      },
      buildActor(),
    );

    await expect(
      service.create(
        {
          stationId: 1,
          vehicleId: 1,
          customerId: 1,
          pickupAt: new Date().toISOString(),
          expectedReturnAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          pickupOdometerKm: 46300,
          vehicleCondition: 'OK',
        },
        buildActor(),
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects rentals when the customer does not exist', async () => {
    await expect(
      service.create(
        {
          stationId: 1,
          vehicleId: 1,
          customerId: 999,
          pickupAt: new Date().toISOString(),
          expectedReturnAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          pickupOdometerKm: 46300,
          vehicleCondition: 'OK',
        },
        buildActor(),
      ),
    ).rejects.toThrow(NotFoundException);
  });
});