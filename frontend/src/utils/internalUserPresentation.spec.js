/* eslint-env jest */
import {
  formatInternalPermission,
  getInternalUserActivityLabel,
  getInternalUserDeletionPrompt,
  getInternalUserDeletionResultMessage,
  getInternalUserRoleLabel,
  getInternalUserStatusLabel,
  shouldShowPermissionCompatibilityGuide,
} from './internalUserPresentation'

describe('internalUserPresentation helpers', () => {
  it('maps internal roles into UI labels', () => {
    expect(
      getInternalUserRoleLabel(
        [
          { value: 'IT', label: 'IT' },
          { value: 'STAFF', label: 'Staff' },
        ],
        'STAFF',
      ),
    ).toBe('Staff')
  })

  it('formats permissions for display', () => {
    expect(formatInternalPermission('USER_CREATE')).toBe('User Create')
  })

  it('builds a defensive confirmation prompt', () => {
    expect(getInternalUserDeletionPrompt('staff.clean')).toContain('staff.clean')
    expect(getInternalUserDeletionPrompt('')).toContain('este utilizador')
  })

  it('translates deletion outcomes and activity states', () => {
    expect(getInternalUserDeletionResultMessage('DEACTIVATED')).toContain('historico')
    expect(getInternalUserDeletionResultMessage('DELETED')).toContain('permanentemente')
    expect(getInternalUserActivityLabel(true)).toBe('Conta ativa')
    expect(getInternalUserActivityLabel(false)).toBe('Conta desativada')
    expect(getInternalUserStatusLabel('ACTIVE')).toBe('Ativa')
    expect(getInternalUserStatusLabel('PENDING_IT_VALIDATION')).toBe(
      'Pendente de validacao IT',
    )
  })

  it('detects when the permission compatibility helper should be shown', () => {
    expect(
      shouldShowPermissionCompatibilityGuide([
        'Algumas permissoes foram removidas automaticamente por nao serem compativeis com o tipo de utilizador selecionado.',
      ]),
    ).toBe(true)
    expect(shouldShowPermissionCompatibilityGuide(['Outro aviso qualquer.'])).toBe(false)
  })
})
