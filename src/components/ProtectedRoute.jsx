import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ROLE_HOME = {
  student: '/student/dashboard',
  teacher: '/teacher/dashboard',
  parent: '/parent/dashboard',
  librarian: '/library/catalogue',
  admin: '/admin/dashboard',
  super_admin: '/admin/dashboard'
}

export default function ProtectedRoute({ children, allowedRoles }) {
  const { session, loading, role } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-app)]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to={ROLE_HOME[role] || '/student/dashboard'} replace />
  }

  return children
}
