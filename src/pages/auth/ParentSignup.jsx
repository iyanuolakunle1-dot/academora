import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FiUser, FiMail, FiLock, FiUserPlus, FiCheckCircle,
  FiHeart, FiPhone, FiBookOpen, FiBriefcase, FiShield
} from 'react-icons/fi'
import AuthLayout from '../../components/layout/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import PasswordStrength from '../../components/ui/PasswordStrength'
import { useAuth } from '../../context/AuthContext'
import { validateEmail, validatePassword } from '../../utils/validators'
import { supabase } from '../../lib/supabaseClient'
import { SIGNUP_ROLES } from './Signup'

export default function ParentSignup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.fullName.trim() || form.fullName.trim().length < 3) nextErrors.fullName = 'Enter guardian full name.'
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
        role: 'parent'
      })

      const parentId = res?.user?.id
      if (parentId && form.phone) {
        await supabase.from('profiles').update({
          phone: form.phone
        }).eq('id', parentId)
      }

      setDone(true)
      toast.success('Parent / Guardian account registered successfully! 👨‍👩‍👧')
    } catch (err) {
      toast.error(err.message || 'Could not complete registration.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <AuthLayout
        title="Parent Account Active 👨‍👩‍👧"
        subtitle="Your guardian portal account is ready."
      >
        <div className="flex flex-col items-center rounded-3xl border app-border app-surface-2 p-8 text-center animate-scaleIn shadow-card space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-600 dark:text-rose-400">
            <FiCheckCircle className="h-8 w-8" />
          </div>

          <div>
            <span className="rounded-full bg-rose-500/10 px-3.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Parent Portal Active
            </span>
            <h3 className="font-display text-xl font-bold text-app-primary mt-2">
              Welcome, {form.fullName}
            </h3>
          </div>

          <p className="text-xs text-app-secondary max-w-sm">
            Sign in to your parent portal to monitor your ward's academic results, term attendance, and tuition payments.
          </p>

          <Button className="w-full justify-center" as={Link} to="/login">
            Sign In to Parent Portal
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Parent & Guardian Registration"
      subtitle="Create a parent account to monitor your ward's academic results, attendance, and fees."
    >
      {/* Registration Portal Switcher */}
      <div className="mb-6 grid grid-cols-3 gap-1.5 rounded-2xl bg-black/5 dark:bg-white/5 p-1.5 text-xs font-semibold">
        {SIGNUP_ROLES.map((r) => {
          const Icon = r.icon
          const isCurrent = r.id === 'parent'
          return (
            <Link
              key={r.id}
              to={r.path}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 rounded-xl py-2 px-1 text-center transition-all ${
                isCurrent
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-soft font-bold'
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
          label="Guardian Full Name *"
          icon={FiUser}
          placeholder="e.g. Mr. Babatunde Adewale"
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
          placeholder="parent@example.com"
          value={form.email}
          onChange={update('email')}
          error={errors.email}
          autoComplete="email"
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          icon={FiPhone}
          placeholder="+234 800 000 0000"
          value={form.phone}
          onChange={update('phone')}
          autoComplete="tel"
        />

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
          I agree to the Academora Parent Portal Terms & Privacy Guidelines.
        </label>
        {errors.agree && <p className="text-xs text-red-500">{errors.agree}</p>}

        <Button type="submit" loading={loading} iconRight={<FiUserPlus />} className="w-full justify-center">
          Register Parent Account
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t app-border text-center space-y-2 text-xs">
        <p className="text-app-secondary">
          Already have a parent account?{' '}
          <Link to="/login" className="font-bold text-primary-600 dark:text-primary-300 hover:underline">
            Sign in to Portal
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
