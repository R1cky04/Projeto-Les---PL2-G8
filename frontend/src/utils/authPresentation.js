const ROLE_LABELS = {
  IT: 'IT',
  ADMIN: 'Admin',
  STAFF: 'Staff',
  FLEET: 'Frota',
}

const ACCESS_LEVEL_LABELS = {
  FULL: 'Acesso completo',
  LIMITED: 'Acesso limitado',
}

const FEATURE_STATUS_LABELS = {
  AVAILABLE: 'Disponivel',
  LIMITED: 'Limitado',
  TEMPORARILY_DISABLED: 'Manutencao',
}

// Presentation helpers keep labels and formatting rules centralized.
export function getRoleLabel(role) {
  return ROLE_LABELS[role] || role || 'Sem perfil'
}

export function getAccessLevelLabel(accessLevel) {
  return ACCESS_LEVEL_LABELS[accessLevel] || accessLevel || 'Sem acesso'
}

export function getFeatureStatusLabel(status) {
  return FEATURE_STATUS_LABELS[status] || status || 'Indefinido'
}

export function formatSessionExpiry(value) {
  if (!value) {
    return 'Sem expiracao'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Sem expiracao'
  }

  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}
