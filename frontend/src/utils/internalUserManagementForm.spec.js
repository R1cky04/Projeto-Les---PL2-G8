/* eslint-env jest */
import {
  buildInternalUserManagementForm,
  buildUpdateInternalUserPayload,
  createInternalUserManagementForm,
  validateInternalUserManagementForm,
} from './internalUserManagementForm'

describe('internalUserManagementForm helpers', () => {
  it('creates an empty management form', () => {
    expect(createInternalUserManagementForm()).toEqual({
      id: '',
      userId: '',
      password: '',
      role: '',
      status: 'ACTIVE',
      isActive: true,
      createdAt: null,
    })
  })

  it('maps a listed internal user into the editable form shape', () => {
    expect(
      buildInternalUserManagementForm({
        id: 'user-1',
        userId: 'staff.lisboa',
        internalRole: 'STAFF',
        internalStatus: 'PENDING_IT_VALIDATION',
        isActive: false,
        createdAt: '2026-03-22T10:00:00.000Z',
      }),
    ).toEqual({
      id: 'user-1',
      userId: 'staff.lisboa',
      password: '',
      role: 'STAFF',
      status: 'PENDING_IT_VALIDATION',
      isActive: false,
      createdAt: '2026-03-22T10:00:00.000Z',
    })
  })

  it('normalizes the update payload before sending it to the API', () => {
    expect(
      buildUpdateInternalUserPayload({
        userId: ' Admin.Lisboa ',
        password: ' NewStrong1! ',
        role: 'ADMIN',
        status: 'ACTIVE',
        isActive: true,
      }),
    ).toEqual({
      userId: 'admin.lisboa',
      password: 'NewStrong1!',
      role: 'ADMIN',
      status: 'ACTIVE',
      isActive: true,
    })
  })

  it('flags missing or invalid management fields', () => {
    expect(
      validateInternalUserManagementForm({
        userId: 'A',
        password: 'weak',
        role: '',
        status: '',
        isActive: 'yes',
      }),
    ).toEqual({
      userId:
        'Usa entre 4 e 30 caracteres com letras minusculas, numeros, ponto, underscore ou hifen.',
      password: 'A password deve ter pelo menos 8 caracteres.',
      role: 'Seleciona um tipo de utilizador.',
      status: 'Seleciona um estado de conta.',
      isActive: 'Indica se a conta deve permanecer ativa.',
    })
  })

  it('accepts keeping the existing password untouched', () => {
    expect(
      buildUpdateInternalUserPayload({
        userId: 'staff.lisboa',
        password: '   ',
        role: 'STAFF',
        status: 'ACTIVE',
        isActive: true,
      }),
    ).toEqual({
      userId: 'staff.lisboa',
      role: 'STAFF',
      status: 'ACTIVE',
      isActive: true,
    })
  })
})
