import React, { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { FiSend, FiMail, FiSearch } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { EmptyState, SkeletonBlock } from '../../components/student/Shared'

export default function Messages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [active, setActive] = useState(null)
  const [thread, setThread] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!user?.id) return
    let mounted = true
    async function load() {
      const { data } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant_one.eq.${user.id},participant_two.eq.${user.id}`)
        .order('updated_at', { ascending: false })
      if (!mounted) return
      setConversations(data || [])
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [user?.id])

  useEffect(() => {
    if (!active) return
    let mounted = true
    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', active.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (!mounted) return
        setThread(data || [])
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      })

    const channel = supabase
      .channel(`messages-${active.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${active.id}` }, (payload) => {
        setThread((prev) => [...prev, payload.new])
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      })
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [active])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim() || !active) return
    const recipientId = active.participant_one === user.id ? active.participant_two : active.participant_one
    try {
      const { error } = await supabase.from('messages').insert({
        conversation_id: active.id,
        sender_id: user.id,
        recipient_id: recipientId,
        content: text.trim()
      })
      if (error) throw error
      setText('')
    } catch (err) {
      toast.error(err.message || 'Could not send message.')
    }
  }

  if (loading) return <SkeletonBlock className="h-[32rem]" />

  return (
    <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-2xl app-surface border app-border shadow-card lg:grid-cols-3 h-[32rem]">
      <div className="border-b app-border lg:col-span-1 lg:border-b-0 lg:border-r overflow-y-auto">
        <div className="p-4 border-b app-border">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-secondary" />
            <input placeholder="Search messages..." className="w-full rounded-lg border app-border app-surface-2 py-2 pl-9 pr-3 text-sm text-app-primary outline-none focus:border-primary-500" />
          </div>
        </div>
        {conversations.length === 0 ? (
          <div className="p-6"><EmptyState icon={FiMail} title="No conversations" description="Start a conversation with your lecturers or classmates." /></div>
        ) : (
          conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c)}
              className={`flex w-full items-center gap-3 border-b app-border px-4 py-3 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${active?.id === c.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-accent-500 text-sm font-bold text-white">
                {(c.other_name || '?').charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-app-primary">{c.other_name || 'Conversation'}</p>
                <p className="truncate text-xs text-app-secondary">{c.last_message || 'No messages yet'}</p>
              </div>
            </button>
          ))
        )}
      </div>

      <div className="flex flex-col lg:col-span-2">
        {!active ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyState icon={FiMail} title="Select a conversation" description="Choose a conversation from the list to view messages." />
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {thread.map((m) => (
                <div key={m.id} className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.sender_id === user.id ? 'bg-primary-600 text-white' : 'app-surface-2 text-app-primary'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={handleSend} className="flex items-center gap-2 border-t app-border p-3">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border app-border app-surface-2 px-4 py-2.5 text-sm text-app-primary outline-none focus:border-primary-500"
              />
              <button type="submit" className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors">
                <FiSend className="h-4 w-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
