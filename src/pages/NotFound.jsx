import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome, FiArrowLeft } from 'react-icons/fi'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-app)] px-4 text-center">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-display text-7xl font-bold text-primary-600">404</p>
        <h1 className="mt-3 font-display text-2xl font-bold text-app-primary">Page not found</h1>
        <p className="mt-2 max-w-sm text-app-secondary">The page you're looking for doesn't exist or may have been moved.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button as={Link} to="/" icon={FiHome}>Go Home</Button>
          <Button variant="outline" icon={FiArrowLeft} onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </motion.div>
    </div>
  )
}
