import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { AuthSessionGuard } from '../src/auth/auth-session.guard';
import {
  InternalPermission,
  InternalUserRole,
} from '../src/internal-users/internal-user.enums';
import { PrismaService } from '../src/prisma/prisma.service';
import { createContractAuthGuard } from './support/e2e-auth';

describe('Impro HTTP contract', () => {
  let app: INestApplication<App>;
  let actorRole: InternalUserRole;
  let actorPermissions: InternalPermission[];
  let consoleLogSpy: jest.SpyInstance;

  const createImproPayload = {
    vehicleId: 1,
    originStationId: 1,
    destinationStationId: 2,
    transferDate: '2026-12-01T09:00:00.000Z',
    plannedArrivalDate: '2026-12-01T12:00:00.000Z',
    notes: 'Transferencia programada por teste de contrato.',
  };

  beforeEach(async () => {
    actorRole = InternalUserRole.IT;
    actorPermissions = Object.values(InternalPermission);
    consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: jest.fn(),
        $disconnect: jest.fn(),
      })
      .overrideGuard(AuthSessionGuard)
      .useValue(
        createContractAuthGuard(() => ({
          role: actorRole,
          userId: `${actorRole.toLowerCase()}.contract`,
          permissions: actorPermissions,
        })),
      )
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    consoleLogSpy.mockRestore();
    await app.close();
  });

  it('returns vehicle and station context contracts for impros', async () => {
    const vehiclesResponse = await request(app.getHttpServer())
      .get('/impros/vehicles')
      .query({ plate: 'AA' })
      .set('Authorization', 'Bearer contract-token')
      .expect(200);

    expect(vehiclesResponse.body).toEqual(expect.any(Array));
    expect(vehiclesResponse.body[0]).toMatchObject({
      id: expect.any(Number),
      plate: expect.any(String),
      model: expect.any(String),
      currentStationId: expect.any(Number),
      status: expect.any(String),
      hasActiveContract: expect.any(Boolean),
    });

    const stationsResponse = await request(app.getHttpServer())
      .get('/impros/stations')
      .set('Authorization', 'Bearer contract-token')
      .expect(200);

    expect(stationsResponse.body).toEqual(expect.any(Array));
    expect(stationsResponse.body[0]).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      location: expect.any(String),
    });
  });

  it('creates, lists, updates and closes impros with stable contracts', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/impros')
      .set('Authorization', 'Bearer contract-token')
      .send(createImproPayload)
      .expect(201);

    expect(createResponse.body).toMatchObject({
      id: expect.any(Number),
      improCode: 'IMPRO-00001',
      vehicleId: 1,
      vehiclePlate: 'AA-11-BB',
      originStationId: 1,
      destinationStationId: 2,
      transferDate: '2026-12-01T09:00:00.000Z',
      plannedArrivalDate: '2026-12-01T12:00:00.000Z',
      actualArrivalDate: null,
      status: 'SCHEDULED',
      notes: 'Transferencia programada por teste de contrato.',
      createdBy: 'it.contract',
      updatedBy: 'it.contract',
      warnings: expect.arrayContaining([
        'Transferencia agendada para data futura.',
      ]),
      history: expect.arrayContaining([
        expect.objectContaining({
          action: 'CREATED',
          actor: 'it.contract',
        }),
      ]),
    });

    const improId = createResponse.body.id;

    const listResponse = await request(app.getHttpServer())
      .get('/impros')
      .query({ status: 'SCHEDULED', vehiclePlate: 'AA-11' })
      .set('Authorization', 'Bearer contract-token')
      .expect(200);

    expect(listResponse.body).toMatchObject({
      items: [
        expect.objectContaining({
          id: improId,
          improCode: 'IMPRO-00001',
          status: 'SCHEDULED',
        }),
      ],
      totalItems: 1,
    });

    const updateResponse = await request(app.getHttpServer())
      .patch(`/impros/${improId}`)
      .set('Authorization', 'Bearer contract-token')
      .send({
        plannedArrivalDate: '2026-12-01T13:00:00.000Z',
        notes: 'Chegada prevista atualizada.',
      })
      .expect(200);

    expect(updateResponse.body).toMatchObject({
      id: improId,
      plannedArrivalDate: '2026-12-01T13:00:00.000Z',
      notes: 'Chegada prevista atualizada.',
      updatedBy: 'it.contract',
      history: expect.arrayContaining([
        expect.objectContaining({
          action: 'UPDATED',
          actor: 'it.contract',
        }),
      ]),
    });

    const closeResponse = await request(app.getHttpServer())
      .post(`/impros/${improId}/close`)
      .set('Authorization', 'Bearer contract-token')
      .send({
        actualArrivalDate: '2026-12-01T14:00:00.000Z',
        vehicleDamaged: false,
        closureNotes: 'Veiculo entregue.',
      })
      .expect(201);

    expect(closeResponse.body).toMatchObject({
      id: improId,
      status: 'CLOSED',
      actualArrivalDate: '2026-12-01T14:00:00.000Z',
      updatedBy: 'it.contract',
      notes: expect.stringContaining('Veiculo entregue.'),
      history: expect.arrayContaining([
        expect.objectContaining({
          action: 'CLOSED',
          actor: 'it.contract',
        }),
      ]),
    });
  });

  it('rejects invalid impro filters with a stable error contract', async () => {
    await request(app.getHttpServer())
      .post('/impros')
      .set('Authorization', 'Bearer contract-token')
      .send(createImproPayload)
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/impros')
      .query({ status: 'UNKNOWN' })
      .set('Authorization', 'Bearer contract-token')
      .expect(400);

    expect(response.body).toMatchObject({
      message: 'Estado de impro invalido no filtro.',
      code: 'INVALID_IMPRO_STATUS_FILTER',
    });
  });

  it('rejects roles outside the impro management contract', async () => {
    actorRole = InternalUserRole.STAFF;

    const response = await request(app.getHttpServer())
      .get('/impros')
      .set('Authorization', 'Bearer contract-token')
      .expect(403);

    expect(response.body).toMatchObject({
      message: 'Apenas Frota, Admin ou IT podem gerir impros.',
      code: 'IMPRO_ROLE_REQUIRED',
    });
  });

  it('requires transfer permission even when the role can enter the module', async () => {
    actorRole = InternalUserRole.ADMIN;
    actorPermissions = [InternalPermission.VEHICLE_READ];

    const response = await request(app.getHttpServer())
      .post('/impros')
      .set('Authorization', 'Bearer contract-token')
      .send(createImproPayload)
      .expect(400);

    expect(response.body).toMatchObject({
      message: 'Sem permissao para operacoes de transferencia.',
      code: 'TRANSFER_PERMISSION_REQUIRED',
    });
  });
});
