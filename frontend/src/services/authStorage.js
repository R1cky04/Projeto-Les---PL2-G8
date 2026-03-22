const AUTH_SESSION_TOKEN_KEY = 'pl2g8.internal-session-token'

// Keep browser persistence in one place so the rest of the app remains easy to
// test and reason about.
export function readStoredSessionToken(storage = getBrowserStorage()) {
  return storage?.getItem(AUTH_SESSION_TOKEN_KEY) || ''
}

export function storeSessionToken(token, storage = getBrowserStorage()) {
  if (!storage || typeof token !== 'string' || token.length === 0) {
    return
  }

  storage.setItem(AUTH_SESSION_TOKEN_KEY, token)
}

export function clearStoredSessionToken(storage = getBrowserStorage()) {
  storage?.removeItem(AUTH_SESSION_TOKEN_KEY)
}

function getBrowserStorage() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null
  }

  return window.localStorage
}
