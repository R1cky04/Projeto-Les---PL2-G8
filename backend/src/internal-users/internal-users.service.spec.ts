import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  InternalPermission,
  InternalUserRole,
  InternalUserStatus,
} from '@prisma/client';
import { AuthenticatedUserDto } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { InternalUsersService } from './internal-users.service';
import { PasswordHasherService } from './password-hasher.service';

// Service tests cover creation policy, deletion policy, retention behavior and
// the audit trail required by the IT workflow.
describe('InternalUsersService', () => {
  let service: InternalUsersService;
  let prisma: {
    $transaction: jest.Mock;
    user: {
      count: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    internalSession: {
      updateMany: jest.Mock;
    };
    internalUserDeletionAuditLog: {
      create: jest.Mock;
    };
  };
  let passwordHasher: PasswordHasherService;

  const actor: AuthenticatedUserDto = {
    id: 'it-actor-id',
    userId: 'it.master',
    fullName: 'IT Master',
    role: InternalUserRole.IT,
    status: InternalUserStatus.ACTIVE,
    isActive: true,
    accessLevel: 'FULL',
    permissions: [
      InternalPermission.USER_CREATE,
      InternalPermission.USER_ACTIVATE,
      InternalPermission.USER_READ,
    ],
  };

  beforeEach(() => {
    prisma = {
      $transaction: jest.fn().mockImplementation((operations) =>
        Promise.all(operations),
      ),
      user: {
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      internalSession: {
        updateMany: jest.fn(),
      },
      internalUserDeletionAuditLog: {
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
      isActive: true,
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
      isActive: true,
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

  it('returns internal users with pagination metadata', async () => {
    prisma.user.count.mockResolvedValue(12);
    prisma.user.findMany.mockResolvedValue([
      {
        id: 'user-7',
        userId: 'staff.page',
        internalRole: InternalUserRole.STAFF,
        internalStatus: InternalUserStatus.PENDING_IT_VALIDATION,
        permissions: [InternalPermission.RESERVATION_READ],
        requiresItValidation: true,
        isActive: true,
        createdAt: new Date('2026-03-21T09:00:00.000Z'),
      },
    ]);

    const response = await service.findAll('2', '5');

    expect(prisma.user.count).toHaveBeenCalledWith({
      where: { isInternal: true },
    });
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { isInternal: true },
      select: {
        id: true,
        userId: true,
        internalRole: true,
        internalStatus: true,
        permissions: true,
        requiresItValidation: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: 5,
      take: 5,
    });
    expect(response.pagination).toEqual({
      page: 2,
      pageSize: 5,
      totalItems: 12,
      totalPages: 3,
      hasPreviousPage: true,
      hasNextPage: true,
    });
    expect(response.items).toHaveLength(1);
  });

  it('filters internal users by a search term and keeps the default page size of ten', async () => {
    prisma.user.count.mockResolvedValue(1);
    prisma.user.findMany.mockResolvedValue([
      {
        id: 'user-8',
        userId: 'staff.lisboa',
        internalRole: InternalUserRole.STAFF,
        internalStatus: InternalUserStatus.ACTIVE,
        permissions: [InternalPermission.USER_READ],
        requiresItValidation: false,
        isActive: true,
        createdAt: new Date('2026-03-21T10:00:00.000Z'),
      },
    ]);

    const response = await service.findAll(undefined, undefined, ' lisboa ');

    expect(prisma.user.count).toHaveBeenCalledWith({
      where: {
        isInternal: true,
        userId: {
          contains: 'lisboa',
          mode: 'insensitive',
        },
      },
    });
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: {
        isInternal: true,
        userId: {
          contains: 'lisboa',
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        userId: true,
        internalRole: true,
        internalStatus: true,
        permissions: true,
        requiresItValidation: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: 10,
    });
    expect(response.pagination).toEqual({
      page: 1,
      pageSize: 10,
      totalItems: 1,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    });
  });

  it('permanently deletes an internal user without historical records', async () => {
    prisma.user.findFirst.mockResolvedValue({
      id: 'user-3',
      userId: 'staff.clean',
      isActive: true,
      createdReservations: [],
      createdRentals: [],
      createdTransfers: [],
    });
    prisma.internalSession.updateMany.mockResolvedValue({ count: 2 });
    prisma.internalUserDeletionAuditLog.create.mockResolvedValue({
      id: 'audit-1',
      mode: 'DELETED',
    });
    prisma.user.delete.mockResolvedValue({ id: 'user-3' });

    const response = await service.remove('user-3', actor);

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.internalSession.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user-3', revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    });
    expect(prisma.internalUserDeletionAuditLog.create).toHaveBeenCalledWith({
      data: {
        actorUserId: actor.id,
        actorUserIdentifier: actor.userId,
        targetUserId: 'user-3',
        targetUserIdentifier: 'staff.clean',
        mode: 'DELETED',
        summary:
          'Conta eliminada permanentemente por nao possuir historico a reter.',
      },
    });
    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: 'user-3' },
    });
    expect(response).toEqual({
      message: 'Utilizador removido permanentemente com sucesso.',
      mode: 'DELETED',
      userId: 'staff.clean',
    });
  });

  it('deactivates an internal user when history must be retained', async () => {
    prisma.user.findFirst.mockResolvedValue({
      id: 'user-4',
      userId: 'staff.history',
      isActive: true,
      createdReservations: [{ id: 'res-1', status: 'COMPLETED' }],
      createdRentals: [],
      createdTransfers: [],
    });
    prisma.user.update.mockResolvedValue({ id: 'user-4', isActive: false });
    prisma.internalSession.updateMany.mockResolvedValue({ count: 1 });
    prisma.internalUserDeletionAuditLog.create.mockResolvedValue({
      id: 'audit-2',
      mode: 'DEACTIVATED',
    });

    const response = await service.remove('user-4', actor);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-4' },
      data: { isActive: false },
    });
    expect(prisma.user.delete).not.toHaveBeenCalled();
    expect(prisma.internalUserDeletionAuditLog.create).toHaveBeenCalledWith({
      data: {
        actorUserId: actor.id,
        actorUserIdentifier: actor.userId,
        targetUserId: 'user-4',
        targetUserIdentifier: 'staff.history',
        mode: 'DEACTIVATED',
        summary:
          'Conta desativada para reter historico existente e remover o acesso imediato.',
      },
    });
    expect(response).toEqual({
      message:
        'Utilizador desativado temporariamente devido a retencao de historico.',
      mode: 'DEACTIVATED',
      userId: 'staff.history',
    });
  });

  it('rejects deletion when the target user is already inactive', async () => {
    prisma.user.findFirst.mockResolvedValue({
      id: 'user-5',
      userId: 'staff.inactive',
      isActive: false,
      createdReservations: [],
      createdRentals: [],
      createdTransfers: [],
    });

    await expect(service.remove('user-5', actor)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.user.delete).not.toHaveBeenCalled();
  });

  it('blocks deletion while the user still owns active operational records', async () => {
    prisma.user.findFirst.mockResolvedValue({
      id: 'user-6',
      userId: 'staff.busy',
      isActive: true,
      createdReservations: [{ id: 'res-2', status: 'CONFIRMED' }],
      createdRentals: [],
      createdTransfers: [],
    });

    await expect(service.remove('user-6', actor)).rejects.toBeInstanceOf(
      ConflictException,
    );

    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.user.delete).not.toHaveBeenCalled();
    expect(prisma.internalUserDeletionAuditLog.create).not.toHaveBeenCalled();
  });
});
