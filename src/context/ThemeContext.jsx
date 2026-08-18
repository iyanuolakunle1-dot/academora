import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

const ThemeContext = createContext(null)
const STORAGE_KEY = 'academora-theme'

function getSystemPref() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(mode) {
  const root = document.documentElement
  const resolved = mode === 'system' ? getSystemPref() : mode
  root.classList.toggle('dark', resolved === 'dark')
  return resolved
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem(STORAGE_KEY) || 'system')
  const [resolvedTheme, setResolvedTheme] = useState('light')

  useEffect(() => {
    setResolvedTheme(applyTheme(theme))
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setResolvedTheme(applyTheme('system'))
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [theme])

  const setTheme = useCallback((mode) => setThemeState(mode), [])
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const current = prev === 'system' ? getSystemPref() : prev
      return current === 'dark' ? 'light' : 'dark'
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
