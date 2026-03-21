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
    getJson.mockResolvedValue({
      items: [],
      pagination: {
        page: 3,
        pageSize: 10,
        totalItems: 12,
        totalPages: 2,
        hasPreviousPage: true,
        hasNextPage: false,
      },
    })

    fetchInternalUsers('token-list', {
      page: 3,
      pageSize: 10,
      search: 'lisboa',
    })

    expect(getJson).toHaveBeenCalledWith('/internal-users?page=3&pageSize=10&search=lisboa', {
      token: 'token-list',
      fallbackMessage: 'Nao foi possivel carregar a lista de utilizadores.',
    })
  })

  it('normalizes the legacy list response into a paginated shape', async () => {
    getJson.mockResolvedValue([
      { id: 'user-1', userId: 'staff.one' },
      { id: 'user-2', userId: 'staff.two' },
    ])

    await expect(
      fetchInternalUsers('token-list', {
        page: 1,
        pageSize: 10,
      }),
    ).resolves.toEqual({
      items: [
        { id: 'user-1', userId: 'staff.one' },
        { id: 'user-2', userId: 'staff.two' },
      ],
      pagination: {
        page: 1,
        pageSize: 10,
        totalItems: 2,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      },
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
