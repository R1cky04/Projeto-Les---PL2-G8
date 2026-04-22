/* eslint-env jest */
import { getJson, postJson, putJson } from './apiClient'

// API client tests focus on request wiring and normalized error contracts.
describe('apiClient', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('sends JSON requests with bearer authorization when provided', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ ok: true }),
    })

    await postJson('/auth/login', {
      body: { userId: 'it.master', password: 'Secret123!' },
      token: 'token-123',
    })

    expect(global.fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:3000/auth/login',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer token-123',
          'Content-Type': 'application/json',
        }),
      }),
    )
  })

  it('supports authenticated PUT requests for update flows', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ ok: true }),
    })

    await putJson('/internal-users/user-1', {
      body: { userId: 'staff.updated' },
      token: 'token-456',
    })

    expect(global.fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:3000/internal-users/user-1',
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          Authorization: 'Bearer token-456',
          'Content-Type': 'application/json',
        }),
      }),
    )
  })

  it('normalizes API failures into a predictable error shape', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 403,
      json: jest.fn().mockResolvedValue({
        message: 'Sessao invalida.',
        code: 'INVALID_SESSION',
        errors: [{ field: 'userId', message: 'Invalido.' }],
      }),
    })

    await expect(getJson('/auth/me')).rejects.toMatchObject({
      message: 'Sessao invalida.',
      status: 403,
      code: 'INVALID_SESSION',
      errors: [{ field: 'userId', message: 'Invalido.' }],
    })
  })

  it('maps backend details and alternatives when the API returns them', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        message: 'O veiculo selecionado ja nao esta disponivel.',
        code: 'VEHICLE_UNAVAILABLE',
        details: ['Selecione outra viatura.'],
        alternatives: [{ id: 4, plateNumber: '44-EF-66' }],
      }),
    })

    await expect(getJson('/reservations/availability')).rejects.toMatchObject({
      message: 'O veiculo selecionado ja nao esta disponivel.',
      status: 400,
      code: 'VEHICLE_UNAVAILABLE',
      errors: ['Selecione outra viatura.'],
      alternatives: [{ id: 4, plateNumber: '44-EF-66' }],
    })
  })
})
