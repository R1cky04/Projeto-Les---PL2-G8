import { getJson, patchJson, postJson } from './apiClient'
import { getLocaleState } from './i18n'

function tr(pt, en, es) {
  const locale = getLocaleState().locale
  if (locale === 'en') {
    return en
  }
  if (locale === 'es') {
    return es
  }
  return pt
}

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
    fallbackMessage: tr(
      'Nao foi possivel carregar o contexto de contratos.',
      'Unable to load contracts context.',
      'No fue posible cargar el contexto de contratos.',
    ),
  })
}

export function fetchRentalContracts(sessionToken, filters = {}) {
  return getJson(`/rentals${buildRentalQuery(filters)}`, {
    token: sessionToken,
    fallbackMessage: tr(
      'Nao foi possivel carregar os contratos.',
      'Unable to load contracts.',
      'No fue posible cargar los contratos.',
    ),
  })
}

export function createRentalContract(payload, sessionToken) {
  return postJson('/rentals', {
    body: payload,
    token: sessionToken,
    fallbackMessage: tr(
      'Nao foi possivel criar o contrato.',
      'Unable to create contract.',
      'No fue posible crear el contrato.',
    ),
  })
}

export function updateRentalContract(rentalId, payload, sessionToken) {
  return patchJson(`/rentals/${rentalId}`, {
    body: payload,
    token: sessionToken,
    fallbackMessage: tr(
      'Nao foi possivel atualizar o contrato.',
      'Unable to update contract.',
      'No fue posible actualizar el contrato.',
    ),
  })
}

export function closeRentalContract(rentalId, payload, sessionToken) {
  return patchJson(`/rentals/${rentalId}/close`, {
    body: payload,
    token: sessionToken,
    fallbackMessage: tr(
      'Nao foi possivel encerrar o contrato.',
      'Unable to close contract.',
      'No fue posible cerrar el contrato.',
    ),
  })
}
