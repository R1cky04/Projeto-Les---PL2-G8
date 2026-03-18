const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';

export async function createInternalUser(payload) {
  const response = await fetch(`${API_BASE_URL}/internal-users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-actor-role': 'IT',
    },
    body: JSON.stringify(payload),
  });

  const body = await parseJson(response);

  if (!response.ok) {
    const error = new Error(
      typeof body?.message === 'string'
        ? body.message
        : 'Nao foi possivel criar o utilizador.',
    );

    error.status = response.status;
    error.errors = Array.isArray(body?.errors) ? body.errors : [];
    error.code = body?.code;

    throw error;
  }

  return body;
}

async function parseJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
