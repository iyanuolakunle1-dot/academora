import React, { useEffect, useState } from 'react'
import { FiDownload, FiEye, FiFile } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { EmptyState, SkeletonBlock } from '../../components/student/Shared'

export default function Downloads() {
  const { user } = useAuth()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    let mounted = true
    supabase
      .from('documents')
      .select('*')
      .or(`student_id.eq.${user.id},is_public.eq.true`)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (!mounted) return
        setFiles(data || [])
        setLoading(false)
      })
    return () => { mounted = false }
  }, [user?.id])

  if (loading) return <SkeletonBlock className="h-96" />

  return (
    <div className="rounded-2xl app-surface border app-border p-5 shadow-card">
      {files.length === 0 ? (
        <EmptyState icon={FiFile} title="No files yet" description="Documents shared by the school will appear here for you to download." />
      ) : (
        <div className="divide-y app-border">
          {files.map((f) => (
            <div key={f.id} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300">
                  <FiFile className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-app-primary">{f.file_name}</p>
                  <p className="text-xs text-app-secondary">{f.category} • {new Date(f.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href={f.file_url} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-app-secondary hover:bg-black/5 dark:hover:bg-white/5">
                  <FiEye className="h-4 w-4" />
                </a>
                <a href={f.file_url} download className="rounded-lg p-2 text-app-secondary hover:bg-black/5 dark:hover:bg-white/5">
                  <FiDownload className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
