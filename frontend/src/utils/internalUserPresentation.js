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

export function getInternalUserDeletionPrompt(userId) {
  const normalizedUserId =
    typeof userId === 'string' && userId.trim() ? userId.trim() : 'este utilizador'

  return `Tem a certeza que deseja eliminar ou desativar "${normalizedUserId}"? Esta acao remove o acesso ao portal imediatamente.`
}

export function getInternalUserDeletionResultMessage(mode) {
  return mode === 'DEACTIVATED'
    ? 'Utilizador desativado com sucesso. O historico foi retido e o acesso ficou bloqueado.'
    : 'Utilizador eliminado permanentemente com sucesso.'
}

export function getInternalUserActivityLabel(isActive) {
  return isActive ? 'Conta ativa' : 'Conta desativada'
}

export function getInternalUserStatusLabel(status) {
  if (status === 'PENDING_IT_VALIDATION') {
    return 'Pendente de validacao IT'
  }

  if (status === 'BLOCKED') {
    return 'Bloqueada'
  }

  return 'Ativa'
}

export function shouldShowPermissionCompatibilityGuide(warnings) {
  if (!Array.isArray(warnings)) {
    return false
  }

  return warnings.some(
    (warning) =>
      typeof warning === 'string' &&
      warning.includes('Algumas permissoes foram removidas automaticamente'),
  )
}
