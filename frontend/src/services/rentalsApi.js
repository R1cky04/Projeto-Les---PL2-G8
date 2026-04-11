import { getJson, patchJson, postJson } from './apiClient'

function buildRentalQuery(filters = {}) {
  const searchParams = new URLSearchParams()

  if (filters.status) {
    searchParams.set('status', filters.status)
  }

  if (filters.search) {
    searchParams.set('search', filters.search)
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export function fetchRentalContext(sessionToken) {
  return getJson('/rentals/context', {
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel carregar o contexto de contratos.',
  })
}

export function fetchRentalContracts(sessionToken, filters = {}) {
  return getJson(`/rentals${buildRentalQuery(filters)}`, {
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

export function updateRentalContract(rentalId, payload, sessionToken) {
  return patchJson(`/rentals/${rentalId}`, {
    body: payload,
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel atualizar o contrato.',
  })
}
