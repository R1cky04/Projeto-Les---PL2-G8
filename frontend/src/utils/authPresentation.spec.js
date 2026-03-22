/* eslint-env jest */
import {
  formatSessionExpiry,
  getAccessLevelLabel,
  getFeatureStatusLabel,
  getRoleLabel,
} from './authPresentation'

// Presentation helpers should stay deterministic because the workspace depends
// on them for role and status copy.
describe('authPresentation helpers', () => {
  it('translates roles and access levels into readable labels', () => {
    expect(getRoleLabel('FLEET')).toBe('Frota')
    expect(getAccessLevelLabel('LIMITED')).toBe('Acesso limitado')
  })

  it('translates feature statuses into short labels', () => {
    expect(getFeatureStatusLabel('TEMPORARILY_DISABLED')).toBe('Manutencao')
  })

  it('formats session expiry dates defensively', () => {
    expect(formatSessionExpiry('2026-03-20T10:15:00.000Z')).toBeTruthy()
    expect(formatSessionExpiry('invalid')).toBe('Sem expiracao')
  })
})
