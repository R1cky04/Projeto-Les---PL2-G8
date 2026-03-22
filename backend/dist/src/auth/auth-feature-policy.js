"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFeatureCatalog = buildFeatureCatalog;
exports.parseDisabledFeaturesFromEnvironment = parseDisabledFeaturesFromEnvironment;
const internal_user_enums_1 = require("../internal-users/internal-user.enums");
const auth_types_1 = require("./auth.types");
const FEATURE_DEFINITIONS = [
    {
        key: 'INTERNAL_USERS',
        label: 'Internal Users',
        description: 'Gestao de contas internas, ativacao e controlo de acessos.',
        isEntitled: (user) => user.role === internal_user_enums_1.InternalUserRole.IT,
    },
    {
        key: 'CUSTOMERS',
        label: 'Customers',
        description: 'Consulta e apoio operacional a perfis de cliente.',
        isEntitled: (user) => user.role === internal_user_enums_1.InternalUserRole.IT ||
            user.role === internal_user_enums_1.InternalUserRole.ADMIN ||
            user.role === internal_user_enums_1.InternalUserRole.STAFF,
    },
    {
        key: 'RESERVATIONS',
        label: 'Reservations',
        description: 'Reserva, consulta e acompanhamento do ciclo de reservas.',
        isEntitled: (user) => user.permissions.includes(internal_user_enums_1.InternalPermission.RESERVATION_READ),
    },
    {
        key: 'RENTALS',
        label: 'Rentals',
        description: 'Acompanhamento de alugueres e estado operacional associado.',
        isEntitled: (user) => user.permissions.includes(internal_user_enums_1.InternalPermission.RENTAL_READ),
    },
    {
        key: 'VEHICLES',
        label: 'Vehicles',
        description: 'Consulta do parque automovel e disponibilidade das viaturas.',
        isEntitled: (user) => user.permissions.includes(internal_user_enums_1.InternalPermission.VEHICLE_READ),
    },
    {
        key: 'FLEET_OPERATIONS',
        label: 'Fleet Operations',
        description: 'Operacoes de frota, manutencao, transferencias e gestao de incidentes.',
        isEntitled: (user) => user.permissions.includes(internal_user_enums_1.InternalPermission.VEHICLE_WRITE) ||
            user.permissions.includes(internal_user_enums_1.InternalPermission.MAINTENANCE_WRITE) ||
            user.permissions.includes(internal_user_enums_1.InternalPermission.TRANSFER_WRITE) ||
            user.permissions.includes(internal_user_enums_1.InternalPermission.INCIDENT_WRITE),
    },
];
const LIMITED_ACCESS_REASON = 'A conta foi autenticada, mas algumas capacidades ficam condicionadas ate validacao final.';
const TEMPORARY_DISABLED_REASON = 'Temporariamente indisponivel por manutencao ou restricao operacional.';
function buildFeatureCatalog(user, accessLevel, disabledFeatures) {
    return FEATURE_DEFINITIONS.filter((feature) => feature.isEntitled(user)).map((feature) => {
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
    });
}
function parseDisabledFeaturesFromEnvironment(rawValue = process.env.TEMPORARILY_DISABLED_FEATURES) {
    if (!rawValue) {
        return new Set();
    }
    const allowedKeys = new Set(auth_types_1.FEATURE_KEYS);
    const keys = rawValue
        .split(',')
        .map((entry) => entry.trim().toUpperCase())
        .filter((entry) => allowedKeys.has(entry));
    return new Set(keys);
}
//# sourceMappingURL=auth-feature-policy.js.map