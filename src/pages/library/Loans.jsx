import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiPlus, FiRotateCcw, FiBook } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { EmptyState, SkeletonBlock } from '../../components/shared/Widgets'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function LibraryLoans() {
  const { user } = useAuth()
  const [loans, setLoans] = useState([])
  const [books, setBooks] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [issueOpen, setIssueOpen] = useState(false)
  const [form, setForm] = useState({ book_id: '', student_id: '', due_at: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const [{ data: loanRows }, { data: bookRows }, { data: studentRows }] = await Promise.all([
      supabase.from('library_loans').select('*, library_books(title), profiles(full_name)').order('created_at', { ascending: false }),
      supabase.from('library_books').select('id, title, available_copies').gt('available_copies', 0),
      supabase.from('profiles').select('id, full_name').eq('role', 'student')
    ])
    setLoans(loanRows || [])
    setBooks(bookRows || [])
    setStudents(studentRows || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleIssue = async (e) => {
    e.preventDefault()
    if (!form.book_id || !form.student_id || !form.due_at) {
      toast.error('Fill in all fields.')
      return
    }
    setSaving(true)
    try {
      const { error } = await supabase.from('library_loans').insert({
        book_id: form.book_id,
        student_id: form.student_id,
        due_at: form.due_at,
        issued_by: user.id
      })
      if (error) throw error
      const book = books.find((b) => b.id === form.book_id)
      await supabase.from('library_books').update({ available_copies: book.available_copies - 1 }).eq('id', form.book_id)
      toast.success('Book issued successfully.')
      setIssueOpen(false)
      setForm({ book_id: '', student_id: '', due_at: '' })
      load()
    } catch (err) {
      toast.error(err.message || 'Could not issue book.')
    } finally {
      setSaving(false)
    }
  }

  const handleReturn = async (loan) => {
    try {
      await supabase.from('library_loans').update({ status: 'returned', returned_at: new Date().toISOString().slice(0, 10) }).eq('id', loan.id)
      const { data: book } = await supabase.from('library_books').select('available_copies').eq('id', loan.book_id).single()
      await supabase.from('library_books').update({ available_copies: (book?.available_copies || 0) + 1 }).eq('id', loan.book_id)
      toast.success('Book marked as returned.')
      load()
    } catch (err) {
      toast.error(err.message || 'Could not process return.')
    }
  }

  if (loading) return <SkeletonBlock className="h-96" />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-app-primary">Loans</h2>
        <Button icon={FiPlus} onClick={() => setIssueOpen(true)}>Issue Book</Button>
      </div>

      <div className="rounded-2xl app-surface border app-border shadow-card overflow-hidden">
        {loans.length === 0 ? (
          <div className="p-8"><EmptyState icon={FiBook} title="No loans yet" description="Issued books will be tracked here until they're returned." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-primary-900 text-white">
                <tr><th className="px-5 py-3 font-medium">Book</th><th className="px-5 py-3 font-medium">Student</th><th className="px-5 py-3 font-medium">Due Date</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium" /></tr>
              </thead>
              <tbody>
                {loans.map((l) => (
                  <tr key={l.id} className="border-t app-border">
                    <td className="px-5 py-3.5 text-app-primary">{l.library_books?.title}</td>
                    <td className="px-5 py-3.5 text-app-secondary">{l.profiles?.full_name}</td>
                    <td className="px-5 py-3.5 text-app-secondary">{new Date(l.due_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${l.status === 'returned' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>{l.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {l.status === 'borrowed' && (
                        <button onClick={() => handleReturn(l)} className="inline-flex items-center gap-1.5 rounded-lg border app-border px-3 py-1.5 text-xs font-medium text-app-primary hover:bg-black/5 dark:hover:bg-white/5">
                          <FiRotateCcw className="h-3.5 w-3.5" /> Mark Returned
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={issueOpen} onClose={() => setIssueOpen(false)} title="Issue Book">
        <form onSubmit={handleIssue} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-app-primary">Book</span>
            <select value={form.book_id} onChange={(e) => setForm((f) => ({ ...f, book_id: e.target.value }))} className="w-full rounded-xl border app-border app-surface px-3.5 py-2.5 text-sm text-app-primary outline-none focus:border-primary-500">
              <option value="">Select a book</option>
              {books.map((b) => <option key={b.id} value={b.id}>{b.title} ({b.available_copies} available)</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-app-primary">Student</span>
            <select value={form.student_id} onChange={(e) => setForm((f) => ({ ...f, student_id: e.target.value }))} className="w-full rounded-xl border app-border app-surface px-3.5 py-2.5 text-sm text-app-primary outline-none focus:border-primary-500">
              <option value="">Select a student</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
            </select>
          </label>
          <Input label="Due Date" type="date" value={form.due_at} onChange={(e) => setForm((f) => ({ ...f, due_at: e.target.value }))} />
          <Button type="submit" loading={saving} className="w-full justify-center">Issue Book</Button>
        </form>
      </Modal>
    </div>
  )
}
