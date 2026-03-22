const USER_ID_PATTERN = /^[a-z0-9._-]{4,30}$/

// Login form helpers keep the container focused on orchestration instead of
// inline validation noise.
export function createLoginForm() {
  return {
    userId: '',
    password: '',
  }
}

export function buildLoginPayload(form) {
  const userId = typeof form?.userId === 'string' ? form.userId : ''
  const password = typeof form?.password === 'string' ? form.password : ''

  return {
    userId: userId.trim().toLowerCase(),
    password: password.trim(),
  }
}

export function validateLoginForm(form) {
  const errors = {}
  const payload = buildLoginPayload(form)

  if (!payload.userId) {
    errors.userId = 'O User ID e obrigatorio.'
  } else if (!USER_ID_PATTERN.test(payload.userId)) {
    errors.userId =
      'O User ID deve ter entre 4 e 30 caracteres e usar apenas letras minusculas, numeros, ponto, underscore ou hifen.'
  }

  if (!payload.password) {
    errors.password = 'A password e obrigatoria.'
  }

  return errors
}

export function mapLoginApiErrors(errors) {
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
