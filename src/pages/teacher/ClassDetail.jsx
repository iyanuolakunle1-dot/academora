import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FiArrowLeft, FiCheck, FiX as FiXIcon, FiSave, FiUsers,
  FiCheckSquare, FiFileText, FiUserPlus, FiTrash2, FiSearch,
  FiAward, FiCalendar, FiClock, FiMapPin
} from 'react-icons/fi'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { EmptyState, SkeletonBlock } from '../../components/shared/Widgets'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'

const tabs = [
  { key: 'roster', label: 'Class Roster', icon: FiUsers },
  { key: 'attendance', label: 'Take Attendance', icon: FiCheckSquare },
  { key: 'grades', label: 'Enter Grades', icon: FiFileText }
]

export default function ClassDetail() {
  const { classId } = useParams()
  const { user } = useAuth()
  const [klass, setKlass] = useState(null)
  const [students, setStudents] = useState([])
  const [allStudents, setAllStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('roster')
  const [attendance, setAttendance] = useState({})
  const [grades, setGrades] = useState({})
  const [saving, setSaving] = useState(false)
  const [enrollModalOpen, setEnrollModalOpen] = useState(false)
  const [studentSearch, setStudentSearch] = useState('')
  const [enrolling, setEnrolling] = useState(false)

  const today = new Date().toISOString().slice(0, 10)

  const load = async () => {
    try {
      const [
        { data: classData },
        { data: studentRows },
        { data: allStudentProfiles }
      ] = await Promise.all([
        supabase.from('classes').select('*').eq('id', classId).single(),
        supabase.from('class_students').select('student_id, profiles(*)').eq('class_id', classId),
        supabase.from('profiles').select('*').eq('role', 'student')
      ])

      setKlass(classData)
      setStudents((studentRows || []).map((r) => r.profiles).filter(Boolean))
      setAllStudents(allStudentProfiles || [])
    } catch (err) {
      // Graceful fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (classId) load()
  }, [classId])

  const enrolledIds = new Set(students.map((s) => s.id))

  const availableToEnroll = allStudents.filter(
    (s) =>
      !enrolledIds.has(s.id) &&
      (s.full_name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.email?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.matric_number?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.department?.toLowerCase().includes(studentSearch.toLowerCase()))
  )

  const handleEnrollSingle = async (studentId) => {
    setEnrolling(true)
    try {
      const { error } = await supabase.from('class_students').insert({
        class_id: classId,
        student_id: studentId
      })
      if (error) throw error
      toast.success('Student enrolled into class successfully!')
      load()
    } catch (err) {
      toast.error(err.message || 'Could not enroll student.')
    } finally {
      setEnrolling(false)
    }
  }

  const handleEnrollAll = async () => {
    if (availableToEnroll.length === 0) return
    setEnrolling(true)
    try {
      const rows = availableToEnroll.map((s) => ({
        class_id: classId,
        student_id: s.id
      }))
      const { error } = await supabase.from('class_students').insert(rows)
      if (error) throw error
      toast.success(`Enrolled all ${rows.length} students into class!`)
      setEnrollModalOpen(false)
      load()
    } catch (err) {
      toast.error(err.message || 'Could not enroll students.')
    } finally {
      setEnrolling(false)
    }
  }

  const handleRemoveStudent = async (studentId) => {
    try {
      const { error } = await supabase
        .from('class_students')
        .delete()
        .eq('class_id', classId)
        .eq('student_id', studentId)
      if (error) throw error
      toast.success('Student removed from class roster.')
      load()
    } catch (err) {
      toast.error(err.message || 'Could not remove student.')
    }
  }

  const markAttendance = (studentId, status) =>
    setAttendance((a) => ({ ...a, [studentId]: status }))

  const saveAttendance = async () => {
    if (Object.keys(attendance).length === 0) {
      toast.error('Mark at least one student attendance before saving.')
      return
    }
    setSaving(true)
    try {
      const rows = Object.entries(attendance).map(([student_id, status]) => ({
        student_id,
        course_id: klass?.id,
        class_date: today,
        status
      }))
      const { error } = await supabase.from('attendance_records').insert(rows)
      if (error) throw error
      toast.success('Attendance saved successfully.')
      setAttendance({})
    } catch (err) {
      toast.error(err.message || 'Could not save attendance.')
    } finally {
      setSaving(false)
    }
  }

  const setGrade = (studentId, field, value) =>
    setGrades((g) => ({ ...g, [studentId]: { ...g[studentId], [field]: value } }))

  const saveGrades = async () => {
    const rows = Object.entries(grades)
      .filter(([, v]) => v.grade)
      .map(([student_id, v]) => ({
        student_id,
        course_code: klass?.class_code || 'CLS-101',
        course_title: klass?.class_name || 'Academic Course',
        units: 3,
        grade: v.grade,
        grade_point: v.point ? Number(v.point) : 4.0,
        remarks: v.remarks || 'Satisfactory'
      }))

    if (rows.length === 0) {
      toast.error('Enter at least one grade before submitting.')
      return
    }
    setSaving(true)
    try {
      const { error } = await supabase.from('semester_results').insert(rows)
      if (error) throw error
      toast.success('Grades submitted and published to student portals!')
      setGrades({})
    } catch (err) {
      toast.error(err.message || 'Could not save grades.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <SkeletonBlock className="h-96" />

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Link
        to="/teacher/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
      >
        <FiArrowLeft className="h-4 w-4" /> Back to My Classes
      </Link>

      {/* Class Command Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-br from-slate-950 via-primary-950 to-primary-900 p-6 sm:p-8 text-white shadow-soft"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-full bg-accent-500/20 px-3 py-0.5 text-xs font-mono font-bold text-accent-300 border border-accent-500/30">
                {klass?.class_code || 'CLS-101'}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-semibold">
                {klass?.level || 'Grade 10'}
              </span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                {students.length} Enrolled Students
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {klass?.class_name}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-white/80">
              Subject: <strong>{klass?.subject}</strong> • Venue: <strong>{klass?.room || 'Main Hall'}</strong> • Periods/Wk: <strong>{klass?.periods_per_week || 4}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              icon={FiUserPlus}
              onClick={() => setEnrollModalOpen(true)}
              className="shadow-soft"
            >
              Enroll Students ({allStudents.length - students.length} Available)
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto rounded-2xl app-surface border app-border p-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              tab === t.key
                ? 'bg-primary-600 text-white shadow-soft'
                : 'text-app-secondary hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <t.icon className="h-4 w-4" />
            <span>{t.label}</span>
            {t.key === 'roster' && (
              <span className="rounded-full bg-white/20 px-2 py-0.2 text-xs">
                {students.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="rounded-3xl app-surface border app-border p-6 shadow-card">
        {/* 1. ROSTER TAB */}
        {tab === 'roster' && (
          <div>
            <div className="flex items-center justify-between mb-5 border-b app-border pb-4">
              <div>
                <h3 className="font-display text-base font-bold text-app-primary">
                  Enrolled Students ({students.length})
                </h3>
                <p className="text-xs text-app-secondary">Students actively registered for this class roster.</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                icon={FiUserPlus}
                onClick={() => setEnrollModalOpen(true)}
              >
                Add Student
              </Button>
            </div>

            {students.length === 0 ? (
              <EmptyState
                icon={FiUsers}
                title="No students enrolled in this class yet"
                description="Click 'Enroll Students' to select and add registered students from the school directory into this class roster."
                action={
                  <Button icon={FiUserPlus} onClick={() => setEnrollModalOpen(true)}>
                    Enroll Students Now
                  </Button>
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 text-app-secondary text-xs uppercase tracking-wider border-b app-border">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Student Name</th>
                      <th className="px-4 py-3 font-semibold">Matric / Student ID</th>
                      <th className="px-4 py-3 font-semibold">Department</th>
                      <th className="px-4 py-3 font-semibold">Email</th>
                      <th className="px-4 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y app-border">
                    {students.map((s) => (
                      <tr key={s.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3.5 flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-accent-500 text-sm font-bold text-white shadow-soft">
                            {(s.full_name || 'S').charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-app-primary text-sm">{s.full_name}</p>
                            <span className="text-[11px] text-app-secondary">{s.level || 'Student'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs font-bold text-accent-600 dark:text-accent-400">
                          {s.matric_number || 'Pending'}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-app-primary">{s.department || 'General'}</td>
                        <td className="px-4 py-3.5 text-xs text-app-secondary">{s.email}</td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => handleRemoveStudent(s.id)}
                            className="p-1.5 text-app-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                            title="Remove from roster"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 2. ATTENDANCE TAB */}
        {tab === 'attendance' && (
          <div>
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b app-border pb-4">
              <div>
                <h3 className="font-display text-base font-bold text-app-primary">
                  Mark Daily Attendance
                </h3>
                <p className="text-xs text-app-secondary">
                  Session Date: <strong>{new Date().toDateString()}</strong>
                </p>
              </div>
              {students.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const allPresent = {}
                      students.forEach((s) => {
                        allPresent[s.id] = 'present'
                      })
                      setAttendance(allPresent)
                    }}
                  >
                    Mark All Present
                  </Button>
                  <Button icon={FiSave} loading={saving} onClick={saveAttendance}>
                    Save Attendance
                  </Button>
                </div>
              )}
            </div>

            {students.length === 0 ? (
              <EmptyState
                icon={FiUsers}
                title="No students to mark"
                description="Enroll students in the Roster tab to take attendance."
                action={
                  <Button icon={FiUserPlus} onClick={() => setEnrollModalOpen(true)}>
                    Enroll Students
                  </Button>
                }
              />
            ) : (
              <div className="space-y-2.5">
                {students.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-2xl app-surface-2 border app-border p-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                        {(s.full_name || 'S').charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-app-primary">{s.full_name}</p>
                        <p className="text-xs text-app-secondary font-mono">{s.matric_number || s.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => markAttendance(s.id, 'present')}
                        className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                          attendance[s.id] === 'present'
                            ? 'bg-emerald-600 text-white shadow-soft'
                            : 'bg-black/5 dark:bg-white/10 text-app-secondary hover:text-app-primary'
                        }`}
                      >
                        <FiCheck className="h-3.5 w-3.5" /> Present
                      </button>
                      <button
                        type="button"
                        onClick={() => markAttendance(s.id, 'absent')}
                        className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                          attendance[s.id] === 'absent'
                            ? 'bg-red-600 text-white shadow-soft'
                            : 'bg-black/5 dark:bg-white/10 text-app-secondary hover:text-app-primary'
                        }`}
                      >
                        <FiXIcon className="h-3.5 w-3.5" /> Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. GRADES TAB */}
        {tab === 'grades' && (
          <div>
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b app-border pb-4">
              <div>
                <h3 className="font-display text-base font-bold text-app-primary">
                  Continuous Assessment & Semester Gradebook
                </h3>
                <p className="text-xs text-app-secondary">
                  Submitting grades automatically publishes results to Student and Parent dashboards.
                </p>
              </div>
              {students.length > 0 && (
                <Button icon={FiSave} loading={saving} onClick={saveGrades}>
                  Submit & Publish Grades
                </Button>
              )}
            </div>

            {students.length === 0 ? (
              <EmptyState
                icon={FiFileText}
                title="No students to grade"
                description="Enroll students in the Roster tab to enter grades."
                action={
                  <Button icon={FiUserPlus} onClick={() => setEnrollModalOpen(true)}>
                    Enroll Students
                  </Button>
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 text-app-secondary text-xs uppercase tracking-wider border-b app-border">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Student</th>
                      <th className="px-4 py-3 font-semibold">Grade</th>
                      <th className="px-4 py-3 font-semibold">Grade Point</th>
                      <th className="px-4 py-3 font-semibold">Instructor Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y app-border">
                    {students.map((s) => (
                      <tr key={s.id}>
                        <td className="px-4 py-3">
                          <p className="font-bold text-app-primary">{s.full_name}</p>
                          <span className="font-mono text-xs text-accent-600 dark:text-accent-400">
                            {s.matric_number || s.email}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={grades[s.id]?.grade || ''}
                            onChange={(e) => {
                              const val = e.target.value
                              const pointMap = { A: 4.0, 'A-': 3.75, 'B+': 3.5, B: 3.0, 'C+': 2.5, C: 2.0, D: 1.0, F: 0.0 }
                              setGrade(s.id, 'grade', val)
                              setGrade(s.id, 'point', pointMap[val] || 4.0)
                            }}
                            className="rounded-xl border app-border app-surface-2 px-3 py-2 text-sm text-app-primary font-bold outline-none focus:border-primary-500"
                          >
                            <option value="">Select Grade</option>
                            {['A', 'A-', 'B+', 'B', 'C+', 'C', 'D', 'F'].map((g) => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="4"
                            placeholder="4.0"
                            value={grades[s.id]?.point || ''}
                            onChange={(e) => setGrade(s.id, 'point', e.target.value)}
                            className="w-24 rounded-xl border app-border app-surface-2 px-3 py-2 text-sm font-mono font-bold text-app-primary outline-none focus:border-primary-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            placeholder="e.g. Excellent conceptual mastery"
                            value={grades[s.id]?.remarks || ''}
                            onChange={(e) => setGrade(s.id, 'remarks', e.target.value)}
                            className="w-full rounded-xl border app-border app-surface-2 px-3 py-2 text-xs text-app-primary outline-none focus:border-primary-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enroll Students Modal */}
      <Modal
        open={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        title="Enroll Students into Class Roster"
      >
        <div className="space-y-4">
          <p className="text-xs text-app-secondary">
            Select students from the institutional directory to add them directly into <strong>{klass?.class_name}</strong>.
          </p>

          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-app-secondary h-4 w-4" />
            <input
              type="text"
              placeholder="Search student name, matric no, department..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full rounded-xl border app-border app-surface-2 pl-9 pr-3 py-2 text-xs text-app-primary outline-none focus:border-primary-500"
            />
          </div>

          {availableToEnroll.length > 1 && (
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={handleEnrollAll}
                loading={enrolling}
              >
                Enroll All Matching Students ({availableToEnroll.length})
              </Button>
            </div>
          )}

          <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar divide-y app-border">
            {availableToEnroll.length === 0 ? (
              <p className="py-8 text-center text-xs text-app-secondary">
                {allStudents.length === 0
                  ? 'No students registered in the system yet.'
                  : 'All registered students are already enrolled in this class!'}
              </p>
            ) : (
              availableToEnroll.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white font-bold text-xs">
                      {(s.full_name || 'S').charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-app-primary">{s.full_name}</p>
                      <p className="text-[11px] text-app-secondary">
                        {s.matric_number || s.email} • {s.department || 'General'}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    loading={enrolling}
                    onClick={() => handleEnrollSingle(s.id)}
                    className="text-xs"
                  >
                    + Enroll
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}
