import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import type { AuthenticatedUserDto } from '../auth/auth.types';
import {
  InternalPermission,
  InternalUserRole,
  InternalUserStatus,
} from '../internal-users/internal-user.enums';
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
        pickupAt: '2026-04-11T09:00:00.000Z',
        expectedReturnAt: '2026-04-13T09:00:00.000Z',
        pickupOdometerKm: 46300,
        vehicleCondition: 'Limpo e em bom estado',
      },
      buildActor(),
    );

    expect(rental.contractNumber.startsWith('CTR-')).toBe(true);
    expect(rental.estimatedDays).toBe(2);
    expect(rental.estimatedAmount).toBeGreaterThan(0);
    expect(rental.returnStationId).toBe(1);
    expect(rental.dailyRate).toBeGreaterThan(0);

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

  it('filters active rentals by contract number and customer search term', async () => {
    const createdRental = await service.create(
      {
        stationId: 1,
        vehicleId: 1,
        customerId: 1,
        pickupAt: new Date().toISOString(),
        expectedReturnAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
        pickupOdometerKm: 46300,
        vehicleCondition: 'OK',
      },
      buildActor(),
    );

    const byContract = await service.findAll({
      search: createdRental.contractNumber,
      status: 'OPEN',
    });
    const byCustomer = await service.findAll({
      search: 'ines',
      status: 'OPEN',
    });

    expect(byContract).toHaveLength(1);
    expect(byContract[0].id).toBe(createdRental.id);
    expect(byCustomer).toHaveLength(1);
    expect(byCustomer[0].customerId).toBe(1);
  });

  it('updates an active rental period and recalculates the estimated value', async () => {
    const createdRental = await service.create(
      {
        stationId: 1,
        vehicleId: 1,
        customerId: 1,
        pickupAt: '2026-04-11T09:00:00.000Z',
        expectedReturnAt: '2026-04-12T09:00:00.000Z',
        pickupOdometerKm: 46300,
        vehicleCondition: 'OK',
      },
      buildActor(),
    );

    const updatedRental = await service.update(
      createdRental.id,
      {
        expectedReturnAt: '2026-04-15T09:00:00.000Z',
        notes: 'Cliente prolongou o periodo.',
      },
      buildActor(),
    );

    expect(updatedRental.estimatedDays).toBe(4);
    expect(updatedRental.estimatedAmount).toBe(
      Number((4 * createdRental.dailyRate).toFixed(2)),
    );
    expect(updatedRental.notes).toBe('Cliente prolongou o periodo.');
  });

  it('updates return station and customer data for an active rental', async () => {
    const createdRental = await service.create(
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

    const updatedRental = await service.update(
      createdRental.id,
      {
        returnStationId: 2,
        customerEmail: 'ines.updated@example.com',
        customerPhone: '+351900000000',
      },
      buildActor(),
    );

    expect(updatedRental.returnStationId).toBe(2);
    expect(updatedRental.customerEmail).toBe('ines.updated@example.com');
    expect(updatedRental.customerPhone).toBe('+351900000000');
  });

  it('rejects updates for contracts that are no longer active', async () => {
    const createdRental = await service.create(
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

    (await service.findOne(createdRental.id)).status = 'CLOSED';

    await expect(
      service.update(
        createdRental.id,
        {
          notes: 'Nao deve atualizar',
        },
        buildActor(),
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects customer updates that would duplicate another customer email', async () => {
    const createdRental = await service.create(
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
      service.update(
        createdRental.id,
        {
          customerEmail: 'daniel.costa@example.com',
        },
        buildActor(),
      ),
    ).rejects.toThrow(ConflictException);
  });
});
