import { INTERNAL_USER_PERMISSION_OPTIONS } from './internalUserPermissions'

const permissionLabels = INTERNAL_USER_PERMISSION_OPTIONS.reduce((labels, option) => {
  labels[option.value] = option.label
  return labels
}, {})

// Frontend mirror of the role-permission policy so the IT operator can inspect
// which permissions are inherited automatically from each role.
export const INTERNAL_USER_ROLE_PERMISSION_GUIDE = [
  {
    role: 'IT',
    label: 'IT',
    permissions: [
      'RESERVATION_READ',
      'RENTAL_READ',
      'VEHICLE_READ',
      'VEHICLE_WRITE',
      'MAINTENANCE_WRITE',
      'TRANSFER_WRITE',
      'INCIDENT_WRITE',
      'USER_READ',
      'USER_CREATE',
      'USER_ACTIVATE',
    ],
  },
  {
    role: 'ADMIN',
    label: 'Admin',
    permissions: [
      'RESERVATION_READ',
      'RENTAL_READ',
      'VEHICLE_READ',
      'VEHICLE_WRITE',
      'MAINTENANCE_WRITE',
      'TRANSFER_WRITE',
      'INCIDENT_WRITE',
    ],
  },
  {
    role: 'FLEET',
    label: 'Frota',
    permissions: [
      'RESERVATION_READ',
      'RENTAL_READ',
      'VEHICLE_READ',
      'VEHICLE_WRITE',
      'MAINTENANCE_WRITE',
      'TRANSFER_WRITE',
      'INCIDENT_WRITE',
    ],
  },
  {
    role: 'STAFF',
    label: 'Staff',
    permissions: ['RESERVATION_READ', 'RENTAL_READ'],
  },
].map((entry) => ({
  ...entry,
  permissionLabels: entry.permissions.map(
    (permission) => permissionLabels[permission] || permission,
  ),
}))

export function getRolePermissionValues(role) {
  const matchingRole = INTERNAL_USER_ROLE_PERMISSION_GUIDE.find(
    (entry) => entry.role === role,
  )

  return matchingRole ? [...matchingRole.permissions] : []
}
