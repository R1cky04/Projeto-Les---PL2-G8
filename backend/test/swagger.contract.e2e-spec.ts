import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { setupSwagger } from '../src/swagger';

describe('Swagger/OpenAPI contract', () => {
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
      .compile();

    app = moduleFixture.createNestApplication();
    setupSwagger(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('publishes the OpenAPI document with the main API paths', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/docs-json')
      .expect(200);

    expect(response.body).toMatchObject({
      openapi: expect.stringMatching(/^3\./),
      info: {
        title: 'PL2-G8 Rent-a-Car API',
        version: '1.0.0',
      },
      paths: expect.objectContaining({
        '/auth/login': expect.any(Object),
        '/internal-users': expect.any(Object),
        '/stations': expect.any(Object),
        '/vehicles': expect.any(Object),
        '/rentals': expect.any(Object),
        '/reservations': expect.any(Object),
        '/reservations/{id}/cancel': expect.any(Object),
        '/impros': expect.any(Object),
      }),
      components: {
        schemas: expect.objectContaining({
          LoginDto: expect.any(Object),
          CreateReservationDto: expect.any(Object),
          CancelReservationDto: expect.any(Object),
          CreateRentalDto: expect.any(Object),
          CreateImproDto: expect.any(Object),
        }),
      },
    });
  });
});
