import React from 'react'
import { motion } from 'framer-motion'

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap'

const variants = {
  primary:
    'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-soft hover:shadow-lg hover:brightness-105 active:brightness-95',
  secondary:
    'bg-primary-600 text-white hover:bg-primary-700 shadow-soft',
  outline:
    'border-2 border-primary-600 text-primary-600 dark:text-primary-300 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30',
  ghost: 'text-app-primary hover:bg-black/5 dark:hover:bg-white/5',
  danger: 'bg-red-600 text-white hover:bg-red-700'
}

const sizes = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-5 py-2.5',
  lg: 'text-base px-7 py-3.5'
}

const motionComponentCache = new Map()

function getMotionComponent(as) {
  if (typeof as === 'string') {
    return motion[as] || motion.button
  }
  if (!motionComponentCache.has(as)) {
    motionComponentCache.set(as, motion.create ? motion.create(as) : motion(as))
  }
  return motionComponentCache.get(as)
}

export default function Button({
  as = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconRight,
  className = '',
  children,
  ...props
}) {
  const Component = getMotionComponent(as)
  return (
    <Component
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
      ) : Icon ? (
        <Icon className="h-4 w-4" />
      ) : null}
      {children}
      {iconRight && !loading ? <span className="h-4 w-4">{iconRight}</span> : null}
    </Component>
  )
}
