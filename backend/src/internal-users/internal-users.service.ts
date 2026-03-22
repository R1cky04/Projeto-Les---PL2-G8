import { ConflictException, Injectable } from '@nestjs/common';
import { InternalUserRole } from './internal-user.enums';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInternalUserDto } from './dto/create-internal-user.dto';
import { CreateInternalUserResponseDto } from './dto/create-internal-user-response.dto';
import {
  getInitialStatusForRole,
  getPermissionsForRole,
  requiresItValidation,
} from './internal-user-access';
import { normalizeCreateInternalUserInput } from './internal-user-validation';
import { PasswordHasherService } from './password-hasher.service';

// Application service for internal user provisioning.
@Injectable()
export class InternalUsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordHasher: PasswordHasherService,
  ) {}

  async create(
    payload: CreateInternalUserDto,
  ): Promise<CreateInternalUserResponseDto> {
    const input = normalizeCreateInternalUserInput(payload);

    await this.ensureUserIdIsUnique(input.userId);

    const permissions = getPermissionsForRole(input.role);
    const pendingValidation = requiresItValidation(input.role);
    const passwordHash = this.passwordHasher.hash(input.password);

    const user = await (this.prisma as any).user.create({
      data: {
        userId: input.userId,
        passwordHash,
        // The flow does not collect a display name yet; keep a stable placeholder.
        fullName: input.userId,
        isInternal: true,
        internalRole: input.role,
        internalStatus: getInitialStatusForRole(input.role),
        permissions,
        requiresItValidation: pendingValidation,
        isActive: !pendingValidation,
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
    });

    return {
      message: getCreationMessage(input.role),
      user: {
        id: user.id,
        userId: user.userId ?? '',
        role: user.internalRole ?? InternalUserRole.STAFF,
        status: user.internalStatus,
        permissions: user.permissions,
        requiresItValidation: user.requiresItValidation,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    };
  }

  private async ensureUserIdIsUnique(userId: string) {
    // Keep the failure deterministic and user-friendly before hitting the unique index.
    const existingUser = await (this.prisma as any).user.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException({
        message: 'O User ID indicado ja existe.',
        code: 'USER_ID_ALREADY_EXISTS',
      });
    }
  }
}

function getCreationMessage(role: InternalUserRole): string {
  return requiresItValidation(role)
    ? 'Utilizador criado com sucesso, mas a conta fica pendente de validacao do IT.'
    : 'Utilizador criado com sucesso.';
}
