import React, { useState } from 'react'
import PeopleManager from '../../components/shared/PeopleManager'

const roles = [
  { key: 'teacher', label: 'Teachers' },
  { key: 'librarian', label: 'Librarians' },
  { key: 'admin', label: 'Admins' }
]

export default function AdminStaff() {
  const [active, setActive] = useState('teacher')
  return (
    <div>
      <div className="mb-5 flex gap-2 overflow-x-auto rounded-2xl app-surface border app-border p-2 w-fit">
        {roles.map((r) => (
          <button
            key={r.key}
            onClick={() => setActive(r.key)}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-colors ${active === r.key ? 'bg-primary-600 text-white' : 'text-app-primary hover:bg-black/5 dark:hover:bg-white/5'}`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <PeopleManager key={active} role={active} title={roles.find((r) => r.key === active).label} addLabel={`Add ${roles.find((r) => r.key === active).label.slice(0, -1)}`} />
    </div>
  )
}
