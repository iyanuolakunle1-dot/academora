import { FiBookOpen, FiRepeat, FiMail, FiBell, FiSettings } from 'react-icons/fi'
import { createPortalLayout } from './createPortalLayout'

const navItems = [
  { to: '/library/catalogue', label: 'Catalogue', icon: FiBookOpen, end: true },
  { to: '/library/loans', label: 'Loans', icon: FiRepeat },
  { to: '/library/notifications', label: 'Notifications', icon: FiBell },
  { to: '/library/messages', label: 'Messages', icon: FiMail },
  { to: '/library/settings', label: 'Settings', icon: FiSettings }
]

const titles = {
  '/library/catalogue': ['Catalogue', 'Manage the library book collection.'],
  '/library/loans': ['Loans', 'Issue and track borrowed books.'],
  '/library/notifications': ['Notifications', 'Stay informed about important updates.'],
  '/library/messages': ['Messages', 'Communicate with students and staff.'],
  '/library/settings': ['Settings', 'Manage your account, preferences and system settings.']
}

export default createPortalLayout({ portalLabel: 'Library Portal', basePath: '/library', navItems, titles })
