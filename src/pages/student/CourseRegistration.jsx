import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FiPlus, FiX, FiSearch, FiArrowRight, FiBookOpen,
  FiCheckCircle, FiCheck, FiPrinter, FiClock, FiUser,
  FiAward, FiLayers, FiDownload, FiZap
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { EmptyState, SkeletonBlock } from '../../components/student/Shared'

const MAX_UNITS = 24
const MIN_UNITS = 12

// Default Comprehensive Curriculum Courses
const INSTITUTIONAL_COURSES = [
  {
    id: 'c-mth-101',
    course_code: 'MTH 101',
    course_title: 'Elementary Mathematics & Calculus I',
    units: 3,
    department: 'Science & Technology',
    level: '100 Level (Year 1)',
    instructor: 'Dr. A. B. Adeyemi',
    schedule: 'Mon & Wed 09:00 - 11:00 AM',
    day_of_week: 'Monday',
    start_time: '09:00 AM',
    end_time: '11:00 AM',
    room: 'Lecture Hall 1A',
    is_required: true
  },
  {
    id: 'c-phy-101',
    course_code: 'PHY 101',
    course_title: 'General Physics & Mechanics',
    units: 3,
    department: 'Science & Technology',
    level: '100 Level (Year 1)',
    instructor: 'Prof. K. O. Okon',
    schedule: 'Tue & Thu 10:00 - 12:00 PM',
    day_of_week: 'Tuesday',
    start_time: '10:00 AM',
    end_time: '12:00 PM',
    room: 'Physics Lab 2',
    is_required: true
  },
  {
    id: 'c-chm-101',
    course_code: 'CHM 101',
    course_title: 'General Chemistry I',
    units: 3,
    department: 'Science & Technology',
    level: '100 Level (Year 1)',
    instructor: 'Dr. Mrs. C. Eze',
    schedule: 'Mon & Fri 11:00 - 01:00 PM',
    day_of_week: 'Wednesday',
    start_time: '11:00 AM',
    end_time: '01:00 PM',
    room: 'Chemistry Hall B',
    is_required: true
  },
  {
    id: 'c-csc-101',
    course_code: 'CSC 101',
    course_title: 'Introduction to Computer Science & Python',
    units: 3,
    department: 'Computer Science & Robotics',
    level: '100 Level (Year 1)',
    instructor: 'Engr. D. T. Bello',
    schedule: 'Wed & Fri 02:00 - 04:00 PM',
    day_of_week: 'Wednesday',
    start_time: '02:00 PM',
    end_time: '04:00 PM',
    room: 'Robotics Suite 1',
    is_required: true
  },
  {
    id: 'c-gst-101',
    course_code: 'GST 101',
    course_title: 'Use of English & Communication Skills',
    units: 2,
    department: 'Arts & Humanities',
    level: '100 Level (Year 1)',
    instructor: 'Dr. H. I. Danjuma',
    schedule: 'Thu 08:00 - 10:00 AM',
    day_of_week: 'Thursday',
    start_time: '08:00 AM',
    end_time: '10:00 AM',
    room: 'Main Auditorium',
    is_required: true
  },
  {
    id: 'c-acc-101',
    course_code: 'ACC 101',
    course_title: 'Principles of Accounting I',
    units: 3,
    department: 'Commercial & Business',
    level: '100 Level (Year 1)',
    instructor: 'Mr. F. O. Williams',
    schedule: 'Mon & Wed 01:00 - 03:00 PM',
    day_of_week: 'Monday',
    start_time: '01:00 PM',
    end_time: '03:00 PM',
    room: 'Business Hall 3',
    is_required: true
  },
  {
    id: 'c-ecn-101',
    course_code: 'ECN 101',
    course_title: 'Principles of Economics I (Microeconomics)',
    units: 3,
    department: 'Commercial & Business',
    level: '100 Level (Year 1)',
    instructor: 'Dr. G. A. Johnson',
    schedule: 'Tue & Thu 02:00 - 04:00 PM',
    day_of_week: 'Tuesday',
    start_time: '02:00 PM',
    end_time: '04:00 PM',
    room: 'Social Science Complex',
    is_required: false
  },
  {
    id: 'c-bio-101',
    course_code: 'BIO 101',
    course_title: 'General Biology & Cell Physiology',
    units: 3,
    department: 'Science & Technology',
    level: '100 Level (Year 1)',
    instructor: 'Dr. S. K. Alabi',
    schedule: 'Wed 08:00 - 10:00 AM',
    day_of_week: 'Wednesday',
    start_time: '08:00 AM',
    end_time: '10:00 AM',
    room: 'Biology Lab 1',
    is_required: false
  },
  {
    id: 'c-gst-102',
    course_code: 'GST 102',
    course_title: 'Philosophy, Logic & Critical Thinking',
    units: 2,
    department: 'Arts & Humanities',
    level: '100 Level (Year 1)',
    instructor: 'Prof. T. M. Peters',
    schedule: 'Fri 09:00 - 11:00 AM',
    day_of_week: 'Friday',
    start_time: '09:00 AM',
    end_time: '11:00 AM',
    room: 'Humanities Hall A',
    is_required: false
  },
  {
    id: 'c-lit-101',
    course_code: 'LIT 101',
    course_title: 'Introduction to World & African Literature',
    units: 3,
    department: 'Arts & Humanities',
    level: '100 Level (Year 1)',
    instructor: 'Dr. Amina Yusuf',
    schedule: 'Mon & Thu 03:00 - 05:00 PM',
    day_of_week: 'Thursday',
    start_time: '03:00 PM',
    end_time: '05:00 PM',
    room: 'Arts Theatre',
    is_required: true
  },
  {
    id: 'c-csc-201',
    course_code: 'CSC 201',
    course_title: 'Data Structures & Object-Oriented Programming',
    units: 3,
    department: 'Computer Science & Robotics',
    level: '200 Level (Year 2)',
    instructor: 'Engr. D. T. Bello',
    schedule: 'Tue & Thu 09:00 - 11:00 AM',
    day_of_week: 'Tuesday',
    start_time: '09:00 AM',
    end_time: '11:00 AM',
    room: 'Computer Lab 3',
    is_required: true
  }
]

