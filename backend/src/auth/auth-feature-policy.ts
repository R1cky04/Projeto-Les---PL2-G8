import {
  InternalPermission,
  InternalUserRole,
} from '../internal-users/internal-user.enums';
import {
  AuthenticatedFeatureDto,
  AuthenticatedUserDto,
  FEATURE_KEYS,
  InternalFeatureKey,
  SessionAccessLevel,
} from './auth.types';

interface FeatureDefinition {
  key: InternalFeatureKey;
  label: string;
  description: string;
  isEntitled: (user: AuthenticatedUserDto) => boolean;
}

const FEATURE_DEFINITIONS: FeatureDefinition[] = [
  {
    key: 'INTERNAL_USERS',
    label: 'Internal Users',
    description: 'Gestao de contas internas, ativacao e controlo de acessos.',
    isEntitled: (user) => user.role === InternalUserRole.IT,
  },
  {
    key: 'CUSTOMERS',
    label: 'Customers',
    description: 'Consulta e apoio operacional a perfis de cliente.',
    isEntitled: (user) =>
      user.role === InternalUserRole.IT ||
      user.role === InternalUserRole.ADMIN ||
      user.role === InternalUserRole.STAFF,
  },
  {
    key: 'RESERVATIONS',
    label: 'Reservations',
    description: 'Reserva, consulta e acompanhamento do ciclo de reservas.',
    isEntitled: (user) =>
      user.permissions.includes(InternalPermission.RESERVATION_READ),
  },
  {
    key: 'RENTALS',
    label: 'Rentals',
    description: 'Gestao de contratos de aluguer com cliente, viatura, datas e valor estimado.',
    isEntitled: (user) =>
      user.permissions.includes(InternalPermission.RENTAL_READ),
  },
  {
    key: 'VEHICLES',
    label: 'Vehicles',
    description: 'Consulta do parque automovel e disponibilidade das viaturas.',
    isEntitled: (user) =>
      user.permissions.includes(InternalPermission.VEHICLE_READ),
  },
  {
    key: 'FLEET_OPERATIONS',
    label: 'Fleet Operations',
    description:
      'Operacoes de frota, manutencao, transferencias e gestao de incidentes.',
    isEntitled: (user) =>
      user.permissions.includes(InternalPermission.VEHICLE_WRITE) ||
      user.permissions.includes(InternalPermission.MAINTENANCE_WRITE) ||
      user.permissions.includes(InternalPermission.TRANSFER_WRITE) ||
      user.permissions.includes(InternalPermission.INCIDENT_WRITE),
  },
];

const LIMITED_ACCESS_REASON =
  'A conta foi autenticada, mas algumas capacidades ficam condicionadas ate validacao final.';
const TEMPORARY_DISABLED_REASON =
  'Temporariamente indisponivel por manutencao ou restricao operacional.';

export function buildFeatureCatalog(
  user: AuthenticatedUserDto,
  accessLevel: SessionAccessLevel,
  disabledFeatures: Set<InternalFeatureKey>,
): AuthenticatedFeatureDto[] {
  return FEATURE_DEFINITIONS.filter((feature) => feature.isEntitled(user)).map(
    (feature) => {
      if (disabledFeatures.has(feature.key)) {
        return {
          key: feature.key,
          label: feature.label,
          description: feature.description,
          status: 'TEMPORARILY_DISABLED',
          reason: TEMPORARY_DISABLED_REASON,
        };
      }

      if (accessLevel === 'LIMITED') {
        return {
          key: feature.key,
          label: feature.label,
          description: feature.description,
          status: 'LIMITED',
          reason: LIMITED_ACCESS_REASON,
        };
      }

      return {
        key: feature.key,
        label: feature.label,
        description: feature.description,
        status: 'AVAILABLE',
      };
    },
  );
}

export function parseDisabledFeaturesFromEnvironment(
  rawValue = process.env.TEMPORARILY_DISABLED_FEATURES,
): Set<InternalFeatureKey> {
  if (!rawValue) {
    return new Set();
  }

  const allowedKeys = new Set<string>(FEATURE_KEYS);
  const keys = rawValue
    .split(',')
    .map((entry) => entry.trim().toUpperCase())
    .filter((entry) => allowedKeys.has(entry));

  return new Set(keys as InternalFeatureKey[]);
}
