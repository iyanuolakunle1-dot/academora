import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiPlus, FiTrash2, FiFileText, FiCalendar, FiVolume2 } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { EmptyState, SkeletonBlock } from '../../components/shared/Widgets'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const sections = [
  { key: 'news', label: 'News Posts', icon: FiFileText, table: 'news_posts' },
  { key: 'events', label: 'School Events', icon: FiCalendar, table: 'school_events' },
  { key: 'announcements', label: 'Announcements', icon: FiVolume2, table: 'announcements' }
]

export default function AdminContent() {
  const { user } = useAuth()
  const [active, setActive] = useState('news')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const section = sections.find((s) => s.key === active)

  const load = async () => {
    setLoading(true)
    const orderCol = active === 'events' ? 'event_date' : active === 'news' ? 'published_at' : 'created_at'
    const { data } = await supabase.from(section.table).select('*').order(orderCol, { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { load(); setForm({}) }, [active])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      let payload = {}
      if (active === 'news') {
        if (!form.title || !form.excerpt) return toast.error('Title and excerpt are required.')
        payload = { title: form.title, excerpt: form.excerpt, content: form.content || form.excerpt, category: form.category || 'General', created_by: user.id }
      } else if (active === 'events') {
        if (!form.title || !form.event_date) return toast.error('Title and date are required.')
        payload = { title: form.title, description: form.description, location: form.location, event_date: form.event_date, created_by: user.id }
      } else {
        if (!form.title || !form.content) return toast.error('Title and content are required.')
        payload = { title: form.title, content: form.content, posted_by: user.id }
      }
      const { error } = await supabase.from(section.table).insert(payload)
      if (error) throw error
      toast.success('Published successfully.')
      setAddOpen(false)
      setForm({})
      load()
    } catch (err) {
      toast.error(err.message || 'Could not publish.')
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async (id) => {
    try {
      const { error } = await supabase.from(section.table).delete().eq('id', id)
      if (error) throw error
      toast.success('Removed.')
      load()
    } catch (err) {
      toast.error(err.message || 'Could not remove item.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto rounded-2xl app-surface border app-border p-2 w-fit">
          {sections.map((s) => (
            <button key={s.key} onClick={() => setActive(s.key)} className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-colors ${active === s.key ? 'bg-primary-600 text-white' : 'text-app-primary hover:bg-black/5 dark:hover:bg-white/5'}`}>
              <s.icon className="h-4 w-4" /> {s.label}
            </button>
          ))}
        </div>
        <Button icon={FiPlus} onClick={() => setAddOpen(true)}>New {section.label.replace(/s$/, '')}</Button>
      </div>

      <div className="rounded-2xl app-surface border app-border p-5 shadow-card">
        {loading ? <SkeletonBlock className="h-64" /> : items.length === 0 ? (
          <EmptyState icon={section.icon} title={`No ${section.label.toLowerCase()} yet`} description="Published items will appear on the public site immediately." />
        ) : (
          <div className="divide-y app-border">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3.5">
                <div>
                  <p className="text-sm font-medium text-app-primary">{item.title}</p>
                  <p className="text-xs text-app-secondary">{item.excerpt || item.content || item.description}</p>
                </div>
                <button onClick={() => handleRemove(item.id)} className="rounded-lg p-2 text-app-secondary hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"><FiTrash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={`New ${section.label.replace(/s$/, '')}`}>
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Title" value={form.title || ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          {active === 'news' && (
            <>
              <Input label="Excerpt" value={form.excerpt || ''} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />
              <Input label="Category" value={form.category || ''} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
            </>
          )}
          {active === 'events' && (
            <>
              <Input label="Date & Time" type="datetime-local" value={form.event_date || ''} onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))} />
              <Input label="Location" value={form.location || ''} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
            </>
          )}
          {(active === 'announcements' || !form.excerpt) && active !== 'events' && (
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-app-primary">{active === 'news' ? 'Full Content' : 'Content'}</span>
              <textarea rows={4} value={form.content || ''} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className="w-full rounded-xl border app-border app-surface px-3.5 py-2.5 text-sm text-app-primary outline-none focus:border-primary-500" />
            </label>
          )}
          <Button type="submit" loading={saving} className="w-full justify-center">Publish</Button>
        </form>
      </Modal>
    </div>
  )
}
