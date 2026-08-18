import React, { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMenu, FiX, FiLock, FiPhone, FiMail, FiArrowRight, FiUser,
  FiChevronDown, FiBookOpen, FiHeart, FiBriefcase, FiShield
} from 'react-icons/fi'
import ThemeToggle from '../ui/ThemeToggle'
import Button from '../ui/Button'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/academics', label: 'Academics' },
  { to: '/admissions', label: 'Admissions' },
  { to: '/student-life', label: 'Student Life' },
  { to: '/news-events', label: 'News & Events' },
  { to: '/contact', label: 'Contact' }
]

const portalOptions = [
  { title: 'Student Portal', desc: 'Course registration, results & timetable', icon: FiBookOpen, color: 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60' },
  { title: 'Parent Portal', desc: 'Ward tracking, fees & term reports', icon: FiHeart, color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60' },
  { title: 'Faculty & Teacher', desc: 'Class rosters, grading & attendance', icon: FiBriefcase, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60' }
]

export default function PublicNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [portalMenuOpen, setPortalMenuOpen] = useState(false)
  const portalMenuRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
    setPortalMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (portalMenuRef.current && !portalMenuRef.current.contains(e.target)) {
        setPortalMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Utility Bar */}
      <div className="hidden border-b border-slate-200/60 bg-slate-50/80 px-4 py-1.5 text-xs text-slate-600 dark:border-slate-800/80 dark:bg-slate-950/80 dark:text-slate-400 sm:block lg:px-8 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6 text-[11px] font-medium">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>2024/2025 Academic Session Admissions Active</span>
            </span>
            <span className="hidden md:flex items-center gap-1 text-slate-400 dark:text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors">
              <FiPhone className="h-3 w-3 text-accent-500" />
              <span>+234 (0) 800-ACADEMORA</span>
            </span>
            <span className="hidden lg:flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors">
              <FiMail className="h-3 w-3 text-accent-500" />
              <span>admissions@academora.edu.ng</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link
              to="/login"
              className="flex items-center gap-1.5 font-semibold text-slate-700 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors"
            >
              <FiLock className="h-3 w-3 text-accent-500" />
              <span>Integrated Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main University Navbar */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-slate-950/95 shadow-sm border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md'
            : 'bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 lg:px-8">
          {/* Logo Brand */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white font-display font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              A
            </div>
            <div className="leading-none">
              <p className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                ACADEMORA
              </p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-accent-600 dark:text-accent-400 mt-1">
                University & College
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-primary-700 dark:text-primary-300 font-semibold bg-primary-50/70 dark:bg-primary-950/60'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-900/60'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Group */}
          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle compact />

            {/* Portal Dropdown Menu */}
            <div className="relative" ref={portalMenuRef}>
              <button
                type="button"
                onClick={() => setPortalMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <FiLock className="h-3.5 w-3.5 text-accent-500" />
                <span>Portal Login</span>
                <FiChevronDown className={`h-3.5 w-3.5 opacity-60 transition-transform ${portalMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {portalMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl z-50"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Select Campus Portal
                      </p>
                    </div>

                    <div className="mt-1 space-y-1">
                      {portalOptions.map((p) => {
                        const Icon = p.icon
                        return (
                          <Link
                            key={p.title}
                            to="/login"
                            className="flex items-start gap-2.5 rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors group"
                          >
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${p.color}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                {p.title}
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                                {p.desc}
                              </p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              as={Link}
              to="/signup"
              size="sm"
              className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm font-semibold text-xs px-4"
              iconRight={<FiArrowRight className="h-3.5 w-3.5" />}
            >
              Apply Now
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle compact />
            <button
              onClick={() => setOpen((o) => !o)}
              className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-6 lg:hidden shadow-lg"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-950/60'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <Link
                  to="/login"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border app-border app-surface p-2.5 text-xs font-bold text-app-primary"
                >
                  <FiLock className="h-4 w-4 text-accent-500" />
                  <span>University Portal Sign In</span>
                </Link>

                <Button as={Link} to="/signup" className="w-full justify-center text-xs">
                  Apply for Admission
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
