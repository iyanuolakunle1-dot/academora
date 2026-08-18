import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FiMenu, FiBell, FiMail, FiChevronDown, FiUser,
  FiSettings, FiLogOut, FiAward, FiBookOpen
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from '../ui/ThemeToggle'

export default function StudentTopbar({ onMenuClick, title, subtitle, unreadNotifications = 0, unreadMessages = 0 }) {
  const { profile, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    await signOut()
    toast.success('You have been signed out.')
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b app-border app-surface px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenuClick} className="rounded-lg p-2 text-app-secondary hover:bg-black/5 dark:hover:bg-white/5 lg:hidden">
          <FiMenu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate font-display text-lg font-bold text-app-primary sm:text-xl">{title}</h1>
          {subtitle && <p className="hidden truncate text-xs text-app-secondary sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle compact />
        <Link to="/student/notifications" className="relative rounded-full p-2 text-app-secondary hover:bg-black/5 dark:hover:bg-white/5">
          <FiBell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
              {unreadNotifications}
            </span>
          )}
        </Link>
        <Link to="/student/messages" className="relative hidden rounded-full p-2 text-app-secondary hover:bg-black/5 dark:hover:bg-white/5 sm:block">
          <FiMail className="h-5 w-5" />
          {unreadMessages > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white">
              {unreadMessages}
            </span>
          )}
        </Link>

        <div className="relative" ref={ref}>
          <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-black/5 dark:hover:bg-white/5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-accent-500 text-sm font-bold text-white shadow-soft">
              {(profile?.full_name || 'S').charAt(0)}
            </div>
            <span className="hidden text-left sm:block">
              <span className="block text-xs font-bold text-app-primary leading-tight">
                {profile?.full_name?.split(' ')[0] || 'Student'}
              </span>
              <span className="block text-[10px] text-accent-600 dark:text-accent-400 font-mono">
                {profile?.matric_number || 'Student Portal'}
              </span>
            </span>
            <FiChevronDown className="h-4 w-4 text-app-secondary" />
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 rounded-2xl border app-border app-surface shadow-card p-2 z-50 divide-y app-border"
              >
                <div className="px-3 py-2">
                  <p className="text-xs font-bold text-app-primary truncate">{profile?.full_name || 'Student Account'}</p>
                  <p className="text-[11px] text-app-secondary font-mono truncate">{profile?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-2 py-0.5 rounded-full">
                    Student Workspace
                  </span>
                </div>

                <div className="py-1.5">
                  <Link to="/student/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-app-primary hover:bg-black/5 dark:hover:bg-white/10 font-medium">
                    <FiUser className="h-3.5 w-3.5 text-app-secondary" /> My Academic Profile
                  </Link>
                  <Link to="/student/course-registration" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-app-primary hover:bg-black/5 dark:hover:bg-white/10 font-medium">
                    <FiBookOpen className="h-3.5 w-3.5 text-app-secondary" /> Course Registration
                  </Link>
                  <Link to="/student/settings" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-app-primary hover:bg-black/5 dark:hover:bg-white/10 font-medium">
                    <FiSettings className="h-3.5 w-3.5 text-app-secondary" /> Account Settings
                  </Link>
                </div>

                <div className="pt-1.5">
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium">
                    <FiLogOut className="h-3.5 w-3.5" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
