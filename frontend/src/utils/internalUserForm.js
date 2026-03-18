// Frontend copy of the form rules. Keep aligned with
// backend/src/internal-users/internal-user-validation.ts.
const USER_ID_PATTERN = /^[a-z0-9._-]{4,30}$/

export function createInternalUserForm(defaultRole) {
  return {
    userId: '',
    password: '',
    role: defaultRole,
  }
}

export function buildCreateInternalUserPayload(form) {
  const userId = typeof form?.userId === 'string' ? form.userId : ''
  const password = typeof form?.password === 'string' ? form.password : ''
  const role = typeof form?.role === 'string' ? form.role : ''

  return {
    userId: userId.trim().toLowerCase(),
    password,
    role,
  }
}

export function validateInternalUserForm(form) {
  const errors = {}
  const userId = typeof form?.userId === 'string' ? form.userId : ''
  const password = typeof form?.password === 'string' ? form.password : ''
  const role = typeof form?.role === 'string' ? form.role : ''
  const normalizedUserId = userId.trim().toLowerCase()

  if (!normalizedUserId) {
    errors.userId = 'O User ID e obrigatorio.'
  } else if (!USER_ID_PATTERN.test(normalizedUserId)) {
    errors.userId =
      'Usa entre 4 e 30 caracteres com letras minusculas, numeros, ponto, underscore ou hifen.'
  }

  // Fail fast in the UI, but keep server-side validation authoritative.
  if (!password) {
    errors.password = 'A password e obrigatoria.'
  } else if (password.length < 8) {
    errors.password = 'A password deve ter pelo menos 8 caracteres.'
  }

  if (!/[a-z]/.test(password)) {
    errors.password = errors.password || 'A password deve incluir uma letra minuscula.'
  }

  if (!/[A-Z]/.test(password)) {
    errors.password = errors.password || 'A password deve incluir uma letra maiuscula.'
  }

  if (!/[0-9]/.test(password)) {
    errors.password = errors.password || 'A password deve incluir um numero.'
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.password = errors.password || 'A password deve incluir um caractere especial.'
  }

  if (!role) {
    errors.role = 'Seleciona um tipo de utilizador.'
  }

  return errors
}

export function mapInternalUserApiErrors(errors) {
  // Nest-style validation errors arrive as a list; the form expects a field map.
  if (!Array.isArray(errors)) {
    return {}
  }

  return errors.reduce((mappedErrors, error) => {
    if (error?.field && error?.message && !mappedErrors[error.field]) {
      mappedErrors[error.field] = error.message
    }

    return mappedErrors
  }, {})
}
