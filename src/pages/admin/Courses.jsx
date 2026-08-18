import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiSearch, FiPlus, FiTrash2, FiBookOpen } from 'react-icons/fi'
import { supabase } from '../../lib/supabaseClient'
import { EmptyState, SkeletonBlock } from '../../components/shared/Widgets'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function AdminCourses() {
  const [courses, setCourses] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ course_code: '', course_title: '', units: '3', instructor: '', department: '', schedule: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('courses').select('*').order('course_code')
    setCourses(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = courses.filter((c) => c.course_title.toLowerCase().includes(search.toLowerCase()) || c.course_code.toLowerCase().includes(search.toLowerCase()))

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.course_code || !form.course_title) {
      toast.error('Course code and title are required.')
      return
    }
    setSaving(true)
    try {
      const { error } = await supabase.from('courses').insert({ ...form, units: Number(form.units) || 1 })
      if (error) throw error
      toast.success('Course added successfully.')
      setAddOpen(false)
      setForm({ course_code: '', course_title: '', units: '3', instructor: '', department: '', schedule: '' })
      load()
    } catch (err) {
      toast.error(err.message || 'Could not add course.')
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async (id) => {
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id)
      if (error) throw error
      toast.success('Course removed.')
      load()
    } catch (err) {
      toast.error(err.message || 'Could not remove course.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-secondary" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses..." className="rounded-xl border app-border app-surface-2 py-2 pl-9 pr-3 text-sm text-app-primary outline-none focus:border-primary-500 w-full sm:w-72" />
        </div>
        <Button icon={FiPlus} onClick={() => setAddOpen(true)}>Add Course</Button>
      </div>

      <div className="rounded-2xl app-surface border app-border shadow-card overflow-hidden">
        {loading ? <SkeletonBlock className="h-64 !rounded-none" /> : filtered.length === 0 ? (
          <div className="p-8"><EmptyState icon={FiBookOpen} title="No courses yet" description="Add your first course to make it available for student registration." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-primary-900 text-white">
                <tr><th className="px-5 py-3 font-medium">Course</th><th className="px-5 py-3 font-medium">Units</th><th className="px-5 py-3 font-medium">Instructor</th><th className="px-5 py-3 font-medium">Department</th><th className="px-5 py-3 font-medium" /></tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-t app-border">
                    <td className="px-5 py-3.5"><p className="font-medium text-app-primary">{c.course_code}</p><span className="text-xs text-app-secondary">{c.course_title}</span></td>
                    <td className="px-5 py-3.5 text-app-secondary">{c.units}</td>
                    <td className="px-5 py-3.5 text-app-secondary">{c.instructor || '—'}</td>
                    <td className="px-5 py-3.5 text-app-secondary">{c.department || '—'}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => handleRemove(c.id)} className="rounded-lg p-2 text-app-secondary hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"><FiTrash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Course">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Course Code" value={form.course_code} onChange={(e) => setForm((f) => ({ ...f, course_code: e.target.value }))} />
            <Input label="Units" type="number" value={form.units} onChange={(e) => setForm((f) => ({ ...f, units: e.target.value }))} />
          </div>
          <Input label="Course Title" value={form.course_title} onChange={(e) => setForm((f) => ({ ...f, course_title: e.target.value }))} />
          <Input label="Instructor" value={form.instructor} onChange={(e) => setForm((f) => ({ ...f, instructor: e.target.value }))} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Department" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} />
            <Input label="Schedule" value={form.schedule} onChange={(e) => setForm((f) => ({ ...f, schedule: e.target.value }))} placeholder="Mon 10:00 - 11:30 AM" />
          </div>
          <Button type="submit" loading={saving} className="w-full justify-center">Add Course</Button>
        </form>
      </Modal>
    </div>
  )
}
