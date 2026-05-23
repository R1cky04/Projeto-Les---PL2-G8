import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { AuthSessionGuard } from '../src/auth/auth-session.guard';
import { AuthService } from '../src/auth/auth.service';
import { PrismaService } from '../src/prisma/prisma.service';
import {
  buildContractUser,
  CONTRACT_FEATURES,
  createContractAuthGuard,
} from './support/e2e-auth';

describe('Auth HTTP contract', () => {
  let app: INestApplication<App>;
  let authService: {
    login: jest.Mock;
    getCurrentSession: jest.Mock;
    logoutCurrentSession: jest.Mock;
  };

  const expiresAt = new Date('2026-12-31T00:00:00.000Z');

  function buildAuthResponse(message: string, token?: string) {
    return {
      message,
      session: {
        token,
        expiresAt,
        concurrentSessionCount: 0,
        warnings: [],
      },
      user: buildContractUser(),
      features: CONTRACT_FEATURES,
    };
  }

  beforeEach(async () => {
    authService = {
      login: jest.fn(async () =>
        buildAuthResponse('Login efetuado com sucesso.', 'contract-token'),
      ),
      getCurrentSession: jest.fn(() =>
        buildAuthResponse('Sessao restaurada com sucesso.'),
      ),
      logoutCurrentSession: jest.fn(async () => ({
        message: 'Sessao terminada com sucesso.',
      })),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: jest.fn(),
        $disconnect: jest.fn(),
      })
      .overrideProvider(AuthService)
      .useValue(authService)
      .overrideGuard(AuthSessionGuard)
      .useValue(createContractAuthGuard())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns the login response contract', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .set('User-Agent', 'Contract Browser')
      .send({
        userId: 'it.master',
        password: 'secret',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      message: 'Login efetuado com sucesso.',
      session: {
        token: 'contract-token',
        expiresAt: expiresAt.toISOString(),
        concurrentSessionCount: 0,
        warnings: [],
      },
      user: {
        id: 'user-contract',
        userId: 'it.contract',
        role: 'IT',
        status: 'ACTIVE',
        accessLevel: 'FULL',
        permissions: expect.any(Array),
      },
      features: expect.any(Array),
    });
    expect(authService.login).toHaveBeenCalledWith(
      {
        userId: 'it.master',
        password: 'secret',
      },
      'Contract Browser',
    );
  });

  it('returns the current session contract', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer contract-token')
      .expect(200);

    expect(response.body).toMatchObject({
      message: 'Sessao restaurada com sucesso.',
      session: {
        expiresAt: expiresAt.toISOString(),
        concurrentSessionCount: 0,
        warnings: [],
      },
      user: {
        userId: 'it.contract',
        role: 'IT',
      },
      features: expect.any(Array),
    });
    expect(response.body.session).not.toHaveProperty('token');
    expect(authService.getCurrentSession).toHaveBeenCalledTimes(1);
  });

  it('returns the logout contract', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', 'Bearer contract-token')
      .expect(201);

    expect(response.body).toEqual({
      message: 'Sessao terminada com sucesso.',
    });
    expect(authService.logoutCurrentSession).toHaveBeenCalledTimes(1);
  });
});
