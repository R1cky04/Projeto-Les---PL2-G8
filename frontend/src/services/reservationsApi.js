import { getJson, patchJson, postJson } from './apiClient'

function buildReservationQuery(filters = {}) {
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

export function fetchReservations(sessionToken, filters = {}) {
  return getJson(`/reservations${buildReservationQuery(filters)}`, {
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel carregar as reservas.',
  })
}

export function createReservation(payload, sessionToken) {
  return postJson('/reservations', {
    body: payload,
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel criar a reserva.',
  })
}

export function updateReservation(reservationId, payload, sessionToken) {
  return patchJson(`/reservations/${reservationId}`, {
    body: payload,
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel atualizar a reserva.',
  })
}

export function cancelReservation(reservationId, sessionToken) {
  return patchJson(`/reservations/${reservationId}/cancel`, {
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel cancelar a reserva.',
  })
}
