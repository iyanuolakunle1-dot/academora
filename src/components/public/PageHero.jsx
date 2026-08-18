import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiChevronRight, FiHome, FiCheckCircle, FiStar } from 'react-icons/fi'

export default function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  crumb,
  actions,
  badgeText = 'Excellence in Education',
  highlights = []
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50/70 via-white to-primary-100/40 dark:from-primary-950 dark:via-primary-900 dark:to-primary-950 py-14 lg:py-20 text-app-primary dark:text-white border-b app-border dark:border-white/5 transition-colors duration-200">
      {/* Background Glows */}
      <div className="pointer-events-none absolute -right-24 top-1/2 h-[450px] w-[450px] -translate-y-1/2 rounded-full bg-gradient-to-br from-accent-500/15 to-primary-500/10 dark:from-accent-500/20 dark:to-primary-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-primary-500/10 dark:bg-primary-600/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 lg:grid-cols-12 lg:px-8">
        {/* Left Column Content */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-8 flex flex-col items-start"
        >
          {/* Breadcrumb Navigation */}
          {crumb && (
            <div className="mb-4 flex items-center gap-1.5 text-xs text-app-secondary dark:text-white/70">
              <FiHome className="h-3.5 w-3.5 text-accent-500" />
              <Link to="/" className="hover:text-accent-600 dark:hover:text-accent-300 transition-colors">
                Home
              </Link>
              <FiChevronRight className="h-3 w-3 opacity-40" />
              <span className="text-accent-600 dark:text-accent-300 font-semibold">{crumb}</span>
            </div>
          )}

          {/* Eyebrow Pill */}
          {eyebrow && (
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/20 bg-accent-500/10 dark:border-accent-400/30 dark:bg-accent-500/15 px-3.5 py-1 text-xs font-semibold text-accent-600 dark:text-accent-300 mb-3 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-500 animate-pulse" />
              <span>{eyebrow}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl text-app-primary dark:text-white">
            {title}{' '}
            {highlight && (
              <span className="bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-transparent">
                {highlight}
              </span>
            )}
          </h1>

          {/* Description */}
          {description && (
            <p className="mt-4 max-w-2xl text-base sm:text-lg text-app-secondary dark:text-white/80 leading-relaxed">
              {description}
            </p>
          )}

          {/* Action Buttons */}
          {actions && <div className="mt-7 flex flex-wrap items-center gap-3">{actions}</div>}
        </motion.div>

        {/* Right Column Highlights Deck */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-4"
        >
          <div className="rounded-3xl border app-border dark:border-white/15 app-surface dark:bg-white/10 p-6 shadow-card hover:shadow-soft transition-all backdrop-blur-md">
            <div className="flex items-center gap-2.5 border-b app-border dark:border-white/10 pb-3.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 text-white font-bold text-sm shadow-soft">
                A
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-app-primary dark:text-white">
                  Academora
                </p>
                <p className="text-[11px] text-accent-600 dark:text-accent-300 font-semibold">
                  {badgeText}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {(highlights.length > 0
                ? highlights
                : [
                  { title: 'Accredited Curriculum', desc: 'Cambridge & National WAEC' },
                  { title: 'Expert Faculty', desc: '1:12 Dedicated Teacher Ratio' },
                  { title: 'Global Placements', desc: '100% University Acceptance' }
                ]
              ).map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-2xl app-surface-2 dark:bg-white/5 p-3 border app-border dark:border-white/5"
                >
                  <FiCheckCircle className="h-4 w-4 text-accent-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-app-primary dark:text-white">{h.title}</p>
                    <p className="text-[11px] text-app-secondary dark:text-white/70">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t app-border dark:border-white/10 flex items-center justify-between text-[11px] text-app-secondary dark:text-white/70">
              <span className="flex items-center gap-1 font-semibold text-app-primary dark:text-white">
                <FiStar className="h-3 w-3 text-amber-500 fill-amber-500" /> Top Ranked
              </span>
              <span className="text-accent-600 dark:text-accent-300 font-bold">Session 2024/2025</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
