import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiSearch, FiUserPlus, FiTrash2, FiUsers } from 'react-icons/fi'
import { supabase } from '../../lib/supabaseClient'
import { apiRequest } from '../../lib/api'
import { EmptyState, SkeletonBlock } from './Widgets'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'

/**
 * Generic staff/student directory manager. Adding a person creates a real
 * Supabase auth account (via the secured /api/admin/create-user route, which
 * uses the service role key server-side) and an invite email is sent so they
 * can set their own password on first login.
 */
export default function PeopleManager({ role, title, addLabel }) {
  const [people, setPeople] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ full_name: '', email: '', department: '', phone: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('role', role).order('created_at', { ascending: false })
    setPeople(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [role])

  const filtered = people.filter((p) => (p.full_name || '').toLowerCase().includes(search.toLowerCase()) || (p.email || '').toLowerCase().includes(search.toLowerCase()))

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.full_name || !form.email) {
      toast.error('Name and email are required.')
      return
    }
    setSaving(true)
    try {
      await apiRequest('/api/admin/create-user', {
        method: 'POST',
        body: { email: form.email, fullName: form.full_name, role, department: form.department, phone: form.phone }
      })
      toast.success(`${title.slice(0, -1)} added — an invite email has been sent.`)
      setAddOpen(false)
      setForm({ full_name: '', email: '', department: '', phone: '' })
      load()
    } catch (err) {
      toast.error(err.message || 'Could not add record.')
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async (id) => {
    try {
      await apiRequest(`/api/admin/users/${id}`, { method: 'DELETE' })
      toast.success('Removed.')
      load()
    } catch (err) {
      toast.error(err.message || 'Could not remove record.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-secondary" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            className="rounded-xl border app-border app-surface-2 py-2 pl-9 pr-3 text-sm text-app-primary outline-none focus:border-primary-500 w-full sm:w-72"
          />
        </div>
        <Button icon={FiUserPlus} onClick={() => setAddOpen(true)}>{addLabel}</Button>
      </div>

      <div className="rounded-2xl app-surface border app-border shadow-card overflow-hidden">
        {loading ? (
          <SkeletonBlock className="h-64 !rounded-none" />
        ) : filtered.length === 0 ? (
          <div className="p-8"><EmptyState icon={FiUsers} title={`No ${title.toLowerCase()} yet`} description={`Added ${title.toLowerCase()} will appear here.`} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-primary-900 text-white">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Department</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t app-border">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-accent-500 text-xs font-bold text-white">
                          {(p.full_name || '?').charAt(0)}
                        </div>
                        <span className="font-medium text-app-primary">{p.full_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-app-secondary">{p.email}</td>
                    <td className="px-5 py-3.5 text-app-secondary">{p.department || '—'}</td>
                    <td className="px-5 py-3.5 text-app-secondary">{p.phone || '—'}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => handleRemove(p.id)} className="rounded-lg p-2 text-app-secondary hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
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

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={addLabel}>
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Full Name" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} />
          <Input label="Email Address" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <Input label="Department" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          <Button type="submit" loading={saving} className="w-full justify-center">Save</Button>
        </form>
      </Modal>
    </div>
  )
}
