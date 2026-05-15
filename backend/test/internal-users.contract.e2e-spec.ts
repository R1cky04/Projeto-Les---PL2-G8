import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { AuthSessionGuard } from '../src/auth/auth-session.guard';
import {
  InternalPermission,
  InternalUserRole,
  InternalUserStatus,
} from '../src/internal-users/internal-user.enums';
import { InternalUsersService } from '../src/internal-users/internal-users.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { createContractAuthGuard } from './support/e2e-auth';

describe('Internal users HTTP contract', () => {
  let app: INestApplication<App>;
  let actorRole: InternalUserRole;
  let internalUsersService: {
    create: jest.Mock;
    findAll: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  const createdAt = new Date('2026-05-01T10:00:00.000Z');
  const userPayload = {
    id: 'user-staff',
    userId: 'staff.contract',
    role: InternalUserRole.STAFF,
    status: InternalUserStatus.PENDING_IT_VALIDATION,
    internalRole: InternalUserRole.STAFF,
    internalStatus: InternalUserStatus.PENDING_IT_VALIDATION,
    permissions: [InternalPermission.RESERVATION_READ],
    requiresItValidation: true,
    isActive: true,
    createdAt,
  };

  beforeEach(async () => {
    actorRole = InternalUserRole.IT;
    internalUsersService = {
      create: jest.fn(async () => ({
        message:
          'Utilizador criado com sucesso, mas a conta fica pendente de validacao do IT.',
        user: userPayload,
      })),
      findAll: jest.fn(async () => ({
        items: [
          {
            id: userPayload.id,
            userId: userPayload.userId,
            internalRole: userPayload.internalRole,
            internalStatus: userPayload.internalStatus,
            permissions: userPayload.permissions,
            requiresItValidation: userPayload.requiresItValidation,
            isActive: userPayload.isActive,
            createdAt,
          },
        ],
        pagination: {
          page: 1,
          pageSize: 10,
          totalItems: 1,
          totalPages: 1,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      })),
      update: jest.fn(async () => ({
        message: 'Utilizador atualizado com sucesso.',
        outcome: 'UPDATED',
        warnings: [],
        user: {
          id: userPayload.id,
          userId: 'staff.updated',
          internalRole: InternalUserRole.ADMIN,
          internalStatus: InternalUserStatus.ACTIVE,
          permissions: [
            InternalPermission.RESERVATION_READ,
            InternalPermission.RENTAL_READ,
          ],
          requiresItValidation: true,
          isActive: true,
          createdAt,
        },
      })),
      remove: jest.fn(async () => ({
        message: 'Utilizador removido permanentemente com sucesso.',
        mode: 'DELETED',
        userId: userPayload.userId,
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
      .overrideProvider(InternalUsersService)
      .useValue(internalUsersService)
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
    await app.close();
  });

  it('creates an internal user with the expected response contract', async () => {
    const payload = {
      userId: 'staff.contract',
      password: 'StrongPass123',
      role: 'STAFF',
    };

    const response = await request(app.getHttpServer())
      .post('/internal-users')
      .set('Authorization', 'Bearer contract-token')
      .send(payload)
      .expect(201);

    expect(response.body).toMatchObject({
      message: expect.any(String),
      user: {
        id: 'user-staff',
        userId: 'staff.contract',
        role: 'STAFF',
        status: 'PENDING_IT_VALIDATION',
        permissions: expect.any(Array),
        requiresItValidation: true,
        isActive: true,
        createdAt: createdAt.toISOString(),
      },
    });
    expect(internalUsersService.create).toHaveBeenCalledWith(payload);
  });

  it('lists internal users with pagination metadata', async () => {
    const response = await request(app.getHttpServer())
      .get('/internal-users')
      .query({ page: '1', pageSize: '10', search: 'staff' })
      .set('Authorization', 'Bearer contract-token')
      .expect(200);

    expect(response.body).toEqual({
      items: [
        {
          id: 'user-staff',
          userId: 'staff.contract',
          internalRole: 'STAFF',
          internalStatus: 'PENDING_IT_VALIDATION',
          permissions: ['RESERVATION_READ'],
          requiresItValidation: true,
          isActive: true,
          createdAt: createdAt.toISOString(),
        },
      ],
      pagination: {
        page: 1,
        pageSize: 10,
        totalItems: 1,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    });
    expect(internalUsersService.findAll).toHaveBeenCalledWith(
      '1',
      '10',
      'staff',
    );
  });

  it('updates an internal user with the management outcome contract', async () => {
    const response = await request(app.getHttpServer())
      .put('/internal-users/user-staff')
      .set('Authorization', 'Bearer contract-token')
      .send({
        userId: 'staff.updated',
        role: 'ADMIN',
        status: 'ACTIVE',
        isActive: true,
      })
      .expect(200);

    expect(response.body).toMatchObject({
      message: 'Utilizador atualizado com sucesso.',
      outcome: 'UPDATED',
      warnings: [],
      user: {
        id: 'user-staff',
        userId: 'staff.updated',
        internalRole: 'ADMIN',
        internalStatus: 'ACTIVE',
        permissions: expect.any(Array),
        requiresItValidation: true,
        isActive: true,
        createdAt: createdAt.toISOString(),
      },
    });
    expect(internalUsersService.update).toHaveBeenCalledWith(
      'user-staff',
      expect.any(Object),
      expect.objectContaining({ userId: 'it.contract' }),
    );
  });

  it('removes an internal user with the deletion contract', async () => {
    const response = await request(app.getHttpServer())
      .delete('/internal-users/user-staff')
      .set('Authorization', 'Bearer contract-token')
      .expect(200);

    expect(response.body).toEqual({
      message: 'Utilizador removido permanentemente com sucesso.',
      mode: 'DELETED',
      userId: 'staff.contract',
    });
    expect(internalUsersService.remove).toHaveBeenCalledWith(
      'user-staff',
      expect.objectContaining({ userId: 'it.contract' }),
    );
  });

  it('rejects non-IT access with the documented error contract', async () => {
    actorRole = InternalUserRole.STAFF;

    const response = await request(app.getHttpServer())
      .get('/internal-users')
      .set('Authorization', 'Bearer contract-token')
      .expect(403);

    expect(response.body).toMatchObject({
      message: 'Apenas o IT pode gerir utilizadores internos.',
      code: 'IT_ROLE_REQUIRED',
    });
    expect(internalUsersService.findAll).not.toHaveBeenCalled();
  });
});
