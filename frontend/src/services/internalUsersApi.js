import { postJson } from './apiClient'

// Internal user creation now consumes the authenticated bearer token issued by
// the real login flow.
export function createInternalUser(payload, sessionToken) {
  return postJson('/internal-users', {
    body: payload,
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel criar o utilizador.',
  })
}
