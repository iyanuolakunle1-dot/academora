import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiSearch, FiPlus, FiBookOpen, FiTrash2, FiUpload } from 'react-icons/fi'
import { supabase } from '../../lib/supabaseClient'
import { uploadToCloudinary } from '../../lib/cloudinary'
import { EmptyState, SkeletonBlock } from '../../components/shared/Widgets'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function LibraryCatalogue() {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ title: '', author: '', isbn: '', category: '', total_copies: '1' })
  const [cover, setCover] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('library_books').select('*').order('title')
    setBooks(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = books.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()) || (b.author || '').toLowerCase().includes(search.toLowerCase()))

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.title) {
      toast.error('Book title is required.')
      return
    }
    setSaving(true)
    try {
      let coverUrl = null
      if (cover) {
        const result = await uploadToCloudinary(cover, { folder: 'academora/library' })
        coverUrl = result.url
      }
      const copies = Number(form.total_copies) || 1
      const { error } = await supabase.from('library_books').insert({
        title: form.title,
        author: form.author,
        isbn: form.isbn,
        category: form.category,
        total_copies: copies,
        available_copies: copies,
        cover_image_url: coverUrl
      })
      if (error) throw error
      toast.success('Book added to catalogue.')
      setAddOpen(false)
      setForm({ title: '', author: '', isbn: '', category: '', total_copies: '1' })
      setCover(null)
      load()
    } catch (err) {
      toast.error(err.message || 'Could not add book.')
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async (id) => {
    try {
      const { error } = await supabase.from('library_books').delete().eq('id', id)
      if (error) throw error
      toast.success('Book removed.')
      load()
    } catch (err) {
      toast.error(err.message || 'Could not remove book.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-secondary" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search catalogue..." className="rounded-xl border app-border app-surface-2 py-2 pl-9 pr-3 text-sm text-app-primary outline-none focus:border-primary-500 w-full sm:w-72" />
        </div>
        <Button icon={FiPlus} onClick={() => setAddOpen(true)}>Add Book</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">{[0,1,2,3,4].map((i) => <SkeletonBlock key={i} className="h-56" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl app-surface border app-border p-8"><EmptyState icon={FiBookOpen} title="No books in the catalogue yet" description="Add your first book to start building the library catalogue." /></div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
          {filtered.map((b) => (
            <div key={b.id} className="overflow-hidden rounded-2xl app-surface border app-border shadow-card">
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-primary-700 to-accent-600 text-white/80">
                {b.cover_image_url ? <img src={b.cover_image_url} alt={b.title} className="h-full w-full object-cover" /> : <FiBookOpen className="h-8 w-8" />}
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-semibold text-app-primary">{b.title}</p>
                <p className="truncate text-xs text-app-secondary">{b.author}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${b.available_copies > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {b.available_copies}/{b.total_copies} available
                  </span>
                  <button onClick={() => handleRemove(b.id)} className="text-app-secondary hover:text-red-600"><FiTrash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Book to Catalogue">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <Input label="Author" value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="ISBN" value={form.isbn} onChange={(e) => setForm((f) => ({ ...f, isbn: e.target.value }))} />
            <Input label="Total Copies" type="number" value={form.total_copies} onChange={(e) => setForm((f) => ({ ...f, total_copies: e.target.value }))} />
          </div>
          <Input label="Category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed app-border p-4 text-sm text-app-secondary hover:border-primary-400">
            <FiUpload className="h-4 w-4" /> {cover ? cover.name : 'Upload cover image (optional)'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setCover(e.target.files?.[0] || null)} />
          </label>
          <Button type="submit" loading={saving} className="w-full justify-center">Add Book</Button>
        </form>
      </Modal>
    </div>
  )
}
