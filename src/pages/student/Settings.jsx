import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FiUser, FiLock, FiShield, FiSettings as FiIcon, FiBell, FiSave, FiSun, FiMoon, FiMonitor } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { useTheme } from '../../context/ThemeContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import PasswordStrength from '../../components/ui/PasswordStrength'
import { validatePassword } from '../../utils/validators'

const tabs = [
  { key: 'profile', label: 'Profile', icon: FiUser },
  { key: 'security', label: 'Security', icon: FiLock },
  { key: 'preferences', label: 'Preferences', icon: FiIcon },
  { key: 'notifications', label: 'Notifications', icon: FiBell }
]

export default function Settings() {
  const { profile, user, refreshProfile } = useAuth()
  const { theme, setTheme } = useTheme()
  const [tab, setTab] = useState('profile')
  const [form, setForm] = useState(profile || {})
  const [saving, setSaving] = useState(false)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [changingPw, setChangingPw] = useState(false)
  const [prefs, setPrefs] = useState({ email_updates: true, sms_notifications: true, auto_logout: '30' })

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const saveProfile = async () => {
    setSaving(true)
    try {
      const { error } = await supabase.from('profiles').update(form).eq('id', user.id)
      if (error) throw error
      await refreshProfile()
      toast.success('Profile information saved.')
    } catch (err) {
      toast.error(err.message || 'Could not save changes.')
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    if (!validatePassword(pw.next).isValid) {
      toast.error('New password does not meet all requirements.')
      return
    }
    if (pw.next !== pw.confirm) {
      toast.error('New passwords do not match.')
      return
    }
    setChangingPw(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: pw.next })
      if (error) throw error
      toast.success('Password updated successfully.')
      setPw({ current: '', next: '', confirm: '' })
    } catch (err) {
      toast.error(err.message || 'Could not update password.')
    } finally {
      setChangingPw(false)
    }
  }

  const savePrefs = async () => {
    try {
      const { error } = await supabase.from('profiles').update({ preferences: prefs }).eq('id', user.id)
      if (error) throw error
      localStorage.setItem('academora-prefs', JSON.stringify(prefs))
      toast.success('Preferences saved.')
    } catch (err) {
      toast.error(err.message || 'Could not save preferences.')
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <div className="lg:col-span-1">
        <div className="flex gap-2 overflow-x-auto rounded-2xl app-surface border app-border p-2 lg:flex-col">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                tab === t.key ? 'bg-primary-600 text-white' : 'text-app-primary hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        {tab === 'profile' && (
          <div className="rounded-2xl app-surface border app-border p-6 shadow-card">
            <h3 className="mb-5 font-semibold text-app-primary">Profile Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Full Name" value={form.full_name || ''} onChange={update('full_name')} />
              <Input label="Email Address" type="email" value={form.email || ''} onChange={update('email')} />
              <Input label="Phone Number" value={form.phone || ''} onChange={update('phone')} />
              <Input label="Address" value={form.address || ''} onChange={update('address')} />
            </div>
            <Button className="mt-5" icon={FiSave} loading={saving} onClick={saveProfile}>Save Changes</Button>
          </div>
        )}

        {tab === 'security' && (
          <div className="rounded-2xl app-surface border app-border p-6 shadow-card">
            <h3 className="mb-5 flex items-center gap-2 font-semibold text-app-primary"><FiShield className="h-4.5 w-4.5" /> Change Password</h3>
            <form onSubmit={changePassword} className="space-y-4 max-w-md">
              <Input label="Current Password" type="password" value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} />
              <div>
                <Input label="New Password" type="password" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} />
                <PasswordStrength password={pw.next} />
              </div>
              <Input label="Confirm New Password" type="password" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} />
              <Button type="submit" loading={changingPw} icon={FiLock}>Update Password</Button>
            </form>
          </div>
        )}

        {tab === 'preferences' && (
          <div className="rounded-2xl app-surface border app-border p-6 shadow-card">
            <h3 className="mb-5 font-semibold text-app-primary">Appearance</h3>
            <div className="grid grid-cols-3 gap-3 max-w-md">
              {[{ key: 'light', label: 'Light', icon: FiSun }, { key: 'dark', label: 'Dark', icon: FiMoon }, { key: 'system', label: 'System', icon: FiMonitor }].map((o) => (
                <button
                  key={o.key}
                  onClick={() => setTheme(o.key)}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${theme === o.key ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30' : 'app-border hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                  <o.icon className="h-5 w-5 text-app-primary" />
                  <span className="text-sm text-app-primary">{o.label}</span>
                </button>
              ))}
            </div>

            <h3 className="mb-4 mt-8 font-semibold text-app-primary">Session</h3>
            <label className="block max-w-xs">
              <span className="mb-1.5 block text-sm font-medium text-app-primary">Auto Logout</span>
              <select
                value={prefs.auto_logout}
                onChange={(e) => setPrefs((p) => ({ ...p, auto_logout: e.target.value }))}
                className="w-full rounded-xl border app-border app-surface px-3.5 py-2.5 text-sm text-app-primary outline-none focus:border-primary-500"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="never">Never</option>
              </select>
            </label>
            <Button className="mt-5" icon={FiSave} onClick={savePrefs}>Save Preferences</Button>
          </div>
        )}

        {tab === 'notifications' && (
          <div className="rounded-2xl app-surface border app-border p-6 shadow-card">
            <h3 className="mb-5 font-semibold text-app-primary">Notification Preferences</h3>
            <div className="space-y-4 max-w-md">
              {[
                { key: 'email_updates', label: 'Email Updates', desc: 'Receive important updates and announcements via email.' },
                { key: 'sms_notifications', label: 'SMS Notifications', desc: 'Receive important notifications via SMS.' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-xl app-surface-2 p-4">
                  <div>
                    <p className="text-sm font-medium text-app-primary">{item.label}</p>
                    <p className="text-xs text-app-secondary">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setPrefs((p) => ({ ...p, [item.key]: !p[item.key] }))}
                    className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${prefs[item.key] ? 'bg-primary-600' : 'bg-black/15 dark:bg-white/15'}`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${prefs[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
            <Button className="mt-5" icon={FiSave} onClick={savePrefs}>Save Preferences</Button>
          </div>
        )}
      </div>
    </div>
  )
}
