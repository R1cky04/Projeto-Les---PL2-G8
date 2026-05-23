import axios from 'axios'

const API_BASE = process.env.VUE_APP_API_BASE_URL || 'http://127.0.0.1:3000'

export async function searchMakes(q) {
  const res = await axios.get(`${API_BASE}/catalog/makes`, { params: { q } })
  return res.data || []
}

export async function listModels(makeId, q, year, limit) {
  const params = { makeId, q }

  if (year !== undefined && year !== null) {
    params.year = year
  }

  if (limit !== undefined && limit !== null) {
    params.limit = limit
  }

  const res = await axios.get(`${API_BASE}/catalog/models`, { params })
  return res.data || []
}

export async function listVariants(modelId, q) {
  const res = await axios.get(`${API_BASE}/catalog/variants`, { params: { modelId, q } })
  return res.data || []
}

export async function vinLookup(vin) {
  const res = await axios.post(`${API_BASE}/catalog/vin/lookup`, { vin })
  return res.data
}
