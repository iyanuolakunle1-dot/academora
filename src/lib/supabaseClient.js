import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    '[Academora] Missing Supabase env vars. Fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in client/.env'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'academora-auth'
  }
})

// Local Storage TTL Caching Layer
const CACHE_PREFIX = 'academora_cache_'
const DEFAULT_TTL_MS = 5 * 60 * 1000 // 5 minutes

export function getCached(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const { data, expiresAt } = JSON.parse(raw)
    if (Date.now() > expiresAt) {
      localStorage.removeItem(CACHE_PREFIX + key)
      return null
    }
    return data
  } catch (err) {
    return null
  }
}

export function setCached(key, data, ttlMs = DEFAULT_TTL_MS) {
  try {
    localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ data, expiresAt: Date.now() + ttlMs })
    )
  } catch (err) {
    // Storage full or unavailable
  }
}

export function invalidateCache(keyPattern) {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX) && (!keyPattern || k.includes(keyPattern)))
      .forEach((k) => localStorage.removeItem(k))
  } catch (err) {
    // Ignore
  }
}
