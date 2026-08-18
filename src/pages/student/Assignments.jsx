import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiClipboard, FiUpload, FiCheckCircle, FiClock } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { uploadToCloudinary } from '../../lib/cloudinary'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import { EmptyState, SkeletonBlock } from '../../components/student/Shared'

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  submitted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  graded: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
}

export default function Assignments() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(null)
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('assignments').select('*').eq('student_id', user.id).order('due_date')
    setAssignments(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (user?.id) load()
  }, [user?.id])

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Attach a file before submitting.')
      return
    }
    setSubmitting(true)
    try {
      const result = await uploadToCloudinary(file, { folder: 'academora/assignments', onProgress: setProgress })
      const { error } = await supabase
        .from('assignments')
        .update({ status: 'submitted', submission_url: result.url, submitted_at: new Date().toISOString() })
        .eq('id', active.id)
      if (error) throw error
      toast.success('Assignment submitted successfully!')
      setActive(null)
      setFile(null)
      setProgress(0)
      load()
    } catch (err) {
      toast.error(err.message || 'Submission failed.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <SkeletonBlock className="h-96" />

  return (
    <div className="rounded-2xl app-surface border app-border p-5 shadow-card">
      {assignments.length === 0 ? (
        <EmptyState icon={FiClipboard} title="No assignments yet" description="Assignments given by your lecturers will show up here." />
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => (
            <div key={a.id} className="flex flex-col gap-3 rounded-xl app-surface-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-app-primary">{a.title}</p>
                <p className="text-xs text-app-secondary">{a.course_code} • Due {new Date(a.due_date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[a.status] || statusStyles.pending}`}>
                  {a.status === 'submitted' || a.status === 'graded' ? <FiCheckCircle className="h-3 w-3" /> : <FiClock className="h-3 w-3" />}
                  {a.status}
                </span>
                {a.status === 'pending' && (
                  <Button size="sm" variant="outline" icon={FiUpload} onClick={() => setActive(a)}>Submit</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!active} onClose={() => { setActive(null); setFile(null); setProgress(0) }} title={`Submit: ${active?.title || ''}`}>
        <div className="space-y-4">
          <p className="text-sm text-app-secondary">{active?.description}</p>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed app-border p-6 text-center hover:border-primary-400 transition-colors">
            <FiUpload className="h-6 w-6 text-app-secondary" />
            <span className="text-sm text-app-secondary">{file ? file.name : 'Click to select a file to upload'}</span>
            <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          {submitting && (
            <div className="h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
              <div className="h-full rounded-full bg-primary-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
          <Button className="w-full justify-center" loading={submitting} onClick={handleSubmit}>Submit Assignment</Button>
        </div>
      </Modal>
    </div>
  )
}
