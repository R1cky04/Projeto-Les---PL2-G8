// Frontend copy of the edit rules. Backend validation remains authoritative.
const USER_ID_PATTERN = /^[a-z0-9._-]{4,30}$/

export function createInternalUserManagementForm() {
  return {
    id: '',
    userId: '',
    password: '',
    role: '',
    status: 'ACTIVE',
    isActive: true,
    createdAt: null,
  }
}

export function buildInternalUserManagementForm(user) {
  const form = createInternalUserManagementForm()

  if (!user || typeof user !== 'object') {
    return form
  }

  return {
    id: typeof user.id === 'string' ? user.id : '',
    userId: typeof user.userId === 'string' ? user.userId : '',
    password: '',
    role: typeof user.internalRole === 'string' ? user.internalRole : '',
    status: typeof user.internalStatus === 'string' ? user.internalStatus : 'ACTIVE',
    isActive: user.isActive !== false,
    createdAt: user.createdAt || null,
  }
}

export function buildUpdateInternalUserPayload(form) {
  const normalizedPassword =
    typeof form?.password === 'string' ? form.password.trim() : ''
  const payload = {
    userId: typeof form?.userId === 'string' ? form.userId.trim().toLowerCase() : '',
    role: typeof form?.role === 'string' ? form.role : '',
    status: typeof form?.status === 'string' ? form.status : '',
    isActive: form?.isActive === true,
  }

  if (normalizedPassword) {
    payload.password = normalizedPassword
  }

  return payload
}

export function validateInternalUserManagementForm(form) {
  const errors = {}
  const payload = buildUpdateInternalUserPayload(form)

  if (!payload.userId) {
    errors.userId = 'O User ID e obrigatorio.'
  } else if (!USER_ID_PATTERN.test(payload.userId)) {
    errors.userId =
      'Usa entre 4 e 30 caracteres com letras minusculas, numeros, ponto, underscore ou hifen.'
  }

  if (!payload.role) {
    errors.role = 'Seleciona um tipo de utilizador.'
  }

  if (!payload.status) {
    errors.status = 'Seleciona um estado de conta.'
  }

  if (typeof payload.password === 'string' && payload.password.length > 0) {
    if (payload.password.length < 8) {
      errors.password = 'A password deve ter pelo menos 8 caracteres.'
    } else if (!/[a-z]/.test(payload.password)) {
      errors.password = 'A password deve incluir uma letra minuscula.'
    } else if (!/[A-Z]/.test(payload.password)) {
      errors.password = 'A password deve incluir uma letra maiuscula.'
    } else if (!/[0-9]/.test(payload.password)) {
      errors.password = 'A password deve incluir um numero.'
    } else if (!/[^A-Za-z0-9]/.test(payload.password)) {
      errors.password = 'A password deve incluir um caractere especial.'
    }
  }

  if (typeof form?.isActive !== 'boolean') {
    errors.isActive = 'Indica se a conta deve permanecer ativa.'
  }

  return errors
}
