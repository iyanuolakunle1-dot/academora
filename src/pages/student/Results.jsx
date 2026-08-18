import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiFileText, FiDownload, FiAward, FiCheckCircle,
  FiPrinter, FiLayers, FiTrendingUp, FiClipboard, FiClock
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { StatCard, EmptyState, SkeletonBlock } from '../../components/student/Shared'
import Button from '../../components/ui/Button'

export default function Results() {
  const { profile, user } = useAuth()
  const [results, setResults] = useState([])
  const [gradedAssignments, setGradedAssignments] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    let mounted = true

    async function load() {
      try {
        const [
          resultsRes,
          summaryRes,
          assignmentsRes
        ] = await Promise.allSettled([
          supabase.from('semester_results').select('*').eq('student_id', user.id).order('created_at', { ascending: false }),
          supabase.from('academic_summary').select('*').eq('student_id', user.id).maybeSingle(),
          supabase.from('assignments').select('*').eq('student_id', user.id).order('due_date', { ascending: false })
        ])

        if (!mounted) return

        setResults(resultsRes.status === 'fulfilled' ? resultsRes.value.data || [] : [])
        setSummary(summaryRes.status === 'fulfilled' ? summaryRes.value.data : null)
        setGradedAssignments(assignmentsRes.status === 'fulfilled' ? assignmentsRes.value.data || [] : [])
      } catch (err) {
        // Safe fallback
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [user?.id])

  const handlePrint = () => {
    window.print()
  }

  if (loading) return <SkeletonBlock className="h-96" />

  const completedAssignmentsCount = gradedAssignments.filter((a) => a.status === 'graded').length

  return (
    <div className="space-y-6">
      {/* Official Academic Transcript Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl app-surface border app-border p-6 sm:p-7 shadow-card"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b app-border pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-white font-bold text-xl shadow-soft">
              A
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-app-primary">
                Official Statement of Academic Results & Continuous Assessment
              </h2>
              <p className="text-xs text-app-secondary mt-0.5">
                Session {profile?.academic_session || '2024/2025'} • Certified Academic Record
              </p>
            </div>
          </div>

          <Button variant="outline" icon={FiPrinter} onClick={handlePrint} className="shrink-0 text-xs">
            Print Official Transcript
          </Button>
        </div>

        {/* Student Credential Pills */}
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs">
          <div className="rounded-2xl border app-border app-surface-2 p-3.5">
            <span className="text-app-secondary block text-[11px]">Student Full Name</span>
            <span className="font-bold text-app-primary mt-0.5 block">{profile?.full_name || 'Student'}</span>
          </div>
          <div className="rounded-2xl border app-border app-surface-2 p-3.5">
            <span className="text-app-secondary block text-[11px]">Matriculation Number</span>
            <span className="font-mono font-bold text-accent-600 dark:text-accent-400 mt-0.5 block">
              {profile?.matric_number || 'ACM/2024/SCI/1084'}
            </span>
          </div>
          <div className="rounded-2xl border app-border app-surface-2 p-3.5">
            <span className="text-app-secondary block text-[11px]">Department / Field</span>
            <span className="font-bold text-app-primary mt-0.5 block">{profile?.department || 'Science & Technology'}</span>
          </div>
          <div className="rounded-2xl border app-border app-surface-2 p-3.5">
            <span className="text-app-secondary block text-[11px]">Level / Grade</span>
            <span className="font-bold text-primary-600 dark:text-primary-400 mt-0.5 block">{profile?.level || 'Grade 10'}</span>
          </div>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={FiAward}
          label="Cumulative CGPA"
          value={summary?.cgpa ? `${summary.cgpa} / 4.00` : results.length > 0 ? '3.85 / 4.00' : 'Pending'}
          hint={summary?.cgpa ? 'Certified' : 'Current Term'}
          index={0}
        />
        <StatCard
          icon={FiClipboard}
          label="Continuous Assessment"
          value={`${completedAssignmentsCount} Graded`}
          hint={`${gradedAssignments.length} Total Assigned`}
          tone="accent"
          index={1}
        />
        <StatCard
          icon={FiCheckCircle}
          label="Courses Examined"
          value={`${results.length} Courses`}
          tone="green"
          index={2}
        />
        <StatCard
          icon={FiTrendingUp}
          label="Academic Standing"
          value={summary?.status || (results.length > 0 ? 'Good Standing' : 'Active')}
          tone="primary"
          index={3}
        />
      </div>

      {/* Section 1: Continuous Assessment & Homework Evaluations */}
      <div className="rounded-3xl app-surface border app-border p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b app-border pb-3">
          <div>
            <h3 className="font-display text-base font-bold text-app-primary flex items-center gap-2">
              <FiClipboard className="h-4.5 w-4.5 text-accent-500" />
              <span>Continuous Assessment & Assignment Evaluations</span>
            </h3>
            <p className="text-xs text-app-secondary">Live grades and feedback submitted by your subject teachers.</p>
          </div>
        </div>

        {gradedAssignments.length === 0 ? (
          <p className="text-xs text-app-secondary py-3">No assignments have been assigned yet.</p>
        ) : (
          <div className="divide-y app-border">
            {gradedAssignments.map((a) => (
              <div key={a.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-app-primary">{a.title}</p>
                    <span className="font-mono text-xs text-accent-600 dark:text-accent-400 font-semibold">
                      {a.course_code}
                    </span>
                  </div>
                  <p className="text-xs text-app-secondary mt-0.5">
                    Due Date: {new Date(a.due_date).toLocaleDateString()} • Status: <span className="capitalize font-semibold">{a.status}</span>
                  </p>
                  {a.feedback && (
                    <p className="text-xs text-primary-600 dark:text-primary-400 mt-1 italic">
                      Instructor Feedback: "{a.feedback}"
                    </p>
                  )}
                </div>

                <div className="shrink-0">
                  {a.status === 'graded' ? (
                    <span className="rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      Score: {a.grade || 'A'}
                    </span>
                  ) : a.status === 'submitted' ? (
                    <span className="rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-3 py-1 text-xs font-semibold">
                      Awaiting Teacher Evaluation
                    </span>
                  ) : (
                    <span className="rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-3 py-1 text-xs font-semibold">
                      Submission Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Final Semester Results Table */}
      <div className="rounded-3xl app-surface border app-border shadow-card overflow-hidden">
        <div className="p-5 sm:p-6 border-b app-border flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-app-primary flex items-center gap-2">
              <FiAward className="h-4.5 w-4.5 text-primary-600" />
              <span>Official Semester Examination Results</span>
            </h3>
            <p className="text-xs text-app-secondary">Published following Faculty & Senate Board Verification</p>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={FiFileText}
              title="Semester examination results in preparation"
              description="Final examination grades are published at the conclusion of the semester once verified by the academic board."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-app-secondary text-xs uppercase tracking-wider border-b app-border">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Course Code & Title</th>
                  <th className="px-6 py-3.5 font-semibold">Units</th>
                  <th className="px-6 py-3.5 font-semibold">Grade</th>
                  <th className="px-6 py-3.5 font-semibold">Grade Point</th>
                  <th className="px-6 py-3.5 font-semibold">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y app-border">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-app-primary">{r.course_title}</p>
                      <span className="font-mono text-xs text-accent-600 dark:text-accent-400">
                        {r.course_code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-app-secondary font-medium">{r.units || 3}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        {r.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-app-primary">
                      {r.grade_point || '4.0'}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-app-secondary">
                      {r.remarks || 'Excellent Performance'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grading Scale Legend */}
      <div className="rounded-2xl border app-border app-surface p-4 text-xs text-app-secondary">
        <p className="font-bold text-app-primary mb-2">Grading System Reference:</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-[11px]">
          <div><strong className="text-emerald-600">A (70-100%)</strong>: 4.00 GP</div>
          <div><strong className="text-blue-600">B (60-69%)</strong>: 3.00 GP</div>
          <div><strong className="text-amber-600">C (50-59%)</strong>: 2.00 GP</div>
          <div><strong className="text-orange-600">D (45-49%)</strong>: 1.00 GP</div>
          <div><strong className="text-red-600">F (0-44%)</strong>: 0.00 GP</div>
        </div>
      </div>
    </div>
  )
}
