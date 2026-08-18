import { FiHome, FiUsers, FiUserCheck, FiBookOpen, FiCreditCard, FiFileText, FiMail, FiBell, FiSettings } from 'react-icons/fi'
import { createPortalLayout } from './createPortalLayout'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FiHome, end: true },
  { to: '/admin/students', label: 'Students', icon: FiUsers },
  { to: '/admin/staff', label: 'Staff', icon: FiUserCheck },
  { to: '/admin/courses', label: 'Courses', icon: FiBookOpen },
  { to: '/admin/fees', label: 'Fees & Payments', icon: FiCreditCard },
  { to: '/admin/content', label: 'Site Content', icon: FiFileText },
  { to: '/admin/notifications', label: 'Notifications', icon: FiBell },
  { to: '/admin/messages', label: 'Messages', icon: FiMail },
  { to: '/admin/settings', label: 'Settings', icon: FiSettings }
]

const titles = {
  '/admin/dashboard': ['Dashboard', 'School-wide overview and quick stats.'],
  '/admin/students': ['Students', 'Manage all enrolled students.'],
  '/admin/staff': ['Staff', 'Manage teachers, librarians and admins.'],
  '/admin/courses': ['Courses', 'Manage the course catalogue.'],
  '/admin/fees': ['Fees & Payments', 'View all fee collections and transactions.'],
  '/admin/content': ['Site Content', 'Publish news, events and announcements.'],
  '/admin/notifications': ['Notifications', 'Stay informed about important updates.'],
  '/admin/messages': ['Messages', 'Communicate across the school.'],
  '/admin/settings': ['Settings', 'Manage your account, preferences and system settings.']
}

export default createPortalLayout({ portalLabel: 'Super Admin', basePath: '/admin', navItems, titles })
