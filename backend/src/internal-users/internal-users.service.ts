import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InternalUserRole } from './internal-user.enums';
import { AuthenticatedUserDto } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInternalUserDto } from './dto/create-internal-user.dto';
import { CreateInternalUserResponseDto } from './dto/create-internal-user-response.dto';
import {
  DeleteInternalUserResponseDto,
  InternalUserDeletionMode,
} from './dto/delete-internal-user-response.dto';
import { ListInternalUsersResponseDto } from './dto/list-internal-users-response.dto';
import {
  getInitialStatusForRole,
  getPermissionsForRole,
  requiresItValidation,
} from './internal-user-access';
import { normalizeCreateInternalUserInput } from './internal-user-validation';
import { PasswordHasherService } from './password-hasher.service';

// Application service for internal-user provisioning and lifecycle actions.
@Injectable()
export class InternalUsersService {
  private static readonly DEFAULT_PAGE = 1;
  private static readonly DEFAULT_PAGE_SIZE = 10;
  private static readonly MAX_PAGE_SIZE = 20;
  private readonly logger = new Logger(InternalUsersService.name);

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

    const user = await this.prisma.user.create({
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
        // Pending validation users can authenticate with limited access; blocked
        // accounts are represented separately through isActive = false.
        isActive: true,
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
    const existingUser = await this.prisma.user.findUnique({
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

  async findAll(
    pageInput?: number | string,
    pageSizeInput?: number | string,
    searchInput?: string,
  ): Promise<ListInternalUsersResponseDto> {
    const page = normalizePositiveInteger(
      pageInput,
      InternalUsersService.DEFAULT_PAGE,
    );
    const pageSize = Math.min(
      normalizePositiveInteger(
        pageSizeInput,
        InternalUsersService.DEFAULT_PAGE_SIZE,
      ),
      InternalUsersService.MAX_PAGE_SIZE,
    );
    const searchTerm = normalizeSearchTerm(searchInput);
    const skip = (page - 1) * pageSize;
    const where = buildInternalUserDirectoryWhere(searchTerm);

    // The IT directory can grow large, so the API returns both the current slice
    // and enough metadata for the client to page or search without loading
    // every account into the browser first.
    const [totalItems, items] = await this.prisma.$transaction([
      this.prisma.user.count({
        where,
      }),
      this.prisma.user.findMany({
        where,
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
        skip,
        take: pageSize,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    this.logger.log(
      `Found ${items.length} internal users on page ${page} of ${totalPages}${searchTerm ? ` for search "${searchTerm}"` : ''}.`,
    );

    return {
      items,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };
  }

  async remove(
    id: string,
    actor: AuthenticatedUserDto,
  ): Promise<DeleteInternalUserResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { id, isInternal: true },
      select: {
        id: true,
        userId: true,
        isActive: true,
        createdReservations: {
          select: { id: true, status: true },
        },
        createdRentals: {
          select: { id: true, status: true },
        },
        createdTransfers: {
          select: { id: true, status: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Utilizador interno nao encontrado.');
    }

    if (!user.isActive) {
      throw new NotFoundException(
        'O utilizador indicado ja foi removido ou desativado.',
      );
    }

    const hasActiveReservations = user.createdReservations.some(
      (res) => res.status === 'CONFIRMED' || res.status === 'DRAFT',
    );
    const hasActiveRentals = user.createdRentals.some(
      (rental) => rental.status === 'OPEN',
    );
    const hasActiveTransfers = user.createdTransfers.some(
      (transfer) =>
        transfer.status === 'PENDING' || transfer.status === 'IN_TRANSIT',
    );

    if (hasActiveReservations || hasActiveRentals || hasActiveTransfers) {
      throw new ConflictException(
        'Nao foi possivel eliminar ou desativar: o utilizador possui contratos ou reservas ativas.',
      );
    }

    const targetUserId = user.userId ?? id;
    const hasHistory =
      user.createdReservations.length > 0 ||
      user.createdRentals.length > 0 ||
      user.createdTransfers.length > 0;

    if (hasHistory) {
      return this.softDeleteUser(id, targetUserId, actor);
    }

    return this.deleteUser(id, targetUserId, actor);
  }

  private async softDeleteUser(
    id: string,
    targetUserId: string,
    actor: AuthenticatedUserDto,
  ): Promise<DeleteInternalUserResponseDto> {
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id },
        data: { isActive: false },
      }),
      this.prisma.internalSession.updateMany({
        where: { userId: id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
      this.prisma.internalUserDeletionAuditLog.create({
        data: this.buildDeletionAuditEntry({
          actor,
          targetUserId: id,
          targetUserIdentifier: targetUserId,
          mode: 'DEACTIVATED',
          summary:
            'Conta desativada para reter historico existente e remover o acesso imediato.',
        }),
      }),
    ]);

    this.logger.log(
      `Internal user ${targetUserId} (${id}) was deactivated by ${actor.userId}.`,
    );

    return {
      message:
        'Utilizador desativado temporariamente devido a retencao de historico.',
      mode: 'DEACTIVATED',
      userId: targetUserId,
    };
  }

  private async deleteUser(
    id: string,
    targetUserId: string,
    actor: AuthenticatedUserDto,
  ): Promise<DeleteInternalUserResponseDto> {
    await this.prisma.$transaction([
      this.prisma.internalSession.updateMany({
        where: { userId: id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
      this.prisma.internalUserDeletionAuditLog.create({
        data: this.buildDeletionAuditEntry({
          actor,
          targetUserId: id,
          targetUserIdentifier: targetUserId,
          mode: 'DELETED',
          summary:
            'Conta eliminada permanentemente por nao possuir historico a reter.',
        }),
      }),
      this.prisma.user.delete({ where: { id } }),
    ]);

    this.logger.log(
      `Internal user ${targetUserId} (${id}) was permanently deleted by ${actor.userId}.`,
    );

    return {
      message: 'Utilizador removido permanentemente com sucesso.',
      mode: 'DELETED',
      userId: targetUserId,
    };
  }

  private buildDeletionAuditEntry(input: {
    actor: AuthenticatedUserDto;
    targetUserId: string;
    targetUserIdentifier: string;
    mode: InternalUserDeletionMode;
    summary: string;
  }) {
    return {
      actorUserId: input.actor.id,
      actorUserIdentifier: input.actor.userId,
      targetUserId: input.targetUserId,
      targetUserIdentifier: input.targetUserIdentifier,
      mode: toDeletionAuditMode(input.mode),
      summary: input.summary,
    };
  }
}

function getCreationMessage(role: InternalUserRole): string {
  return requiresItValidation(role)
    ? 'Utilizador criado com sucesso, mas a conta fica pendente de validacao do IT.'
    : 'Utilizador criado com sucesso.';
}

function toDeletionAuditMode(
  mode: InternalUserDeletionMode,
): 'DEACTIVATED' | 'DELETED' {
  return mode === 'DEACTIVATED'
    ? 'DEACTIVATED'
    : 'DELETED';
}

function normalizePositiveInteger(
  input: number | string | undefined,
  fallback: number,
): number {
  const normalizedValue =
    typeof input === 'string' ? Number.parseInt(input, 10) : input;

  if (
    typeof normalizedValue === 'number' &&
    Number.isInteger(normalizedValue) &&
    normalizedValue > 0
  ) {
    return normalizedValue;
  }

  return fallback;
}

function normalizeSearchTerm(input: string | undefined): string | undefined {
  if (typeof input !== 'string') {
    return undefined;
  }

  const normalizedValue = input.trim();

  return normalizedValue ? normalizedValue : undefined;
}

function buildInternalUserDirectoryWhere(
  searchTerm?: string,
): Record<string, unknown> {
  if (!searchTerm) {
    return {
      isInternal: true,
    };
  }

  return {
    isInternal: true,
    userId: {
      contains: searchTerm,
      mode: 'insensitive',
    },
  };
}
