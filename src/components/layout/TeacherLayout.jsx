import { FiHome, FiUsers, FiClipboard, FiMail, FiBell, FiSettings } from 'react-icons/fi'
import { createPortalLayout } from './createPortalLayout'

const navItems = [
  { to: '/teacher/dashboard', label: 'My Classes', icon: FiHome, end: true },
  { to: '/teacher/assignments', label: 'Assignments', icon: FiClipboard },
  { to: '/teacher/notifications', label: 'Notifications', icon: FiBell },
  { to: '/teacher/messages', label: 'Messages', icon: FiMail },
  { to: '/teacher/settings', label: 'Settings', icon: FiSettings }
]

const titles = {
  '/teacher/dashboard': ['My Classes', 'View and manage all the classes you are assigned to.'],
  '/teacher/assignments': ['Assignments', 'Create assignments and grade student submissions.'],
  '/teacher/notifications': ['Notifications', 'Stay informed about important updates.'],
  '/teacher/messages': ['Messages', 'Communicate with students and staff.'],
  '/teacher/settings': ['Settings', 'Manage your account, preferences and system settings.']
}

export default createPortalLayout({ portalLabel: 'Teacher Portal', basePath: '/teacher', navItems, titles })
