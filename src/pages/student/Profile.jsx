import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  FiEdit2, FiCamera, FiSave, FiLock, FiBookOpen,
  FiAward, FiSettings as FiSettingsIcon, FiCheckCircle, FiRefreshCw
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { uploadToCloudinary } from '../../lib/cloudinary'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { SkeletonBlock } from '../../components/student/Shared'
import { generateMatricNumber } from '../../utils/matricGenerator'

const personalFields = [
  { key: 'full_name', label: 'Full Name' },
  { key: 'email', label: 'Email Address', type: 'email' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'date_of_birth', label: 'Date of Birth', type: 'date' },
  { key: 'gender', label: 'Gender' },
  { key: 'nationality', label: 'Nationality' },
  { key: 'state_of_origin', label: 'State of Origin' },
  { key: 'address', label: 'Home Address' }
]

const departments = [
  'Computer Science & Information Technology',
  'Electrical & Mechanical Engineering',
  'Business Administration & Finance',
  'Economics & Social Sciences',
  'Arts, Law & Humanities',
  'Biological & Chemical Sciences'
]

const levels = [
  '100 Level (Freshman / Year 1)',
  '200 Level (Sophomore / Year 2)',
  '300 Level (Junior / Year 3)',
  '400 Level (Senior / Final Year)',
  '500 Level (Engineering / 5-Yr Program)',
  'Postgraduate (M.Sc / MBA / Ph.D)'
]

