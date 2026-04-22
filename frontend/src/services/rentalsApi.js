import { getJson, postJson } from './apiClient'
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

export function fetchRentalContracts(sessionToken) {
  return getJson('/rentals', {
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