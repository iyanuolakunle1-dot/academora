import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FiUser, FiMail, FiLock, FiUserPlus, FiCheckCircle,
  FiBookOpen, FiHeart, FiBriefcase, FiShield
} from 'react-icons/fi'
import AuthLayout from '../../components/layout/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import PasswordStrength from '../../components/ui/PasswordStrength'
import { useAuth } from '../../context/AuthContext'
import { validateEmail, validatePassword } from '../../utils/validators'
import { supabase } from '../../lib/supabaseClient'
import { generateMatricNumber } from '../../utils/matricGenerator'

const DEPARTMENTS = [
  'Computer Science & Information Technology',
  'Electrical & Mechanical Engineering',
  'Business Administration & Finance',
  'Economics & Social Sciences',
  'Arts, Law & Humanities',
  'Biological & Chemical Sciences'
]

const LEVELS = [
  '100 Level (Freshman / Year 1)',
  '200 Level (Sophomore / Year 2)',
  '300 Level (Junior / Year 3)',
  '400 Level (Senior / Final Year)',
  '500 Level (Engineering / 5-Yr Program)',
  'Postgraduate (M.Sc / MBA / Ph.D)'
]

export const SIGNUP_ROLES = [
  { id: 'student', label: 'Student Admission', path: '/signup', icon: FiBookOpen },
  { id: 'parent', label: 'Parent / Guardian', path: '/parent/signup', icon: FiHeart },
  { id: 'teacher', label: 'Faculty Staff', path: '/teacher/signup', icon: FiBriefcase }
]

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    department: 'Science & Technology',
    level: '100 Level (Year 1)',
    password: '',
    confirmPassword: ''
  })
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [createdMatric, setCreatedMatric] = useState('')

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.fullName.trim() || form.fullName.trim().length < 3) nextErrors.fullName = 'Enter your full name.'
    if (!validateEmail(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (!validatePassword(form.password).isValid) nextErrors.password = 'Password does not meet all requirements.'
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.'
    if (!agree) nextErrors.agree = 'You must accept the terms to continue.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setLoading(true)
    try {
      const res = await signUp({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        role: 'student'
      })

      const studentId = res?.user?.id
      const matric = generateMatricNumber(form.department, studentId)
      setCreatedMatric(matric)

      // Save academic credentials to student profile
      if (studentId) {
        await supabase.from('profiles').update({
          department: form.department,
          level: form.level,
          matric_number: matric,
          academic_session: '2024/2025'
        }).eq('id', studentId)
      }

      setDone(true)
      toast.success('Student admission account created successfully! 🎓')
    } catch (err) {
      toast.error(err.message || 'Could not complete registration.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <AuthLayout
        title="Admission Registered! 🎓"
        subtitle="Your official student portal account is ready."
      >
        <div className="flex flex-col items-center rounded-3xl border app-border app-surface-2 p-8 text-center animate-scaleIn shadow-card space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <FiCheckCircle className="h-8 w-8" />
          </div>

          <div>
            <span className="rounded-full bg-primary-500/10 px-3.5 py-1 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
              Student Portal Profile Activated
            </span>
            <h3 className="font-display text-xl font-bold text-app-primary mt-2">
              Welcome, {form.fullName}
            </h3>
          </div>

          <div className="w-full rounded-2xl border app-border bg-white dark:bg-slate-900 p-4 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-app-secondary">Assigned Matric No:</span>
              <span className="font-mono font-bold text-accent-600 dark:text-accent-400 text-sm">
                {createdMatric}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-app-secondary">Department:</span>
              <span className="font-bold text-app-primary">{form.department}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-app-secondary">Academic Level:</span>
              <span className="font-bold text-primary-600 dark:text-primary-400">{form.level}</span>
            </div>
          </div>

          <p className="text-xs text-app-secondary">
            You can now sign in to register your courses, access your timetable, and view lecture materials.
          </p>

          <Button className="w-full justify-center" as={Link} to="/login">
            Proceed to Student Login
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Student Admission & Registration"
      subtitle="Complete your student registration to access the online campus and coursework."
    >
      {/* Registration Portal Switcher */}
      <div className="mb-6 grid grid-cols-3 gap-1.5 rounded-2xl bg-black/5 dark:bg-white/5 p-1.5 text-xs font-semibold">
        {SIGNUP_ROLES.map((r) => {
          const Icon = r.icon
          const isCurrent = r.id === 'student'
          return (
            <Link
              key={r.id}
              to={r.path}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 rounded-xl py-2 px-1 text-center transition-all ${
                isCurrent
                  ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-300 shadow-soft font-bold'
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
        <Input
          label="Student Full Name *"
          icon={FiUser}
          placeholder="e.g. Oluwatosin Adewale"
          value={form.fullName}
          onChange={update('fullName')}
          error={errors.fullName}
          autoComplete="name"
          required
        />

        <Input
          label="Email Address *"
          type="email"
          icon={FiMail}
          placeholder="student@example.com"
          value={form.email}
          onChange={update('email')}
          error={errors.email}
          autoComplete="email"
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
              Academic Level *
            </span>
            <select
              value={form.level}
              onChange={update('level')}
              className="w-full rounded-xl border app-border app-surface px-3 py-2.5 text-xs text-app-primary outline-none focus:border-primary-500 font-semibold"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <Input
            label="Account Password *"
            type="password"
            icon={FiLock}
            placeholder="Create a secure password"
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
          I agree to the Academora Student Code of Conduct and Academic Guidelines.
        </label>
        {errors.agree && <p className="text-xs text-red-500">{errors.agree}</p>}

        <Button type="submit" loading={loading} iconRight={<FiUserPlus />} className="w-full justify-center">
          Register Student Account
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t app-border text-center space-y-2 text-xs">
        <p className="text-app-secondary">
          Already have a student account?{' '}
          <Link to="/login" className="font-bold text-primary-600 dark:text-primary-300 hover:underline">
            Sign in to Portal
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
