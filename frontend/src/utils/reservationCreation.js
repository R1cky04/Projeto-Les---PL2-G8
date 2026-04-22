function normalizeText(value) {
  return String(value || '').trim()
}

export function createReservationForm() {
  return {
    pickupStationId: 0,
    returnStationId: 0,
    vehicleId: 0,
    pickupAt: '',
    expectedReturnAt: '',
    notes: '',
  }
}

export function createReservationCustomerForm() {
  return {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    documentNumber: '',
  }
}

export function isReservationAvailabilityReady(form) {
  return (
    Number.isInteger(Number(form?.pickupStationId)) &&
    Number(form?.pickupStationId) > 0 &&
    normalizeText(form?.pickupAt) !== '' &&
    normalizeText(form?.expectedReturnAt) !== ''
  )
}

export function validateReservationCreateForm({
  customerMode,
  selectedCustomerId,
  newCustomer,
  form,
}) {
  const errors = {}

  if (customerMode === 'existing') {
    if (!Number.isInteger(Number(selectedCustomerId)) || Number(selectedCustomerId) < 1) {
      errors.customerId = 'Seleciona um cliente existente.'
    }
  } else {
    if (!normalizeText(newCustomer?.firstName)) {
      errors.customerFirstName = 'Indica o nome do novo cliente.'
    }

    if (!normalizeText(newCustomer?.lastName)) {
      errors.customerLastName = 'Indica o apelido do novo cliente.'
    }
  }

  if (!Number.isInteger(Number(form?.pickupStationId)) || Number(form?.pickupStationId) < 1) {
    errors.pickupStationId = 'Seleciona a estacao de levantamento.'
  }

  if (!Number.isInteger(Number(form?.returnStationId)) || Number(form?.returnStationId) < 1) {
    errors.returnStationId = 'Seleciona a estacao de devolucao.'
  }

  if (!Number.isInteger(Number(form?.vehicleId)) || Number(form?.vehicleId) < 1) {
    errors.vehicleId = 'Seleciona uma viatura disponivel.'
  }

  if (!normalizeText(form?.pickupAt)) {
    errors.pickupAt = 'Indica a data de levantamento.'
  }

  if (!normalizeText(form?.expectedReturnAt)) {
    errors.expectedReturnAt = 'Indica a data de devolucao.'
  }

  if (
    normalizeText(form?.pickupAt) &&
    normalizeText(form?.expectedReturnAt)
  ) {
    const pickupAt = new Date(form.pickupAt)
    const expectedReturnAt = new Date(form.expectedReturnAt)

    if (
      Number.isNaN(pickupAt.getTime()) ||
      Number.isNaN(expectedReturnAt.getTime())
    ) {
      errors.period = 'As datas indicadas sao invalidas.'
    } else if (expectedReturnAt.getTime() <= pickupAt.getTime()) {
      errors.period =
        'A data de devolucao tem de ser posterior a data de levantamento.'
    }
  }

  return errors
}

export function buildCreateReservationPayload({
  customerMode,
  selectedCustomerId,
  newCustomer,
  form,
}) {
  const payload = {
    pickupStationId: Number(form.pickupStationId),
    returnStationId: Number(form.returnStationId),
    vehicleId: Number(form.vehicleId),
    pickupAt: new Date(form.pickupAt).toISOString(),
    expectedReturnAt: new Date(form.expectedReturnAt).toISOString(),
    notes: normalizeText(form.notes),
  }

  if (customerMode === 'existing') {
    return {
      ...payload,
      customerId: Number(selectedCustomerId),
    }
  }

  return {
    ...payload,
    customerFirstName: normalizeText(newCustomer.firstName),
    customerLastName: normalizeText(newCustomer.lastName),
    customerEmail: normalizeText(newCustomer.email).toLowerCase(),
    customerPhone: normalizeText(newCustomer.phone),
    customerDocumentNumber: normalizeText(newCustomer.documentNumber),
  }
}
