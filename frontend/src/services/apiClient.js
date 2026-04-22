const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://127.0.0.1:3000'

// Shared JSON client so feature services only describe endpoints and contracts.
export async function getJson(path, options = {}) {
  return executeJsonRequest(path, {
    method: 'GET',
    ...options,
  })
}

export async function postJson(path, options = {}) {
  return executeJsonRequest(path, {
    method: 'POST',
    ...options,
  })
}

export async function putJson(path, options = {}) {
  return executeJsonRequest(path, {
    method: 'PUT',
    ...options,
  })
}

export async function deleteJson(path, options = {}) {
  return executeJsonRequest(path, {
    method: 'DELETE',
    ...options,
  })
}

export async function patchJson(path, options = {}) {
  return executeJsonRequest(path, {
    method: 'PATCH',
    ...options,
  })
}

async function executeJsonRequest(
  path,
  { method, body, token, headers = {}, fallbackMessage },
) {
  const requestHeaders = {
    ...headers,
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    const error = new Error(
      'Nao foi possivel contactar a API. Verifica se o backend esta ativo em http://127.0.0.1:3000.',
    )
    error.code = 'API_UNREACHABLE'
    throw error
  }

  const responseBody = await parseJson(response)

  if (!response.ok) {
    throw buildApiError(response, responseBody, fallbackMessage)
  }

  return responseBody
}

function buildApiError(response, responseBody, fallbackMessage) {
  const error = new Error(
    typeof responseBody?.message === 'string'
      ? responseBody.message
      : fallbackMessage || 'O pedido falhou.',
  )

  error.status = response.status
  error.code = responseBody?.code
  error.errors = Array.isArray(responseBody?.errors)
    ? responseBody.errors
    : Array.isArray(responseBody?.details)
      ? responseBody.details
      : []
  error.alternatives = Array.isArray(responseBody?.alternatives)
    ? responseBody.alternatives
    : []

  return error
}

async function parseJson(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}
