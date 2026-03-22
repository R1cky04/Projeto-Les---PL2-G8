/* eslint-env jest */
import {
  clearStoredSessionToken,
  readStoredSessionToken,
  storeSessionToken,
} from './authStorage'

function createStorageDouble() {
  const values = new Map()

  return {
    getItem: jest.fn((key) => values.get(key) || null),
    setItem: jest.fn((key, value) => values.set(key, value)),
    removeItem: jest.fn((key) => values.delete(key)),
  }
}

// Storage tests keep browser persistence explicit and side-effect free.
describe('authStorage', () => {
  it('stores, reads and clears the session token', () => {
    const storage = createStorageDouble()

    storeSessionToken('token-123', storage)
    expect(readStoredSessionToken(storage)).toBe('token-123')

    clearStoredSessionToken(storage)
    expect(readStoredSessionToken(storage)).toBe('')
  })
})
