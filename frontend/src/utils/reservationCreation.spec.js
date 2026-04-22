/* eslint-env jest */
import {
  buildCreateReservationPayload,
  createReservationCustomerForm,
  createReservationForm,
  isReservationAvailabilityReady,
  validateReservationCreateForm,
} from './reservationCreation'

describe('reservationCreation helpers', () => {
  it('creates empty reservation forms', () => {
    expect(createReservationForm()).toEqual({
      pickupStationId: 0,
      returnStationId: 0,
      vehicleId: 0,
      pickupAt: '',
      expectedReturnAt: '',
      notes: '',
    })

    expect(createReservationCustomerForm()).toEqual({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      documentNumber: '',
    })
  })

  it('detects when availability inputs are ready', () => {
    expect(
      isReservationAvailabilityReady({
        pickupStationId: 1,
        pickupAt: '2026-09-10T09:00',
        expectedReturnAt: '2026-09-12T09:00',
      }),
    ).toBe(true)

    expect(
      isReservationAvailabilityReady({
        pickupStationId: 0,
        pickupAt: '',
        expectedReturnAt: '',
      }),
    ).toBe(false)
  })

  it('validates the create flow for both existing and new customers', () => {
    expect(
      validateReservationCreateForm({
        customerMode: 'existing',
        selectedCustomerId: 0,
        newCustomer: createReservationCustomerForm(),
        form: createReservationForm(),
      }),
    ).toEqual({
      customerId: 'Seleciona um cliente existente.',
      pickupStationId: 'Seleciona a estacao de levantamento.',
      returnStationId: 'Seleciona a estacao de devolucao.',
      vehicleId: 'Seleciona uma viatura disponivel.',
      pickupAt: 'Indica a data de levantamento.',
      expectedReturnAt: 'Indica a data de devolucao.',
    })

    expect(
      validateReservationCreateForm({
        customerMode: 'new',
        selectedCustomerId: 0,
        newCustomer: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          documentNumber: '',
        },
        form: {
          pickupStationId: 1,
          returnStationId: 2,
          vehicleId: 3,
          pickupAt: '2026-09-12T09:00',
          expectedReturnAt: '2026-09-11T09:00',
          notes: '',
        },
      }),
    ).toEqual({
      customerFirstName: 'Indica o nome do novo cliente.',
      customerLastName: 'Indica o apelido do novo cliente.',
      period:
        'A data de devolucao tem de ser posterior a data de levantamento.',
    })
  })

  it('builds the API payload for an existing customer reservation', () => {
    expect(
      buildCreateReservationPayload({
        customerMode: 'existing',
        selectedCustomerId: 7,
        newCustomer: createReservationCustomerForm(),
        form: {
          pickupStationId: 1,
          returnStationId: 2,
          vehicleId: 4,
          pickupAt: '2026-09-10T09:00',
          expectedReturnAt: '2026-09-12T09:00',
          notes: '  Reserva prioritara  ',
        },
      }),
    ).toEqual({
      pickupStationId: 1,
      returnStationId: 2,
      vehicleId: 4,
      pickupAt: new Date('2026-09-10T09:00').toISOString(),
      expectedReturnAt: new Date('2026-09-12T09:00').toISOString(),
      notes: 'Reserva prioritara',
      customerId: 7,
    })
  })

  it('builds the API payload for a newly created customer', () => {
    expect(
      buildCreateReservationPayload({
        customerMode: 'new',
        selectedCustomerId: 0,
        newCustomer: {
          firstName: '  Maria ',
          lastName: ' Santos  ',
          email: '  Maria.Santos@Example.com ',
          phone: ' +351912000000 ',
          documentNumber: ' 123123123 ',
        },
        form: {
          pickupStationId: 1,
          returnStationId: 1,
          vehicleId: 2,
          pickupAt: '2026-09-15T09:00',
          expectedReturnAt: '2026-09-16T09:00',
          notes: '',
        },
      }),
    ).toEqual({
      pickupStationId: 1,
      returnStationId: 1,
      vehicleId: 2,
      pickupAt: new Date('2026-09-15T09:00').toISOString(),
      expectedReturnAt: new Date('2026-09-16T09:00').toISOString(),
      notes: '',
      customerFirstName: 'Maria',
      customerLastName: 'Santos',
      customerEmail: 'maria.santos@example.com',
      customerPhone: '+351912000000',
      customerDocumentNumber: '123123123',
    })
  })
})
