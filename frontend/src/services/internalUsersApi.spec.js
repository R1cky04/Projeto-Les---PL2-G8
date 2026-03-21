/* eslint-env jest */
jest.mock('./apiClient', () => ({
  deleteJson: jest.fn(),
  getJson: jest.fn(),
  postJson: jest.fn(),
}))

import { deleteJson, getJson, postJson } from './apiClient'
import {
  createInternalUser,
  deleteInternalUser,
  fetchInternalUsers,
} from './internalUsersApi'

// The feature client only wires endpoints, bearer tokens and fallback copy.
describe('internalUsersApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('posts internal user creation requests with the session token', () => {
    createInternalUser(
      {
        userId: 'staff.novo',
        password: 'StrongPwd1!',
        role: 'STAFF',
      },
      'token-abc',
    )

    expect(postJson).toHaveBeenCalledWith('/internal-users', {
      body: {
        userId: 'staff.novo',
        password: 'StrongPwd1!',
        role: 'STAFF',
      },
      token: 'token-abc',
      fallbackMessage: 'Nao foi possivel criar o utilizador.',
    })
  })

  it('loads the internal user list with the authenticated session token', () => {
    fetchInternalUsers('token-list')

    expect(getJson).toHaveBeenCalledWith('/internal-users', {
      token: 'token-list',
      fallbackMessage: 'Nao foi possivel carregar a lista de utilizadores.',
    })
  })

  it('sends deletion requests to the internal user endpoint', () => {
    deleteInternalUser('user-123', 'token-delete')

    expect(deleteJson).toHaveBeenCalledWith('/internal-users/user-123', {
      token: 'token-delete',
      fallbackMessage: 'Nao foi possivel eliminar o utilizador.',
    })
  })
})
