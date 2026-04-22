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

function buildQueryString(filters = {}) {
  const queryParams = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return
    }

    const normalizedValue = typeof value === 'string' ? value.trim() : value
    if (normalizedValue === '') {
      return
    }

    queryParams.set(key, String(normalizedValue))
  })

  const query = queryParams.toString()
  return query ? `?${query}` : ''
}

export function fetchImproStations(sessionToken) {
  return getJson('/impros/stations', {
    token: sessionToken,
    fallbackMessage: tr(
      'Nao foi possivel carregar as estacoes.',
      'Unable to load stations.',
      'No fue posible cargar las estaciones.',
    ),
  })
}

export function fetchImproVehicles(sessionToken, options = {}) {
  const query = buildQueryString({ plate: options.plate })

  return getJson(`/impros/vehicles${query}`, {
    token: sessionToken,
    fallbackMessage: tr(
      'Nao foi possivel carregar os veiculos.',
      'Unable to load vehicles.',
      'No fue posible cargar los vehiculos.',
    ),
  })
}

export function createImpro(payload, sessionToken) {
  return postJson('/impros', {
    body: payload,
    token: sessionToken,
    fallbackMessage: tr(
      'Nao foi possivel criar o impro.',
      'Unable to create impro.',
      'No fue posible crear el impro.',
    ),
  })
}

export function fetchImpros(sessionToken, filters = {}) {
  const query = buildQueryString(filters)

  return getJson(`/impros${query}`, {
    token: sessionToken,
    fallbackMessage: tr(
      'Nao foi possivel carregar os impros.',
      'Unable to load impros.',
      'No fue posible cargar los impros.',
    ),
  })
}

export function updateImpro(id, payload, sessionToken) {
  return patchJson(`/impros/${id}`, {
    body: payload,
    token: sessionToken,
    fallbackMessage: tr(
      'Nao foi possivel atualizar o impro.',
      'Unable to update impro.',
      'No fue posible actualizar el impro.',
    ),
  })
}

export function closeImpro(id, payload, sessionToken) {
  return postJson(`/impros/${id}/close`, {
    body: payload,
    token: sessionToken,
    fallbackMessage: tr(
      'Nao foi possivel encerrar o impro.',
      'Unable to close impro.',
      'No fue posible cerrar el impro.',
    ),
  })
}
