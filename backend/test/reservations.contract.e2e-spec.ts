import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { AuthSessionGuard } from '../src/auth/auth-session.guard';
import {
  InternalPermission,
  InternalUserRole,
  InternalUserStatus,
} from '../src/internal-users/internal-user.enums';
import { PrismaService } from '../src/prisma/prisma.service';
import { ReservationManagementGuard } from '../src/reservations/reservation-management.guard';

describe('Reservations HTTP contract', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: jest.fn(),
        $disconnect: jest.fn(),
      })
      .overrideGuard(AuthSessionGuard)
      .useValue({
        canActivate(context: any) {
          const request = context.switchToHttp().getRequest();
          request.auth = {
            sessionId: 'session-contract',
            tokenId: 'token-contract',
            expiresAt: new Date('2026-12-31T00:00:00.000Z'),
            concurrentSessionCount: 0,
            warnings: [],
            features: [],
            user: {
              id: 'user-contract',
              userId: 'staff.contract',
              fullName: 'Staff Contract',
              role: InternalUserRole.STAFF,
              status: InternalUserStatus.ACTIVE,
              isActive: true,
              accessLevel: 'FULL',
              permissions: [InternalPermission.RESERVATION_READ],
            },
          };

          return true;
        },
      })
      .overrideGuard(ReservationManagementGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns the reservation creation context contract', async () => {
    const response = await request(app.getHttpServer())
      .get('/reservations/context')
      .set('Authorization', 'Bearer contract-token')
      .expect(200);

    expect(response.body).toEqual({
      customers: expect.any(Array),
      stations: expect.any(Array),
      recentReservations: expect.any(Array),
    });
    expect(response.body.customers[0]).toMatchObject({
      id: expect.any(Number),
      firstName: expect.any(String),
      lastName: expect.any(String),
    });
  });

  it('returns available and alternative vehicles for a reservation period', async () => {
    const response = await request(app.getHttpServer())
      .get('/reservations/availability')
      .query({
        pickupStationId: 1,
        pickupAt: '2026-09-10T09:00:00.000Z',
        expectedReturnAt: '2026-09-12T09:00:00.000Z',
      })
      .set('Authorization', 'Bearer contract-token')
      .expect(200);

    expect(response.body).toEqual({
      pickupStationId: 1,
      pickupAt: expect.any(String),
      expectedReturnAt: expect.any(String),
      availableVehicles: expect.any(Array),
      alternativeVehicles: expect.any(Array),
      suggestionMessage: null,
    });
    expect(response.body.availableVehicles[0]).toMatchObject({
      id: expect.any(Number),
      plateNumber: expect.any(String),
      stationId: 1,
      stationName: expect.any(String),
    });
  });

  it('creates a reservation with the expected response contract', async () => {
    const response = await request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', 'Bearer contract-token')
      .send({
        pickupStationId: 1,
        returnStationId: 2,
        vehicleId: 1,
        customerId: 1,
        pickupAt: '2026-09-15T09:00:00.000Z',
        expectedReturnAt: '2026-09-17T09:00:00.000Z',
        notes: 'Reserva criada em contrato e2e.',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      reservationNumber: expect.stringMatching(/^RSV-/),
      customerId: 1,
      customerFullName: 'Ines Almeida',
      stationId: 1,
      returnStationId: 2,
      vehicleId: 1,
      status: 'CONFIRMED',
      createdBy: 'staff.contract',
    });
  });

  it('rejects overlapping reservations with a stable error contract', async () => {
    await request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', 'Bearer contract-token')
      .send({
        pickupStationId: 1,
        returnStationId: 1,
        vehicleId: 1,
        customerId: 1,
        pickupAt: '2026-09-20T09:00:00.000Z',
        expectedReturnAt: '2026-09-22T09:00:00.000Z',
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', 'Bearer contract-token')
      .send({
        pickupStationId: 1,
        returnStationId: 2,
        vehicleId: 1,
        customerId: 2,
        pickupAt: '2026-09-21T09:00:00.000Z',
        expectedReturnAt: '2026-09-23T09:00:00.000Z',
      })
      .expect(400);

    expect(response.body).toMatchObject({
      message:
        'O veiculo selecionado ja nao esta disponivel no periodo indicado. Escolha outra viatura.',
      code: 'VEHICLE_UNAVAILABLE',
      alternatives: expect.any(Array),
    });
  });
});
