import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiArrowRight, FiCheck, FiStar, FiUsers, FiUser, FiAward,
  FiBookOpen, FiShield, FiTrendingUp, FiGlobe, FiCpu,
  FiCalendar, FiCompass, FiHeart, FiActivity, FiMapPin,
  FiFileText, FiCheckCircle, FiChevronRight, FiClock
} from 'react-icons/fi'
import Button from '../../components/ui/Button'
import { SectionHeading, StatStrip } from '../../components/public/Shared'
import Testimonials from '../../components/public/Testimonials'

import { STOCK_IMAGES } from '../../lib/stockImages'

const keyStats = [
  { icon: FiUsers, value: '5,000+', label: 'Enrolled Students', subtext: 'Undergraduate & Postgraduate' },
  { icon: FiAward, value: '250+', label: 'Professors & Faculty', subtext: '1:12 Academic Mentorship' },
  { icon: FiShield, value: '15+', label: 'Years of Heritage', subtext: 'Founded 2009' },
  { icon: FiTrendingUp, value: '99.4%', label: 'Graduate Employment', subtext: 'Global Industry Placements' },
  { icon: FiActivity, value: '45+', label: 'Degree Programs', subtext: 'B.Sc, B.Eng, B.A, M.Sc, MBA, Ph.D' },
  { icon: FiGlobe, value: '100%', label: 'Global Accreditation', subtext: 'Recognized Worldwide' }
]

const academicPrograms = [
  {
    level: 'Faculty of Computing & AI',
    ages: '4-Year B.Sc Degree',
    tag: 'Computer Science',
    color: 'from-blue-600 to-indigo-600',
    image: STOCK_IMAGES.codingStudents,
    desc: 'Cutting-edge programs in Software Engineering, Artificial Intelligence, Cybersecurity, and Cloud Computing.',
    highlights: ['AI & Neural Network Labs', 'Cloud Systems & DevOps Suites', 'Tech Hackathons & Industry Internships']
  },
  {
    level: 'Faculty of Engineering',
    ages: '5-Year B.Eng Degree',
    tag: 'Engineering',
    color: 'from-purple-600 to-pink-600',
    image: STOCK_IMAGES.roboticsLab,
    desc: 'Rigorous engineering training across Mechatronics, Robotics, Electrical Electronics, and Renewable Energy.',
    highlights: ['Advanced Robotics & IoT Arenas', 'Fluid & Thermodynamics Labs', 'COREN & International Standards']
  },
  {
    level: 'Faculty of Business & Finance',
    ages: '4-Year B.Sc Degree',
    tag: 'Management',
    color: 'from-emerald-600 to-teal-600',
    image: STOCK_IMAGES.classroomOverview,
    desc: 'Empowering future business leaders with quantitative finance, corporate strategy, accounting, and economics.',
    highlights: ['Bloomberg Financial Terminal Pods', 'Venture Incubation Hub', 'ACCA & ICAN Accelerated Tracks']
  },
  {
    level: 'School of Postgraduate Studies',
    ages: 'M.Sc, MBA & Ph.D',
    tag: 'Postgraduate',
    color: 'from-amber-500 to-orange-500',
    image: STOCK_IMAGES.collegePrep,
    desc: 'Advanced research masterclasses, Executive MBA programs, and doctoral research fellowships.',
    highlights: ['Peer-Reviewed Research Grants', 'Executive Hybrid Evening Schedules', 'Doctoral Faculty Mentorship']
  }
]

