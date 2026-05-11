import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { AuthSessionGuard } from '../src/auth/auth-session.guard';
import { InternalUserRole } from '../src/internal-users/internal-user.enums';
import { PrismaService } from '../src/prisma/prisma.service';
import { createContractAuthGuard } from './support/e2e-auth';

describe('Vehicles HTTP contract', () => {
  let app: INestApplication<App>;
  let actorRole: InternalUserRole;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(async () => {
    actorRole = InternalUserRole.IT;
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

  it('lists vehicles with the public vehicle shape', async () => {
    const response = await request(app.getHttpServer())
      .get('/vehicles')
      .set('Authorization', 'Bearer contract-token')
      .expect(200);

    expect(response.body).toEqual(expect.any(Array));
    expect(response.body[0]).toMatchObject({
      id: expect.any(Number),
      plateNumber: expect.any(String),
      brand: expect.any(String),
      model: expect.any(String),
      stationId: expect.any(Number),
      dailyRate: expect.any(Number),
      status: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      createdBy: expect.any(String),
    });
  });

  it('creates, reads, searches, updates and deletes vehicles with stable contracts', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/vehicles')
      .set('Authorization', 'Bearer contract-token')
      .send({
        plateNumber: 'ZZ-99-ZZ',
        brand: 'Peugeot',
        model: '308',
        category: 'Compacto',
        year: 2022,
        seats: 5,
        transmission: 'MANUAL',
        fuelType: 'DIESEL',
        odometerKm: 23000,
        dailyRate: 61.5,
        status: 'AVAILABLE',
      })
      .expect(201);

    expect(createResponse.body).toMatchObject({
      id: expect.any(Number),
      plateNumber: 'ZZ-99-ZZ',
      brand: 'Peugeot',
      model: '308',
      stationId: 1,
      category: 'Compacto',
      year: 2022,
      seats: 5,
      transmission: 'MANUAL',
      fuelType: 'DIESEL',
      odometerKm: 23000,
      dailyRate: 61.5,
      status: 'AVAILABLE',
      createdBy: 'it.contract',
    });

    const vehicleId = createResponse.body.id;

    const readResponse = await request(app.getHttpServer())
      .get(`/vehicles/${vehicleId}`)
      .set('Authorization', 'Bearer contract-token')
      .expect(200);

    expect(readResponse.body).toMatchObject({
      id: vehicleId,
      plateNumber: 'ZZ-99-ZZ',
    });

    const searchResponse = await request(app.getHttpServer())
      .get('/vehicles/search/peugeot')
      .set('Authorization', 'Bearer contract-token')
      .expect(200);

    expect(searchResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: vehicleId,
          plateNumber: 'ZZ-99-ZZ',
        }),
      ]),
    );

    actorRole = InternalUserRole.STAFF;

    const updateResponse = await request(app.getHttpServer())
      .put(`/vehicles/${vehicleId}`)
      .set('Authorization', 'Bearer contract-token')
      .send({
        dailyRate: 65,
        status: 'MAINTENANCE',
      })
      .expect(200);

    expect(updateResponse.body).toMatchObject({
      id: vehicleId,
      dailyRate: 65,
      status: 'MAINTENANCE',
    });

    actorRole = InternalUserRole.IT;

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/vehicles/${vehicleId}`)
      .set('Authorization', 'Bearer contract-token')
      .expect(200);

    expect(deleteResponse.body).toMatchObject({
      id: vehicleId,
      plateNumber: 'ZZ-99-ZZ',
    });
  });

  it('rejects invalid vehicle payloads with the validation error contract', async () => {
    const response = await request(app.getHttpServer())
      .post('/vehicles')
      .set('Authorization', 'Bearer contract-token')
      .send({
        plateNumber: 'AA-99-AA',
        brand: 'Tesla',
        model: 'Model 3',
        dailyRate: 0,
      })
      .expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      message: expect.any(Array),
      error: 'Bad Request',
    });
  });

  it('keeps create and delete restricted to IT', async () => {
    actorRole = InternalUserRole.STAFF;

    const response = await request(app.getHttpServer())
      .post('/vehicles')
      .set('Authorization', 'Bearer contract-token')
      .send({
        plateNumber: 'ST-11-AF',
        brand: 'Seat',
        model: 'Ibiza',
        dailyRate: 40,
      })
      .expect(403);

    expect(response.body).toMatchObject({
      message: 'Apenas o perfil IT pode criar ou eliminar veiculos.',
      code: 'VEHICLE_CREATE_DELETE_IT_ONLY',
    });
  });
});
