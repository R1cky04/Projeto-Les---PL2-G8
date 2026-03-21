/* eslint-env jest */
import {
  buildLoginPayload,
  createLoginForm,
  mapLoginApiErrors,
  validateLoginForm,
} from './loginForm'

// Login form tests keep the client contract stable before the request reaches
// the backend.
describe('loginForm utilities', () => {
  it('creates an empty login form state', () => {
    expect(createLoginForm()).toEqual({
      userId: '',
      password: '',
    })
  })

  it('normalizes the payload before authentication', () => {
    expect(
      buildLoginPayload({
        userId: '  IT.Master  ',
        password: ' Secret123! ',
      }),
    ).toEqual({
      userId: 'it.master',
      password: 'Secret123!',
    })
  })

  it('validates missing fields and invalid user identifiers', () => {
    expect(validateLoginForm(createLoginForm())).toEqual({
      userId: 'O User ID e obrigatorio.',
      password: 'A password e obrigatoria.',
    })

    expect(
      validateLoginForm({
        userId: 'INVALID USER',
        password: 'Secret123!',
      }),
    ).toEqual({
      userId:
        'O User ID deve ter entre 4 e 30 caracteres e usar apenas letras minusculas, numeros, ponto, underscore ou hifen.',
    })
  })

  it('maps API field errors to the form shape', () => {
    expect(
      mapLoginApiErrors([
        { field: 'userId', message: 'Duplicado.' },
        { field: 'password', message: 'Obrigatoria.' },
      ]),
    ).toEqual({
      userId: 'Duplicado.',
      password: 'Obrigatoria.',
    })
  })
})
