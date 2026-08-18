import React, { useEffect, useState } from 'react'
import { FiCheckSquare } from 'react-icons/fi'
import { supabase } from '../../lib/supabaseClient'
import { useLinkedChildren, ChildPicker, NoChildrenLinked } from '../../components/shared/useLinkedChildren'
import { StatCard, EmptyState, SkeletonBlock } from '../../components/shared/Widgets'

export default function ParentAttendance() {
  const { children, activeChild, setActiveChild, loading } = useLinkedChildren()
  const [byCourse, setByCourse] = useState([])
  const [summary, setSummary] = useState(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!activeChild?.id) return
    let mounted = true
    Promise.all([
      supabase.from('attendance_by_course').select('*').eq('student_id', activeChild.id),
      supabase.from('attendance_summary').select('*').eq('student_id', activeChild.id).maybeSingle()
    ]).then(([{ data: c }, { data: s }]) => {
      if (!mounted) return
      setByCourse(c || [])
      setSummary(s)
      setFetching(false)
    })
    return () => { mounted = false }
  }, [activeChild?.id])

  if (loading) return <SkeletonBlock className="h-96" />
  if (children.length === 0) return <NoChildrenLinked />

  return (
    <div>
      <ChildPicker children={children} activeChild={activeChild} setActiveChild={setActiveChild} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
        <StatCard icon={FiCheckSquare} label="Overall" value={summary ? `${summary.percentage}%` : '—'} index={0} />
        <StatCard icon={FiCheckSquare} label="Attended" value={summary?.attended ?? '—'} tone="green" index={1} />
        <StatCard icon={FiCheckSquare} label="Missed" value={summary?.missed ?? '—'} tone="red" index={2} />
        <StatCard icon={FiCheckSquare} label="This Month" value={summary?.this_month_pct != null ? `${summary.this_month_pct}%` : '—'} tone="accent" index={3} />
      </div>
      <div className="rounded-2xl app-surface border app-border p-5 shadow-card">
        {fetching ? <SkeletonBlock className="h-40" /> : byCourse.length === 0 ? (
          <EmptyState icon={FiCheckSquare} title="No attendance records yet" description="Records will appear here once classes begin taking attendance." />
        ) : (
          <div className="space-y-4">
            {byCourse.map((c) => (
              <div key={c.course_code}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-app-primary">{c.course_code} — {c.course_title}</span>
                  <span className="text-app-secondary">{c.attended}/{c.held} ({c.percentage}%)</span>
                </div>
                <div className="h-2 rounded-full bg-black/5 dark:bg-white/10">
                  <div className={`h-full rounded-full ${c.percentage >= 75 ? 'bg-green-500' : c.percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${c.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
