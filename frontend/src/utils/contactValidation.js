function normalizeText(value) {
  return String(value || '').trim()
}

export function normalizeEmail(value) {
  const normalized = normalizeText(value)
  return normalized ? normalized.toLowerCase() : ''
}

export function isValidEmail(value) {
  const normalized = normalizeEmail(value)

  if (!normalized) {
    return false
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
}

export function normalizePhoneNumber(value) {
  return normalizeText(value).replace(/\D/g, '')
}

export function isValidPhoneNumber(value) {
  const normalized = normalizePhoneNumber(value)
  return normalized.length >= 9 && normalized.length <= 15
}