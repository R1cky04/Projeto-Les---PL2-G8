export function formatPlateForDisplay(raw) {
  if (!raw) return ''
  const up = String(raw).toUpperCase()
  const allowed = up.replace(/[^A-Z0-9]/g, '')
  const pattern = ['L', 'L', 'D', 'D', 'L', 'L']
  let idx = 0
  const out = []

  for (let p of pattern) {
    while (idx < allowed.length) {
      const ch = allowed[idx]
      idx += 1
      if (p === 'L' && /[A-Z]/.test(ch)) {
        out.push(ch)
        break
      }
      if (p === 'D' && /[0-9]/.test(ch)) {
        out.push(ch)
        break
      }
      // otherwise skip char
    }
    if (out.length < pattern.indexOf(p) + 1) {
      // couldn't fill this slot yet
      break
    }
  }

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
