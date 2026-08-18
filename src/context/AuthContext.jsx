import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)
const CACHE_KEY = 'academora-profile-cache'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null)
      localStorage.removeItem(CACHE_KEY)
      return
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!error && data) {
      setProfile(data)
      localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    }
  }, [])

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      if (data.session?.user?.id) loadProfile(data.session.user.id)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (newSession?.user?.id) {
        loadProfile(newSession.user.id)
      } else {
        setProfile(null)
        localStorage.removeItem(CACHE_KEY)
      }
    })

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [loadProfile])

  const signUp = useCallback(async ({ email, password, fullName, role = 'student' }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role }
      }
    })
    if (error) throw error

    if (data?.user?.id) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        email,
        role
      })
    }
    return data
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }, [])

  const switchRole = useCallback(async (newRole) => {
    if (!session?.user?.id) return
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', session.user.id)
    if (error) throw error
    await loadProfile(session.user.id)
  }, [session?.user?.id, loadProfile])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setProfile(null)
    localStorage.removeItem(CACHE_KEY)
  }, [])

  const resetPassword = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
  }, [])

  const refreshProfile = useCallback(() => {
    if (session?.user?.id) return loadProfile(session.user.id)
  }, [session, loadProfile])

  const value = {
    session,
    user: session?.user || null,
    profile,
    role: profile?.role || null,
    loading,
    signUp,
    signIn,
    switchRole,
    signOut,
    resetPassword,
    refreshProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
