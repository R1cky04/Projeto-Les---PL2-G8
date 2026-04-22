import {
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  InternalPermission,
  InternalUserRole,
  InternalUserStatus,
} from '../internal-users/internal-user.enums';
import { PasswordHasherService } from '../internal-users/password-hasher.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { AuthTokenService } from './auth-token.service';

// Service tests cover the sprint's main login outcomes and session rules.
describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    $queryRaw: jest.Mock;
    $executeRaw: jest.Mock;
  };
  let passwordHasher: PasswordHasherService;
  let authTokenService: {
    issueToken: jest.Mock;
    parseToken: jest.Mock;
    verifySecret: jest.Mock;
  };

  beforeEach(() => {
    prisma = {
      $queryRaw: jest.fn(),
      $executeRaw: jest.fn(),
    };
    passwordHasher = new PasswordHasherService();
    authTokenService = {
      issueToken: jest.fn(),
      parseToken: jest.fn(),
      verifySecret: jest.fn(),
    };

    service = new AuthService(
      prisma as unknown as PrismaService,
      passwordHasher,
      authTokenService as unknown as AuthTokenService,
    );
  });

  it('logs in an active IT user and returns a full-access session', async () => {
    prisma.$queryRaw
      .mockResolvedValueOnce([
        {
          id: 'user-1',
          userId: 'it.master',
          fullName: 'Master IT',
          passwordHash: passwordHasher.hash('ItMaster1!'),
          isInternal: true,
          isActive: true,
          internalRole: InternalUserRole.IT,
          internalStatus: InternalUserStatus.ACTIVE,
          permissions: [],
        },
      ])
      .mockResolvedValueOnce([{ total: 0n }])
      .mockResolvedValueOnce([{ id: 'session-1' }]);
    authTokenService.issueToken.mockReturnValue({
      rawToken: 'token-1.secret',
      tokenId: 'token-1',
      tokenHash: 'hashed-secret',
    });

    const response = await service.login({
      userId: 'It.Master',
      password: 'ItMaster1!',
    });

    expect(response.message).toBe('Login efetuado com sucesso.');
    expect(response.session.token).toBe('token-1.secret');
    expect(response.session.warnings).toEqual([]);
    expect(response.user.accessLevel).toBe('FULL');
    expect(response.features).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'INTERNAL_USERS',
          status: 'AVAILABLE',
        }),
      ]),
    );
    expect(prisma.$queryRaw).toHaveBeenCalledTimes(3);
  });

  it('logs in a pending staff user with limited access and warning state', async () => {
    prisma.$queryRaw
      .mockResolvedValueOnce([
        {
          id: 'user-2',
          userId: 'staff.porto',
          fullName: 'Staff Porto',
          passwordHash: passwordHasher.hash('StrongPwd1!'),
          isInternal: true,
          isActive: true,
          internalRole: InternalUserRole.STAFF,
          internalStatus: InternalUserStatus.PENDING_IT_VALIDATION,
          permissions: [
            InternalPermission.RESERVATION_READ,
            InternalPermission.RENTAL_READ,
          ],
        },
      ])
      .mockResolvedValueOnce([{ total: 1n }])
      .mockResolvedValueOnce([{ id: 'session-2' }]);
    authTokenService.issueToken.mockReturnValue({
      rawToken: 'token-2.secret',
      tokenId: 'token-2',
      tokenHash: 'hashed-secret-2',
    });

    const response = await service.login({
      userId: 'staff.porto',
      password: 'StrongPwd1!',
    });

    expect(response.message).toBe('Login efetuado com acesso limitado.');
    expect(response.user.accessLevel).toBe('LIMITED');
    expect(response.session.concurrentSessionCount).toBe(1);
    expect(response.session.warnings).toEqual(
      expect.arrayContaining([
        expect.stringContaining('acesso limitado'),
        expect.stringContaining('sessao ativa'),
      ]),
    );
    expect(response.features).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'RESERVATIONS',
          status: 'LIMITED',
        }),
      ]),
    );
  });

  it('rejects invalid credentials', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([
      {
        id: 'user-3',
        userId: 'admin.lisboa',
        fullName: 'Admin Lisboa',
        passwordHash: passwordHasher.hash('DifferentPwd1!'),
        isInternal: true,
        isActive: true,
        internalRole: InternalUserRole.ADMIN,
        internalStatus: InternalUserStatus.ACTIVE,
        permissions: [],
      },
    ]);

    await expect(
      service.login({
        userId: 'admin.lisboa',
        password: 'StrongPwd1!',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
  });

  it('rejects blocked accounts even when credentials are valid', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([
      {
        id: 'user-4',
        userId: 'fleet.sul',
        fullName: 'Fleet Sul',
        passwordHash: passwordHasher.hash('StrongPwd1!'),
        isInternal: true,
        isActive: false,
        internalRole: InternalUserRole.FLEET,
        internalStatus: InternalUserStatus.ACTIVE,
        permissions: [],
      },
    ]);

    await expect(
      service.login({
        userId: 'fleet.sul',
        password: 'StrongPwd1!',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejects legacy blocked statuses even when the active flag remains true', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([
      {
        id: 'user-5',
        userId: 'staff.legacy',
        fullName: 'Staff Legacy',
        passwordHash: passwordHasher.hash('StrongPwd1!'),
        isInternal: true,
        isActive: true,
        internalRole: InternalUserRole.STAFF,
        internalStatus: InternalUserStatus.BLOCKED,
        permissions: [],
      },
    ]);

    await expect(
      service.login({
        userId: 'staff.legacy',
        password: 'StrongPwd1!',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('restores a session from a valid bearer token', async () => {
    authTokenService.parseToken.mockReturnValue({
      tokenId: 'token-restore',
      secret: 'secret-restore',
    });
    authTokenService.verifySecret.mockReturnValue(true);
    prisma.$queryRaw
      .mockResolvedValueOnce([
        {
          sessionId: 'session-restore',
          tokenId: 'token-restore',
          tokenHash: 'stored-hash',
          expiresAt: new Date('2026-12-25T12:00:00.000Z'),
          revokedAt: null,
          userPkId: 'user-restore',
          userId: 'admin.restore',
          fullName: 'Admin Restore',
          isActive: true,
          isInternal: true,
          internalRole: InternalUserRole.ADMIN,
          internalStatus: InternalUserStatus.ACTIVE,
          permissions: [
            InternalPermission.RESERVATION_READ,
            InternalPermission.RENTAL_READ,
          ],
        },
      ])
      .mockResolvedValueOnce([{ total: 1n }]);
    prisma.$executeRaw.mockResolvedValue(1);

    const context = await service.authenticateSessionToken(
      'token-restore.secret-restore',
    );

    expect(context.sessionId).toBe('session-restore');
    expect(context.user.role).toBe(InternalUserRole.ADMIN);
    expect(context.warnings).toEqual(
      expect.arrayContaining([expect.stringContaining('sessao ativa')]),
    );
    expect(prisma.$executeRaw).toHaveBeenCalledTimes(1);
  });

  it('revokes the current session on logout', async () => {
    prisma.$executeRaw.mockResolvedValue(1);

    const response = await service.logoutCurrentSession({
      sessionId: 'session-logout',
      tokenId: 'token-logout',
      expiresAt: new Date('2026-12-25T12:00:00.000Z'),
      concurrentSessionCount: 0,
      warnings: [],
      user: {
        id: 'user-logout',
        userId: 'it.master',
        fullName: 'Master IT',
        role: InternalUserRole.IT,
        status: InternalUserStatus.ACTIVE,
        isActive: true,
        accessLevel: 'FULL',
        permissions: [],
      },
      features: [],
    });

    expect(response.message).toBe('Sessao terminada com sucesso.');
    expect(prisma.$executeRaw).toHaveBeenCalledTimes(1);
  });
});