export default function Profile() {
  const { profile, refreshProfile, user } = useAuth()
  const [form, setForm] = useState(profile || {})
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    setForm(profile || {})
  }, [profile])

  const update = (key) => (e) => {
    const val = e.target.value
    setForm((f) => {
      const next = { ...f, [key]: val }
      // Auto-suggest real matric number if department changed and matric is empty
      if (key === 'department' && (!next.matric_number || next.matric_number.startsWith('ACM/'))) {
        next.matric_number = generateMatricNumber(val, user?.id)
      }
      return next
    })
  }

  const handleGenerateMatric = () => {
    const dept = form.department || 'Science & Technology'
    const newMatric = generateMatricNumber(dept, user?.id)
    setForm((f) => ({ ...f, matric_number: newMatric }))
    toast.success(`Generated official matric number: ${newMatric}`)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Whitelist only columns that exist in profiles table to prevent 400 Bad Request
      const payload = {
        full_name: form.full_name || null,
        phone: form.phone || null,
        date_of_birth: form.date_of_birth || null,
        gender: form.gender || null,
        nationality: form.nationality || null,
        state_of_origin: form.state_of_origin || null,
        address: form.address || null,
        department: form.department || null,
        level: form.level || null,
        matric_number: form.matric_number || generateMatricNumber(form.department, user?.id),
        avatar_url: form.avatar_url || null
      }

      const { error } = await supabase.from('profiles').update(payload).eq('id', user.id)
      if (error) throw error
      await refreshProfile()
      toast.success('Academic & Personal Profile saved successfully!')
      setEditing(false)
    } catch (err) {
      toast.error(err.message || 'Could not save profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const result = await uploadToCloudinary(file, { folder: 'academora/avatars' })
      const { error } = await supabase.from('profiles').update({ avatar_url: result.url }).eq('id', user.id)
      if (error) throw error
      await refreshProfile()
      toast.success('Profile photo updated.')
    } catch (err) {
      toast.error(err.message || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  if (!profile) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SkeletonBlock className="h-80 lg:col-span-1" />
        <SkeletonBlock className="h-80 lg:col-span-2" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left Column: Student Identity Card */}
      <div className="rounded-3xl app-surface border app-border p-6 shadow-card text-center lg:col-span-1 flex flex-col items-center justify-between">
        <div className="w-full">
          <div className="relative mx-auto h-28 w-28">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-600 to-accent-500 text-3xl font-bold text-white shadow-soft">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full object-cover" />
              ) : (
                (profile.full_name || 'S').charAt(0)
              )}
            </div>
            <label className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-accent-500 text-white shadow-soft hover:bg-accent-600 transition-colors">
              {uploading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <FiCamera className="h-4 w-4" />}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>

          <h2 className="mt-4 font-display text-xl font-bold text-app-primary">{profile.full_name}</h2>
          <p className="text-sm font-medium text-accent-600 dark:text-accent-400 mt-0.5">
            {profile.department || 'Department Pending'}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {profile.level ? (
              <span className="rounded-full bg-primary-50 dark:bg-primary-900/30 px-3 py-1 text-xs font-semibold text-primary-600 dark:text-primary-300">
                {profile.level}
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs text-app-secondary">
                Level: Unset
              </span>
            )}
            
            {profile.matric_number ? (
              <span className="rounded-full bg-primary-900 dark:bg-primary-950 text-accent-400 px-3.5 py-1 text-xs font-mono font-bold border border-accent-500/30 shadow-sm">
                {profile.matric_number}
              </span>
            ) : (
              <span className="rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-3 py-1 text-xs font-medium border border-amber-500/20">
                Matric Pending
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 w-full pt-4 border-t app-border text-xs text-app-secondary space-y-2 text-left">
          <div className="flex justify-between">
            <span>Official Role:</span>
            <span className="font-semibold text-app-primary uppercase">{profile.role || 'Student'}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Active • Good Standing</span>
          </div>
        </div>
      </div>

      {/* Right Column: Academic & Personal Form */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* 1. Academic Details Card */}
        <div className="rounded-3xl app-surface border app-border p-6 sm:p-7 shadow-card">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold text-app-primary text-base">
              <FiBookOpen className="h-5 w-5 text-accent-500" />
              <span>Academic Information & Matriculation</span>
            </h3>
            <Button
              variant="ghost"
              size="sm"
              icon={FiEdit2}
              onClick={() => setEditing((e) => !e)}
            >
              {editing ? 'Cancel' : 'Edit Information'}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Department Dropdown */}
            <div>
              <label className="block text-sm font-medium text-app-primary mb-1.5">
                Department / Program *
              </label>
              {editing ? (
                <select
                  value={form.department || ''}
                  onChange={update('department')}
                  className="w-full rounded-xl border app-border app-surface text-app-primary px-3.5 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25"
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              ) : (
                <div className="w-full rounded-xl border app-border app-surface-2 px-3.5 py-2.5 text-sm font-medium text-app-primary">
                  {form.department || 'Not selected (Click edit to choose)'}
                </div>
              )}
            </div>

            {/* Level / Grade Dropdown */}
            <div>
              <label className="block text-sm font-medium text-app-primary mb-1.5">
                Academic Level / Grade *
              </label>
              {editing ? (
                <select
                  value={form.level || ''}
                  onChange={update('level')}
                  className="w-full rounded-xl border app-border app-surface text-app-primary px-3.5 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25"
                >
                  <option value="">Select Level</option>
                  {levels.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              ) : (
                <div className="w-full rounded-xl border app-border app-surface-2 px-3.5 py-2.5 text-sm font-medium text-app-primary">
                  {form.level || 'Not selected (Click edit to choose)'}
                </div>
              )}
            </div>

            {/* Official Real Matric Number with Auto-generate tool */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-app-primary mb-1.5">
                Official Matriculation Number (Real Format: ACM/YYYY/DEPT/XXXX)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g. ACM/2024/SCI/1084"
                  value={form.matric_number || ''}
                  onChange={update('matric_number')}
                  disabled={!editing}
                  className="flex-1 rounded-xl border app-border app-surface text-app-primary px-3.5 py-2.5 text-sm font-mono font-bold tracking-wide outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25 disabled:opacity-80 disabled:bg-black/5 dark:disabled:bg-white/5"
                />
                {editing && (
                  <Button
                    type="button"
                    variant="outline"
                    icon={FiRefreshCw}
                    onClick={handleGenerateMatric}
                    className="shrink-0 text-xs"
                  >
                    Generate Real Matric
                  </Button>
                )}
              </div>
              <p className="mt-1 text-[11px] text-app-secondary">
                Format: <code>ACM/{new Date().getFullYear()}/[DEPT]/[ID]</code> (Official student credential used on grade transcripts and student ID cards).
              </p>
            </div>
          </div>
        </div>

        {/* 2. Personal Information Card */}
        <div className="rounded-3xl app-surface border app-border p-6 sm:p-7 shadow-card">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold text-app-primary text-base">
              <FiSettingsIcon className="h-5 w-5 text-primary-600" />
              <span>Personal Details</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {personalFields.map((f) => (
              <Input
                key={f.key}
                label={f.label}
                type={f.type || 'text'}
                value={form[f.key] || ''}
                onChange={update(f.key)}
                disabled={!editing}
              />
            ))}
          </div>

          {editing && (
            <div className="mt-6 flex justify-end gap-3 pt-4 border-t app-border">
              <Button variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button icon={FiSave} loading={saving} onClick={handleSave}>
                Save All Changes
              </Button>
            </div>
          )}
        </div>

        {/* 3. Security */}
        <div className="rounded-3xl app-surface border app-border p-6 shadow-card">
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-app-primary text-base">
            <FiLock className="h-5 w-5 text-accent-500" />
            <span>Account Security</span>
          </h3>
          <p className="text-sm text-app-secondary">
            Manage your password, notifications, and security preferences from the{' '}
            <a href="/student/settings" className="font-semibold text-primary-600 dark:text-primary-300 hover:underline">
              Settings page
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}
