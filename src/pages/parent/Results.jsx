import React, { useEffect, useState } from 'react'
import { FiFileText } from 'react-icons/fi'
import { supabase } from '../../lib/supabaseClient'
import { useLinkedChildren, ChildPicker, NoChildrenLinked } from '../../components/shared/useLinkedChildren'
import { StatCard, EmptyState, SkeletonBlock } from '../../components/shared/Widgets'

export default function ParentResults() {
  const { children, activeChild, setActiveChild, loading } = useLinkedChildren()
  const [results, setResults] = useState([])
  const [summary, setSummary] = useState(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!activeChild?.id) return
    let mounted = true
    Promise.all([
      supabase.from('semester_results').select('*').eq('student_id', activeChild.id).order('created_at', { ascending: false }),
      supabase.from('academic_summary').select('*').eq('student_id', activeChild.id).maybeSingle()
    ]).then(([{ data: r }, { data: s }]) => {
      if (!mounted) return
      setResults(r || [])
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
        <StatCard icon={FiFileText} label="CGPA" value={summary ? `${summary.cgpa}/4.00` : '—'} index={0} />
        <StatCard icon={FiFileText} label="Total Units" value={summary?.total_units ?? '—'} tone="accent" index={1} />
        <StatCard icon={FiFileText} label="Total Courses" value={summary?.total_courses ?? '—'} tone="green" index={2} />
        <StatCard icon={FiFileText} label="Status" value={summary?.status || '—'} tone="primary" index={3} />
      </div>
      <div className="rounded-2xl app-surface border app-border p-5 shadow-card">
        {fetching ? <SkeletonBlock className="h-40" /> : results.length === 0 ? (
          <EmptyState icon={FiFileText} title="No results published yet" description="Results will appear here once released by the academic office." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="text-xs text-app-secondary"><th className="pb-3 pr-3">Course</th><th className="pb-3 pr-3">Unit</th><th className="pb-3 pr-3">Grade</th><th className="pb-3">Remarks</th></tr></thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id} className="border-t app-border">
                    <td className="py-3 pr-3 text-app-primary">{r.course_code} — {r.course_title}</td>
                    <td className="py-3 pr-3 text-app-secondary">{r.units}</td>
                    <td className="py-3 pr-3"><span className="rounded-md bg-primary-50 dark:bg-primary-900/30 px-2 py-1 font-semibold text-primary-600 dark:text-primary-300">{r.grade}</span></td>
                    <td className="py-3 text-app-secondary">{r.remarks}</td>
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
