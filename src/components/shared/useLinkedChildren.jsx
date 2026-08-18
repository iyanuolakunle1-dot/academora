import React, { useEffect, useState } from 'react'
import { FiChevronDown, FiUsers, FiUserPlus, FiSearch, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { EmptyState, SkeletonBlock } from './Widgets'
import Button from '../ui/Button'
import Modal from '../ui/Modal'

export function useLinkedChildren() {
  const { user } = useAuth()
  const [children, setChildren] = useState([])
  const [activeChild, setActiveChild] = useState(null)
  const [loading, setLoading] = useState(true)

  const reload = async () => {
    if (!user?.id) return
    const { data } = await supabase
      .from('parent_students')
      .select('student_id, relationship, profiles(*)')
      .eq('parent_id', user.id)

    const kids = (data || []).map((r) => ({ ...r.profiles, relationship: r.relationship }))
    setChildren(kids)
    if (kids.length > 0 && !activeChild) {
      setActiveChild(kids[0])
    }
    setLoading(false)
  }

  useEffect(() => {
    reload()
  }, [user?.id])

  return { children, activeChild, setActiveChild, loading, reload }
}

export function ChildPicker({ children, activeChild, setActiveChild, onLinkNew }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-3 rounded-2xl app-surface border app-border p-3 shadow-card hover:border-primary-500 transition-colors"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-accent-500 text-sm font-bold text-white shadow-soft">
            {(activeChild?.full_name || '?').charAt(0)}
          </div>
          <div className="text-left">
            <p className="text-xs text-app-secondary">Active Ward</p>
            <p className="text-sm font-bold text-app-primary">{activeChild?.full_name || 'Select Child'}</p>
          </div>
          {children.length > 1 && <FiChevronDown className="ml-2 h-4 w-4 text-app-secondary" />}
        </button>

        {open && children.length > 1 && (
          <div className="absolute z-20 mt-2 w-64 rounded-2xl border app-border app-surface shadow-card p-1.5 divide-y app-border">
            {children.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveChild(c)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                  c.id === activeChild?.id
                    ? 'bg-primary-50 dark:bg-primary-950/60 font-bold text-primary-600 dark:text-primary-400'
                    : 'text-app-primary hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                <span>{c.full_name}</span>
                {c.matric_number && <span className="font-mono text-[10px] text-app-secondary">{c.matric_number}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {onLinkNew && (
        <Button size="sm" variant="outline" icon={FiUserPlus} onClick={onLinkNew}>
          Link Another Ward
        </Button>
      )}
    </div>
  )
}

export function LinkWardModal({ open, onClose, onLinked }) {
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [relationship, setRelationship] = useState('Parent')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    let mounted = true
    setLoading(true)
    supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .then(({ data }) => {
        if (!mounted) return
        setStudents(data || [])
        setLoading(false)
      })
    return () => { mounted = false }
  }, [open])

  const filtered = students.filter(
    (s) =>
      s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.matric_number?.toLowerCase().includes(search.toLowerCase())
  )

  const handleLink = async (studentId) => {
    if (!user?.id) return
    setSaving(true)
    try {
      const { error } = await supabase.from('parent_students').insert({
        parent_id: user.id,
        student_id: studentId,
        relationship
      })
      if (error) throw error
      toast.success('Ward linked to your parent portal account!')
      if (onLinked) onLinked()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Could not link student.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Link Your Ward / Student">
      <div className="space-y-4">
        <p className="text-xs text-app-secondary">
          Find and link your child's student record by entering their name, email, or official matriculation number.
        </p>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-app-secondary h-4 w-4" />
            <input
              type="text"
              placeholder="Search student name or matric number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border app-border app-surface-2 pl-9 pr-3 py-2 text-xs text-app-primary outline-none focus:border-primary-500"
            />
          </div>

          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="rounded-xl border app-border app-surface-2 px-3 py-2 text-xs text-app-primary outline-none focus:border-primary-500 font-semibold"
          >
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Guardian">Guardian</option>
            <option value="Sponsor">Sponsor</option>
          </select>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar divide-y app-border">
          {loading ? (
            <p className="py-6 text-center text-xs text-app-secondary">Searching student directory...</p>
          ) : filtered.length === 0 ? (
            <p className="py-6 text-center text-xs text-app-secondary">No matching students found.</p>
          ) : (
            filtered.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white font-bold text-xs">
                    {(s.full_name || 'S').charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-app-primary">{s.full_name}</p>
                    <p className="text-[11px] text-app-secondary font-mono">
                      {s.matric_number || s.email} • {s.department || 'Student'}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  loading={saving}
                  onClick={() => handleLink(s.id)}
                  className="text-xs"
                >
                  + Link Ward
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}

export function NoChildrenLinked({ onLink }) {
  return (
    <div className="rounded-3xl app-surface border app-border p-8 shadow-card text-center space-y-4">
      <EmptyState
        icon={FiUsers}
        title="No linked student wards yet"
        description="Link your child's student record using their name or matriculation number to start monitoring their academic progress."
        action={
          onLink && (
            <Button icon={FiUserPlus} onClick={onLink}>
              Link Your Child / Ward Now
            </Button>
          )
        }
      />
    </div>
  )
}

export { SkeletonBlock }
