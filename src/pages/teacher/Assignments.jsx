import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FiPlus, FiClipboard, FiCheckCircle, FiClock, FiExternalLink,
  FiSave, FiUsers, FiBookOpen, FiCalendar, FiEdit3
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { EmptyState, SkeletonBlock } from '../../components/shared/Widgets'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'

export default function TeacherAssignments() {
  const { user } = useAuth()
  const [classes, setClasses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [grading, setGrading] = useState(null)
  const [form, setForm] = useState({ classId: '', title: '', description: '', due_date: '' })
  const [gradeForm, setGradeForm] = useState({ grade: '', feedback: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const [
        { data: classData },
        { data: assignmentData }
      ] = await Promise.all([
        supabase.from('classes').select('id, class_name, class_code, subject').eq('teacher_id', user.id),
        supabase.from('assignments').select('*, profiles!assignments_student_id_fkey(full_name, matric_number)').eq('teacher_id', user.id).order('due_date', { ascending: false })
      ])
      setClasses(classData || [])
      setAssignments(assignmentData || [])
    } catch (err) {
      // Safe fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) load()
  }, [user?.id])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.classId || !form.title || !form.due_date) {
      toast.error('Please select a class, title, and due date.')
      return
    }
    setSaving(true)
    try {
      const { data: roster } = await supabase
        .from('class_students')
        .select('student_id')
        .eq('class_id', form.classId)

      const klass = classes.find((c) => c.id === form.classId)

      if (!roster || roster.length === 0) {
        toast.error('This class has no enrolled students yet. Please enroll students into the class roster first.')
        setSaving(false)
        return
      }

      // Check if there is a matching course in `courses` by course_code, else set course_id to null
      let matchedCourseId = null
      if (klass?.class_code) {
        const { data: courseMatch } = await supabase
          .from('courses')
          .select('id')
          .eq('course_code', klass.class_code)
          .maybeSingle()
        if (courseMatch?.id) matchedCourseId = courseMatch.id
      }

      const rows = roster.map((r) => ({
        student_id: r.student_id,
        teacher_id: user.id,
        course_id: matchedCourseId, // Valid foreign key or null (avoids foreign key constraint violation)
        course_code: klass?.class_code || klass?.subject || 'CLS-101',
        title: form.title,
        description: form.description || null,
        due_date: new Date(form.due_date).toISOString(),
        status: 'pending'
      }))

      const { error } = await supabase.from('assignments').insert(rows)
      if (error) throw error
      toast.success(`Assignment assigned to ${rows.length} students! 📝`)
      setCreateOpen(false)
      setForm({ classId: '', title: '', description: '', due_date: '' })
      load()
    } catch (err) {
      toast.error(err.message || 'Could not create assignment.')
    } finally {
      setSaving(false)
    }
  }

  const handleGrade = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase
        .from('assignments')
        .update({
          status: 'graded',
          grade: gradeForm.grade,
          feedback: gradeForm.feedback || null
        })
        .eq('id', grading.id)
      if (error) throw error
      toast.success('Grade and feedback submitted!')
      setGrading(null)
      setGradeForm({ grade: '', feedback: '' })
      load()
    } catch (err) {
      toast.error(err.message || 'Could not save grade.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <SkeletonBlock className="h-96" />

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl app-surface border app-border p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-app-primary">
            Coursework & Assignment Manager
          </h2>
          <p className="text-xs text-app-secondary mt-0.5">
            Assign homework, track student document submissions, and provide graded evaluations.
          </p>
        </div>
        <Button icon={FiPlus} onClick={() => setCreateOpen(true)}>
          Create Assignment
        </Button>
      </div>

      {/* Assignment List */}
      <div className="rounded-3xl app-surface border app-border p-6 shadow-card">
        {assignments.length === 0 ? (
          <EmptyState
            icon={FiClipboard}
            title="No assignments created yet"
            description="Create an assignment for one of your class rosters to distribute coursework to your students."
            action={
              <Button icon={FiPlus} onClick={() => setCreateOpen(true)}>
                Create First Assignment
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {assignments.map((a) => (
              <div
                key={a.id}
                className="flex flex-col gap-3 rounded-2xl app-surface-2 border app-border p-4 sm:flex-row sm:items-center sm:justify-between hover:shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-app-primary text-sm">{a.title}</p>
                    <span className="font-mono text-xs text-accent-600 dark:text-accent-400 font-semibold">
                      {a.course_code}
                    </span>
                  </div>
                  <p className="text-xs text-app-secondary mt-0.5">
                    Student: <strong>{a.profiles?.full_name || 'Enrolled Student'}</strong> {a.profiles?.matric_number ? `(${a.profiles.matric_number})` : ''} • Due: {new Date(a.due_date).toLocaleDateString()}
                  </p>
                  {a.feedback && (
                    <p className="text-[11px] text-primary-600 dark:text-primary-400 mt-1 italic">
                      Feedback: "{a.feedback}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold capitalize ${
                      a.status === 'graded'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : a.status === 'submitted'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                    }`}
                  >
                    {a.status === 'graded' ? (
                      <FiCheckCircle className="h-3 w-3" />
                    ) : (
                      <FiClock className="h-3 w-3" />
                    )}{' '}
                    {a.status === 'graded' ? `Graded: ${a.grade || 'A'}` : a.status}
                  </span>

                  {a.submission_url && (
                    <a
                      href={a.submission_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-xl border app-border bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-app-primary hover:border-primary-500 transition-colors shadow-sm"
                    >
                      <FiExternalLink className="h-3.5 w-3.5" /> View Work
                    </a>
                  )}

                  {a.status === 'submitted' && (
                    <Button size="sm" onClick={() => setGrading(a)}>
                      Grade Submission
                    </Button>
                  )}
                  {a.status === 'graded' && (
                    <Button size="sm" variant="outline" onClick={() => setGrading(a)}>
                      <FiEdit3 className="h-3.5 w-3.5" /> Edit Grade
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Class Assignment">
        <form onSubmit={handleCreate} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-app-primary">
              Target Class Roster *
            </span>
            <select
              value={form.classId}
              onChange={(e) => setForm((f) => ({ ...f, classId: e.target.value }))}
              className="w-full rounded-xl border app-border app-surface px-3.5 py-2.5 text-sm text-app-primary outline-none focus:border-primary-500 font-medium"
              required
            >
              <option value="">Select an active class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.class_name} ({c.class_code || c.subject})
                </option>
              ))}
            </select>
          </label>

          <Input
            label="Assignment Title *"
            placeholder="e.g. Problem Set 1: Newton's Laws of Motion"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-app-primary">
              Instructions & Description
            </span>
            <textarea
              rows={3}
              placeholder="Provide assignment guidelines, questions, or submission instructions..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-xl border app-border app-surface px-3.5 py-2.5 text-xs text-app-primary outline-none focus:border-primary-500"
            />
          </label>

          <Input
            label="Submission Due Date *"
            type="date"
            value={form.due_date}
            onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
            required
          />

          <Button type="submit" loading={saving} className="w-full justify-center mt-2">
            Publish & Distribute to Students
          </Button>
        </form>
      </Modal>

      {/* Grade Submission Modal */}
      <Modal open={!!grading} onClose={() => setGrading(null)} title={`Grade Assignment: ${grading?.title || ''}`}>
        <form onSubmit={handleGrade} className="space-y-4">
          <Input
            label="Evaluation / Grade (e.g. A, 95/100, Distinction) *"
            value={gradeForm.grade}
            onChange={(e) => setGradeForm((f) => ({ ...f, grade: e.target.value }))}
            placeholder="e.g. A (92%)"
            required
          />
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-app-primary">
              Instructor Comments & Feedback
            </span>
            <textarea
              rows={3}
              placeholder="Provide constructive feedback for the student..."
              value={gradeForm.feedback}
              onChange={(e) => setGradeForm((f) => ({ ...f, feedback: e.target.value }))}
              className="w-full rounded-xl border app-border app-surface px-3.5 py-2.5 text-xs text-app-primary outline-none focus:border-primary-500"
            />
          </label>
          <Button type="submit" loading={saving} icon={FiSave} className="w-full justify-center">
            Submit Grade & Notify Student
          </Button>
        </form>
      </Modal>
    </div>
  )
}
