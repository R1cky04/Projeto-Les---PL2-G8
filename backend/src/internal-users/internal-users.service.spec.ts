import { ConflictException } from '@nestjs/common';
import {
  InternalPermission,
  InternalUserRole,
  InternalUserStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { InternalUsersService } from './internal-users.service';
import { PasswordHasherService } from './password-hasher.service';

describe('InternalUsersService', () => {
  let service: InternalUsersService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };
  let passwordHasher: PasswordHasherService;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    passwordHasher = new PasswordHasherService();
    service = new InternalUsersService(
      prisma as unknown as PrismaService,
      passwordHasher,
    );
  });

  it('creates an admin user with inherited permissions and active status', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 'user-1',
      userId: 'admin.master',
      internalRole: InternalUserRole.ADMIN,
      internalStatus: InternalUserStatus.ACTIVE,
      permissions: [
        InternalPermission.RESERVATION_READ,
        InternalPermission.RENTAL_READ,
        InternalPermission.VEHICLE_READ,
        InternalPermission.VEHICLE_WRITE,
        InternalPermission.MAINTENANCE_WRITE,
        InternalPermission.TRANSFER_WRITE,
        InternalPermission.INCIDENT_WRITE,
        InternalPermission.USER_READ,
        InternalPermission.USER_CREATE,
        InternalPermission.USER_ACTIVATE,
      ],
      requiresItValidation: false,
      isActive: true,
      createdAt: new Date('2026-03-17T12:00:00.000Z'),
    });

    const response = await service.create({
      userId: 'Admin.Master',
      password: 'StrongPwd1!',
      role: 'ADMIN',
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { userId: 'admin.master' },
      select: { id: true },
    });
    expect(prisma.user.create).toHaveBeenCalledTimes(1);

    const createCall = prisma.user.create.mock.calls[0][0];
    expect(createCall.data).toMatchObject({
      userId: 'admin.master',
      fullName: 'admin.master',
      isInternal: true,
      internalRole: InternalUserRole.ADMIN,
      internalStatus: InternalUserStatus.ACTIVE,
      requiresItValidation: false,
      isActive: true,
    });
    expect(createCall.data.permissions).toContain(
      InternalPermission.USER_CREATE,
    );
    expect(createCall.data.passwordHash).not.toBe('StrongPwd1!');
    expect(
      passwordHasher.verify('StrongPwd1!', createCall.data.passwordHash),
    ).toBe(true);

    expect(response.message).toBe('Utilizador criado com sucesso.');
    expect(response.user.role).toBe(InternalUserRole.ADMIN);
    expect(response.user.status).toBe(InternalUserStatus.ACTIVE);
  });

  it('creates a restricted fleet user pending IT validation', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 'user-2',
      userId: 'fleet.ops',
      internalRole: InternalUserRole.FLEET,
      internalStatus: InternalUserStatus.PENDING_IT_VALIDATION,
      permissions: [
        InternalPermission.RESERVATION_READ,
        InternalPermission.RENTAL_READ,
        InternalPermission.VEHICLE_READ,
        InternalPermission.VEHICLE_WRITE,
        InternalPermission.MAINTENANCE_WRITE,
        InternalPermission.TRANSFER_WRITE,
        InternalPermission.INCIDENT_WRITE,
      ],
      requiresItValidation: true,
      isActive: false,
      createdAt: new Date('2026-03-17T12:05:00.000Z'),
    });

    const response = await service.create({
      userId: 'fleet.ops',
      password: 'StrongPwd1!',
      role: 'FLEET',
    });

    expect(prisma.user.create.mock.calls[0][0].data).toMatchObject({
      internalRole: InternalUserRole.FLEET,
      internalStatus: InternalUserStatus.PENDING_IT_VALIDATION,
      requiresItValidation: true,
      isActive: false,
    });
    expect(response.message).toContain('pendente de validacao do IT');
    expect(response.user.requiresItValidation).toBe(true);
  });

  it('rejects duplicated user identifiers', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'existing-user' });

    await expect(
      service.create({
        userId: 'existing.user',
        password: 'StrongPwd1!',
        role: 'STAFF',
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('rejects weak passwords before hitting persistence', async () => {
    await expect(
      service.create({
        userId: 'weak.user',
        password: '1234',
        role: 'STAFF',
      }),
    ).rejects.toThrow('Existem erros de validacao.');

    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});
