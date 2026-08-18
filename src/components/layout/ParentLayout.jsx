import { FiHome, FiFileText, FiCheckSquare, FiCreditCard, FiMail, FiBell, FiSettings } from 'react-icons/fi'
import { createPortalLayout } from './createPortalLayout'

const navItems = [
  { to: '/parent/dashboard', label: 'Dashboard', icon: FiHome, end: true },
  { to: '/parent/results', label: "Child's Results", icon: FiFileText },
  { to: '/parent/attendance', label: 'Attendance', icon: FiCheckSquare },
  { to: '/parent/fees', label: 'Fees & Payments', icon: FiCreditCard },
  { to: '/parent/notifications', label: 'Notifications', icon: FiBell },
  { to: '/parent/messages', label: 'Messages', icon: FiMail },
  { to: '/parent/settings', label: 'Settings', icon: FiSettings }
]

const titles = {
  '/parent/dashboard': ['Dashboard', "Overview of your child's academic journey."],
  '/parent/results': ["Child's Results", 'View academic performance and results.'],
  '/parent/attendance': ['Attendance', "Track your child's class attendance."],
  '/parent/fees': ['Fees & Payments', "View and pay your child's school fees."],
  '/parent/notifications': ['Notifications', 'Stay informed about important updates.'],
  '/parent/messages': ['Messages', 'Communicate with teachers and staff.'],
  '/parent/settings': ['Settings', 'Manage your account, preferences and system settings.']
}

export default createPortalLayout({ portalLabel: 'Parent Portal', basePath: '/parent', navItems, titles })
