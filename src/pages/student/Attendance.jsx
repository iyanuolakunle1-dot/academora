import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiCheckSquare, FiCalendar, FiCheckCircle, FiXCircle,
  FiClock, FiAward, FiAlertCircle, FiFilter
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { StatCard, EmptyState, SkeletonBlock } from '../../components/student/Shared'

export default function Attendance() {
  const { profile, user } = useAuth()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    let mounted = true

    async function load() {
      try {
        const { data, error } = await supabase
          .from('attendance_records')
          .select('*')
          .eq('student_id', user.id)
          .order('class_date', { ascending: false })

        if (!mounted) return
        setRecords(data || [])
      } catch (err) {
        setRecords([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [user?.id])

  if (loading) return <SkeletonBlock className="h-96" />

  const totalHeld = records.length
  const attendedCount = records.filter((r) => r.status === 'present').length
  const missedCount = records.filter((r) => r.status === 'absent').length
  const lateCount = records.filter((r) => r.status === 'late').length
  const overallPercentage = totalHeld > 0 ? Math.round((attendedCount / totalHeld) * 100) : 100

  // Group by course
  const byCourseMap = {}
  records.forEach((r) => {
    const key = r.topic || r.course_id || 'General Lectures'
    if (!byCourseMap[key]) {
      byCourseMap[key] = { held: 0, attended: 0, title: key }
    }
    byCourseMap[key].held += 1
    if (r.status === 'present') byCourseMap[key].attended += 1
  })

  const byCourseList = Object.values(byCourseMap)

  return (
    <div className="space-y-6">
      {/* Attendance Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl app-surface border app-border p-6 sm:p-7 shadow-card"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="rounded-full bg-primary-50 dark:bg-primary-950/60 px-3 py-0.5 text-xs font-semibold text-primary-700 dark:text-primary-300">
                {profile?.level || 'Grade 10'}
              </span>
              <span className="rounded-full bg-accent-500/20 px-3 py-0.5 text-xs font-semibold text-accent-400 border border-accent-500/30">
                {profile?.department || 'Science & Technology'}
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-app-primary">
              Student Attendance Record & Verification
            </h2>
            <p className="text-xs text-app-secondary mt-0.5">
              Official institutional attendance is recorded daily by faculty instructors. Minimum 75% required for exam clearance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border app-border app-surface-2 p-3 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-bold text-app-secondary">Eligibility</span>
              <p className={`font-display text-base font-bold mt-0.5 ${overallPercentage >= 75 ? 'text-emerald-600' : 'text-red-500'}`}>
                {overallPercentage >= 75 ? 'Cleared for Exams' : 'Attendance Warning'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={FiCheckSquare}
          label="Overall Attendance"
          value={`${overallPercentage}%`}
          hint={overallPercentage >= 75 ? 'Excellent Standing' : 'Below 75% Threshold'}
          tone="primary"
          index={0}
        />
        <StatCard
          icon={FiCheckCircle}
          label="Lectures Attended"
          value={`${attendedCount} Classes`}
          hint={`Out of ${totalHeld} held`}
          tone="green"
          index={1}
        />
        <StatCard
          icon={FiXCircle}
          label="Lectures Missed"
          value={`${missedCount} Classes`}
          tone="red"
          index={2}
        />
        <StatCard
          icon={FiClock}
          label="Late Arrivals"
          value={`${lateCount} Classes`}
          tone="accent"
          index={3}
        />
      </div>

      {/* Course-by-Course Attendance Breakdown */}
      {byCourseList.length > 0 && (
        <div className="rounded-3xl app-surface border app-border p-6 shadow-card space-y-4">
          <h3 className="font-display text-base font-bold text-app-primary">
            Course-by-Course Attendance Breakdown
          </h3>
          <div className="space-y-3">
            {byCourseList.map((c) => {
              const pct = Math.round((c.attended / c.held) * 100)
              return (
                <div key={c.title} className="rounded-2xl border app-border app-surface-2 p-4">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-app-primary">{c.title}</span>
                    <span className="text-app-secondary">
                      {c.attended} / {c.held} Attended ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Daily Attendance Log */}
      <div className="rounded-3xl app-surface border app-border shadow-card overflow-hidden">
        <div className="p-5 sm:p-6 border-b app-border flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-app-primary">
              Session Attendance History Log ({records.length})
            </h3>
            <p className="text-xs text-app-secondary">Live attendance roll marked by classroom instructors.</p>
          </div>
        </div>

        {records.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={FiCheckSquare}
              title="No attendance sessions marked yet"
              description="Your attendance status will appear here in real time as teachers take attendance during class lectures."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-app-secondary text-xs uppercase tracking-wider border-b app-border">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Date</th>
                  <th className="px-6 py-3.5 font-semibold">Lecture Session</th>
                  <th className="px-6 py-3.5 font-semibold">Status</th>
                  <th className="px-6 py-3.5 font-semibold">Instructor Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y app-border">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-app-primary text-xs">
                      {new Date(r.class_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-app-primary">
                      {r.topic || 'Class Lecture Session'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold capitalize ${
                          r.status === 'present'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                            : r.status === 'late'
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                            : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-500/20'
                        }`}
                      >
                        {r.status === 'present' ? <FiCheckCircle className="h-3 w-3" /> : <FiXCircle className="h-3 w-3" />} {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-app-secondary">
                      {r.remarks || 'Verified by Class Instructor'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
