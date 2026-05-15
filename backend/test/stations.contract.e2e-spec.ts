import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { AuthSessionGuard } from '../src/auth/auth-session.guard';
import { InternalUserRole } from '../src/internal-users/internal-user.enums';
import { PrismaService } from '../src/prisma/prisma.service';
import { createContractAuthGuard } from './support/e2e-auth';

describe('Stations HTTP contract', () => {
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

  it('lists stations with the public station shape', async () => {
    const response = await request(app.getHttpServer())
      .get('/stations')
      .set('Authorization', 'Bearer contract-token')
      .expect(200);

    expect(response.body).toEqual(expect.any(Array));
    expect(response.body[0]).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      location: expect.any(String),
      capacity: expect.any(Number),
      allocatedVehicles: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      createdBy: expect.any(String),
    });
  });

  it('creates, reads, searches, updates and deletes stations with stable contracts', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/stations')
      .set('Authorization', 'Bearer contract-token')
      .send({
        name: 'Estacao Contrato',
        location: 'Zona Contrato',
        capacity: 12,
        allocatedVehicles: 2,
      })
      .expect(201);

    expect(createResponse.body).toMatchObject({
      id: expect.any(Number),
      name: 'Estacao Contrato',
      location: 'Zona Contrato',
      capacity: 12,
      allocatedVehicles: 2,
      createdBy: 'it.contract',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    const stationId = createResponse.body.id;

    const readResponse = await request(app.getHttpServer())
      .get(`/stations/${stationId}`)
      .set('Authorization', 'Bearer contract-token')
      .expect(200);

    expect(readResponse.body).toMatchObject({
      id: stationId,
      name: 'Estacao Contrato',
    });

    const searchResponse = await request(app.getHttpServer())
      .get('/stations/search/contrato')
      .set('Authorization', 'Bearer contract-token')
      .expect(200);

    expect(searchResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: stationId,
          name: 'Estacao Contrato',
        }),
      ]),
    );

    const updateResponse = await request(app.getHttpServer())
      .put(`/stations/${stationId}`)
      .set('Authorization', 'Bearer contract-token')
      .send({
        name: 'Estacao Contrato Atualizada',
        location: 'Zona Atualizada',
        capacity: 14,
        allocatedVehicles: 3,
      })
      .expect(200);

    expect(updateResponse.body).toMatchObject({
      id: stationId,
      name: 'Estacao Contrato Atualizada',
      location: 'Zona Atualizada',
      capacity: 14,
      allocatedVehicles: 3,
      updatedAt: expect.any(String),
    });

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/stations/${stationId}`)
      .set('Authorization', 'Bearer contract-token')
      .expect(200);

    expect(deleteResponse.body).toMatchObject({
      id: stationId,
      name: 'Estacao Contrato Atualizada',
    });
  });

  it('rejects invalid station payloads with the validation error contract', async () => {
    const response = await request(app.getHttpServer())
      .post('/stations')
      .set('Authorization', 'Bearer contract-token')
      .send({
        name: '',
        location: '',
        capacity: 0,
        allocatedVehicles: -1,
      })
      .expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      message: expect.any(Array),
      error: 'Bad Request',
    });
  });

  it('rejects non-IT station management access', async () => {
    actorRole = InternalUserRole.STAFF;

    const response = await request(app.getHttpServer())
      .get('/stations')
      .set('Authorization', 'Bearer contract-token')
      .expect(403);

    expect(response.body).toMatchObject({
      message: 'Apenas o IT pode gerir estacoes.',
      code: 'IT_ROLE_REQUIRED',
    });
  });
});
