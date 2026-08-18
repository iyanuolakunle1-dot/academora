import React from 'react'
import { motion } from 'framer-motion'

export function StatCard({ icon: Icon, label, value, hint, tone = 'primary', index = 0 }) {
  const tones = {
    primary: 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300',
    accent: 'bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl app-surface border app-border p-5 shadow-card"
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs text-app-secondary">{label}</p>
          <p className="font-display text-xl font-bold text-app-primary">{value}</p>
        </div>
      </div>
      {hint && <p className="mt-2 text-xs text-app-secondary">{hint}</p>}
    </motion.div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed app-border p-10 text-center">
      {Icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full app-surface-2 text-app-secondary">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <p className="font-semibold text-app-primary">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-app-secondary">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton rounded-2xl ${className}`} />
}
