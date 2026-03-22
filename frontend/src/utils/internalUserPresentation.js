// Presentation-only helpers for API enums.
export function getInternalUserRoleLabel(roleOptions, role) {
  const normalizedRoleOptions = Array.isArray(roleOptions) ? roleOptions : []
  const foundRole = normalizedRoleOptions.find((entry) => entry.value === role)

  return foundRole ? foundRole.label : role
}

export function formatInternalPermission(permission) {
  if (typeof permission !== 'string') {
    return ''
  }

  // USER_CREATE -> User Create
  return permission
    .toLowerCase()
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}
