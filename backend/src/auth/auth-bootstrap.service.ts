import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import {
  InternalUserRole,
  InternalUserStatus,
} from '../internal-users/internal-user.enums';
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

    if ((this.prisma as any).user) {
      const existingUser = await (this.prisma as any).user.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (existingUser) {
        return;
      }

      await (this.prisma as any).user.create({
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

      return;
    }

    // Fallback path for environments where generated delegates are incomplete.
    const existingRows = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT id
      FROM "User"
      WHERE "userId" = ${userId}
      LIMIT 1
    `;

    if (existingRows.length > 0) {
      return;
    }

    await this.prisma.$executeRaw`
      INSERT INTO "User" (
        id,
        "userId",
        "passwordHash",
        "fullName",
        "isInternal",
        "isActive",
        "internalRole",
        "internalStatus",
        "requiresItValidation",
        permissions,
        "createdAt",
        "updatedAt"
      )
      VALUES (
        md5(random()::text || clock_timestamp()::text),
        ${userId},
        ${this.passwordHasher.hash(password)},
        'Master IT',
        true,
        true,
        ${InternalUserRole.IT}::"InternalUserRole",
        ${InternalUserStatus.ACTIVE}::"InternalUserStatus",
        false,
        ARRAY[]::"InternalPermission"[],
        NOW(),
        NOW()
      )
    `;
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
