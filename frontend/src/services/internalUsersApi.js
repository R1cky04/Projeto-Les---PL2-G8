import { getJson, postJson, deleteJson } from './apiClient'

// Internal user creation now consumes the authenticated bearer token issued by
// the real login flow.
export function createInternalUser(payload, sessionToken) {
  return postJson('/internal-users', {
    body: payload,
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel criar o utilizador.',
  })
}

export function fetchInternalUsers(sessionToken) {
  return getJson('/internal-users', {
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel carregar a lista de utilizadores.',
  })
}

export function deleteInternalUser(id, sessionToken) {
  return deleteJson(`/internal-users/${id}`, {
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel eliminar o utilizador.',
  })
}
