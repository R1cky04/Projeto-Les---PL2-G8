export function formatPlateForDisplay(raw) {
  if (!raw) return ''
  const up = String(raw).toUpperCase()
  const allowed = up.replace(/[^A-Z0-9]/g, '')
  const letters = allowed.replace(/[^A-Z]/g, '').slice(0, 4)
  const digits = allowed.replace(/[^0-9]/g, '').slice(0, 2)
  const out = [
    ...letters.slice(0, 2),
    ...digits,
    ...letters.slice(2, 4),
  ]

  // Build formatted with dashes
  if (out.length === 0) return ''
  let formatted = ''
  if (out.length <= 2) {
    formatted = out.join('')
  } else if (out.length <= 4) {
    formatted = out.slice(0, 2).join('') + '-' + out.slice(2).join('')
  } else {
    formatted = out.slice(0, 2).join('') + '-' + out.slice(2, 4).join('') + '-' + out.slice(4, 6).join('')
  }

  return formatted.slice(0, 8)
}

export function isValidPortuguesePlate(raw) {
  if (!raw) return false
  return /^[A-Z]{2}-\d{2}-[A-Z]{2}$/.test(String(raw).toUpperCase())
}
