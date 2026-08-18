import React from 'react'
import { Routes, Route } from 'react-router-dom'

import PublicLayout from './components/layout/PublicLayout'
import StudentLayout from './components/layout/StudentLayout'
import TeacherLayout from './components/layout/TeacherLayout'
import ParentLayout from './components/layout/ParentLayout'
import AdminLayout from './components/layout/AdminLayout'
import LibraryLayout from './components/layout/LibraryLayout'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/public/Home'
import About from './pages/public/About'
import Academics from './pages/public/Academics'
import Admissions from './pages/public/Admissions'
import StudentLife from './pages/public/StudentLife'
import NewsEvents from './pages/public/NewsEvents'
import Contact from './pages/public/Contact'

import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ParentSignup from './pages/auth/ParentSignup'
import TeacherSignup from './pages/auth/TeacherSignup'
import AdminSignup from './pages/auth/AdminSignup'

import Dashboard from './pages/student/Dashboard'
import Profile from './pages/student/Profile'
import CourseRegistration from './pages/student/CourseRegistration'
import Timetable from './pages/student/Timetable'
import Attendance from './pages/student/Attendance'
import Assignments from './pages/student/Assignments'
import Results from './pages/student/Results'
import Fees from './pages/student/Fees'
import Downloads from './pages/student/Downloads'
import Notifications from './pages/student/Notifications'
import Messages from './pages/student/Messages'
import Settings from './pages/student/Settings'

import TeacherDashboard from './pages/teacher/Dashboard'
import ClassDetail from './pages/teacher/ClassDetail'
import TeacherAssignments from './pages/teacher/Assignments'

import ParentDashboard from './pages/parent/Dashboard'
import ParentResults from './pages/parent/Results'
import ParentAttendance from './pages/parent/Attendance'
import ParentFees from './pages/parent/Fees'

import AdminDashboard from './pages/admin/Dashboard'
import AdminStudents from './pages/admin/Students'
import AdminStaff from './pages/admin/Staff'
import AdminCourses from './pages/admin/Courses'
import AdminFees from './pages/admin/Fees'
import AdminContent from './pages/admin/Content'

import LibraryCatalogue from './pages/library/Catalogue'
import LibraryLoans from './pages/library/Loans'

import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/student-life" element={<StudentLife />} />
        <Route path="/news-events" element={<NewsEvents />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/parent/signup" element={<ParentSignup />} />
      <Route path="/teacher/signup" element={<TeacherSignup />} />
      <Route path="/admin/signup" element={<AdminSignup />} />

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="course-registration" element={<CourseRegistration />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="results" element={<Results />} />
        <Route path="fees" element={<Fees />} />
        <Route path="downloads" element={<Downloads />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="messages" element={<Messages />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="classes/:classId" element={<ClassDetail />} />
        <Route path="assignments" element={<TeacherAssignments />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="messages" element={<Messages />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route
        path="/parent"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<ParentDashboard />} />
        <Route path="results" element={<ParentResults />} />
        <Route path="attendance" element={<ParentAttendance />} />
        <Route path="fees" element={<ParentFees />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="messages" element={<Messages />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="staff" element={<AdminStaff />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="fees" element={<AdminFees />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="messages" element={<Messages />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route
        path="/library"
        element={
          <ProtectedRoute allowedRoles={['librarian']}>
            <LibraryLayout />
          </ProtectedRoute>
        }
      >
        <Route path="catalogue" element={<LibraryCatalogue />} />
        <Route path="loans" element={<LibraryLoans />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="messages" element={<Messages />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
