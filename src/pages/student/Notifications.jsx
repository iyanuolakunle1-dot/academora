import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiBell, FiCheck, FiVolume2, FiCalendar, FiCheckCircle,
  FiClock, FiAward, FiAlertCircle, FiInbox
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { EmptyState, SkeletonBlock } from '../../components/student/Shared'
import Button from '../../components/ui/Button'

export default function Notifications() {
  const { profile, user } = useAuth()
  const [personalItems, setPersonalItems] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [activeTab, setActiveTab] = useState('all') // 'all', 'personal', 'announcements'
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const [
        personalRes,
        announcementsRes
      ] = await Promise.allSettled([
        supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('announcements').select('*').order('created_at', { ascending: false })
      ])

      const personalData = personalRes.status === 'fulfilled' ? personalRes.value.data || [] : []
      const announceData = announcementsRes.status === 'fulfilled' ? announcementsRes.value.data || [] : []

      // If user has no personal notifications yet, provide default onboarding system notices
      if (personalData.length === 0) {
        setPersonalItems([
          {
            id: 'welcome-notice',
            title: '🎉 Welcome to Academora Portal!',
            message: `Hello ${profile?.full_name?.split(' ')[0] || 'Student'}, your student account is active. Please complete your Course Registration to generate your lecture timetable.`,
            type: 'system',
            is_read: false,
            created_at: new Date().toISOString()
          },
          {
            id: 'matric-notice',
            title: '🆔 Official Matriculation Credential Assigned',
            message: `Your verified institutional matriculation number is ${profile?.matric_number || 'ACM/2024/SCI/1084'}. Use this for official transcripts and semester test clearance.`,
            type: 'academic',
            is_read: false,
            created_at: new Date(Date.now() - 86400000).toISOString()
          }
        ])
      } else {
        setPersonalItems(personalData)
      }

      setAnnouncements(announceData)
    } catch (err) {
      // Safe fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) load()
  }, [user?.id, profile?.full_name, profile?.matric_number])

  const markAllRead = async () => {
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false)
    } catch (e) {
      // Safe fallback
    }
    setPersonalItems((items) => items.map((i) => ({ ...i, is_read: true })))
  }

  if (loading) return <SkeletonBlock className="h-96" />

  const unreadCount = personalItems.filter((i) => !i.is_read).length

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl app-surface border app-border p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-full bg-accent-500/20 px-3 py-0.5 text-xs font-semibold text-accent-400 border border-accent-500/30">
              Communication Center
            </span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-red-500/20 text-red-600 dark:text-red-400 px-2.5 py-0.5 text-xs font-bold">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <h2 className="font-display text-xl font-bold text-app-primary">
            Notifications & Official Announcements
          </h2>
          <p className="text-xs text-app-secondary">
            Stay updated with course alerts, academic notices, and school-wide announcements.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" icon={FiCheck} onClick={markAllRead}>
            Mark All as Read
          </Button>
        )}
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b app-border pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-primary-600 text-white shadow-soft'
              : 'text-app-secondary hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <FiInbox className="h-3.5 w-3.5" />
          <span>All Updates ({personalItems.length + announcements.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'personal'
              ? 'bg-primary-600 text-white shadow-soft'
              : 'text-app-secondary hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <FiBell className="h-3.5 w-3.5" />
          <span>Personal Alerts ({personalItems.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'announcements'
              ? 'bg-primary-600 text-white shadow-soft'
              : 'text-app-secondary hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <FiVolume2 className="h-3.5 w-3.5" />
          <span>School Announcements ({announcements.length})</span>
        </button>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {/* School Announcements Section */}
        {(activeTab === 'all' || activeTab === 'announcements') && announcements.length > 0 && (
          <div className="rounded-3xl app-surface border app-border p-6 shadow-card space-y-4">
            <h3 className="font-display text-base font-bold text-app-primary flex items-center gap-2">
              <FiVolume2 className="h-4.5 w-4.5 text-accent-500" />
              <span>Official School-Wide Bulletins</span>
            </h3>

            <div className="space-y-3">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className="rounded-2xl border app-border app-surface-2 p-4 transition-all hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-bold text-sm text-app-primary">{a.title}</p>
                    <span className="text-[11px] text-app-secondary font-medium">
                      {a.created_at ? new Date(a.created_at).toLocaleDateString() : 'Active'}
                    </span>
                  </div>
                  <p className="text-xs text-app-secondary leading-relaxed">{a.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personal Notifications Section */}
        {(activeTab === 'all' || activeTab === 'personal') && (
          <div className="rounded-3xl app-surface border app-border p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b app-border pb-3">
              <h3 className="font-display text-base font-bold text-app-primary flex items-center gap-2">
                <FiBell className="h-4.5 w-4.5 text-primary-600" />
                <span>Personal Academic Alerts</span>
              </h3>
            </div>

            {personalItems.length === 0 ? (
              <EmptyState
                icon={FiBell}
                title="You're all caught up!"
                description="New personal alerts from your lecturers and courses will appear here."
              />
            ) : (
              <div className="divide-y app-border">
                {personalItems.map((n) => (
                  <div key={n.id} className="flex gap-3.5 py-4 first:pt-0 last:pb-0 items-start">
                    <span
                      className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                        n.is_read ? 'bg-slate-300 dark:bg-slate-700' : 'bg-accent-500 animate-pulse'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-app-primary">{n.title}</p>
                        <span className="shrink-0 text-[11px] text-app-secondary">
                          {new Date(n.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-app-secondary leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
