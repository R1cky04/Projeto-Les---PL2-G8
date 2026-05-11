import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { AuthSessionGuard } from '../src/auth/auth-session.guard';
import { PrismaService } from '../src/prisma/prisma.service';
import { createContractAuthGuard } from './support/e2e-auth';

describe('Rentals HTTP contract', () => {
  let app: INestApplication<App>;
  let consoleLogSpy: jest.SpyInstance;

  const createRentalPayload = {
    stationId: 1,
    vehicleId: 1,
    customerId: 1,
    pickupAt: '2026-11-01T09:00:00.000Z',
    expectedReturnAt: '2026-11-03T09:00:00.000Z',
    pickupOdometerKm: 46310,
    vehicleCondition: 'Sem danos visiveis',
    notes: 'Contrato criado por teste de contrato.',
  };

  beforeEach(async () => {
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
      .useValue(createContractAuthGuard())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    consoleLogSpy.mockRestore();
    await app.close();
  });

  it('returns the rental creation context contract', async () => {
    const response = await request(app.getHttpServer())
      .get('/rentals/context')
      .set('Authorization', 'Bearer contract-token')
      .expect(200);

    expect(response.body).toMatchObject({
      customers: expect.any(Array),
      stations: expect.any(Array),
      availableVehicles: expect.any(Array),
      recentRentals: expect.any(Array),
    });
    expect(response.body.customers[0]).toMatchObject({
      id: expect.any(Number),
      firstName: expect.any(String),
      lastName: expect.any(String),
      email: expect.any(String),
    });
    expect(response.body.availableVehicles[0]).toMatchObject({
      id: expect.any(Number),
      plateNumber: expect.any(String),
      stationName: expect.any(String),
      status: 'AVAILABLE',
    });
  });

  it('creates, lists, reads, updates and closes rentals with stable contracts', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/rentals')
      .set('Authorization', 'Bearer contract-token')
      .send(createRentalPayload)
      .expect(201);

    expect(createResponse.body).toMatchObject({
      id: expect.any(Number),
      contractNumber: expect.stringMatching(/^CTR-/),
      customerId: 1,
      customerFullName: 'Ines Almeida',
      vehicleId: 1,
      vehiclePlate: 'AA-11-BB',
      stationId: 1,
      returnStationId: 1,
      pickupAt: expect.any(String),
      expectedReturnAt: expect.any(String),
      pickupOdometerKm: 46310,
      estimatedDays: 2,
      estimatedAmount: expect.any(Number),
      dailyRate: expect.any(Number),
      vehicleCondition: 'Sem danos visiveis',
      status: 'OPEN',
      createdBy: 'it.contract',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    const rentalId = createResponse.body.id;
    const contractNumber = createResponse.body.contractNumber;

    const listResponse = await request(app.getHttpServer())
      .get('/rentals')
      .query({ status: 'OPEN', search: contractNumber })
      .set('Authorization', 'Bearer contract-token')
      .expect(200);

    expect(listResponse.body).toEqual([
      expect.objectContaining({
        id: rentalId,
        contractNumber,
        status: 'OPEN',
      }),
    ]);

    const readResponse = await request(app.getHttpServer())
      .get(`/rentals/${rentalId}`)
      .set('Authorization', 'Bearer contract-token')
      .expect(200);

    expect(readResponse.body).toMatchObject({
      id: rentalId,
      contractNumber,
      customerFullName: 'Ines Almeida',
    });

    const updateResponse = await request(app.getHttpServer())
      .patch(`/rentals/${rentalId}`)
      .set('Authorization', 'Bearer contract-token')
      .send({
        expectedReturnAt: '2026-11-04T09:00:00.000Z',
        returnStationId: 2,
        notes: 'Cliente pediu prolongamento.',
      })
      .expect(200);

    expect(updateResponse.body).toMatchObject({
      id: rentalId,
      expectedReturnAt: '2026-11-04T09:00:00.000Z',
      returnStationId: 2,
      returnStationName: expect.any(String),
      estimatedDays: 3,
      notes: 'Cliente pediu prolongamento.',
      status: 'OPEN',
    });

    const closeResponse = await request(app.getHttpServer())
      .patch(`/rentals/${rentalId}/close`)
      .set('Authorization', 'Bearer contract-token')
      .send({
        returnOdometerKm: 46500,
        actualReturnStationId: 2,
        finalNotes: 'Contrato encerrado sem incidentes.',
      })
      .expect(200);

    expect(closeResponse.body).toMatchObject({
      id: rentalId,
      status: 'CLOSED',
      returnOdometerKm: 46500,
      returnStationId: 2,
      closedAt: expect.any(String),
      finalAmount: expect.any(Number),
      finalNotes: 'Contrato encerrado sem incidentes.',
    });
  });

  it('rejects invalid rental filters with a stable error contract', async () => {
    const response = await request(app.getHttpServer())
      .get('/rentals')
      .query({
        createdFrom: '2026-11-30',
        createdTo: '2026-11-01',
      })
      .set('Authorization', 'Bearer contract-token')
      .expect(400);

    expect(response.body).toMatchObject({
      message: 'O intervalo de datas para consulta de contratos e invalido.',
      code: 'INVALID_RENTAL_DATE_RANGE',
    });
  });
});
