import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiCalendar, FiClock, FiMapPin, FiArrowRight, FiPrinter } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { EmptyState, SkeletonBlock } from '../../components/student/Shared'
import Button from '../../components/ui/Button'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const colors = [
  'bg-primary-50 text-primary-800 dark:bg-primary-950/60 dark:text-primary-300 border border-primary-200 dark:border-primary-800/40',
  'bg-accent-50 text-accent-800 dark:bg-accent-950/40 dark:text-accent-300 border border-accent-200 dark:border-accent-800/40',
  'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40',
  'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40',
  'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40'
]

export default function Timetable() {
  const { profile, user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const storageKey = user?.id ? `academora_reg_courses_${user.id}` : null

  useEffect(() => {
    if (!user?.id) return
    let mounted = true

    async function load() {
      try {
        const { data } = await supabase
          .from('timetable_entries')
          .select('*')
          .eq('student_id', user.id)

        if (!mounted) return

        if (data && data.length > 0) {
          setEntries(data)
        } else {
          // Read from registered courses cache
          const localSaved = storageKey ? JSON.parse(localStorage.getItem(storageKey) || '[]') : []
          if (localSaved.length > 0) {
            const mapped = localSaved.map((item, idx) => {
              const c = item.courses || item
              return {
                id: c.id || `entry-${idx}`,
                course_code: c.course_code,
                course_title: c.course_title,
                day_of_week: c.day_of_week || days[idx % days.length],
                start_time: c.start_time || '09:00 AM',
                end_time: c.end_time || '11:00 AM',
                room: c.room || 'Lecture Hall 1'
              }
            })
            setEntries(mapped)
          } else {
            setEntries([])
          }
        }
      } catch (err) {
        setEntries([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [user?.id, storageKey])

  if (loading) return <SkeletonBlock className="h-[32rem]" />

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl app-surface border app-border p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-full bg-primary-50 dark:bg-primary-950/60 px-3 py-0.5 text-xs font-semibold text-primary-700 dark:text-primary-300">
              {profile?.level || '100 Level'}
            </span>
            <span className="rounded-full bg-accent-500/20 px-3 py-0.5 text-xs font-semibold text-accent-400 border border-accent-500/30">
              {profile?.department || 'Science & Technology'}
            </span>
          </div>
          <h2 className="font-display text-xl font-bold text-app-primary">
            Weekly Class Schedule & Lecture Timetable
          </h2>
          <p className="text-xs text-app-secondary">Session {profile?.academic_session || '2024/2025'} • First Semester</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" icon={FiPrinter} onClick={() => window.print()} className="text-xs">
            Print Schedule
          </Button>
          <Button as={Link} to="/student/course-registration" size="sm">
            Manage Courses
          </Button>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-3xl app-surface border app-border p-8 shadow-card">
          <EmptyState
            icon={FiCalendar}
            title="No course timetable available"
            description="You have not registered for any courses this semester. Complete your course registration to generate your lecture timetable."
            action={
              <Button as={Link} to="/student/course-registration" iconRight={<FiArrowRight />}>
                Register Courses Now
              </Button>
            }
          />
        </div>
      ) : (
        <div className="rounded-3xl app-surface border app-border p-6 shadow-card overflow-x-auto">
          <div className="grid min-w-[800px] grid-cols-5 gap-4">
            {days.map((day, di) => {
              const dayEntries = entries.filter((e) => e.day_of_week === day)
              return (
                <div key={day} className="flex flex-col">
                  {/* Day Header */}
                  <div className="mb-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 py-2 text-center text-xs font-bold uppercase tracking-wider text-app-primary">
                    {day}
                  </div>

                  {/* Day Schedule Cards */}
                  <div className="space-y-3 flex-1">
                    {dayEntries.map((e, i) => (
                      <div
                        key={e.id}
                        className={`rounded-2xl p-4 shadow-sm transition-all hover:scale-[1.02] ${
                          colors[(di + i) % colors.length]
                        }`}
                      >
                        <p className="font-mono font-bold text-xs">{e.course_code || 'CRS-101'}</p>
                        <p className="font-bold text-xs mt-1 leading-snug">{e.course_title}</p>
                        
                        <div className="mt-3 pt-2 border-t border-black/10 dark:border-white/10 space-y-1 text-[11px] opacity-90">
                          <div className="flex items-center gap-1.5">
                            <FiClock className="h-3 w-3" />
                            <span>{e.start_time} - {e.end_time}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FiMapPin className="h-3 w-3" />
                            <span>{e.room || 'Lecture Hall'}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {dayEntries.length === 0 && (
                      <div className="rounded-2xl border-2 border-dashed app-border p-6 text-center text-xs text-app-secondary/70 h-36 flex items-center justify-center">
                        No lectures scheduled
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
