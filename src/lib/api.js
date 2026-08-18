import { supabase } from './supabaseClient'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function apiRequest(path, { method = 'GET', body } = {}) {
  const { data } = await supabase.auth.getSession()
  const token = data?.session?.access_token

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(json.error || 'Request failed.')
  }
  return json
}
