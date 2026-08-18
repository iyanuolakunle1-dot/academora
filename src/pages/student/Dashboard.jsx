import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiBookOpen, FiCalendar, FiCheckCircle, FiCreditCard, FiArrowRight,
  FiVolume2, FiClipboard, FiInbox, FiAlertCircle
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { StatCard, EmptyState, SkeletonBlock } from '../../components/student/Shared'
import Button from '../../components/ui/Button'

export default function Dashboard() {
  const { profile, user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    cgpa: null,
    nextClass: null,
    attendancePct: null,
    outstandingFees: null,
    timetable: [],
    announcements: [],
    assignments: []
  })

  useEffect(() => {
    if (!user?.id) return
    let mounted = true

    async function load() {
      try {
        const [
          resultsRes,
          timetableRes,
          announcementsRes,
          assignmentsRes,
          attendanceRes,
          feesRes
        ] = await Promise.allSettled([
          supabase.from('academic_summary').select('cgpa').eq('student_id', user.id).maybeSingle(),
          supabase.from('timetable_entries').select('*').eq('student_id', user.id).order('day_of_week').limit(5),
          supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(3),
          supabase.from('assignments').select('*').eq('student_id', user.id).order('due_date', { ascending: true }).limit(3),
          supabase.from('attendance_summary').select('percentage').eq('student_id', user.id).maybeSingle(),
          supabase.from('fee_summary').select('outstanding_balance').eq('student_id', user.id).maybeSingle()
        ])

        if (!mounted) return

        const results = resultsRes.status === 'fulfilled' ? resultsRes.value.data : null
        const timetable = timetableRes.status === 'fulfilled' ? timetableRes.value.data : []
        const announcements = announcementsRes.status === 'fulfilled' ? announcementsRes.value.data : []
        const assignments = assignmentsRes.status === 'fulfilled' ? assignmentsRes.value.data : []
        const attendance = attendanceRes.status === 'fulfilled' ? attendanceRes.value.data : null
        const fees = feesRes.status === 'fulfilled' ? feesRes.value.data : null

        setData({
          cgpa: results?.cgpa ?? null,
          nextClass: timetable?.[0] ?? null,
          attendancePct: attendance?.percentage ?? null,
          outstandingFees: fees?.outstanding_balance ?? null,
          timetable: timetable || [],
          announcements: announcements || [],
          assignments: assignments || []
        })
      } catch (err) {
        // Fallback gracefully
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [user?.id])

  const firstName = profile?.full_name?.split(' ')[0] || 'there'
  const isProfileIncomplete = !profile?.department || !profile?.level || !profile?.matric_number

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Real Student Academic Credentials */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-accent-700 p-7 sm:p-8 text-white shadow-soft"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-full bg-white/15 px-3 py-0.5 text-xs font-semibold backdrop-blur">
                {profile?.level || 'Level Pending'}
              </span>
              <span className="rounded-full bg-accent-500/20 px-3 py-0.5 text-xs font-semibold text-accent-300 border border-accent-500/30">
                {profile?.department || 'Department Pending'}
              </span>
              {profile?.matric_number ? (
                <span className="rounded-full bg-black/25 px-3.5 py-0.5 text-xs font-mono font-bold text-accent-300 border border-white/10">
                  {profile.matric_number}
                </span>
              ) : (
                <span className="rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-medium text-amber-200">
                  Matric: Unset
                </span>
              )}
            </div>

            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Welcome Back, {firstName}! 👋
            </h2>
            <p className="mt-1.5 text-sm text-white/80 max-w-lg">
              Official Session 2024/2025 • Stay on top of your courses, grades, and class schedules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              as={Link}
              to="/student/course-registration"
              variant="secondary"
              className="!bg-white !text-primary-900 hover:!bg-white/90 shadow-soft"
            >
              Course Registration
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Academic Profile Setup Reminder */}
      {isProfileIncomplete && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 p-4 text-amber-800 dark:text-amber-300"
        >
          <div className="flex items-center gap-3">
            <FiAlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-sm">
              <strong>Set your Official Credentials:</strong> Select your <strong>Department</strong>, <strong>Level</strong>, and generate your <strong>Real Matriculation Number</strong> in your profile.
            </p>
          </div>
          <Link
            to="/student/profile"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline shrink-0"
          >
            Complete Profile <FiArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      )}

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <SkeletonBlock key={i} className="h-24" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            icon={FiBookOpen}
            label="Current CGPA"
            value={data.cgpa ?? '—'}
            hint={data.cgpa ? 'Good Standing' : 'No results published'}
            index={0}
          />
          <StatCard
            icon={FiCalendar}
            label="Next Class"
            value={data.nextClass?.course_title || 'None scheduled'}
            hint={data.nextClass ? `${data.nextClass.start_time} • ${data.nextClass.room || ''}` : 'View Timetable'}
            tone="accent"
            index={1}
          />
          <StatCard
            icon={FiCheckCircle}
            label="Attendance"
            value={data.attendancePct != null ? `${data.attendancePct}%` : '—'}
            hint="Current Term"
            tone="green"
            index={2}
          />
          <StatCard
            icon={FiCreditCard}
            label="Outstanding Fees"
            value={data.outstandingFees != null ? `₦${Number(data.outstandingFees).toLocaleString()}` : '₦0'}
            tone="red"
            index={3}
          />
        </div>
      )}

      {/* Grid Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Timetable Panel */}
        <div className="rounded-2xl app-surface border app-border p-5 shadow-card lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold text-app-primary">
              <FiCalendar className="h-4.5 w-4.5 text-primary-600" /> My Schedule
            </h3>
            <Link to="/student/timetable" className="text-xs font-medium text-primary-600 dark:text-primary-300 hover:underline">
              View Full →
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2">{[0, 1, 2].map((i) => <SkeletonBlock key={i} className="h-14" />)}</div>
          ) : data.timetable.length === 0 ? (
            <EmptyState icon={FiCalendar} title="No classes yet" description="Your timetable will appear here once courses are registered." />
          ) : (
            <div className="space-y-3">
              {data.timetable.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-xl app-surface-2 px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-app-primary">{t.course_title}</p>
                    <p className="text-xs text-app-secondary">{t.day_of_week} • {t.start_time}</p>
                  </div>
                  <span className="rounded-lg bg-primary-50 dark:bg-primary-900/40 px-2 py-1 text-xs font-semibold text-primary-600 dark:text-primary-300">
                    {t.room || 'TBD'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Announcements & Assignments (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Announcements */}
          <div className="rounded-2xl app-surface border app-border p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold text-app-primary">
                <FiVolume2 className="h-4.5 w-4.5 text-accent-500" /> Recent Announcements
              </h3>
              <Link to="/student/notifications" className="text-xs font-medium text-primary-600 dark:text-primary-300 hover:underline">
                View All →
              </Link>
            </div>
            {loading ? (
              <div className="space-y-2">{[0, 1].map((i) => <SkeletonBlock key={i} className="h-16" />)}</div>
            ) : data.announcements.length === 0 ? (
              <EmptyState icon={FiVolume2} title="No announcements" description="Check back soon for new school updates." />
            ) : (
              <div className="space-y-3">
                {data.announcements.map((a) => (
                  <div key={a.id} className="rounded-xl border app-border app-surface-2 p-3.5">
                    <p className="font-semibold text-sm text-app-primary">{a.title}</p>
                    <p className="mt-1 text-xs text-app-secondary line-clamp-2">{a.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Assignments */}
          <div className="rounded-2xl app-surface border app-border p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold text-app-primary">
                <FiClipboard className="h-4.5 w-4.5 text-emerald-500" /> Pending Assignments
              </h3>
              <Link to="/student/assignments" className="text-xs font-medium text-primary-600 dark:text-primary-300 hover:underline">
                View All →
              </Link>
            </div>
            {loading ? (
              <div className="space-y-2">{[0, 1].map((i) => <SkeletonBlock key={i} className="h-16" />)}</div>
            ) : data.assignments.length === 0 ? (
              <EmptyState icon={FiClipboard} title="All caught up!" description="You have no pending assignments right now." />
            ) : (
              <div className="space-y-3">
                {data.assignments.map((asgn) => (
                  <div key={asgn.id} className="flex items-center justify-between rounded-xl border app-border app-surface-2 p-3.5">
                    <div>
                      <p className="font-semibold text-sm text-app-primary">{asgn.title}</p>
                      <p className="text-xs text-app-secondary mt-0.5">Due: {asgn.due_date ? new Date(asgn.due_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <Button as={Link} to="/student/assignments" size="sm" variant="outline">
                      Submit
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
