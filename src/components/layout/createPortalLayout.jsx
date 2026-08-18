import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import PortalSidebar from './PortalSidebar'
import PortalTopbar from './PortalTopbar'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'

/**
 * createPortalLayout({ portalLabel, basePath, navItems, titles })
 * Returns a React component to use as a layout route element.
 * - navItems: [{ to, label, icon, end }]
 * - titles: { '/base/path': ['Page Title', 'Subtitle'] }
 */
export function createPortalLayout({ portalLabel, basePath, navItems, titles }) {
  return function PortalLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [counts, setCounts] = useState({ notifications: 0, messages: 0 })
    const { user } = useAuth()
    const location = useLocation()
    const [title, subtitle] = titles[location.pathname] || [portalLabel, '']

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
        <PortalSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} navItems={navItems} portalLabel={portalLabel} />
        <div className="flex min-h-screen flex-1 flex-col min-w-0">
          <PortalTopbar
            onMenuClick={() => setSidebarOpen(true)}
            title={title}
            subtitle={subtitle}
            unreadNotifications={counts.notifications}
            unreadMessages={counts.messages}
            profileHref={`${basePath}/settings`}
            settingsHref={`${basePath}/settings`}
            notificationsHref={`${basePath}/notifications`}
            messagesHref={`${basePath}/messages`}
          />
          <main className="flex-1 p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    )
  }
}
