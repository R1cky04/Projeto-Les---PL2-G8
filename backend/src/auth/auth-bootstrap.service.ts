import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InternalUserRole, InternalUserStatus } from '@prisma/client';
import { getPermissionsForRole } from '../internal-users/internal-user-access';
import { PasswordHasherService } from '../internal-users/password-hasher.service';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_MASTER_IT_USER_ID = 'it.master';
const DEFAULT_MASTER_IT_PASSWORD = 'ItMaster1!';

// Development bootstrap so the login flow is usable without a manual seed step.
@Injectable()
export class AuthBootstrapService implements OnApplicationBootstrap {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordHasher: PasswordHasherService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (!this.shouldBootstrapMasterIt()) {
      return;
    }

    const userId = (
      process.env.MASTER_IT_USER_ID ?? DEFAULT_MASTER_IT_USER_ID
    ).trim().toLowerCase();
    const password =
      process.env.MASTER_IT_PASSWORD ?? DEFAULT_MASTER_IT_PASSWORD;

    const existingUser = await this.prisma.user.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (existingUser) {
      return;
    }

    await this.prisma.user.create({
      data: {
        userId,
        passwordHash: this.passwordHasher.hash(password),
        fullName: 'Master IT',
        isInternal: true,
        isActive: true,
        internalRole: InternalUserRole.IT,
        internalStatus: InternalUserStatus.ACTIVE,
        requiresItValidation: false,
        permissions: getPermissionsForRole(InternalUserRole.IT),
      },
    });
  }

  private shouldBootstrapMasterIt(): boolean {
    if (process.env.NODE_ENV === 'test') {
      return false;
    }

    const configuredValue = process.env.ENABLE_MASTER_IT_BOOTSTRAP;

    if (configuredValue === undefined) {
      return process.env.NODE_ENV !== 'production';
    }

    return configuredValue.trim().toLowerCase() === 'true';
  }
}
