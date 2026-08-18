import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FiUsers, FiBookOpen, FiClock, FiPlus, FiEye,
  FiSearch, FiCheckCircle, FiAward, FiLayers
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { StatCard, EmptyState, SkeletonBlock } from '../../components/shared/Widgets'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'

export default function TeacherDashboard() {
  const { user, profile } = useAuth()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({
    class_name: '',
    class_code: '',
    subject: '',
    level: '',
    room: '',
    periods_per_week: ''
  })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*, class_students(count)')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setClasses(data)
      } else {
        setClasses([])
      }
    } catch (err) {
      setClasses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) load()
  }, [user?.id])

  const totalStudents = classes.reduce((sum, c) => sum + (c.class_students?.[0]?.count || 0), 0)
  const totalPeriods = classes.reduce((sum, c) => sum + (c.periods_per_week || 0), 0)
  const subjects = new Set(classes.map((c) => c.subject).filter(Boolean)).size

  const filteredClasses = classes.filter(
    (c) =>
      c.class_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.subject?.toLowerCase().includes(search.toLowerCase()) ||
      c.class_code?.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.class_name.trim()) {
      toast.error('Class name is required.')
      return
    }
    setSaving(true)
    try {
      const { error } = await supabase.from('classes').insert({
        teacher_id: user.id,
        class_name: form.class_name,
        class_code: form.class_code || `CLS-${Math.floor(100 + Math.random() * 900)}`,
        subject: form.subject || 'General Studies',
        level: form.level || 'Grade 10',
        room: form.room || 'Room 101',
        periods_per_week: Number(form.periods_per_week) || 4
      })
      if (error) throw error
      toast.success('Class created successfully.')
      setAddOpen(false)
      setForm({ class_name: '', class_code: '', subject: '', level: '', room: '', periods_per_week: '' })
      load()
    } catch (err) {
      toast.error(err.message || 'Could not create class.')
    } finally {
      setSaving(false)
    }
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'Educator'

  return (
    <div className="space-y-6">
      {/* Faculty Welcome Banner */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-primary-950 to-primary-900 p-7 sm:p-8 text-white shadow-soft"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent-500/10 blur-2xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-full bg-accent-500/20 px-3 py-0.5 text-xs font-semibold text-accent-300 border border-accent-500/30">
                Faculty & Educator Portal
              </span>
              <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-mono font-medium">
                {profile?.staff_id || 'FAC-2024/04'}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-medium">
                {profile?.department || 'Senior Secondary Faculty'}
              </span>
            </div>

            <h2 className="font-display text-2xl font-bold sm:text-3xl text-white">
              Welcome, {firstName}! 🎓
            </h2>
            <p className="mt-1.5 text-sm text-white/80 max-w-lg">
              Manage your teaching rosters, record student attendance, and submit continuous assessments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button icon={FiPlus} onClick={() => setAddOpen(true)}>
              Create Class
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
          <StatCard icon={FiLayers} label="Assigned Classes" value={classes.length} index={0} />
          <StatCard icon={FiUsers} label="Total Students" value={totalStudents} tone="accent" index={1} />
          <StatCard icon={FiBookOpen} label="Subjects Taught" value={subjects || 1} tone="green" index={2} />
          <StatCard icon={FiClock} label="Teaching Periods / Wk" value={totalPeriods || 0} tone="primary" index={3} />
        </div>
      )}

      {/* Classes Table Section */}
      <div className="rounded-3xl app-surface border app-border shadow-card overflow-hidden">
        {/* Table Filter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 border-b app-border">
          <div>
            <h3 className="font-display text-lg font-bold text-app-primary">Active Class Rosters</h3>
            <p className="text-xs text-app-secondary">Select a class to view registered students, mark attendance, or enter grades.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-app-secondary h-4 w-4" />
            <input
              type="text"
              placeholder="Search classes or subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border app-border app-surface-2 pl-9 pr-3.5 py-2 text-xs text-app-primary outline-none transition focus:border-primary-500"
            />
          </div>
        </div>

        {loading ? (
          <SkeletonBlock className="h-64 !rounded-none" />
        ) : filteredClasses.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={FiBookOpen}
              title={search ? 'No matching classes found' : 'No classes assigned yet'}
              description={search ? 'Try adjusting your search keywords.' : 'Create your first class roster to start managing students and grades.'}
              action={
                <Button icon={FiPlus} onClick={() => setAddOpen(true)}>
                  Create Class Roster
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-app-secondary text-xs uppercase tracking-wider border-b app-border">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Class & Code</th>
                  <th className="px-6 py-3.5 font-semibold">Subject</th>
                  <th className="px-6 py-3.5 font-semibold">Level / Grade</th>
                  <th className="px-6 py-3.5 font-semibold">Enrolled Students</th>
                  <th className="px-6 py-3.5 font-semibold">Venue / Room</th>
                  <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y app-border">
                {filteredClasses.map((c) => (
                  <tr key={c.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-app-primary text-sm">{c.class_name}</p>
                      <span className="font-mono text-xs text-accent-600 dark:text-accent-400">
                        {c.class_code || 'CLS-101'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-app-primary font-medium">{c.subject}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-primary-50 dark:bg-primary-950/60 px-2.5 py-0.5 text-xs font-semibold text-primary-700 dark:text-primary-300">
                        {c.level || 'Grade 10'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-app-secondary font-medium">
                      {c.class_students?.[0]?.count || 0} Students
                    </td>
                    <td className="px-6 py-4 text-app-secondary text-xs">{c.room || 'Room 101'}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/teacher/classes/${c.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border app-border bg-slate-50 dark:bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-app-primary hover:border-primary-500 hover:text-primary-600 transition-colors shadow-sm"
                      >
                        <FiEye className="h-3.5 w-3.5" /> Manage Class
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Class Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Create New Class Roster">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Class Name *"
            placeholder="e.g. SS1 Alpha - Advanced Physics"
            value={form.class_name}
            onChange={(e) => setForm((f) => ({ ...f, class_name: e.target.value }))}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Class Code"
              placeholder="e.g. PHY-101"
              value={form.class_code}
              onChange={(e) => setForm((f) => ({ ...f, class_code: e.target.value }))}
            />
            <Input
              label="Subject"
              placeholder="e.g. Physics"
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Level / Grade"
              placeholder="e.g. Grade 10 / SS1"
              value={form.level}
              onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
            />
            <Input
              label="Classroom / Lab"
              placeholder="e.g. Science Lab 2"
              value={form.room}
              onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))}
            />
          </div>
          <Input
            label="Teaching Periods per Week"
            type="number"
            placeholder="e.g. 4"
            value={form.periods_per_week}
            onChange={(e) => setForm((f) => ({ ...f, periods_per_week: e.target.value }))}
          />
          <Button type="submit" loading={saving} className="w-full justify-center mt-2">
            Create Class
          </Button>
        </form>
      </Modal>
    </div>
  )
}
