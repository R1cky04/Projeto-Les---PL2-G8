import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { AuthSessionGuard } from '../src/auth/auth-session.guard';
import type { AuthenticatedRequest } from '../src/auth/auth.types';
import {
  InternalPermission,
  InternalUserRole,
  InternalUserStatus,
} from '../src/internal-users/internal-user.enums';
import { PrismaService } from '../src/prisma/prisma.service';
import { ReservationManagementGuard } from '../src/reservations/reservation-management.guard';

describe('Reservation cancellation integration', () => {
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
        canActivate(context: ExecutionContext) {
          const request = context
            .switchToHttp()
            .getRequest<AuthenticatedRequest>();
          request.auth = {
            sessionId: 'session-cancel',
            tokenId: 'token-cancel',
            expiresAt: new Date('2026-12-31T00:00:00.000Z'),
            concurrentSessionCount: 0,
            warnings: [],
            features: [],
            user: {
              id: 'user-cancel',
              userId: 'staff.cancel',
              fullName: 'Staff Cancel',
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

  it('cancels a reservation and makes its vehicle available again for the same period', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', 'Bearer cancel-token')
      .send({
        pickupStationId: 1,
        returnStationId: 1,
        vehicleId: 1,
        customerId: 1,
        pickupAt: '2026-11-10T09:00:00.000Z',
        expectedReturnAt: '2026-11-12T09:00:00.000Z',
      })
      .expect(201);

    await request(app.getHttpServer())
      .get('/reservations/availability')
      .query({
        pickupStationId: 1,
        pickupAt: '2026-11-10T09:00:00.000Z',
        expectedReturnAt: '2026-11-12T09:00:00.000Z',
      })
      .set('Authorization', 'Bearer cancel-token')
      .expect(200)
      .expect((response) => {
        expect(
          response.body.availableVehicles.some(
            (vehicle: { id: number }) => vehicle.id === 1,
          ),
        ).toBe(false);
      });

    const cancelResponse = await request(app.getHttpServer())
      .patch(`/reservations/${createResponse.body.id}/cancel`)
      .set('Authorization', 'Bearer cancel-token')
      .expect(200);

    expect(cancelResponse.body).toMatchObject({
      id: createResponse.body.id,
      status: 'CANCELLED',
      cancelledBy: 'staff.cancel',
      cancellationWarnings: expect.any(Array),
      financialReviewRequired: false,
    });

    await request(app.getHttpServer())
      .get('/reservations/availability')
      .query({
        pickupStationId: 1,
        pickupAt: '2026-11-10T09:00:00.000Z',
        expectedReturnAt: '2026-11-12T09:00:00.000Z',
      })
      .set('Authorization', 'Bearer cancel-token')
      .expect(200)
      .expect((response) => {
        expect(
          response.body.availableVehicles.some(
            (vehicle: { id: number }) => vehicle.id === 1,
          ),
        ).toBe(true);
      });
  });
});
