import { InternalPermission, InternalUserRole, InternalUserStatus } from '../internal-users/internal-user.enums';
import type { AuthenticatedUserDto } from '../auth/auth.types';
import { StationService } from '../station/station.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { ImproService } from './impro.service';

function buildActor(): AuthenticatedUserDto {
  return {
    id: 'auth-it-1',
    userId: 'fleet.manager',
    fullName: 'Fleet Manager',
    role: InternalUserRole.FLEET,
    status: InternalUserStatus.ACTIVE,
    isActive: true,
    accessLevel: 'FULL',
    permissions: [InternalPermission.TRANSFER_WRITE],
  };
}

describe('ImproService', () => {
  let service: ImproService;
  let actor: AuthenticatedUserDto;

  beforeEach(() => {
    service = new ImproService(new StationService(), new VehicleService());
    actor = buildActor();
  });

  it('creates impro and marks vehicle as in transfer', async () => {
    const impro = await service.create(
      {
        vehicleId: 1,
        originStationId: 1,
        destinationStationId: 2,
      },
      actor,
    );

    expect(impro.status).toBe('IN_TRANSFER');

    const vehicles = await service.listVehicles();
    expect(vehicles.find((vehicle) => vehicle.id === 1)?.status).toBe('IN_TRANSFER');
  });

  it('schedules impro for a future date', async () => {
    const future = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();

    const impro = await service.create(
      {
        vehicleId: 2,
        originStationId: 2,
        destinationStationId: 1,
        transferDate: future,
      },
      actor,
    );

    expect(impro.status).toBe('SCHEDULED');
    expect(impro.warnings).toContain('Transferencia agendada para data futura.');

    const vehicles = await service.listVehicles();
    expect(vehicles.find((vehicle) => vehicle.id === 2)?.status).toBe('MAINTENANCE');
  });

  it('closes impro and returns vehicle to available status at destination', async () => {
    const impro = await service.create(
      {
        vehicleId: 1,
        originStationId: 1,
        destinationStationId: 2,
      },
      actor,
    );

    const closedImpro = await service.close(impro.id, {}, actor);

    expect(closedImpro.status).toBe('CLOSED');

    const vehicles = await service.listVehicles();
    expect(vehicles.find((vehicle) => vehicle.id === 1)).toMatchObject({
      currentStationId: 2,
      status: 'AVAILABLE',
    });
  });

  it('marks vehicle as maintenance when closing damaged transfer', async () => {
    const impro = await service.create(
      {
        vehicleId: 1,
        originStationId: 1,
        destinationStationId: 2,
      },
      actor,
    );

    const closedImpro = await service.close(
      impro.id,
      {
        vehicleDamaged: true,
      },
      actor,
    );

    expect(closedImpro.status).toBe('CLOSED');
    expect(closedImpro.warnings).toContain(
      'Veiculo com danos foi encaminhado para manutencao.',
    );

    const vehicles = await service.listVehicles();
    expect(vehicles.find((vehicle) => vehicle.id === 1)?.status).toBe('MAINTENANCE');
  });

  it('filters history by vehicle plate', async () => {
    await service.create(
      {
        vehicleId: 1,
        originStationId: 1,
        destinationStationId: 2,
      },
      actor,
    );

    await service.create(
      {
        vehicleId: 2,
        originStationId: 2,
        destinationStationId: 1,
        transferDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      },
      actor,
    );

    const filtered = await service.findAll({ vehiclePlate: 'aa-11' });
    expect(filtered.totalItems).toBe(1);
    expect(filtered.items[0].vehiclePlate).toBe('AA-11-BB');
  });
});
