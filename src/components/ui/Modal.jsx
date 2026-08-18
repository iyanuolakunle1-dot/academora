import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const handleKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className={`relative w-full ${sizes[size]} app-surface rounded-2xl shadow-2xl border app-border overflow-hidden`}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b app-border">
              <h3 className="text-lg font-semibold text-app-primary">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-app-secondary hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
            {footer && <div className="px-6 py-4 border-t app-border flex justify-end gap-3">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
