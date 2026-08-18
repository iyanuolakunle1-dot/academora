import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiUsers, FiUserCheck, FiBookOpen, FiCreditCard, FiMail,
  FiTrendingUp, FiArrowRight, FiShield, FiPlus, FiCheckCircle
} from 'react-icons/fi'
import { supabase } from '../../lib/supabaseClient'
import { StatCard, EmptyState, SkeletonBlock } from '../../components/shared/Widgets'
import Button from '../../components/ui/Button'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    revenue: 0
  })
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [
          studentsRes,
          teachersRes,
          coursesRes,
          paymentsRes,
          messagesRes
        ] = await Promise.allSettled([
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'teacher'),
          supabase.from('courses').select('id', { count: 'exact', head: true }),
          supabase.from('payments').select('amount').eq('status', 'successful'),
          supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(6)
        ])

        if (!mounted) return

        const studentsCount = studentsRes.status === 'fulfilled' ? studentsRes.value.count : 0
        const teachersCount = teachersRes.status === 'fulfilled' ? teachersRes.value.count : 0
        const coursesCount = coursesRes.status === 'fulfilled' ? coursesRes.value.count : 0
        const paymentsData = paymentsRes.status === 'fulfilled' ? paymentsRes.value.data : []
        const messagesData = messagesRes.status === 'fulfilled' ? messagesRes.value.data : []

        const revenue = (paymentsData || []).reduce((sum, p) => sum + Number(p.amount || 0), 0)

        setStats({
          students: studentsCount || 0,
          teachers: teachersCount || 0,
          courses: coursesCount || 0,
          revenue
        })
        setMessages(messagesData || [])
      } catch (err) {
        // Safe fallback
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="space-y-6">
      {/* Executive Command Banner */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-primary-950 to-primary-900 p-7 sm:p-8 text-white shadow-soft"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent-500/15 blur-2xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-full bg-accent-500/20 px-3 py-0.5 text-xs font-semibold text-accent-300 border border-accent-500/30">
                Institutional Administration
              </span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                System Active
              </span>
            </div>

            <h2 className="font-display text-2xl font-bold sm:text-3xl text-white">
              Executive Management Console
            </h2>
            <p className="mt-1.5 text-sm text-white/80 max-w-lg">
              Manage student admissions, faculty records, academic curriculum, and financial ledgers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button as={Link} to="/admin/students" variant="secondary" className="!bg-white !text-slate-900 shadow-sm">
              Manage Students
            </Button>
            <Button as={Link} to="/admin/staff" iconRight={<FiArrowRight />}>
              Faculty Roster
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Metrics Row */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <SkeletonBlock key={i} className="h-24" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={FiUsers} label="Total Enrolled Students" value={stats.students} index={0} />
          <StatCard icon={FiUserCheck} label="Certified Faculty" value={stats.teachers} tone="accent" index={1} />
          <StatCard icon={FiBookOpen} label="Curriculum Courses" value={stats.courses} tone="green" index={2} />
          <StatCard
            icon={FiCreditCard}
            label="Total Revenue Recorded"
            value={`₦${stats.revenue.toLocaleString()}`}
            tone="primary"
            index={3}
          />
        </div>
      )}

      {/* Grid: Quick Actions & Recent Messages */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Operations Panel */}
        <div className="rounded-3xl app-surface border app-border p-6 shadow-card lg:col-span-1 space-y-4">
          <h3 className="font-display text-base font-bold text-app-primary">
            Quick Operations
          </h3>
          <div className="space-y-2">
            <Link
              to="/admin/students"
              className="flex items-center justify-between p-3.5 rounded-2xl border app-border app-surface-2 hover:border-primary-500 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-300">
                  <FiUsers className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-app-primary">Student Directory</p>
                  <p className="text-[11px] text-app-secondary">View and enroll students</p>
                </div>
              </div>
              <FiArrowRight className="h-4 w-4 text-app-secondary group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/admin/staff"
              className="flex items-center justify-between p-3.5 rounded-2xl border app-border app-surface-2 hover:border-primary-500 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500/10 text-accent-600 dark:text-accent-300">
                  <FiUserCheck className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-app-primary">Faculty & Staff</p>
                  <p className="text-[11px] text-app-secondary">Assign roles and classes</p>
                </div>
              </div>
              <FiArrowRight className="h-4 w-4 text-app-secondary group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/admin/fees"
              className="flex items-center justify-between p-3.5 rounded-2xl border app-border app-surface-2 hover:border-primary-500 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                  <FiCreditCard className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-app-primary">Fee Ledgers & Payments</p>
                  <p className="text-[11px] text-app-secondary">Track tuition & receipts</p>
                </div>
              </div>
              <FiArrowRight className="h-4 w-4 text-app-secondary group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Recent Inquiries & Messages (2 cols) */}
        <div className="rounded-3xl app-surface border app-border p-6 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between border-b app-border pb-4">
            <div>
              <h3 className="flex items-center gap-2 font-display text-base font-bold text-app-primary">
                <FiMail className="h-4.5 w-4.5 text-accent-500" /> Recent Admission Inquiries
              </h3>
              <p className="text-xs text-app-secondary">Submitted via the public portal contact form.</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">{[0, 1, 2].map((i) => <SkeletonBlock key={i} className="h-16" />)}</div>
          ) : messages.length === 0 ? (
            <EmptyState
              icon={FiMail}
              title="No recent inquiries"
              description="New messages from the public Contact form will appear here in real time."
            />
          ) : (
            <div className="divide-y app-border">
              {messages.map((m) => (
                <div key={m.id} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-app-primary">{m.full_name || 'Anonymous'}</p>
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-app-secondary">
                        {m.subject || 'General Inquiry'}
                      </span>
                    </div>
                    <span className="text-[11px] text-app-secondary">
                      {m.created_at ? new Date(m.created_at).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-app-secondary line-clamp-2 leading-relaxed">
                    {m.message}
                  </p>
                  {m.email && (
                    <p className="mt-1 text-[11px] text-primary-600 dark:text-primary-400 font-medium">
                      Email: {m.email} {m.phone ? `• Phone: ${m.phone}` : ''}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
