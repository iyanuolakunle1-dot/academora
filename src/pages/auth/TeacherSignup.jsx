import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FiUser, FiMail, FiLock, FiBookOpen, FiCheckCircle,
  FiAward, FiBriefcase, FiKey
} from 'react-icons/fi'
import AuthLayout from '../../components/layout/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import PasswordStrength from '../../components/ui/PasswordStrength'
import { useAuth } from '../../context/AuthContext'
import { validateEmail, validatePassword } from '../../utils/validators'
import { supabase } from '../../lib/supabaseClient'
import { SIGNUP_ROLES } from './Signup'

const DEPARTMENTS = [
  'Science & Technology',
  'Computer Science & Robotics',
  'Commercial & Business',
  'Arts & Humanities',
  'Social Sciences'
]

const DESIGNATIONS = [
  'Senior Lecturer / Professor',
  'Lecturer I',
  'Lecturer II',
  'Assistant Lecturer',
  'Classroom Teacher',
  'Department Head'
]

const FACULTY_PASSKEY = 'ACADEMORA-FACULTY-2026'

export default function TeacherSignup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    department: 'Science & Technology',
    designation: 'Senior Lecturer / Professor',
    facultyPasskey: '',
    password: '',
    confirmPassword: ''
  })
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [assignedStaffId, setAssignedStaffId] = useState('')

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.fullName.trim() || form.fullName.trim().length < 3) nextErrors.fullName = 'Enter your full legal name.'
    if (!validateEmail(form.email)) nextErrors.email = 'Enter a valid institutional email address.'
    
    // Passkey verification
    if (!form.facultyPasskey.trim()) {
      nextErrors.facultyPasskey = 'Faculty Onboarding Passkey is required.'
    } else if (form.facultyPasskey.trim().toUpperCase() !== FACULTY_PASSKEY) {
      nextErrors.facultyPasskey = 'Invalid Faculty Passkey. Contact the Academic Dean or ICT.'
    }

    if (!validatePassword(form.password).isValid) nextErrors.password = 'Password does not meet all requirements.'
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.'
    if (!agree) nextErrors.agree = 'You must accept the academic staff terms to continue.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setLoading(true)
    try {
      const res = await signUp({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        role: 'teacher'
      })

      const staffIdNumber = `STF/2024/${form.department.slice(0, 3).toUpperCase()}/${Math.floor(1000 + Math.random() * 9000)}`
      setAssignedStaffId(staffIdNumber)

      const teacherUserId = res?.user?.id
      if (teacherUserId) {
        await supabase.from('profiles').update({
          department: form.department,
          level: form.designation,
          matric_number: staffIdNumber,
          role: 'teacher'
        }).eq('id', teacherUserId)
      }

      setDone(true)
      toast.success('Faculty & Teacher account registered successfully! 👩‍🏫')
    } catch (err) {
      toast.error(err.message || 'Could not complete faculty registration.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <AuthLayout
        title="Faculty Account Registered 👩‍🏫"
        subtitle="Your official Academic Staff portal is ready."
      >
        <div className="flex flex-col items-center rounded-3xl border app-border app-surface-2 p-8 text-center animate-scaleIn shadow-card space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-500/20 text-accent-600 dark:text-accent-400">
            <FiCheckCircle className="h-8 w-8" />
          </div>

          <div>
            <span className="rounded-full bg-accent-500/10 px-3.5 py-1 text-xs font-bold text-accent-600 dark:text-accent-400 uppercase tracking-wider">
              Faculty Portal Active
            </span>
            <h3 className="font-display text-xl font-bold text-app-primary mt-2">
              Welcome, {form.fullName}
            </h3>
          </div>

          <div className="w-full rounded-2xl border app-border bg-white dark:bg-slate-900 p-4 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-app-secondary">Assigned Staff ID:</span>
              <span className="font-mono font-bold text-accent-600 dark:text-accent-400 text-sm">
                {assignedStaffId}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-app-secondary">Department:</span>
              <span className="font-bold text-app-primary">{form.department}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-app-secondary">Academic Rank:</span>
              <span className="font-bold text-primary-600 dark:text-primary-400">{form.designation}</span>
            </div>
          </div>

          <p className="text-xs text-app-secondary">
            Sign in to manage your class rosters, enroll students, take roll-call attendance, and publish grades.
          </p>

          <Button className="w-full justify-center" as={Link} to="/login">
            Proceed to Teacher Login
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Faculty & Teacher Portal Registration"
      subtitle="Authorized academic instructors only. Requires institutional faculty onboarding passkey."
    >
      {/* Registration Portal Switcher */}
      <div className="mb-6 grid grid-cols-3 gap-1.5 rounded-2xl bg-black/5 dark:bg-white/5 p-1.5 text-xs font-semibold">
        {SIGNUP_ROLES.map((r) => {
          const Icon = r.icon
          const isCurrent = r.id === 'teacher'
          return (
            <Link
              key={r.id}
              to={r.path}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 rounded-xl py-2 px-1 text-center transition-all ${
                isCurrent
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-soft font-bold'
                  : 'text-app-secondary hover:text-app-primary'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{r.label}</span>
            </Link>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Passkey Info */}
        <div className="p-3 rounded-2xl bg-accent-500/10 border border-accent-500/30 text-xs text-accent-800 dark:text-accent-300">
          <p className="text-[11px]">
            Faculty onboarding passkey required (Default for test deployment: <code className="font-mono font-bold">ACADEMORA-FACULTY-2026</code>).
          </p>
        </div>

        <Input
          label="Instructor / Staff Full Name *"
          icon={FiUser}
          placeholder="e.g. Dr. Mrs. Funke Adeleke"
          value={form.fullName}
          onChange={update('fullName')}
          error={errors.fullName}
          autoComplete="name"
          required
        />

        <Input
          label="Institutional / Staff Email *"
          type="email"
          icon={FiMail}
          placeholder="faculty@academora.edu.ng"
          value={form.email}
          onChange={update('email')}
          error={errors.email}
          autoComplete="email"
          required
        />

        <Input
          label="Faculty Onboarding Passkey *"
          type="password"
          icon={FiKey}
          placeholder="Enter Faculty Passkey"
          value={form.facultyPasskey}
          onChange={update('facultyPasskey')}
          error={errors.facultyPasskey}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-app-primary uppercase tracking-wider">
              Department / Faculty *
            </span>
            <select
              value={form.department}
              onChange={update('department')}
              className="w-full rounded-xl border app-border app-surface px-3 py-2.5 text-xs text-app-primary outline-none focus:border-primary-500 font-semibold"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-app-primary uppercase tracking-wider">
              Academic Rank *
            </span>
            <select
              value={form.designation}
              onChange={update('designation')}
              className="w-full rounded-xl border app-border app-surface px-3 py-2.5 text-xs text-app-primary outline-none focus:border-primary-500 font-semibold"
            >
              {DESIGNATIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <Input
            label="Account Password *"
            type="password"
            icon={FiLock}
            placeholder="Create a strong staff password"
            value={form.password}
            onChange={update('password')}
            error={errors.password}
            autoComplete="new-password"
            required
          />
          <PasswordStrength password={form.password} />
        </div>

        <Input
          label="Confirm Password *"
          type="password"
          icon={FiLock}
          placeholder="Re-enter password"
          value={form.confirmPassword}
          onChange={update('confirmPassword')}
          error={errors.confirmPassword}
          autoComplete="new-password"
          required
        />

        <label className="flex items-start gap-2.5 text-xs text-app-secondary cursor-pointer">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-app-border text-primary-600 focus:ring-primary-500"
          />
          I agree to the University Academic Staff Code of Conduct and Grading Guidelines.
        </label>
        {errors.agree && <p className="text-xs text-red-500">{errors.agree}</p>}

        <Button type="submit" loading={loading} iconRight={<FiBookOpen />} className="w-full justify-center">
          Register Faculty Account
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t app-border text-center space-y-2 text-xs">
        <p className="text-app-secondary">
          Already have a staff account?{' '}
          <Link to="/login" className="font-bold text-primary-600 dark:text-primary-300 hover:underline">
            Sign in to Portal
          </Link>
        </p>
        <p className="text-app-secondary">
          Registering as a student?{' '}
          <Link to="/signup" className="font-semibold text-accent-600 dark:text-accent-400 hover:underline">
            Student Admission Application
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
