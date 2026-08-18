import React from 'react'
import { motion } from 'framer-motion'

export function StatStrip({ stats, className = '' }) {
  return (
    <div className={`mx-auto max-w-7xl px-4 lg:px-8 ${className}`}>
      <div className="rounded-2xl app-surface border app-border shadow-sm p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x app-border">
          {stats.map(({ icon: Icon, value, label, subtext }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="flex flex-col items-center text-center px-3 py-3 first:pt-0 sm:first:pt-3"
            >
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-300">
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-app-primary">
                {value}
              </p>
              <p className="text-xs font-semibold text-app-primary mt-1">{label}</p>
              {subtext && <p className="text-[10px] text-app-secondary mt-0.5">{subtext}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  center = true,
  className = ''
}) {
  return (
    <div className={`max-w-3xl ${center ? 'mx-auto text-center' : ''} ${className}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-accent-600 dark:text-accent-400 mb-3 border border-accent-500/20">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-app-primary sm:text-4xl lg:text-5xl leading-tight">
        {title}{' '}
        {highlight && (
          <span className="bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-transparent">
            {highlight}
          </span>
        )}
      </h2>
      {description && (
        <p className="mt-4 text-base text-app-secondary leading-relaxed sm:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}

export function FeatureCard({ icon: Icon, title, description, badge, index = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className={`group relative flex flex-col justify-between rounded-2xl app-surface border app-border p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 ${className}`}
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-sm group-hover:scale-105 transition-transform">
            <Icon className="h-6 w-6" />
          </div>
          {badge && (
            <span className="rounded-full bg-primary-50 dark:bg-primary-900/40 px-2.5 py-1 text-xs font-semibold text-primary-600 dark:text-primary-300">
              {badge}
            </span>
          )}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-app-primary">{title}</h3>
        <p className="text-sm text-app-secondary leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

export function ImageFrame({ icon: Icon, className = '' }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600 text-white/90 shadow-sm ${className}`}
    >
      <Icon className="h-16 w-16 opacity-90" />
    </div>
  )
}
