/* eslint-env jest */
jest.mock('./apiClient', () => ({
  postJson: jest.fn(),
}))

import { postJson } from './apiClient'
import { createInternalUser } from './internalUsersApi'

// The internal user client should only be concerned with endpoint wiring and
// token forwarding.
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
})
