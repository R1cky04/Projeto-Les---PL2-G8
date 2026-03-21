import { InternalUserRole, InternalUserStatus } from '@prisma/client';
import { PasswordHasherService } from '../internal-users/password-hasher.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthBootstrapService } from './auth-bootstrap.service';

// Bootstrap tests ensure the development login account is created predictably.
describe('AuthBootstrapService', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalBootstrapFlag = process.env.ENABLE_MASTER_IT_BOOTSTRAP;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.ENABLE_MASTER_IT_BOOTSTRAP = originalBootstrapFlag;
  });

  it('creates the master IT account in development when missing', async () => {
    process.env.NODE_ENV = 'development';
    process.env.ENABLE_MASTER_IT_BOOTSTRAP = 'true';

    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 'user-1' }),
      },
    };
    const passwordHasher = new PasswordHasherService();
    const service = new AuthBootstrapService(
      prisma as unknown as PrismaService,
      passwordHasher,
    );

    await service.onApplicationBootstrap();

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'it.master',
        internalRole: InternalUserRole.IT,
        internalStatus: InternalUserStatus.ACTIVE,
        isInternal: true,
        isActive: true,
      }),
    });
  });
});
