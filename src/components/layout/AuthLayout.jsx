import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShield, FiUsers, FiBookOpen, FiTrendingUp } from 'react-icons/fi'
import ThemeToggle from '../ui/ThemeToggle'

import { STOCK_IMAGES } from '../../lib/stockImages'

const highlights = [
  { icon: FiUsers, text: '1,500+ students already learning with Academora' },
  { icon: FiBookOpen, text: 'Track courses, results, attendance & fees in one place' },
  { icon: FiShield, text: 'Your data is encrypted and access-controlled' },
  { icon: FiTrendingUp, text: 'Real-time progress insights for every session' }
]

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary-950 p-10 text-white lg:flex">
        {/* Background Photo & Overlays */}
        <img
          src={STOCK_IMAGES.authCover}
          alt="Academora Campus"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/80 to-primary-900/60" />
        <div className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl" />
        <Link to="/" className="relative flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 font-display text-lg font-bold">A</div>
          <div>
            <p className="font-display text-lg font-bold">ACADEMORA</p>
            <p className="text-[10px] uppercase tracking-widest text-accent-400">Empowering Minds, Shaping Futures</p>
          </div>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative">
          <h2 className="font-display text-3xl font-bold leading-snug">
            Your academic journey, <span className="text-accent-400">all in one portal.</span>
          </h2>
          <div className="mt-8 space-y-4">
            {highlights.map((h) => (
              <div key={h.text} className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                  <h.icon className="h-4 w-4 text-accent-400" />
                </div>
                <p className="text-sm text-white/80">{h.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="relative text-xs text-white/40">&copy; {new Date().getFullYear()} Academora. All rights reserved.</p>
      </div>

      <div className="flex flex-col justify-center px-4 py-10 sm:px-10 lg:px-16">
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 font-display font-bold text-white">A</div>
            <p className="font-display font-bold text-app-primary">ACADEMORA</p>
          </Link>
          <ThemeToggle compact />
        </div>
        <div className="mb-2 hidden justify-end lg:flex">
          <ThemeToggle compact />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto w-full max-w-md"
        >
          <h1 className="font-display text-2xl font-bold text-app-primary">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-app-secondary">{subtitle}</p>}
          <div className="mt-7">{children}</div>
        </motion.div>
      </div>
    </div>
  )
}
