import { getLocaleState } from '../services/i18n'

const LOCALE_MESSAGES = {
  pt: {
    genericUser: 'este utilizador',
    deletionPrompt:
      'Tem a certeza que deseja eliminar ou desativar "{userId}"? Esta acao remove o acesso ao portal imediatamente.',
    deletionDeactivated:
      'Utilizador desativado com sucesso. O historico foi retido e o acesso ficou bloqueado.',
    deletionDeleted: 'Utilizador eliminado permanentemente com sucesso.',
    activityActive: 'Conta ativa',
    activityDisabled: 'Conta desativada',
    statusPending: 'Pendente de validacao IT',
    statusActive: 'Ativa',
    warningPermissionRemoved: 'Algumas permissoes foram removidas automaticamente',
  },
  en: {
    genericUser: 'this user',
    deletionPrompt:
      'Are you sure you want to delete or deactivate "{userId}"? This action removes portal access immediately.',
    deletionDeactivated:
      'User deactivated successfully. History was retained and access was blocked.',
    deletionDeleted: 'User permanently deleted successfully.',
    activityActive: 'Active account',
    activityDisabled: 'Deactivated account',
    statusPending: 'Pending IT validation',
    statusActive: 'Active',
    warningPermissionRemoved: 'Some permissions were removed automatically',
  },
  es: {
    genericUser: 'este usuario',
    deletionPrompt:
      'Seguro que desea eliminar o desactivar "{userId}"? Esta accion elimina el acceso al portal de inmediato.',
    deletionDeactivated:
      'Usuario desactivado con exito. El historial se mantuvo y el acceso quedo bloqueado.',
    deletionDeleted: 'Usuario eliminado permanentemente con exito.',
    activityActive: 'Cuenta activa',
    activityDisabled: 'Cuenta desactivada',
    statusPending: 'Pendiente de validacion IT',
    statusActive: 'Activa',
    warningPermissionRemoved: 'Algunos permisos fueron eliminados automaticamente',
  },
}

function tr(key, params = {}) {
  const locale = getLocaleState().locale
  const template =
    (LOCALE_MESSAGES[locale] && LOCALE_MESSAGES[locale][key]) ||
    LOCALE_MESSAGES.pt[key] ||
    key

  return Object.entries(params).reduce(
    (result, [paramKey, value]) => result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value)),
    template,
  )
}

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
    typeof userId === 'string' && userId.trim() ? userId.trim() : tr('genericUser')

  return tr('deletionPrompt', { userId: normalizedUserId })
}

export function getInternalUserDeletionResultMessage(mode) {
  return mode === 'DEACTIVATED'
    ? tr('deletionDeactivated')
    : tr('deletionDeleted')
}

export function getInternalUserActivityLabel(isActive) {
  return isActive ? tr('activityActive') : tr('activityDisabled')
}

export function getInternalUserStatusLabel(status) {
  return status === 'PENDING_IT_VALIDATION'
    ? tr('statusPending')
    : tr('statusActive')
}

export function shouldShowPermissionCompatibilityGuide(warnings) {
  if (!Array.isArray(warnings)) {
    return false
  }

  return warnings.some(
    (warning) =>
      typeof warning === 'string' &&
      warning.includes(tr('warningPermissionRemoved')),
  )
}
