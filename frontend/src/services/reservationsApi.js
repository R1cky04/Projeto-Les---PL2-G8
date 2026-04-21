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

function buildAvailabilityQuery(filters = {}) {
  const searchParams = new URLSearchParams()

  if (filters.pickupStationId) {
    searchParams.set('pickupStationId', String(filters.pickupStationId))
  }

  if (filters.pickupAt) {
    searchParams.set('pickupAt', filters.pickupAt)
  }

  if (filters.expectedReturnAt) {
    searchParams.set('expectedReturnAt', filters.expectedReturnAt)
  }

  if (filters.excludeReservationId) {
    searchParams.set(
      'excludeReservationId',
      String(filters.excludeReservationId),
    )
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export function fetchReservationContext(sessionToken) {
  return getJson('/reservations/context', {
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel carregar o contexto de reservas.',
  })
}

export function fetchReservationAvailability(sessionToken, filters = {}) {
  return getJson(`/reservations/availability${buildAvailabilityQuery(filters)}`, {
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel validar a disponibilidade das viaturas.',
  })
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
