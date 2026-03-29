import { getJson, patchJson, postJson } from './apiClient'

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
    fallbackMessage: 'Nao foi possivel carregar as estacoes.',
  })
}

export function fetchImproVehicles(sessionToken, options = {}) {
  const query = buildQueryString({ plate: options.plate })

  return getJson(`/impros/vehicles${query}`, {
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel carregar os veiculos.',
  })
}

export function createImpro(payload, sessionToken) {
  return postJson('/impros', {
    body: payload,
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel criar o impro.',
  })
}

export function fetchImpros(sessionToken, filters = {}) {
  const query = buildQueryString(filters)

  return getJson(`/impros${query}`, {
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel carregar os impros.',
  })
}

export function updateImpro(id, payload, sessionToken) {
  return patchJson(`/impros/${id}`, {
    body: payload,
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel atualizar o impro.',
  })
}

export function closeImpro(id, payload, sessionToken) {
  return postJson(`/impros/${id}/close`, {
    body: payload,
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel encerrar o impro.',
  })
}
