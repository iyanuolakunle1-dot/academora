import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import StudentSidebar from './StudentSidebar'
import StudentTopbar from './StudentTopbar'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'

const titles = {
  '/student/dashboard': ['Dashboard', 'Overview of your academic activities.'],
  '/student/profile': ['My Profile', 'View and manage your personal information.'],
  '/student/course-registration': ['Course Registration', 'Register for courses and build your academic schedule.'],
  '/student/timetable': ['Timetable', 'View your class schedule and plan your week.'],
  '/student/attendance': ['Attendance', 'Track your class attendance and stay on top of your record.'],
  '/student/assignments': ['Assignments', 'View, submit and track all your assignments.'],
  '/student/results': ['Results', 'View your academic performance and results.'],
  '/student/fees': ['Fees & Payments', 'View your fee summary, payments and transaction history.'],
  '/student/downloads': ['Downloads', 'Access your academic materials and important documents.'],
  '/student/notifications': ['Notifications', 'Stay informed about important updates and activities.'],
  '/student/messages': ['Messages', 'Communicate with your lecturers, staff and classmates.'],
  '/student/settings': ['Settings', 'Manage your account, preferences and system settings.']
}

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [counts, setCounts] = useState({ notifications: 0, messages: 0 })
  const { user } = useAuth()
  const location = useLocation()
  const [title, subtitle] = titles[location.pathname] || ['Dashboard', '']

  useEffect(() => {
    if (!user?.id) return
    let mounted = true
    async function loadCounts() {
      const [{ count: notifCount }, { count: msgCount }] = await Promise.all([
        supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_read', false),
        supabase.from('messages').select('id', { count: 'exact', head: true }).eq('recipient_id', user.id).eq('is_read', false)
      ])
      if (!mounted) return
      setCounts({ notifications: notifCount || 0, messages: msgCount || 0 })
    }
    loadCounts()
    return () => { mounted = false }
  }, [user?.id])

  return (
    <div className="flex min-h-screen bg-[var(--bg-app)]">
      <StudentSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col min-w-0">
        <StudentTopbar
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
          subtitle={subtitle}
          unreadNotifications={counts.notifications}
          unreadMessages={counts.messages}
        />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
