import { getJson, postJson } from './apiClient'

export function fetchRentalContext(sessionToken) {
  return getJson('/rentals/context', {
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel carregar o contexto de contratos.',
  })
}

export function fetchRentalContracts(sessionToken) {
  return getJson('/rentals', {
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel carregar os contratos.',
  })
}

export function createRentalContract(payload, sessionToken) {
  return postJson('/rentals', {
    body: payload,
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel criar o contrato.',
  })
}