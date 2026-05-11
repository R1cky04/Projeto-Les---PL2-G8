import type { ExecutionContext } from '@nestjs/common';
import type {
  AuthenticatedFeatureDto,
  AuthenticatedRequest,
  AuthenticatedSessionContext,
  AuthenticatedUserDto,
} from '../../src/auth/auth.types';
import {
  InternalPermission,
  InternalUserRole,
  InternalUserStatus,
} from '../../src/internal-users/internal-user.enums';

export const CONTRACT_FEATURES: AuthenticatedFeatureDto[] = [
  {
    key: 'INTERNAL_USERS',
    label: 'Utilizadores internos',
    description: 'Gestao de contas internas',
    status: 'AVAILABLE',
  },
  {
    key: 'RESERVATIONS',
    label: 'Reservas',
    description: 'Gestao operacional de reservas',
    status: 'AVAILABLE',
  },
  {
    key: 'RENTALS',
    label: 'Contratos',
    description: 'Gestao operacional de contratos',
    status: 'AVAILABLE',
  },
  {
    key: 'VEHICLES',
    label: 'Veiculos',
    description: 'Gestao da frota',
    status: 'AVAILABLE',
  },
  {
    key: 'FLEET_OPERATIONS',
    label: 'Operacoes de frota',
    description: 'Transferencias e disponibilidade',
    status: 'AVAILABLE',
  },
];

export function buildContractUser(
  overrides: Partial<AuthenticatedUserDto> = {},
): AuthenticatedUserDto {
  return {
    id: 'user-contract',
    userId: 'it.contract',
    fullName: 'IT Contract',
    role: InternalUserRole.IT,
    status: InternalUserStatus.ACTIVE,
    isActive: true,
    accessLevel: 'FULL',
    permissions: Object.values(InternalPermission),
    ...overrides,
  };
}

export function buildContractSession(
  userOverrides: Partial<AuthenticatedUserDto> = {},
): AuthenticatedSessionContext {
  return {
    sessionId: 'session-contract',
    tokenId: 'token-contract',
    expiresAt: new Date('2026-12-31T00:00:00.000Z'),
    concurrentSessionCount: 0,
    warnings: [],
    features: CONTRACT_FEATURES,
    user: buildContractUser(userOverrides),
  };
}

export function createContractAuthGuard(
  getUserOverrides: () => Partial<AuthenticatedUserDto> = () => ({}),
) {
  return {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
      request.auth = buildContractSession(getUserOverrides());

      return true;
    },
  };
}
