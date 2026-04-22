import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { AuthenticatedUserDto } from '../auth/auth.types';
import {
  InternalPermission,
  InternalUserRole,
  InternalUserStatus,
} from '../internal-users/internal-user.enums';
import { RentalService } from '../rentals/rental.service';
import { StationService } from '../station/station.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { ReservationService } from './reservation.service';

function buildActor(): AuthenticatedUserDto {
  return {
    id: 'auth-admin-1',
    userId: 'admin.member',
    fullName: 'Admin Member',
    role: InternalUserRole.ADMIN,
    status: InternalUserStatus.ACTIVE,
    isActive: true,
    accessLevel: 'FULL',
    permissions: [InternalPermission.RESERVATION_READ],
  };
}

describe('ReservationService', () => {
  let service: ReservationService;
  let vehicleService: VehicleService;

  beforeEach(() => {
    const stationService = new StationService();
    vehicleService = new VehicleService();
    const rentalService = new RentalService(stationService, vehicleService);

    service = new ReservationService(
      stationService,
      vehicleService,
      rentalService,
    );
  });

  it('creates a reservation for an existing customer and available vehicle', async () => {
    const reservation = await service.create(
      {
        pickupStationId: 1,
        returnStationId: 2,
        vehicleId: 1,
        customerId: 1,
        pickupAt: '2026-05-10T09:00:00.000Z',
        expectedReturnAt: '2026-05-12T09:00:00.000Z',
        notes: 'Cliente recolhe na abertura.',
      },
      buildActor(),
    );

    expect(reservation.reservationNumber.startsWith('RSV-')).toBe(true);
    expect(reservation.customerFullName).toBe('Ines Almeida');
    expect(reservation.stationId).toBe(1);
    expect(reservation.returnStationId).toBe(2);
    expect(reservation.vehicleId).toBe(1);
    expect(reservation.status).toBe('CONFIRMED');
  });

  it('creates a customer inline when no existing customer is selected', async () => {
    await service.create(
      {
        pickupStationId: 1,
        returnStationId: 1,
        vehicleId: 1,
        pickupAt: '2026-06-01T09:00:00.000Z',
        expectedReturnAt: '2026-06-03T09:00:00.000Z',
        customerFirstName: 'Maria',
        customerLastName: 'Santos',
        customerEmail: 'maria.santos@example.com',
      },
      buildActor(),
    );

    const context = await service.getContext();

    expect(
      context.customers.some(
        (customer) =>
          customer.firstName === 'Maria' &&
          customer.lastName === 'Santos' &&
          customer.email === 'maria.santos@example.com',
      ),
    ).toBe(true);
  });

  it('suggests alternative vehicles when the selected station has no availability', async () => {
    const createdVehicle = await vehicleService.create(
      {
        plateNumber: '44-EF-66',
        brand: 'Peugeot',
        model: '208',
        dailyRate: 41.5,
      },
      'test-user',
    );
    await vehicleService.transferToStation(createdVehicle.id, 2, 'test-user');

    await service.create(
      {
        pickupStationId: 1,
        returnStationId: 1,
        vehicleId: 1,
        customerId: 1,
        pickupAt: '2026-05-10T09:00:00.000Z',
        expectedReturnAt: '2026-05-12T09:00:00.000Z',
      },
      buildActor(),
    );

    const availability = await service.getAvailability({
      pickupStationId: '1',
      pickupAt: '2026-05-10T09:00:00.000Z',
      expectedReturnAt: '2026-05-12T09:00:00.000Z',
    });

    expect(availability.availableVehicles).toHaveLength(0);
    expect(availability.alternativeVehicles).toHaveLength(1);
    expect(availability.alternativeVehicles[0].stationId).toBe(2);
    expect(availability.suggestionMessage).toContain('alternativas');
  });

  it('rejects a reservation when the selected vehicle becomes unavailable before confirmation', async () => {
    await service.create(
      {
        pickupStationId: 1,
        returnStationId: 1,
        vehicleId: 1,
        customerId: 1,
        pickupAt: '2026-07-10T09:00:00.000Z',
        expectedReturnAt: '2026-07-12T09:00:00.000Z',
      },
      buildActor(),
    );

    await expect(
      service.create(
        {
          pickupStationId: 1,
          returnStationId: 2,
          vehicleId: 1,
          customerId: 2,
          pickupAt: '2026-07-11T09:00:00.000Z',
          expectedReturnAt: '2026-07-13T09:00:00.000Z',
        },
        buildActor(),
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects reservations for unknown customers', async () => {
    await expect(
      service.create(
        {
          pickupStationId: 1,
          returnStationId: 1,
          vehicleId: 1,
          customerId: 999,
          pickupAt: '2026-08-10T09:00:00.000Z',
          expectedReturnAt: '2026-08-11T09:00:00.000Z',
        },
        buildActor(),
      ),
    ).rejects.toThrow(NotFoundException);
  });
});
