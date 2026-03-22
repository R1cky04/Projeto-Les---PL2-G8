/* eslint-env jest */
jest.mock('./apiClient', () => ({
  getJson: jest.fn(),
  postJson: jest.fn(),
}))

import { getJson, postJson } from './apiClient'
import {
  fetchCurrentSession,
  loginInternalUser,
  logoutInternalUser,
} from './authApi'

// Auth service wrappers should stay thin so endpoint drift is easy to catch.
describe('authApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('posts login requests to the auth endpoint', () => {
    loginInternalUser({ userId: 'it.master', password: 'Secret123!' })

    expect(postJson).toHaveBeenCalledWith('/auth/login', {
      body: { userId: 'it.master', password: 'Secret123!' },
      fallbackMessage: 'Nao foi possivel autenticar o utilizador.',
    })
  })

  it('fetches and closes the current session with the stored token', () => {
    fetchCurrentSession('token-123')
    logoutInternalUser('token-123')

    expect(getJson).toHaveBeenCalledWith('/auth/me', {
      token: 'token-123',
      fallbackMessage: 'Nao foi possivel restaurar a sessao atual.',
    })
    expect(postJson).toHaveBeenCalledWith('/auth/logout', {
      token: 'token-123',
      fallbackMessage: 'Nao foi possivel terminar a sessao atual.',
    })
  })
})
