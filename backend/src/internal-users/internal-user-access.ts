import {
  InternalPermission,
  InternalUserRole,
  InternalUserStatus,
} from '@prisma/client';

// Centralized role policy for internal accounts.
const ROLE_PERMISSIONS: Record<InternalUserRole, InternalPermission[]> = {
  [InternalUserRole.IT]: [
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
  [InternalUserRole.STAFF]: [
    InternalPermission.RESERVATION_READ,
    InternalPermission.RENTAL_READ,
  ],
  [InternalUserRole.FLEET]: [
    InternalPermission.RESERVATION_READ,
    InternalPermission.RENTAL_READ,
    InternalPermission.VEHICLE_READ,
    InternalPermission.VEHICLE_WRITE,
    InternalPermission.MAINTENANCE_WRITE,
    InternalPermission.TRANSFER_WRITE,
    InternalPermission.INCIDENT_WRITE,
  ],
  [InternalUserRole.ADMIN]: [
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
};

// Restricted roles require explicit IT activation after creation.
const RESTRICTED_ROLES = new Set<InternalUserRole>([
  InternalUserRole.STAFF,
  InternalUserRole.FLEET,
]);

export function getPermissionsForRole(
  role: InternalUserRole,
): InternalPermission[] {
  // Return a defensive copy so callers cannot mutate the policy table.
  return [...ROLE_PERMISSIONS[role]];
}

export function requiresItValidation(role: InternalUserRole): boolean {
  return RESTRICTED_ROLES.has(role);
}

export function getInitialStatusForRole(
  role: InternalUserRole,
): InternalUserStatus {
  return requiresItValidation(role)
    ? InternalUserStatus.PENDING_IT_VALIDATION
    : InternalUserStatus.ACTIVE;
}
