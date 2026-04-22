/* eslint-env jest */
jest.mock('./apiClient', () => ({
  getJson: jest.fn(),
  patchJson: jest.fn(),
  postJson: jest.fn(),
}))

import { getJson, patchJson, postJson } from './apiClient'
import {
  cancelReservation,
  createReservation,
  fetchReservationAvailability,
  fetchReservationContext,
  fetchReservations,
  updateReservation,
} from './reservationsApi'

describe('reservationsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads reservation context with the authenticated session token', () => {
    fetchReservationContext('token-context')

    expect(getJson).toHaveBeenCalledWith('/reservations/context', {
      token: 'token-context',
      fallbackMessage: 'Nao foi possivel carregar o contexto de reservas.',
    })
  })

  it('requests vehicle availability for the selected period and station', () => {
    fetchReservationAvailability('token-availability', {
      pickupStationId: 2,
      pickupAt: '2026-09-10T09:00:00.000Z',
      expectedReturnAt: '2026-09-12T09:00:00.000Z',
    })

    expect(getJson).toHaveBeenCalledWith(
      '/reservations/availability?pickupStationId=2&pickupAt=2026-09-10T09%3A00%3A00.000Z&expectedReturnAt=2026-09-12T09%3A00%3A00.000Z',
      {
        token: 'token-availability',
        fallbackMessage: 'Nao foi possivel validar a disponibilidade das viaturas.',
      },
    )
  })

  it('posts reservation creation requests with the session token', () => {
    createReservation(
      {
        pickupStationId: 1,
        returnStationId: 2,
        vehicleId: 4,
        customerId: 7,
        pickupAt: '2026-09-10T09:00:00.000Z',
        expectedReturnAt: '2026-09-12T09:00:00.000Z',
      },
      'token-create',
    )

    expect(postJson).toHaveBeenCalledWith('/reservations', {
      body: {
        pickupStationId: 1,
        returnStationId: 2,
        vehicleId: 4,
        customerId: 7,
        pickupAt: '2026-09-10T09:00:00.000Z',
        expectedReturnAt: '2026-09-12T09:00:00.000Z',
      },
      token: 'token-create',
      fallbackMessage: 'Nao foi possivel criar a reserva.',
    })
  })

  it('loads and updates reservations through the expected endpoints', () => {
    fetchReservations('token-list', {
      status: 'CONFIRMED',
      search: 'ines',
    })
    updateReservation(
      12,
      {
        expectedReturnAt: '2026-09-13T09:00:00.000Z',
        returnStationId: 2,
      },
      'token-update',
    )
    cancelReservation(12, 'token-cancel')

    expect(getJson).toHaveBeenCalledWith(
      '/reservations?status=CONFIRMED&search=ines',
      {
        token: 'token-list',
        fallbackMessage: 'Nao foi possivel carregar as reservas.',
      },
    )
    expect(patchJson).toHaveBeenCalledWith('/reservations/12', {
      body: {
        expectedReturnAt: '2026-09-13T09:00:00.000Z',
        returnStationId: 2,
      },
      token: 'token-update',
      fallbackMessage: 'Nao foi possivel atualizar a reserva.',
    })
    expect(patchJson).toHaveBeenCalledWith('/reservations/12/cancel', {
      token: 'token-cancel',
      fallbackMessage: 'Nao foi possivel cancelar a reserva.',
    })
  })
})