const campusPillars = [
  {
    id: 'stem',
    title: 'STEM & Robotics Hub',
    icon: FiCpu,
    image: STOCK_IMAGES.roboticsLab,
    desc: 'Equipped with 3D printers, coding suites, and robotics arenas where students turn curiosity into working inventions.',
    stats: '12 Modern Labs'
  },
  {
    id: 'sports',
    title: 'Athletics & Sports Arena',
    icon: FiActivity,
    image: STOCK_IMAGES.footballPitch,
    desc: 'Olympic-standard football pitch, basketball courts, swimming pool, and martial arts dojo for balanced wellness.',
    stats: '14 Sports Disciplines'
  },
  {
    id: 'arts',
    title: 'Performing Arts & Studio',
    icon: FiHeart,
    image: STOCK_IMAGES.fineArts,
    desc: 'Full acoustic music recording rooms, theatre auditorium, and visual fine arts studios celebrating student creativity.',
    stats: '8 Creative Ensembles'
  },
  {
    id: 'library',
    title: 'Digital Media & Library',
    icon: FiBookOpen,
    image: STOCK_IMAGES.digitalLibrary,
    desc: 'Over 15,000 physical volumes, digital research archives, quiet study pods, and collaborative ideation lounges.',
    stats: '15,000+ Titles'
  }
]

const admissionSteps = [
  {
    step: '01',
    title: 'Submit Online Application',
    desc: 'Fill out our streamlined online admission form and upload previous academic records in under 5 minutes.'
  },
  {
    step: '02',
    title: 'Assessment & Family Interview',
    desc: 'Attend a friendly evaluation session designed to understand your child’s unique strengths and learning needs.'
  },
  {
    step: '03',
    title: 'Offer & Welcome Onboarding',
    desc: 'Receive your admission packet, complete registration, and join our vibrant parent-teacher orientation.'
  }
]

