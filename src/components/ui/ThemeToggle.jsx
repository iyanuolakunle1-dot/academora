import React, { useState, useRef, useEffect } from 'react'
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

const options = [
  { key: 'light', label: 'Light', icon: FiSun },
  { key: 'dark', label: 'Dark', icon: FiMoon },
  { key: 'system', label: 'System', icon: FiMonitor }
]

export default function ThemeToggle({ compact = false, className = '' }) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const CurrentIcon = resolvedTheme === 'dark' ? FiMoon : FiSun

  if (compact) {
    return (
      <button
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        className={`relative h-9 w-9 flex items-center justify-center rounded-xl border app-border app-surface-2 text-app-primary hover:scale-105 active:scale-95 transition-all ${className}`}
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={resolvedTheme}
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.2 }}
          >
            <CurrentIcon className="h-4.5 w-4.5" />
          </motion.span>
        </AnimatePresence>
      </button>
    )
  }

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border app-border app-surface-2 px-3 py-2 text-sm font-medium text-app-primary hover:brightness-95 transition"
      >
        <CurrentIcon className="h-4 w-4" />
        <span className="capitalize">{theme}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-40 rounded-xl border app-border app-surface shadow-soft p-1.5 z-50"
          >
            {options.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => {
                  setTheme(key)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  theme === key
                    ? 'bg-primary-600 text-white'
                    : 'text-app-primary hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
