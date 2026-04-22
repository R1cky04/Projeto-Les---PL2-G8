import { getDateLocale, t } from '../services/i18n'

const ROLE_LABELS = {
  IT: 'IT',
  ADMIN: 'Admin',
  STAFF: 'Staff',
  FLEET: 'authPresentation.roleFleet',
}

const ACCESS_LEVEL_LABELS = {
  FULL: 'authPresentation.accessFull',
  LIMITED: 'authPresentation.accessLimited',
}

const FEATURE_STATUS_LABELS = {
  AVAILABLE: 'authPresentation.featureAvailable',
  LIMITED: 'authPresentation.featureLimited',
  TEMPORARILY_DISABLED: 'authPresentation.featureMaintenance',
}

// Presentation helpers keep labels and formatting rules centralized.
export function getRoleLabel(role) {
  const mapped = ROLE_LABELS[role]
  return mapped ? t(mapped) : role || t('authPresentation.noProfile')
}

export function getAccessLevelLabel(accessLevel) {
  const mapped = ACCESS_LEVEL_LABELS[accessLevel]
  return mapped ? t(mapped) : accessLevel || t('authPresentation.noAccess')
}

export function getFeatureStatusLabel(status) {
  const mapped = FEATURE_STATUS_LABELS[status]
  return mapped ? t(mapped) : status || t('authPresentation.undefined')
}

export function formatSessionExpiry(value) {
  if (!value) {
    return t('authPresentation.noExpiry')
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return t('authPresentation.noExpiry')
  }

  return new Intl.DateTimeFormat(getDateLocale(), {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}
