import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHome, FiUser, FiCalendar, FiClock, FiCheckSquare, FiClipboard,
  FiFileText, FiCreditCard, FiDownload, FiBell, FiMail, FiSettings,
  FiLogOut, FiX, FiBookOpen, FiShield
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

const navSections = [
  {
    title: 'Overview',
    items: [
      { to: '/student/dashboard', label: 'Dashboard', icon: FiHome, end: true },
      { to: '/student/profile', label: 'My Profile', icon: FiUser }
    ]
  },
  {
    title: 'Academics & Study',
    items: [
      { to: '/student/course-registration', label: 'Course Registration', icon: FiBookOpen },
      { to: '/student/timetable', label: 'Timetable', icon: FiCalendar },
      { to: '/student/attendance', label: 'Attendance', icon: FiCheckSquare },
      { to: '/student/assignments', label: 'Assignments', icon: FiClipboard },
      { to: '/student/results', label: 'Results & CGPA', icon: FiFileText }
    ]
  },
  {
    title: 'Finance & Resources',
    items: [
      { to: '/student/fees', label: 'Fees & Payments', icon: FiCreditCard },
      { to: '/student/downloads', label: 'Downloads & Slips', icon: FiDownload }
    ]
  },
  {
    title: 'Communication',
    items: [
      { to: '/student/notifications', label: 'Notifications', icon: FiBell },
      { to: '/student/messages', label: 'Messages', icon: FiMail },
      { to: '/student/settings', label: 'Settings', icon: FiSettings }
    ]
  }
]

export default function StudentSidebar({ open, onClose }) {
  const { profile, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    toast.success('You have been signed out.')
  }

  const content = (
    <div className="flex h-full flex-col bg-slate-900 dark:bg-slate-950 text-white border-r border-slate-800">
      {/* Brand & Portal Monogram */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 font-display font-bold text-lg shadow-sm">
            A
          </div>
          <div>
            <p className="font-display text-base font-bold tracking-wider leading-tight text-white">
              ACADEMORA
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
              <p className="text-[10px] uppercase font-bold tracking-widest text-accent-400">
                Student Portal
              </p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:text-white lg:hidden">
          <FiX className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4 custom-scrollbar">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold shadow-soft'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Card & Logout Footer */}
      <div className="border-t border-slate-800 p-4 bg-slate-900/60">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-800/60 p-3 border border-slate-700/50">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-accent-500 text-sm font-bold text-white shadow-soft">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full rounded-full object-cover" />
            ) : (
              (profile?.full_name || 'S').charAt(0)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-white">{profile?.full_name || 'Student'}</p>
            <p className="truncate text-[11px] text-accent-400 font-medium">
              {profile?.matric_number || profile?.department || 'Active Student'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-800/40 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all"
        >
          <FiLogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-72 flex-shrink-0 lg:block">{content}</aside>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <motion.div
              className="absolute left-0 top-0 h-full w-72 shadow-2xl"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              {content}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
