import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import type { AuthenticatedUserDto } from '../auth/auth.types';
import { ImproService } from '../impro/impro.service';
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
  let improService: ImproService;

  beforeEach(() => {
    const stationService = new StationService();
    vehicleService = new VehicleService();
    const rentalService = new RentalService(stationService, vehicleService);
    improService = new ImproService(stationService, vehicleService);

    service = new ReservationService(
      stationService,
      vehicleService,
      rentalService,
      improService,
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

  it('suggests vehicles from other stations as alternatives', async () => {
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

    expect(
      availability.availableVehicles.some(
        (vehicle) => vehicle.id === createdVehicle.id,
      ),
    ).toBe(false);
    expect(
      availability.alternativeVehicles.some(
        (vehicle) =>
          vehicle.id === createdVehicle.id && vehicle.stationId === 2,
      ),
    ).toBe(true);
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

  it('excludes vehicles with scheduled impro transfers from origin station availability after departure', async () => {
    await improService.create(
      {
        vehicleId: 1,
        originStationId: 1,
        destinationStationId: 2,
        transferDate: '2026-09-10T09:00:00.000Z',
        plannedArrivalDate: '2026-09-10T12:00:00.000Z',
      },
      {
        ...buildActor(),
        role: InternalUserRole.FLEET,
        permissions: [InternalPermission.TRANSFER_WRITE],
      },
    );

    const beforeTransfer = await service.getAvailability({
      pickupStationId: '1',
      pickupAt: '2026-09-08T09:00:00.000Z',
      expectedReturnAt: '2026-09-09T09:00:00.000Z',
    });
    const afterTransfer = await service.getAvailability({
      pickupStationId: '1',
      pickupAt: '2026-09-11T09:00:00.000Z',
      expectedReturnAt: '2026-09-12T09:00:00.000Z',
    });

    expect(beforeTransfer.availableVehicles.some((vehicle) => vehicle.id === 1)).toBe(true);
    expect(afterTransfer.availableVehicles.some((vehicle) => vehicle.id === 1)).toBe(false);
    expect(afterTransfer.alternativeVehicles.some((vehicle) => vehicle.id === 1)).toBe(false);

    await expect(
      service.create(
        {
          pickupStationId: 1,
          returnStationId: 1,
          vehicleId: 1,
          customerId: 1,
          pickupAt: '2026-09-11T09:00:00.000Z',
          expectedReturnAt: '2026-09-12T09:00:00.000Z',
        },
        buildActor(),
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: 'VEHICLE_IN_IMPRO_TRANSFER',
      }),
    });
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

  it('filters reservations by report period, pickup station and status', async () => {
    await service.create(
      {
        pickupStationId: 1,
        returnStationId: 2,
        vehicleId: 1,
        customerId: 1,
        pickupAt: '2026-10-10T09:00:00.000Z',
        expectedReturnAt: '2026-10-12T09:00:00.000Z',
      },
      buildActor(),
    );

    const toCancel = await service.create(
      {
        pickupStationId: 1,
        returnStationId: 1,
        vehicleId: 1,
        customerId: 2,
        pickupAt: '2026-12-10T09:00:00.000Z',
        expectedReturnAt: '2026-12-11T09:00:00.000Z',
      },
      buildActor(),
    );

    await service.cancel(toCancel.id, buildActor());

    const results = await service.findAll({
      startDate: '2026-10-01T00:00:00.000Z',
      endDate: '2026-10-31T23:59:59.999Z',
      pickupStationId: '1',
      status: 'CONFIRMED',
    });

    expect(results).toHaveLength(1);
    expect(results[0].stationId).toBe(1);
    expect(results[0].status).toBe('CONFIRMED');
  });

  it('cancels a confirmed reservation, audits the action and releases vehicle availability', async () => {
    const auditSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const reservation = await service.create(
      {
        pickupStationId: 1,
        returnStationId: 1,
        vehicleId: 1,
        customerId: 1,
        pickupAt: '2026-11-10T09:00:00.000Z',
        expectedReturnAt: '2026-11-12T09:00:00.000Z',
      },
      buildActor(),
    );

    const blockedAvailability = await service.getAvailability({
      pickupStationId: '1',
      pickupAt: '2026-11-10T09:00:00.000Z',
      expectedReturnAt: '2026-11-12T09:00:00.000Z',
    });

    expect(
      blockedAvailability.availableVehicles.some(
        (vehicle) => vehicle.id === reservation.vehicleId,
      ),
    ).toBe(false);

    const cancelled = await service.cancel(reservation.id, buildActor());
    const releasedAvailability = await service.getAvailability({
      pickupStationId: '1',
      pickupAt: '2026-11-10T09:00:00.000Z',
      expectedReturnAt: '2026-11-12T09:00:00.000Z',
    });

    expect(cancelled.status).toBe('CANCELLED');
    expect(cancelled.cancelledBy).toBe('admin.member');
    expect(cancelled.cancelledAt).toBeInstanceOf(Date);
    expect(cancelled.cancellationWarnings).toEqual([]);
    expect(
      releasedAvailability.availableVehicles.some(
        (vehicle) => vehicle.id === reservation.vehicleId,
      ),
    ).toBe(true);
    expect(auditSpy).toHaveBeenCalledWith(expect.stringContaining('CANCEL'));
    auditSpy.mockRestore();
  });

  it('adds operational warnings for late cancellation and paid reservations', async () => {
    const pickupAt = new Date(Date.now() + 60 * 60 * 1000);
    const expectedReturnAt = new Date(pickupAt.getTime() + 2 * 60 * 60 * 1000);
    const reservation = await service.create(
      {
        pickupStationId: 1,
        returnStationId: 1,
        vehicleId: 1,
        customerId: 1,
        pickupAt: pickupAt.toISOString(),
        expectedReturnAt: expectedReturnAt.toISOString(),
      },
      buildActor(),
    );

    (await service.findOne(reservation.id)).paymentStatus = 'PAID';

    const cancelled = await service.cancel(reservation.id, buildActor());

    expect(cancelled.financialReviewRequired).toBe(true);
    expect(cancelled.cancellationWarnings).toEqual([
      expect.stringContaining('proximo da data de inicio'),
      expect.stringContaining('pagamento associado'),
    ]);
  });

  it('requires admin validation for limited-permission cancellations', async () => {
    const reservation = await service.create(
      {
        pickupStationId: 1,
        returnStationId: 1,
        vehicleId: 1,
        customerId: 1,
        pickupAt: '2026-11-20T09:00:00.000Z',
        expectedReturnAt: '2026-11-21T09:00:00.000Z',
      },
      buildActor(),
    );
    const limitedActor: AuthenticatedUserDto = {
      ...buildActor(),
      id: 'fleet-limited-1',
      userId: 'fleet.limited',
      role: InternalUserRole.FLEET,
      accessLevel: 'LIMITED',
    };

    await expect(service.cancel(reservation.id, limitedActor)).rejects.toThrow(
      ForbiddenException,
    );

    const cancelled = await service.cancel(reservation.id, limitedActor, {
      adminValidated: true,
    });

    expect(cancelled.status).toBe('CANCELLED');
    expect(cancelled.adminValidationRequired).toBe(true);
  });

  it('allows IT master users to cancel without additional admin validation', async () => {
    const reservation = await service.create(
      {
        pickupStationId: 1,
        returnStationId: 1,
        vehicleId: 1,
        customerId: 1,
        pickupAt: '2026-11-22T09:00:00.000Z',
        expectedReturnAt: '2026-11-23T09:00:00.000Z',
      },
      buildActor(),
    );
    const itActor: AuthenticatedUserDto = {
      ...buildActor(),
      id: 'it-master-1',
      userId: 'it.master',
      role: InternalUserRole.IT,
      accessLevel: 'FULL',
    };

    const cancelled = await service.cancel(reservation.id, itActor);

    expect(cancelled.status).toBe('CANCELLED');
    expect(cancelled.adminValidationRequired).toBe(false);
    expect(cancelled.cancelledBy).toBe('it.master');
  });

  it('rejects cancellation for unknown, converted or already-started reservations', async () => {
    await expect(service.cancel(999, buildActor())).rejects.toThrow(
      NotFoundException,
    );

    const converted = await service.create(
      {
        pickupStationId: 1,
        returnStationId: 1,
        vehicleId: 1,
        customerId: 1,
        pickupAt: '2026-11-25T09:00:00.000Z',
        expectedReturnAt: '2026-11-26T09:00:00.000Z',
      },
      buildActor(),
    );
    await service.markAsConvertedToContract(converted.id, buildActor());

    await expect(service.cancel(converted.id, buildActor())).rejects.toThrow(
      BadRequestException,
    );

    const started = await service.create(
      {
        pickupStationId: 1,
        returnStationId: 1,
        vehicleId: 1,
        customerId: 2,
        pickupAt: '2026-05-01T09:00:00.000Z',
        expectedReturnAt: '2026-05-02T09:00:00.000Z',
      },
      buildActor(),
    );

    await expect(service.cancel(started.id, buildActor())).rejects.toThrow(
      BadRequestException,
    );
  });
});