const deptCategories = [
  'All Courses',
  'Science & Technology',
  'Computer Science & Robotics',
  'Commercial & Business',
  'Arts & Humanities'
]

export default function CourseRegistration() {
  const { profile, user } = useAuth()
  const [courses, setCourses] = useState([])
  const [registered, setRegistered] = useState([])
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState('All Courses')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [slipOpen, setSlipOpen] = useState(false)

  const storageKey = user?.id ? `academora_reg_courses_${user.id}` : null

  useEffect(() => {
    if (!user?.id) return
    let mounted = true

    async function load() {
      try {
        // Load custom database courses if any
        const { data: dbCourses } = await supabase.from('courses').select('*').order('course_code')
        const allCourses = dbCourses && dbCourses.length > 0 ? dbCourses : INSTITUTIONAL_COURSES

        // Load existing registered courses from Supabase
        const { data: regData } = await supabase
          .from('course_registrations')
          .select('*, courses(*)')
          .eq('student_id', user.id)

        // Local storage cache fallback
        const localSaved = storageKey ? JSON.parse(localStorage.getItem(storageKey) || '[]') : []

        if (!mounted) return

        setCourses(allCourses)
        if (regData && regData.length > 0) {
          setRegistered(regData)
        } else if (localSaved.length > 0) {
          setRegistered(localSaved)
        } else {
          setRegistered([])
        }
      } catch (err) {
        setCourses(INSTITUTIONAL_COURSES)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [user?.id, storageKey])

  const registeredIds = useMemo(
    () => new Set(registered.map((r) => r.course_id || r.id)),
    [registered]
  )

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const isNotRegistered = !registeredIds.has(c.id)
      const matchesSearch =
        c.course_title?.toLowerCase().includes(search.toLowerCase()) ||
        c.course_code?.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor?.toLowerCase().includes(search.toLowerCase())
      const matchesDept =
        selectedDept === 'All Courses' ||
        c.department === selectedDept ||
        (selectedDept === 'Arts & Humanities' && c.course_code.startsWith('GST'))
      return isNotRegistered && matchesSearch && matchesDept
    })
  }, [courses, registeredIds, search, selectedDept])

  const cartUnits = useMemo(
    () => cart.reduce((sum, c) => sum + (c.units || 0), 0),
    [cart]
  )

  const registeredUnits = useMemo(
    () =>
      registered.reduce((sum, r) => {
        const u = r.courses?.units || r.units || 3
        return sum + u
      }, 0),
    [registered]
  )

  const addToCart = (course) => {
    if (cart.find((c) => c.id === course.id)) return
    if (cartUnits + (course.units || 3) > MAX_UNITS) {
      toast.error(`Maximum registration limit of ${MAX_UNITS} credit units exceeded.`)
      return
    }
    setCart((c) => [...c, course])
    toast.success(`Added ${course.course_code} to cart.`)
  }

  const removeFromCart = (id) => {
    setCart((c) => c.filter((x) => x.id !== id))
  }

  // Quick enroll recommended courses for student's department
  const handleAutoSelectDepartmentCourses = () => {
    const studentDept = profile?.department || 'Science & Technology'
    const recommended = courses.filter(
      (c) =>
        !registeredIds.has(c.id) &&
        (c.department === studentDept || c.is_required || c.course_code.startsWith('GST'))
    )

    let currentUnits = 0
    const toAdd = []
    for (const item of recommended) {
      if (currentUnits + (item.units || 3) <= MAX_UNITS) {
        toAdd.push(item)
        currentUnits += item.units || 3
      }
    }

    if (toAdd.length === 0) {
      toast.info('All core department courses are already registered or in your cart.')
      return
    }

    setCart(toAdd)
    toast.success(`Selected ${toAdd.length} recommended department courses (${currentUnits} Units).`)
  }

  const handleSubmit = async () => {
    if (cart.length === 0) {
      toast.error('Please add at least one course to your registration cart.')
      return
    }
    setSubmitting(true)
    try {
      // 1. Prepare Supabase registration rows
      const rows = cart.map((c) => ({
        student_id: user.id,
        course_id: c.id,
        status: 'registered',
        session: profile?.academic_session || '2024/2025',
        semester: 'First Semester'
      }))

      // 2. Insert into Supabase if table exists
      try {
        await supabase.from('course_registrations').insert(rows)
      } catch (e) {
        // Fallback for custom course ids
      }

      // 3. Create timetable entries for registered courses
      const timetableEntries = cart.map((c) => ({
        student_id: user.id,
        course_code: c.course_code,
        course_title: c.course_title,
        day_of_week: c.day_of_week || 'Monday',
        start_time: c.start_time || '09:00 AM',
        end_time: c.end_time || '11:00 AM',
        room: c.room || 'Lecture Hall 1'
      }))

      try {
        await supabase.from('timetable_entries').insert(timetableEntries)
      } catch (e) {
        // Safe fallback
      }

      // 4. Update local registered state & localStorage cache
      const newlyRegistered = cart.map((c) => ({
        course_id: c.id,
        courses: c,
        units: c.units || 3,
        status: 'registered'
      }))

      const combined = [...registered, ...newlyRegistered]
      setRegistered(combined)
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(combined))
      }

      setCart([])
      toast.success('Course Registration completed successfully! 🎉')
      setSlipOpen(true)
    } catch (err) {
      toast.error(err.message || 'Could not complete registration.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SkeletonBlock className="h-96 lg:col-span-2" />
        <SkeletonBlock className="h-96" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Registration Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl app-surface border app-border p-6 sm:p-7 shadow-card"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-full bg-primary-50 dark:bg-primary-950/60 px-3 py-0.5 text-xs font-semibold text-primary-700 dark:text-primary-300">
                {profile?.level || '100 Level'}
              </span>
              <span className="rounded-full bg-accent-500/20 px-3 py-0.5 text-xs font-semibold text-accent-400 border border-accent-500/30">
                {profile?.department || 'Science & Technology'}
              </span>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-0.5 text-xs font-mono font-bold text-app-primary">
                {profile?.matric_number || 'ACM/2024/SCI/1084'}
              </span>
            </div>

            <h2 className="font-display text-2xl font-bold text-app-primary">
              Online Course Registration Portal
            </h2>
            <p className="mt-1 text-sm text-app-secondary">
              Session {profile?.academic_session || '2024/2025'} • First Semester • Maximum Limit: {MAX_UNITS} Credit Units.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              icon={FiZap}
              onClick={handleAutoSelectDepartmentCourses}
              className="text-xs"
            >
              Auto-Select Core Courses
            </Button>
            {registered.length > 0 && (
              <Button
                variant="secondary"
                icon={FiPrinter}
                onClick={() => setSlipOpen(true)}
                className="text-xs"
              >
                Print Course Slip
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Grid: Available Courses & Cart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Course Directory (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl app-surface border app-border p-6 shadow-card">
            {/* Search & Department Filter Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display text-base font-bold text-app-primary">
                  Available Curriculum Courses ({filtered.length})
                </h3>
                <p className="text-xs text-app-secondary">Select courses to add to your registration cart.</p>
              </div>

              <div className="relative w-full sm:w-64">
                <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-secondary" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search code, title, instructor..."
                  className="w-full rounded-xl border app-border app-surface-2 py-2 pl-9 pr-3 text-xs text-app-primary outline-none transition focus:border-primary-500"
                />
              </div>
            </div>

            {/* Department Category Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 border-b app-border custom-scrollbar">
              {deptCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedDept(cat)}
                  className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    selectedDept === cat
                      ? 'bg-primary-600 text-white shadow-soft'
                      : 'text-app-secondary hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Course Table */}
            {filtered.length === 0 ? (
              <EmptyState
                icon={FiBookOpen}
                title="All courses in this category registered"
                description="You have added all courses in this category or no results matched your search."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 text-app-secondary text-xs uppercase tracking-wider border-b app-border">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Course Code & Title</th>
                      <th className="px-4 py-3 font-semibold">Units</th>
                      <th className="px-4 py-3 font-semibold">Schedule & Venue</th>
                      <th className="px-4 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y app-border">
                    {filtered.map((c) => (
                      <tr key={c.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-app-primary text-sm">{c.course_code}</p>
                            {c.is_required && (
                              <span className="rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 border border-red-500/20">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-app-secondary mt-0.5">{c.course_title}</p>
                          <p className="text-[11px] text-primary-600 dark:text-primary-400 mt-0.5">{c.instructor}</p>
                        </td>
                        <td className="px-4 py-3.5 text-app-primary font-mono font-bold text-sm">
                          {c.units}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-app-secondary">
                          <p className="font-medium text-app-primary">{c.schedule}</p>
                          <p className="text-[11px] text-app-secondary">{c.room || 'Main Complex'}</p>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => addToCart(c)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-primary-500/30 bg-primary-50 dark:bg-primary-950/60 px-3 py-1.5 text-xs font-semibold text-primary-600 dark:text-primary-300 hover:bg-primary-600 hover:text-white transition-all shadow-sm"
                          >
                            <FiPlus className="h-3.5 w-3.5" /> Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Registered Courses Ledger */}
          <div className="rounded-3xl app-surface border app-border p-6 shadow-card">
            <div className="flex items-center justify-between border-b app-border pb-4 mb-4">
              <div>
                <h3 className="font-display text-base font-bold text-app-primary">
                  Officially Registered Courses ({registered.length})
                </h3>
                <p className="text-xs text-app-secondary">Current Total: {registeredUnits} Credit Units</p>
              </div>
              {registered.length > 0 && (
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3 py-1 border border-emerald-500/20">
                  Status: Approved
                </span>
              )}
            </div>

            {registered.length === 0 ? (
              <p className="text-xs text-app-secondary py-4 text-center">
                You have not registered any courses for this session yet. Select courses from the list above to begin.
              </p>
            ) : (
              <div className="divide-y app-border">
                {registered.map((r, idx) => {
                  const courseObj = r.courses || r
                  return (
                    <div key={r.course_id || idx} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-semibold text-app-primary">
                          {courseObj.course_code} — {courseObj.course_title}
                        </p>
                        <p className="text-xs text-app-secondary mt-0.5">
                          {courseObj.units || 3} Credit Units • {courseObj.schedule || 'Scheduled'}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-300">
                        <FiCheck className="h-3.5 w-3.5" /> Registered
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Registration Cart & Unit Gauge */}
        <div className="space-y-6">
          <div className="rounded-3xl app-surface border app-border p-6 shadow-card sticky top-24">
            <div className="mb-4 flex items-center justify-between border-b app-border pb-3">
              <h3 className="font-display text-base font-bold text-app-primary">
                Registration Cart ({cart.length})
              </h3>
              <span className="text-xs font-bold font-mono text-accent-600 dark:text-accent-400">
                {cartUnits} / {MAX_UNITS} Units
              </span>
            </div>

            {/* Credit Units Progress Bar */}
            <div className="mb-5 space-y-1.5">
              <div className="flex justify-between text-xs text-app-secondary">
                <span>Total Units in Cart:</span>
                <span className="font-bold text-app-primary">{cartUnits} Units</span>
              </div>
              <div className="h-2 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    cartUnits > MAX_UNITS ? 'bg-red-500' : 'bg-gradient-to-r from-accent-500 to-primary-600'
                  }`}
                  style={{ width: `${Math.min((cartUnits / MAX_UNITS) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-app-secondary">
                {cartUnits >= MIN_UNITS
                  ? '✅ Valid load for full-time academic session'
                  : `⚠️ Minimum load is ${MIN_UNITS} units`}
              </p>
            </div>

            {cart.length === 0 ? (
              <div className="py-8 text-center border-2 border-dashed app-border rounded-2xl p-4">
                <FiBookOpen className="h-8 w-8 text-app-secondary/50 mx-auto mb-2" />
                <p className="text-xs font-semibold text-app-primary">Cart is empty</p>
                <p className="text-[11px] text-app-secondary mt-1">
                  Click "+ Select" on any course or use "Auto-Select Core Courses" above.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                {cart.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-2xl app-surface-2 border app-border p-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-app-primary">{c.course_code}</p>
                      <p className="text-[11px] text-app-secondary truncate max-w-[140px]">{c.course_title}</p>
                      <p className="text-[10px] text-accent-600 dark:text-accent-400 font-semibold">{c.units} Units</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(c.id)}
                      className="p-1.5 text-app-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                      title="Remove from cart"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Button
              className="mt-6 w-full justify-center shadow-soft"
              iconRight={<FiArrowRight />}
              loading={submitting}
              disabled={cart.length === 0}
              onClick={handleSubmit}
            >
              Submit Course Registration
            </Button>
          </div>
        </div>
      </div>

      {/* Official Course Registration Slip (CRF) Modal */}
      <Modal open={slipOpen} onClose={() => setSlipOpen(false)} title="Official Course Registration Form (CRF)">
        <div className="space-y-5 print:p-0">
          {/* Printable Header */}
          <div className="border-b app-border pb-4 text-center">
            <h3 className="font-display text-lg font-bold text-app-primary">ACADEMORA ACADEMY</h3>
            <p className="text-xs text-app-secondary uppercase tracking-widest font-semibold mt-0.5">
              Office of the Registrar • Student Course Registration Slip
            </p>
          </div>

          {/* Student Bio Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs rounded-2xl app-surface-2 border app-border p-3.5">
            <div>
              <span className="text-app-secondary">Full Name:</span>
              <p className="font-bold text-app-primary">{profile?.full_name || 'Student'}</p>
            </div>
            <div>
              <span className="text-app-secondary">Matric No:</span>
              <p className="font-mono font-bold text-accent-600 dark:text-accent-400">
                {profile?.matric_number || 'ACM/2024/SCI/1084'}
              </p>
            </div>
            <div>
              <span className="text-app-secondary">Department:</span>
              <p className="font-bold text-app-primary">{profile?.department || 'Science & Technology'}</p>
            </div>
            <div>
              <span className="text-app-secondary">Academic Session:</span>
              <p className="font-bold text-app-primary">{profile?.academic_session || '2024/2025'} (First Sem)</p>
            </div>
          </div>

          {/* Registered List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-app-primary">
                <tr>
                  <th className="p-2 font-bold">S/N</th>
                  <th className="p-2 font-bold">Course Code</th>
                  <th className="p-2 font-bold">Course Title</th>
                  <th className="p-2 font-bold">Units</th>
                  <th className="p-2 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y app-border">
                {registered.map((r, i) => {
                  const c = r.courses || r
                  return (
                    <tr key={i}>
                      <td className="p-2 text-app-secondary">{i + 1}</td>
                      <td className="p-2 font-bold text-app-primary">{c.course_code}</td>
                      <td className="p-2 text-app-primary">{c.course_title}</td>
                      <td className="p-2 font-mono font-bold text-app-primary">{c.units || 3}</td>
                      <td className="p-2 text-emerald-600 font-semibold">Registered</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-3 border-t app-border text-xs">
            <span className="font-bold text-app-primary">Total Registered Units: {registeredUnits} Units</span>
            <span className="text-app-secondary">Date: {new Date().toLocaleDateString()}</span>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t app-border">
            <Button variant="ghost" onClick={() => setSlipOpen(false)}>
              Close
            </Button>
            <Button icon={FiPrinter} onClick={() => window.print()}>
              Print Official Slip
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