export default function Home() {
  const [activeCampusTab, setActiveCampusTab] = useState('stem')
  const currentPillar = campusPillars.find((p) => p.id === activeCampusTab) || campusPillars[0]

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50/70 via-white to-primary-100/40 dark:from-primary-950 dark:via-primary-900 dark:to-primary-950 text-app-primary dark:text-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b app-border dark:border-white/5 transition-colors duration-200">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -top-40 right-0 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-accent-500/15 to-primary-500/10 dark:from-accent-500/25 dark:to-primary-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary-500/10 dark:bg-primary-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            
            {/* Hero Left Content (7 Cols) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-7 flex flex-col items-start"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/20 bg-accent-500/10 dark:border-accent-400/30 dark:bg-accent-500/15 px-3.5 py-1.5 text-xs font-semibold text-accent-600 dark:text-accent-300 backdrop-blur">
                <span className="flex h-2 w-2 rounded-full bg-accent-500 animate-pulse" />
                <span>Admissions Open for 2024/2025 Session</span>
              </div>

              {/* Main Headline */}
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.15] text-app-primary dark:text-white sm:text-5xl lg:text-6xl">
                Where Education Inspires{' '}
                <span className="bg-gradient-to-r from-accent-500 to-accent-600 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
                  Excellence
                </span>{' '}
                & Shapes Tomorrow.
              </h1>

              {/* Subtitle */}
              <p className="mt-5 max-w-2xl text-base sm:text-lg text-app-secondary dark:text-white/80 leading-relaxed font-normal">
                At Academora, we combine world-class STEAM academics, moral character, and innovative mentorship to help every student discover their potential and excel in a global world.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Button as={Link} to="/admissions" iconRight={<FiArrowRight />} size="lg">
                  Apply for Admission
                </Button>
                <Button
                  as={Link}
                  to="/academics"
                  variant="outline"
                  size="lg"
                  className="hover:!bg-primary-50 dark:!text-white dark:!border-white/30 dark:hover:!bg-white/10"
                >
                  Explore Programs
                </Button>
                <Button
                  as={Link}
                  to="/contact"
                  variant="ghost"
                  size="lg"
                  className="hover:!bg-black/5 dark:!text-white/90 dark:hover:!bg-white/10"
                >
                  Schedule a Visit
                </Button>
              </div>

              {/* Social Proof & Trust Strip */}
              <div className="mt-10 flex flex-wrap items-center gap-4 rounded-2xl border app-border dark:border-white/10 app-surface dark:bg-white/5 p-3.5 shadow-card dark:backdrop-blur-sm">
                <div className="flex -space-x-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white dark:border-primary-900 bg-accent-500 text-xs font-bold text-white shadow-soft">
                    KA
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white dark:border-primary-900 bg-primary-600 text-xs font-bold text-white shadow-soft">
                    AW
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white dark:border-primary-900 bg-emerald-500 text-xs font-bold text-white shadow-soft">
                    CO
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white dark:border-primary-900 bg-indigo-600 text-xs font-bold text-white shadow-soft">
                    TB
                  </div>
                </div>
                <div className="text-xs">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="h-3.5 w-3.5 fill-amber-500" />
                    ))}
                    <span className="font-bold text-app-primary dark:text-white ml-1">4.9 / 5</span>
                  </div>
                  <p className="text-app-secondary dark:text-white/70 mt-0.5">Trusted by 500+ satisfied families & alumni</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Right Interactive Deck (5 Cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5 relative"
            >
              {/* Main Portal Access Card */}
              <div className="relative rounded-3xl border app-border dark:border-white/15 app-surface dark:bg-gradient-to-b dark:from-white/10 dark:to-white/5 p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b app-border dark:border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 text-white font-bold text-sm shadow-soft">
                      A
                    </div>
                    <div>
                      <p className="text-sm font-bold text-app-primary dark:text-white">Academora Portals</p>
                      <p className="text-[11px] font-semibold text-accent-600 dark:text-accent-300">Unified Campus Access</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 dark:border-emerald-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live System
                  </span>
                </div>

                {/* Direct Portal Quick Buttons */}
                <div className="mt-5 space-y-2.5">
                  {/* Student Login */}
                  <div className="flex items-center justify-between rounded-2xl border app-border app-surface-2 dark:bg-white/5 p-3 hover:border-primary-500 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/20 text-primary-600 dark:text-primary-400">
                        <FiUser className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-app-primary dark:text-white">Student Portal</p>
                        <p className="text-[10px] text-app-secondary dark:text-white/60">Courses & Results</p>
                      </div>
                    </div>
                    <Link
                      to="/login?portal=student"
                      className="rounded-xl bg-primary-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-primary-700 transition-colors shadow-sm"
                    >
                      Student Login
                    </Link>
                  </div>

                  {/* Teacher Login */}
                  <div className="flex items-center justify-between rounded-2xl border app-border app-surface-2 dark:bg-white/5 p-3 hover:border-accent-500 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500/20 text-accent-600 dark:text-accent-400">
                        <FiBookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-app-primary dark:text-white">Teacher / Faculty</p>
                        <p className="text-[10px] text-app-secondary dark:text-white/60">Rosters & Grading</p>
                      </div>
                    </div>
                    <Link
                      to="/login?portal=teacher"
                      className="rounded-xl bg-accent-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-accent-700 transition-colors shadow-sm"
                    >
                      Teacher Login
                    </Link>
                  </div>

                  {/* Parent Login */}
                  <div className="flex items-center justify-between rounded-2xl border app-border app-surface-2 dark:bg-white/5 p-3 hover:border-rose-500 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400">
                        <FiHeart className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-app-primary dark:text-white">Parent / Guardian</p>
                        <p className="text-[10px] text-app-secondary dark:text-white/60">Ward Progress & Fees</p>
                      </div>
                    </div>
                    <Link
                      to="/login?portal=parent"
                      className="rounded-xl bg-rose-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-rose-700 transition-colors shadow-sm"
                    >
                      Parent Login
                    </Link>
                  </div>

                  {/* Library & Resource Quick Links */}
                  <div className="pt-1">
                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-1.5 rounded-xl border app-border app-surface-2 p-2 text-xs font-semibold text-app-primary hover:border-amber-500 transition-colors"
                    >
                      <FiAward className="h-3.5 w-3.5 text-amber-500" />
                      <span>Digital Library & Research Desk</span>
                    </Link>
                  </div>
                </div>

                {/* Bottom Registration CTA */}
                <div className="mt-5 pt-3.5 border-t app-border dark:border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-app-secondary dark:text-white/70 font-medium">New Student Admission?</span>
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-1 text-xs font-bold text-accent-600 dark:text-accent-400 hover:underline"
                  >
                    Apply Now <FiChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden sm:flex absolute -bottom-5 -left-6 items-center gap-2.5 rounded-2xl border app-border dark:border-white/20 app-surface dark:bg-primary-900/90 px-4 py-2.5 text-xs font-bold text-app-primary dark:text-white shadow-xl backdrop-blur"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-white">
                  <FiStar className="h-3.5 w-3.5" />
                </div>
                <span>Official Digital Campus Portal</span>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. KEY METRICS & IMPACT BAR */}
      <StatStrip stats={keyStats} />

      {/* 2.5 DEDICATED INSTITUTIONAL PORTALS SHOWCASE SECTION */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-10">
        <SectionHeading
          eyebrow="Direct Portal Gateways"
          title="Dedicated Workspaces for"
          highlight="Every Campus Stakeholder"
          description="Access your personalized portal to manage academics, view real-time grading, roll-call attendance, and financial accounts."
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Student Portal Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="rounded-3xl app-surface border app-border p-6 sm:p-7 shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-600 text-white shadow-soft">
                  <FiUser className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-primary-50 dark:bg-primary-950/60 px-3 py-1 text-xs font-bold text-primary-600 dark:text-primary-400">
                  Students
                </span>
              </div>
              <h3 className="text-xl font-bold text-app-primary">Student Portal</h3>
              <p className="mt-2 text-xs text-app-secondary leading-relaxed">
                Register for semester courses, view your weekly class lecture timetable, submit homework coursework, and access verified transcripts.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t app-border flex items-center gap-2">
              <Button as={Link} to="/login?portal=student" size="sm" className="flex-1 justify-center text-xs">
                Student Sign In
              </Button>
              <Button as={Link} to="/signup" variant="outline" size="sm" className="text-xs">
                Admission
              </Button>
            </div>
          </motion.div>

          {/* 2. Teacher & Faculty Portal Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="rounded-3xl app-surface border app-border p-6 sm:p-7 shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-orange-600 text-white shadow-soft">
                  <FiBookOpen className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-accent-500/15 px-3 py-1 text-xs font-bold text-accent-600 dark:text-accent-400">
                  Faculty
                </span>
              </div>
              <h3 className="text-xl font-bold text-app-primary">Teacher & Faculty</h3>
              <p className="mt-2 text-xs text-app-secondary leading-relaxed">
                Manage classroom rosters, enroll students, mark daily attendance rolls, evaluate homework submissions, and enter semester grades.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t app-border">
              <Button as={Link} to="/login?portal=teacher" size="sm" className="w-full justify-center text-xs bg-accent-600 hover:bg-accent-700 text-white">
                Teacher Sign In
              </Button>
            </div>
          </motion.div>

          {/* 3. Parent & Guardian Portal Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="rounded-3xl app-surface border app-border p-6 sm:p-7 shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-soft">
                  <FiHeart className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                  Guardians
                </span>
              </div>
              <h3 className="text-xl font-bold text-app-primary">Parent / Guardian</h3>
              <p className="mt-2 text-xs text-app-secondary leading-relaxed">
                Monitor your child's live CGPA, report cards, term attendance records, exam clearances, and settle tuition fee invoices online.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t app-border flex items-center gap-2">
              <Button as={Link} to="/login?portal=parent" size="sm" className="flex-1 justify-center text-xs bg-rose-600 hover:bg-rose-700 text-white">
                Parent Sign In
              </Button>
              <Button as={Link} to="/parent/signup" variant="outline" size="sm" className="text-xs">
                Register
              </Button>
            </div>
          </motion.div>

          {/* 5. Library Desk Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="rounded-3xl app-surface border app-border p-6 sm:p-7 shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-soft">
                  <FiAward className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                  Library Desk
                </span>
              </div>
              <h3 className="text-xl font-bold text-app-primary">Library Desk</h3>
              <p className="mt-2 text-xs text-app-secondary leading-relaxed">
                Comprehensive digital book catalog, ISBN management, borrowing privileges, and student loan issuance tracking.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t app-border">
              <Button as={Link} to="/login?portal=librarian" size="sm" variant="outline" className="w-full justify-center text-xs">
                Library Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. WHY CHOOSE ACADEMORA (BENTO GRID LAYOUT) */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Why Choose Academora"
          title="A Foundation Built for"
          highlight="Lifelong Success"
          description="We provide a balanced ecosystem where academic excellence, moral integrity, digital innovation, and leadership go hand in hand."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: STEAM & Innovation (Span 2 on LG) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="lg:col-span-2 rounded-3xl app-surface border app-border p-7 shadow-card hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-soft">
                  <FiCpu className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-primary-50 dark:bg-primary-900/40 px-3 py-1 text-xs font-bold text-primary-600 dark:text-primary-300">
                  Featured Pillar
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-app-primary">
                Future-Ready Computing, Engineering & Research
              </h3>
              <p className="mt-3 text-app-secondary leading-relaxed max-w-2xl text-sm sm:text-base">
                From autonomous robotics and cloud infrastructure to machine learning, quantitative economics, and biotechnology labs, our undergraduates and researchers actively pioneer real-world innovations.
              </p>
              {/* Technology Chips */}
              <div className="mt-6 flex flex-wrap gap-2">
                {['Artificial Intelligence', 'Software Systems', 'Cloud & DevOps', 'Renewable Energy', 'FinTech & Analytics'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border app-border app-surface-2 px-3 py-1 text-xs font-medium text-app-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t app-border flex items-center justify-between">
              <span className="text-xs text-app-secondary">Accredited by National & Global Councils</span>
              <Link to="/academics" className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400">
                Explore Curriculum <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Card 2: Faculty & Mentorship */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="rounded-3xl app-surface border app-border p-7 shadow-card hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-orange-600 text-white shadow-soft mb-5">
                <FiUsers className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-app-primary">World-Class Professors & Faculty</h3>
              <p className="mt-2.5 text-sm text-app-secondary leading-relaxed">
                Our professors and lecturers are active researchers and industry practitioners who provide dedicated academic supervision and research mentorship.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t app-border flex items-center justify-between">
              <span className="text-xs font-semibold text-accent-600 dark:text-accent-400">1:12 Faculty-to-Student Ratio</span>
              <Link to="/about" className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600 dark:text-accent-400">
                Meet Faculty <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Card 3: Character & Leadership */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="rounded-3xl app-surface border app-border p-7 shadow-card hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-soft mb-5">
                <FiAward className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-app-primary">Character & Global Leadership</h3>
              <p className="mt-2.5 text-sm text-app-secondary leading-relaxed">
                We groom ethical leaders through student council, Model United Nations, public debate, and community service initiatives.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t app-border">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Values & Ethics First</p>
            </div>
          </motion.div>

          {/* Card 4: Safe Campus */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="rounded-3xl app-surface border app-border p-7 shadow-card hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-soft mb-5">
                <FiShield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-app-primary">Safe, Inclusive & Caring Campus</h3>
              <p className="mt-2.5 text-sm text-app-secondary leading-relaxed">
                24/7 security surveillance, modern medical clinic, dedicated wellness counselors, and an uplifting atmosphere for every child.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t app-border">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Secure & Nurturing</p>
            </div>
          </motion.div>

          {/* Card 5: Modern Infrastructure */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="rounded-3xl app-surface border app-border p-7 shadow-card hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-soft mb-5">
                <FiCompass className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-app-primary">Modern Facilities & Sports</h3>
              <p className="mt-2.5 text-sm text-app-secondary leading-relaxed">
                Smart interactive classrooms, Olympic swimming pool, multimedia library, and spacious indoor/outdoor sports pavilions.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t app-border">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">Purpose-Built Architecture</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. ACADEMIC PATHWAYS & PROGRAMS */}
      <section className="bg-primary-50/50 dark:bg-primary-950/40 py-16 sm:py-20 border-y app-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-accent-600 dark:text-accent-400 mb-3 border border-accent-500/20">
                Colleges & Degree Programs
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-app-primary">
                Faculties & Degree Pathways
              </h2>
              <p className="mt-2 text-app-secondary max-w-xl text-sm sm:text-base">
                Explore our accredited undergraduate and postgraduate degree programs designed for the modern economy.
              </p>
            </div>
            <Button as={Link} to="/academics" variant="secondary" iconRight={<FiArrowRight />}>
              View All Degree Majors
            </Button>
          </div>

          {/* Academic Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {academicPrograms.map((p, idx) => (
              <motion.div
                key={p.level}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="rounded-3xl app-surface border app-border overflow-hidden shadow-card hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
              >
                {/* Program Header Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={p.image}
                    alt={p.level}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="rounded-full bg-white/90 dark:bg-black/80 backdrop-blur px-2.5 py-0.5 text-[11px] font-bold text-primary-900 dark:text-white uppercase tracking-wider">
                      {p.tag}
                    </span>
                    <span className="rounded-full bg-black/60 backdrop-blur px-2.5 py-0.5 text-[11px] font-semibold text-white">
                      {p.ages}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-display text-xl font-bold text-white drop-shadow-sm">{p.level}</h3>
                    <div className={`mt-1.5 h-1 w-12 rounded-full bg-gradient-to-r ${p.color}`} />
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Description */}
                    <p className="text-xs text-app-secondary leading-relaxed mb-4">{p.desc}</p>

                    {/* Highlights Bullets */}
                    <div className="space-y-1.5 mb-5">
                      {p.highlights.map((h) => (
                        <div key={h} className="flex items-start gap-1.5 text-xs text-app-primary">
                          <FiCheck className="h-3.5 w-3.5 text-accent-500 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <Link
                    to="/academics"
                    className="pt-3 border-t app-border flex items-center justify-between text-xs font-semibold text-primary-600 dark:text-primary-400 group"
                  >
                    <span>Learn curriculum</span>
                    <FiArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CAMPUS EXPERIENCE & LIFE AT ACADEMORA */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Campus Life & Experience"
          title="Beyond the Classroom:"
          highlight="Life at Academora"
          description="A rich environment filled with sports, creative expression, digital creation, and collaborative student leadership."
        />

        <div className="mt-12 rounded-3xl app-surface border app-border p-6 sm:p-10 shadow-soft">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 border-b app-border pb-6">
            {campusPillars.map((pillar) => {
              const Icon = pillar.icon
              const isSelected = activeCampusTab === pillar.id
              return (
                <button
                  key={pillar.id}
                  onClick={() => setActiveCampusTab(pillar.id)}
                  className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    isSelected
                      ? 'bg-primary-600 text-white shadow-soft'
                      : 'text-app-secondary hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{pillar.title}</span>
                </button>
              )
            })}
          </div>

          {/* Active Tab Content Panel */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-lg bg-accent-50 dark:bg-accent-900/20 px-3 py-1 text-xs font-semibold text-accent-600 dark:text-accent-400 mb-4">
                <FiStar className="h-3.5 w-3.5" />
                <span>{currentPillar.stats}</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-app-primary">
                {currentPillar.title}
              </h3>
              <p className="mt-4 text-base text-app-secondary leading-relaxed">
                {currentPillar.desc}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border app-border app-surface-2 p-4">
                  <p className="text-xs font-medium text-app-secondary">Supervision</p>
                  <p className="text-sm font-bold text-app-primary mt-1">Certified Coaches & Mentors</p>
                </div>
                <div className="rounded-2xl border app-border app-surface-2 p-4">
                  <p className="text-xs font-medium text-app-secondary">Safety & Access</p>
                  <p className="text-sm font-bold text-app-primary mt-1">State-of-the-Art Gear</p>
                </div>
              </div>

              <div className="mt-8">
                <Button as={Link} to="/student-life" iconRight={<FiArrowRight />}>
                  Explore Student Life
                </Button>
              </div>
            </div>

            {/* Visual Feature Card for Tab */}
            <div className="lg:col-span-5 relative rounded-3xl overflow-hidden bg-primary-950 p-7 text-white shadow-soft min-h-[340px] flex flex-col justify-between">
              {/* Background Photo & Layer */}
              <img
                src={currentPillar.image}
                alt={currentPillar.title}
                className="absolute inset-0 h-full w-full object-cover opacity-35 transition-all duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/70 to-transparent" />

              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-500 text-white shadow-soft mb-5">
                  <currentPillar.icon className="h-7 w-7" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-accent-400">Experience Highlights</p>
                <h4 className="mt-1 text-xl font-bold text-white">{currentPillar.title}</h4>
                <p className="mt-2.5 text-xs text-white/80 leading-relaxed">
                  Every student participates in at least two enrichment activities each term to build team spirit, resilience, and lifelong friendships.
                </p>
              </div>

              <div className="relative z-10 mt-6 flex items-center gap-4 border-t border-white/15 pt-4">
                <div>
                  <p className="font-display text-xl font-bold text-white">30+</p>
                  <p className="text-[11px] text-white/70">Active Clubs</p>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div>
                  <p className="font-display text-xl font-bold text-white">100%</p>
                  <p className="text-[11px] text-white/70">Participation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS & COMMUNITY VOICES */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Community Voices"
          title="What Parents, Students & Alumni"
          highlight="Say About Us"
          description="Read real stories from families whose lives have been transformed through the Academora experience."
        />
        <div className="mt-12">
          <Testimonials />
        </div>
      </section>

      {/* 7. ADMISSIONS JOURNEY & ACTION CTA */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Step-by-Step Pathway */}
        <div className="mb-12">
          <SectionHeading
            eyebrow="Simple 3-Step Enrollment"
            title="Your Journey to Academora Starts Here"
            description="Our admissions team makes joining our community seamless, supportive, and transparent."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {admissionSteps.map((s) => (
              <div
                key={s.step}
                className="relative rounded-3xl app-surface border app-border p-7 shadow-card"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 font-display text-lg font-bold text-white shadow-soft mb-4">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-app-primary">{s.title}</h3>
                <p className="mt-2 text-sm text-app-secondary leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-primary-950 p-8 sm:p-12 lg:p-16 text-white shadow-2xl">
          {/* Background Campus Photo */}
          <img
            src={STOCK_IMAGES.heroCampus}
            alt="Campus Aerial"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/85 to-primary-900/70" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl" />
          <div className="relative mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-400/30 bg-accent-500/15 px-3.5 py-1 text-xs font-semibold text-accent-300">
              <FiCalendar className="h-3.5 w-3.5" /> 2024/2025 Academic Admissions Active
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Ready to Transform Your Future with the Academora Advantage?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed">
              Join a world-class academic community. Admissions for the 2024/2025 academic session are now open for prospective undergraduate, foundational, and Cambridge programs.
            </p>
            <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
              <Button as={Link} to="/signup" iconRight={<FiArrowRight />} size="lg">
                Apply Online Now
              </Button>
              <Button
                as={Link}
                to="/contact"
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Book a Campus Tour
              </Button>
            </div>
            <p className="mt-6 text-xs text-white/60">
              Need assistance? Call our Admissions Desk at +234 (0) 800-ACADEMORA or email admissions@academora.edu
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
