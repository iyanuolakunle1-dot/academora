import React, { forwardRef, useState } from 'react'
import { FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi'

const Input = forwardRef(function Input(
  { label, error, icon: Icon, type = 'text', className = '', hint, ...props },
  ref
) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (show ? 'text' : 'password') : type

  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-app-primary">{label}</span>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-app-secondary" />
        )}
        <input
          ref={ref}
          type={inputType}
          className={`w-full rounded-xl border app-border app-surface text-app-primary placeholder:text-app-secondary/70
            py-2.5 ${Icon ? 'pl-10' : 'pl-3.5'} ${isPassword ? 'pr-10' : 'pr-3.5'}
            outline-none transition-all duration-150 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-app-secondary hover:text-app-primary transition-colors"
            tabIndex={-1}
          >
            {show ? <FiEyeOff className="h-4.5 w-4.5" /> : <FiEye className="h-4.5 w-4.5" />}
          </button>
        )}
      </div>
      {hint && !error && <span className="mt-1 block text-xs text-app-secondary">{hint}</span>}
      {error && (
        <span className="mt-1 flex items-center gap-1 text-xs text-red-500 animate-fadeIn">
          <FiAlertCircle className="h-3.5 w-3.5" /> {error}
        </span>
      )}
    </label>
  )
})

export default Input
