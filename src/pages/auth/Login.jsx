import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  FiLock, FiLogIn, FiUser, FiHelpCircle, FiCheckCircle,
  FiBookOpen, FiHeart, FiShield, FiBriefcase
} from 'react-icons/fi'
import AuthLayout from '../../components/layout/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { useAuth } from '../../context/AuthContext'
import { validateEmail } from '../../utils/validators'
import { supabase } from '../../lib/supabaseClient'
import { ROLE_HOME } from '../../components/ProtectedRoute'

const PORTAL_TABS = [
  { id: 'student', label: 'Student', icon: FiBookOpen, placeholder: 'e.g. ACM/2024/SCI/1084 or student@academora.edu', helper: 'Use your Matriculation Number or admission email.' },
  { id: 'parent', label: 'Parent', icon: FiHeart, placeholder: 'e.g. parent@example.com', helper: 'Use your registered Guardian email address.' },
  { id: 'teacher', label: 'Faculty', icon: FiBriefcase, placeholder: 'e.g. STF/2024/SCI/1042 or faculty@academora.edu.ng', helper: 'Use your assigned Staff ID or institutional faculty email.' }
]

export default function Login() {
  const { signIn, resetPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [activeTab, setActiveTab] = useState('student')
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [sendingReset, setSendingReset] = useState(false)

  const currentTabInfo = PORTAL_TABS.find((t) => t.id === activeTab) || PORTAL_TABS[0]

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    const idInput = form.identifier.trim()

    if (!idInput) {
      nextErrors.identifier = 'Please enter your login identifier.'
    }
    if (!form.password) {
      nextErrors.password = 'Password is required.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setLoading(true)
    try {
      let emailToUse = idInput

      // If the user entered a Matriculation Number or Staff ID (not an email)
      if (!idInput.includes('@')) {
        let foundEmail = null

        // Tier 1: Try Postgres Security Definer RPC
        try {
          const { data: rpcRows, error: rpcError } = await supabase
            .rpc('lookup_email_by_identifier', { identifier: idInput })
          if (!rpcError && rpcRows && rpcRows.length > 0 && rpcRows[0]?.email) {
            foundEmail = rpcRows[0].email
          }
        } catch (_rpcErr) {
          // Fall through to Tier 2
        }

        // Tier 2: Try Backend Server Resolution (Service Role)
        if (!foundEmail) {
          try {
            const apiRes = await fetch('/api/auth/resolve-identifier', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ identifier: idInput })
            })
            if (apiRes.ok) {
              const apiJson = await apiRes.json()
              if (apiJson?.email) {
                foundEmail = apiJson.email
              }
            }
          } catch (_apiErr) {
            // Fall through
          }
        }

        // Tier 3: Direct Profile Query
        if (!foundEmail) {
          try {
            const { data: matchedProfile } = await supabase
              .from('profiles')
              .select('email')
              .ilike('matric_number', idInput)
              .maybeSingle()
            if (matchedProfile?.email) {
              foundEmail = matchedProfile.email
            }
          } catch (_profErr) {
            // Fall through
          }
        }

        if (foundEmail) {
          emailToUse = foundEmail
        } else {
          toast.error(`No registered account found matching Matriculation Number: "${idInput}". Please check the number or use your email.`)
          setLoading(false)
          return
        }
      }

      const { user } = await signIn({ email: emailToUse, password: form.password })

      // Fetch user profile role to route to the correct university portal
      const { data: profileRow } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

      const userRole = profileRow?.role || 'student'
      const roleHome = ROLE_HOME[userRole] || '/student/dashboard'
      
      // If the user was redirected from a protected page, verify they actually have permission for it
      let destination = roleHome
      const fromPath = location.state?.from?.pathname
      if (fromPath) {
        if (fromPath.startsWith('/admin') && (userRole === 'admin' || userRole === 'super_admin')) {
          destination = fromPath
        } else if (fromPath.startsWith('/teacher') && userRole === 'teacher') {
          destination = fromPath
        } else if (fromPath.startsWith('/parent') && userRole === 'parent') {
          destination = fromPath
        } else if (fromPath.startsWith('/student') && userRole === 'student') {
          destination = fromPath
        } else if (fromPath.startsWith('/library') && userRole === 'librarian') {
          destination = fromPath
        }
      }

      toast.success(`Welcome, ${profileRow?.full_name || 'User'}! 👋`)
      navigate(destination, { replace: true })
    } catch (err) {
      toast.error(err.message || 'Invalid login credentials. Please check your Matric No/Email and password.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    if (!validateEmail(forgotEmail)) {
      toast.error('Enter a valid institutional email address.')
      return
    }
    setSendingReset(true)
    try {
      await resetPassword(forgotEmail)
      toast.success('Password reset link sent. Check your inbox.')
      setForgotOpen(false)
      setForgotEmail('')
    } catch (err) {
      toast.error(err.message || 'Could not send reset link.')
    } finally {
      setSendingReset(false)
    }
  }

  return (
    <AuthLayout
      title="Academora Integrated Portal"
      subtitle="Single sign-on gateway for Students, Parents, and Academic Faculty."
    >
      {/* Role Switcher Tabs */}
      <div className="mb-6 grid grid-cols-3 gap-1.5 rounded-2xl bg-black/5 dark:bg-white/5 p-1.5 text-xs font-semibold">
        {PORTAL_TABS.map((tab) => {
          const Icon = tab.icon
          const isSelected = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 rounded-xl py-2 px-1 transition-all ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-300 shadow-soft font-bold'
                  : 'text-app-secondary hover:text-app-primary'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label={
            activeTab === 'student'
              ? 'Matriculation No. or Student Email'
              : activeTab === 'parent'
              ? 'Guardian Email Address'
              : 'Staff ID or Faculty Email'
          }
          icon={FiUser}
          placeholder={currentTabInfo.placeholder}
          value={form.identifier}
          onChange={update('identifier')}
          error={errors.identifier}
          autoComplete="username"
          required
        />

        <Input
          label="Account Password"
          type="password"
          icon={FiLock}
          placeholder="Enter your account password"
          value={form.password}
          onChange={update('password')}
          error={errors.password}
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-app-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-app-border text-primary-600 focus:ring-primary-500"
            />
            Remember this device
          </label>
          <button
            type="button"
            onClick={() => setForgotOpen(true)}
            className="text-xs font-semibold text-primary-600 dark:text-primary-300 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" loading={loading} iconRight={<FiLogIn />} className="w-full justify-center">
          Sign In to {currentTabInfo.label} Portal
        </Button>
      </form>

      {/* Role Context & Registration Links */}
      <div className="mt-6 pt-5 border-t app-border space-y-3 text-xs text-app-secondary">
        <div className="rounded-xl border app-border app-surface-2 p-3 text-[11px] text-app-secondary flex items-start gap-2">
          <FiHelpCircle className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
          <span>{currentTabInfo.helper}</span>
        </div>

        <div className="text-center space-y-1.5 pt-2">
          {activeTab === 'student' && (
            <p>
              Prospective Student?{' '}
              <Link to="/signup" className="font-bold text-primary-600 dark:text-primary-300 hover:underline">
                Apply for Admission / Register
              </Link>
            </p>
          )}

          {activeTab === 'parent' && (
            <p>
              New Parent / Guardian?{' '}
              <Link to="/parent/signup" className="font-bold text-primary-600 dark:text-primary-300 hover:underline">
                Create Parent Account
              </Link>
            </p>
          )}

          {activeTab === 'teacher' && (
            <p>
              New Academic Staff?{' '}
              <Link to="/teacher/signup" className="font-bold text-primary-600 dark:text-primary-300 hover:underline">
                Faculty Passkey Registration
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        title="Reset Account Password"
      >
        <form onSubmit={handleForgot} className="space-y-4">
          <p className="text-xs text-app-secondary leading-relaxed">
            Enter your registered email address below and we will dispatch a secure password reset link to your inbox.
          </p>
          <Input
            label="Registered Institutional Email"
            type="email"
            placeholder="e.g. user@academora.edu"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setForgotOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={sendingReset}>
              Send Reset Link
            </Button>
          </div>
        </form>
      </Modal>
    </AuthLayout>
  )
}
