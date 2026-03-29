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
    internalUserManagementAuditLog: {
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
      internalUserManagementAuditLog: {
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
    expect(createCall.data.permissions).not.toContain(
      InternalPermission.USER_CREATE,
    );
    expect(createCall.data.permissions).not.toContain(
      InternalPermission.USER_ACTIVATE,
    );
    expect(createCall.data.passwordHash).not.toBe('StrongPwd1!');
    expect(
      passwordHasher.verify('StrongPwd1!', createCall.data.passwordHash),
    ).toBe(true);

    expect(response.message).toBe('Utilizador criado com sucesso.');
    expect(response.user.role).toBe(InternalUserRole.ADMIN);
    expect(response.user.status).toBe(InternalUserStatus.ACTIVE);
  });

  it('rejects attempts to create reserved IT accounts', async () => {
    await expect(
      service.create({
        userId: 'it.shadow',
        password: 'StrongPwd1!',
        role: 'IT',
      } as any),
    ).rejects.toThrow('Existem erros de validacao.');

    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();
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

  it('updates an internal user and records the management audit trail', async () => {
    prisma.user.findFirst.mockResolvedValue({
      id: 'user-9',
      userId: 'staff.alpha',
      internalRole: InternalUserRole.STAFF,
      internalStatus: InternalUserStatus.PENDING_IT_VALIDATION,
      permissions: [
        InternalPermission.RESERVATION_READ,
        InternalPermission.RENTAL_READ,
      ],
      requiresItValidation: true,
      isActive: true,
      createdAt: new Date('2026-03-22T09:00:00.000Z'),
      createdReservations: [],
      createdRentals: [],
      createdTransfers: [],
    });
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.update.mockResolvedValue({
      id: 'user-9',
      userId: 'admin.alpha',
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
      ],
      requiresItValidation: false,
      isActive: true,
      createdAt: new Date('2026-03-22T09:00:00.000Z'),
    });
    prisma.internalSession.updateMany.mockResolvedValue({ count: 1 });
    prisma.internalUserManagementAuditLog.create.mockResolvedValue({
      id: 'audit-manage-1',
      outcome: 'UPDATED',
    });

    const response = await service.update(
      'user-9',
      {
        userId: 'Admin.Alpha',
        password: 'NewStrong1!',
        role: 'ADMIN',
        status: 'ACTIVE',
        isActive: true,
      },
      actor,
    );

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { userId: 'admin.alpha' },
      select: { id: true },
    });
    expect(prisma.user.update).toHaveBeenCalledTimes(1);
    const updateCall = prisma.user.update.mock.calls[0][0];
    expect(updateCall.where).toEqual({ id: 'user-9' });
    expect(updateCall.data).toMatchObject({
      userId: 'admin.alpha',
      fullName: 'admin.alpha',
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
      ],
      requiresItValidation: false,
      isActive: true,
      passwordHash: expect.any(String),
    });
    expect(updateCall.data.passwordHash).not.toBe('NewStrong1!');
    expect(
      passwordHasher.verify('NewStrong1!', updateCall.data.passwordHash),
    ).toBe(true);
    expect(updateCall.select).toEqual({
      id: true,
      userId: true,
      internalRole: true,
      internalStatus: true,
      permissions: true,
      requiresItValidation: true,
      isActive: true,
      createdAt: true,
    });
    expect(prisma.internalSession.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user-9', revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    });
    expect(prisma.internalUserManagementAuditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        actorUserId: actor.id,
        actorUserIdentifier: actor.userId,
        targetUserId: 'user-9',
        targetUserIdentifier: 'admin.alpha',
        outcome: 'UPDATED',
      }),
    });
    expect(response).toMatchObject({
      message: 'Utilizador atualizado com sucesso.',
      outcome: 'UPDATED',
      warnings: [],
      user: {
        id: 'user-9',
        userId: 'admin.alpha',
        internalRole: InternalUserRole.ADMIN,
        internalStatus: InternalUserStatus.ACTIVE,
        requiresItValidation: false,
        isActive: true,
      },
    });
  });

  it('applies a partial update when promotion to IT is requested', async () => {
    prisma.user.findFirst.mockResolvedValue({
      id: 'user-10',
      userId: 'staff.beta',
      internalRole: InternalUserRole.STAFF,
      internalStatus: InternalUserStatus.PENDING_IT_VALIDATION,
      permissions: [
        InternalPermission.RESERVATION_READ,
        InternalPermission.RENTAL_READ,
      ],
      requiresItValidation: true,
      isActive: true,
      createdAt: new Date('2026-03-22T09:30:00.000Z'),
      createdReservations: [],
      createdRentals: [],
      createdTransfers: [],
    });
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.update.mockResolvedValue({
      id: 'user-10',
      userId: 'staff.beta.renamed',
      internalRole: InternalUserRole.STAFF,
      internalStatus: InternalUserStatus.ACTIVE,
      permissions: [
        InternalPermission.RESERVATION_READ,
        InternalPermission.RENTAL_READ,
      ],
      requiresItValidation: true,
      isActive: true,
      createdAt: new Date('2026-03-22T09:30:00.000Z'),
    });
    prisma.internalSession.updateMany.mockResolvedValue({ count: 1 });
    prisma.internalUserManagementAuditLog.create.mockResolvedValue({
      id: 'audit-manage-2',
      outcome: 'PARTIAL',
    });

    const response = await service.update(
      'user-10',
      {
        userId: 'staff.beta.renamed',
        role: 'IT',
        status: 'ACTIVE',
        isActive: true,
      },
      actor,
    );

    expect(response.outcome).toBe('PARTIAL');
    expect(response.user.userId).toBe('staff.beta.renamed');
    expect(response.user.internalRole).toBe(InternalUserRole.STAFF);
    expect(response.warnings).toContain(
      'A promocao para IT e reservada ao administrador master. O tipo de utilizador foi preservado.',
    );
    expect(prisma.internalSession.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user-10', revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    });
  });

  it('preserves protected access fields when the selected account already belongs to IT', async () => {
    prisma.user.findFirst.mockResolvedValue({
      id: 'user-13',
      userId: 'it.delegate',
      internalRole: InternalUserRole.IT,
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
      createdAt: new Date('2026-03-22T09:45:00.000Z'),
      createdReservations: [],
      createdRentals: [],
      createdTransfers: [],
    });
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.update.mockResolvedValue({
      id: 'user-13',
      userId: 'it.delegate.renamed',
      internalRole: InternalUserRole.IT,
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
      createdAt: new Date('2026-03-22T09:45:00.000Z'),
    });
    prisma.internalSession.updateMany.mockResolvedValue({ count: 1 });
    prisma.internalUserManagementAuditLog.create.mockResolvedValue({
      id: 'audit-manage-4',
      outcome: 'PARTIAL',
    });

    const response = await service.update(
      'user-13',
      {
        userId: 'it.delegate.renamed',
        role: 'ADMIN',
        status: 'PENDING_IT_VALIDATION',
        isActive: false,
      },
      actor,
    );

    expect(response.outcome).toBe('PARTIAL');
    expect(response.user.internalRole).toBe(InternalUserRole.IT);
    expect(response.user.permissions).toEqual([
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
    ]);
    expect(response.warnings).toContain(
      'As contas com perfil IT sao reservadas. O tipo, o estado, a ativacao e as permissoes herdadas dessa conta foram preservados.',
    );
  });

  it('preserves access controls when operational records are still active', async () => {
    prisma.user.findFirst.mockResolvedValue({
      id: 'user-11',
      userId: 'fleet.busy',
      internalRole: InternalUserRole.FLEET,
      internalStatus: InternalUserStatus.ACTIVE,
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
      createdAt: new Date('2026-03-22T10:00:00.000Z'),
      createdReservations: [{ id: 'res-active', status: 'CONFIRMED' }],
      createdRentals: [],
      createdTransfers: [],
    });
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.update.mockResolvedValue({
      id: 'user-11',
      userId: 'fleet.busy.ops',
      internalRole: InternalUserRole.FLEET,
      internalStatus: InternalUserStatus.ACTIVE,
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
      createdAt: new Date('2026-03-22T10:00:00.000Z'),
    });
    prisma.internalSession.updateMany.mockResolvedValue({ count: 1 });
    prisma.internalUserManagementAuditLog.create.mockResolvedValue({
      id: 'audit-manage-3',
      outcome: 'PARTIAL',
    });

    const response = await service.update(
      'user-11',
      {
        userId: 'fleet.busy.ops',
        role: 'ADMIN',
        status: 'PENDING_IT_VALIDATION',
        isActive: false,
      },
      actor,
    );

    expect(response.outcome).toBe('PARTIAL');
    expect(response.user.userId).toBe('fleet.busy.ops');
    expect(response.user.internalRole).toBe(InternalUserRole.FLEET);
    expect(response.user.internalStatus).toBe(InternalUserStatus.ACTIVE);
    expect(response.user.isActive).toBe(true);
    expect(response.warnings).toContain(
      'O tipo de utilizador foi preservado porque a conta ainda possui contratos, reservas ou transferencias ativas.',
    );
    expect(response.warnings).toContain(
      'A ativacao da conta foi preservada porque existem registos operacionais ativos associados ao utilizador.',
    );
  });

  it('rejects updates when the requested User ID already exists', async () => {
    prisma.user.findFirst.mockResolvedValue({
      id: 'user-12',
      userId: 'staff.gamma',
      internalRole: InternalUserRole.STAFF,
      internalStatus: InternalUserStatus.ACTIVE,
      permissions: [
        InternalPermission.RESERVATION_READ,
        InternalPermission.RENTAL_READ,
      ],
      requiresItValidation: true,
      isActive: true,
      createdAt: new Date('2026-03-22T10:30:00.000Z'),
      createdReservations: [],
      createdRentals: [],
      createdTransfers: [],
    });
    prisma.user.findUnique.mockResolvedValue({ id: 'some-other-user' });

    await expect(
      service.update(
        'user-12',
        {
          userId: 'already.used',
          role: 'STAFF',
          status: 'ACTIVE',
          isActive: true,
        },
        actor,
      ),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.internalUserManagementAuditLog.create).not.toHaveBeenCalled();
  });

  it('rejects updates for users that do not exist', async () => {
    prisma.user.findFirst.mockResolvedValue(null);

    await expect(
      service.update(
        'missing-user',
        {
          userId: 'missing.user',
          role: 'STAFF',
          status: 'ACTIVE',
          isActive: true,
        },
        actor,
      ),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('blocks self-management through the IT update flow', async () => {
    await expect(
      service.update(
        actor.id,
        {
          userId: 'it.master.renamed',
          role: 'IT',
          status: 'ACTIVE',
          isActive: true,
        },
        actor,
      ),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prisma.user.findFirst).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
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

  it('rejects weak password changes before updating an existing user', async () => {
    await expect(
      service.update(
        'user-weak-update',
        {
          userId: 'staff.weak',
          password: '1234',
          role: 'STAFF',
          status: 'ACTIVE',
          isActive: true,
        },
        actor,
      ),
    ).rejects.toThrow('Existem erros de validacao.');

    expect(prisma.user.findFirst).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
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
