/* global describe, it, expect */
import { formatPlateForDisplay, isValidPortuguesePlate } from './plateFormatting'

describe('plateFormatting', () => {
  it('formats loose input into XX-99-ZZ pattern', () => {
    expect(formatPlateForDisplay('ab12cd')).toBe('AB-12-CD')
    expect(formatPlateForDisplay('aB12cD')).toBe('AB-12-CD')
    expect(formatPlateForDisplay('ab123cd')).toBe('AB-12-CD')
    expect(formatPlateForDisplay('ab1c2d')).toBe('AB-12-CD')
  })

  it('handles partial input gracefully', () => {
    expect(formatPlateForDisplay('a')).toBe('A')
    expect(formatPlateForDisplay('ab')).toBe('AB')
    expect(formatPlateForDisplay('ab1')).toBe('AB-1')
    expect(formatPlateForDisplay('ab12')).toBe('AB-12')
    expect(formatPlateForDisplay('ab12c')).toBe('AB-12-C')
  })

  it('rejects invalid complete plates', () => {
    expect(isValidPortuguesePlate('AB-12-CD')).toBe(true)
    expect(isValidPortuguesePlate('A1-12-CD')).toBe(false)
    expect(isValidPortuguesePlate('AB-1C-CD')).toBe(false)
    expect(isValidPortuguesePlate('AB-12-C3')).toBe(false)
  })
})
