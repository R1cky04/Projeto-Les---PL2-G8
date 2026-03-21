import { getJson, postJson } from './apiClient'

// Auth API stays thin: all request/response normalization happens centrally.
export function loginInternalUser(payload) {
  return postJson('/auth/login', {
    body: payload,
    fallbackMessage: 'Nao foi possivel autenticar o utilizador.',
  })
}

export function fetchCurrentSession(token) {
  return getJson('/auth/me', {
    token,
    fallbackMessage: 'Nao foi possivel restaurar a sessao atual.',
  })
}

export function logoutInternalUser(token) {
  return postJson('/auth/logout', {
    token,
    fallbackMessage: 'Nao foi possivel terminar a sessao atual.',
  })
}
