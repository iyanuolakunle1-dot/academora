import React from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiX } from 'react-icons/fi'
import { validatePassword } from '../../utils/validators'

const levelColors = ['bg-red-500', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500']
const levelLabels = ['Very Weak', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong']

export default function PasswordStrength({ password }) {
  const { results, score } = validatePassword(password)
  if (!password) return null

  return (
    <div className="mt-2 animate-fadeIn">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.03 }}
            className={`h-1.5 flex-1 origin-left rounded-full ${i < score ? levelColors[score] : 'bg-black/10 dark:bg-white/10'}`}
          />
        ))}
      </div>
      <p className="mt-1 text-xs font-medium text-app-secondary">{levelLabels[score]}</p>
      <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
        {results.map((r) => (
          <li key={r.key} className={`flex items-center gap-1.5 text-xs ${r.passed ? 'text-green-600' : 'text-app-secondary'}`}>
            {r.passed ? <FiCheck className="h-3 w-3" /> : <FiX className="h-3 w-3 text-app-secondary/60" />}
            {r.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
