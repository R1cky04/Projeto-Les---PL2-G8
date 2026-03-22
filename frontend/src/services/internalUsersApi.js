import { getJson, postJson, deleteJson } from './apiClient'

function createPagination(page, pageSize, totalItems) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  }
}

function normalizeInternalUsersListResponse(response, page, pageSize) {
  // Keep the client resilient while some runtimes still answer with the
  // legacy array contract instead of the paginated payload.
  if (Array.isArray(response)) {
    return {
      items: response,
      pagination: createPagination(page, pageSize, response.length),
    }
  }

  const items = Array.isArray(response?.items) ? response.items : []
  const pagination = response?.pagination

  if (pagination && typeof pagination.totalItems === 'number') {
    return {
      items,
      pagination,
    }
  }

  return {
    items,
    pagination: createPagination(page, pageSize, items.length),
  }
}

// Internal user creation now consumes the authenticated bearer token issued by
// the real login flow.
export function createInternalUser(payload, sessionToken) {
  return postJson('/internal-users', {
    body: payload,
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel criar o utilizador.',
  })
}

export async function fetchInternalUsers(sessionToken, options = {}) {
  const page = options.page || 1
  const pageSize = options.pageSize || 10
  const search = typeof options.search === 'string' ? options.search.trim() : ''
  const params = new URLSearchParams()

  params.set('page', String(page))
  params.set('pageSize', String(pageSize))

  if (search) {
    params.set('search', search)
  }

  const response = await getJson(`/internal-users?${params.toString()}`, {
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel carregar a lista de utilizadores.',
  })

  return normalizeInternalUsersListResponse(response, page, pageSize)
}

export function deleteInternalUser(id, sessionToken) {
  return deleteJson(`/internal-users/${id}`, {
    token: sessionToken,
    fallbackMessage: 'Nao foi possivel eliminar o utilizador.',
  })
}
