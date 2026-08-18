import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  FiShield, FiMail, FiLock, FiUser, FiCheckCircle,
  FiKey, FiArrowRight, FiLock as FiLockKey
} from 'react-icons/fi'
import AuthLayout from '../../components/layout/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import PasswordStrength from '../../components/ui/PasswordStrength'
import { useAuth } from '../../context/AuthContext'
import { validateEmail, validatePassword } from '../../utils/validators'
import { supabase } from '../../lib/supabaseClient'
import { SIGNUP_ROLES } from './Signup'

const MASTER_ADMIN_PASSKEY = 'ACADEMORA-ADMIN-MASTER-2026'

export default function AdminSignup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    roleTitle: 'Campus Administrator',
    masterPasskey: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.fullName.trim() || form.fullName.trim().length < 3) nextErrors.fullName = 'Enter administrator full name.'
    if (!validateEmail(form.email)) nextErrors.email = 'Enter a valid institutional email address.'
    
    // Security Passkey Check
    if (!form.masterPasskey.trim()) {
      nextErrors.masterPasskey = 'Master Security Passkey is strictly required.'
    } else if (form.masterPasskey.trim().toUpperCase() !== MASTER_ADMIN_PASSKEY) {
      nextErrors.masterPasskey = 'Invalid Master Passkey. Access Denied. Contact Super Admin.'
    }

    if (!validatePassword(form.password).isValid) nextErrors.password = 'Password does not meet complexity requirements.'
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setLoading(true)
    try {
      const res = await signUp({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        role: 'admin'
      })

      const adminUserId = res?.user?.id
      if (adminUserId) {
        await supabase.from('profiles').update({
          department: 'University Administration & ICT',
          level: form.roleTitle,
          matric_number: `ADM/2024/${Math.floor(1000 + Math.random() * 9000)}`,
          role: 'admin'
        }).eq('id', adminUserId)
      }

      setDone(true)
      toast.success('University Administrator account provisioned successfully! 🏛️')
    } catch (err) {
      toast.error(err.message || 'Could not provision administrative account.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <AuthLayout
        title="Admin Console Provisioned 🏛️"
        subtitle="Your University Administrator credentials are now active."
      >
        <div className="flex flex-col items-center rounded-3xl border app-border app-surface-2 p-8 text-center animate-scaleIn shadow-card space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
            <FiShield className="h-8 w-8" />
          </div>

          <div>
            <span className="rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Administration Active
            </span>
            <h3 className="font-display text-xl font-bold text-app-primary mt-2">
              Welcome, {form.fullName}
            </h3>
          </div>

          <div className="w-full rounded-2xl border app-border bg-white dark:bg-slate-900 p-4 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-app-secondary">Administrative Role:</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{form.roleTitle}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-app-secondary">Registered Email:</span>
              <span className="font-mono font-bold text-app-primary">{form.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-app-secondary">Access Scope:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Full Campus Control</span>
            </div>
          </div>

          <p className="text-xs text-app-secondary">
            Sign in to manage faculty staff rosters, student admissions, curriculum course structures, and tuition ledgers.
          </p>

          <Button className="w-full justify-center" as={Link} to="/login">
            Proceed to Admin Sign In
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Administrative Console Provisioning"
      subtitle="Authorized personnel only. Requires valid Master Security Key to activate admin privileges."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Security Warning Box */}
        <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-800 dark:text-indigo-300 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <FiShield size={14} /> Protected Institutional Route
          </p>
          <p className="text-[11px] leading-relaxed opacity-90">
            Public visitors cannot register as administrators without the Master Passkey (<code className="font-mono font-bold">ACADEMORA-ADMIN-MASTER-2026</code>).
          </p>
        </div>

        <Input
          label="Administrator Full Name *"
          icon={FiUser}
          placeholder="e.g. Dr. K. O. Okon (Director of ICT)"
          value={form.fullName}
          onChange={update('fullName')}
          error={errors.fullName}
          autoComplete="name"
          required
        />

        <Input
          label="Administrator Institutional Email *"
          type="email"
          icon={FiMail}
          placeholder="admin@academora.edu.ng"
          value={form.email}
          onChange={update('email')}
          error={errors.email}
          autoComplete="email"
          required
        />

        <Input
          label="Master Security Passkey *"
          type="password"
          icon={FiKey}
          placeholder="Enter Master Security Key"
          value={form.masterPasskey}
          onChange={update('masterPasskey')}
          error={errors.masterPasskey}
          required
        />

        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-app-primary uppercase tracking-wider">
            Administrative Role Title *
          </span>
          <select
            value={form.roleTitle}
            onChange={update('roleTitle')}
            className="w-full rounded-xl border app-border app-surface px-3 py-2.5 text-xs text-app-primary outline-none focus:border-indigo-500 font-semibold"
          >
            <option value="Campus Administrator">Campus Administrator</option>
            <option value="Director of Academic Affairs">Director of Academic Affairs</option>
            <option value="Registrar & Admissions Head">Registrar & Admissions Head</option>
            <option value="Bursar & Finance Director">Bursar & Finance Director</option>
            <option value="ICT & Systems Director">ICT & Systems Director</option>
          </select>
        </label>

        <div>
          <Input
            label="Administrative Password *"
            type="password"
            icon={FiLock}
            placeholder="Create a strong administrator password"
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
          placeholder="Re-enter administrator password"
          value={form.confirmPassword}
          onChange={update('confirmPassword')}
          error={errors.confirmPassword}
          autoComplete="new-password"
          required
        />

        <Button type="submit" loading={loading} iconRight={<FiShield />} className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white">
          Provision Admin Account
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t app-border text-center space-y-2 text-xs text-app-secondary">
        <p>
          Already an administrator?{' '}
          <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign in to Portal
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
