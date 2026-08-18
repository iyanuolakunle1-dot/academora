import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiClipboard, FiFileText, FiUsers, FiMail, FiCheckCircle,
  FiDownload, FiArrowRight, FiCalendar, FiClock, FiHelpCircle,
  FiStar, FiBookOpen, FiAward, FiMap, FiShield, FiPhone
} from 'react-icons/fi'
import PageHero from '../../components/public/PageHero'
import Button from '../../components/ui/Button'
import { SectionHeading } from '../../components/public/Shared'
import { STOCK_IMAGES } from '../../lib/stockImages'

const admissionSteps = [
  {
    step: '01',
    icon: FiClipboard,
    title: 'Inquiry & Campus Tour',
    desc: 'Submit an online inquiry or visit our campus for a personalized guided tour with our admissions counselors.'
  },
  {
    step: '02',
    icon: FiFileText,
    title: 'Online Application',
    desc: 'Complete the digital application form and securely upload academic transcripts, birth certificates, and photos.'
  },
  {
    step: '03',
    icon: FiUsers,
    title: 'Student Assessment',
    desc: 'Prospective students complete a grade-appropriate readiness assessment and informal family interview.'
  },
  {
    step: '04',
    icon: FiMail,
    title: 'Offer of Admission',
    desc: 'Successful candidates receive an official Letter of Admission and enrollment packet within 3 business days.'
  },
  {
    step: '05',
    icon: FiCheckCircle,
    title: 'Enrollment & Welcome',
    desc: 'Confirm acceptance, complete fee registration, and attend our exciting New Student Orientation program!'
  }
]

const requirements = [
  'Completed Online Application Form',
  'Certified Copy of Birth Certificate / Age Declaration',
  'Academic Transcripts or Last 2 Terms Report Cards',
  'Two Recent Passport-Sized Photographs',
  'Medical History & Immunization Records',
  'Student Readiness Assessment (Conducted on Campus)'
]

const faqs = [
  {
    q: 'When does the admission process begin?',
    a: 'Admissions for the upcoming academic session are currently open. We also accept mid-term transfer students subject to seat availability.'
  },
  {
    q: 'Are scholarships or sibling discounts available?',
    a: 'Yes, Academora provides merit-based academic and STEM scholarships as well as family discounts for parents enrolling multiple children.'
  },
  {
    q: 'What is the teacher-to-student ratio?',
    a: 'We maintain an average ratio of 1:12 to ensure every student receives personalized mentorship and active academic support.'
  }
]

export default function Admissions() {
  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      <PageHero
        crumb="Admissions"
        eyebrow="2024/2025 Academic Admissions"
        title="Begin Your University Degree at"
        highlight="Academora."
        description="Choosing the right university is a pivotal milestone. Our admissions team is dedicated to guiding prospective undergraduates and postgraduate scholars through a transparent, supportive enrollment journey."
        badgeText="Admissions Office Active"
        highlights={[
          { title: 'Degree Entries', desc: 'Undergraduate & Postgraduate' },
          { title: 'Fast-Track Processing', desc: 'Decisions within 3 working days' },
          { title: 'Scholarships Available', desc: 'Merit & Research grants awarded' }
        ]}
        actions={
          <>
            <Button as={Link} to="/signup" iconRight={<FiArrowRight />} size="lg">
              Apply Online Now
            </Button>
            <Button
              as={Link}
              to="/contact"
              variant="outline"
              size="lg"
            >
              Schedule Campus Visit
            </Button>
          </>
        }
      />

      {/* 1. ADMISSIONS PROCESS TIMELINE */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="5-Step Admission Journey"
          title="Simple Steps to Join Our Community"
          description="We make applying to Academora smooth, transparent, and structured for prospective families."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {admissionSteps.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative rounded-3xl app-surface border app-border p-6 shadow-card hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-soft">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-display text-xl font-bold text-accent-500">
                      {s.step}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-app-primary">{s.title}</h3>
                  <p className="mt-2 text-xs text-app-secondary leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* 2. REQUIREMENTS & TIMELINE GRID */}
      <section className="bg-primary-50/50 dark:bg-primary-950/40 py-16 border-y app-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            
            {/* Requirements Card */}
            <div className="rounded-3xl app-surface border app-border p-7 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-300">
                  <FiClipboard className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-app-primary">
                  Required Documents
                </h3>
              </div>
              <p className="text-xs text-app-secondary mb-5 leading-relaxed">
                Please prepare clear scanned copies or originals when submitting your application:
              </p>
              <div className="space-y-3">
                {requirements.map((r, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-app-secondary">
                    <FiCheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Info Card */}
            <div className="rounded-3xl app-surface border app-border p-7 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10 text-accent-600 dark:text-accent-400">
                  <FiClock className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-app-primary">
                  Timelines & Dates
                </h3>
              </div>
              <p className="text-xs text-app-secondary mb-5 leading-relaxed">
                Key dates for the 2024/2025 academic calendar:
              </p>
              <div className="space-y-4 text-xs">
                <div className="rounded-xl border app-border app-surface-2 p-3.5">
                  <p className="font-bold text-app-primary">Early Bird Applications</p>
                  <p className="text-app-secondary mt-0.5">Priority assessment and class placement.</p>
                </div>
                <div className="rounded-xl border app-border app-surface-2 p-3.5">
                  <p className="font-bold text-app-primary">Entrance Assessments</p>
                  <p className="text-app-secondary mt-0.5">Conducted every Saturday & upon weekday request.</p>
                </div>
                <div className="rounded-xl border app-border app-surface-2 p-3.5">
                  <p className="font-bold text-app-primary">Term Resumption</p>
                  <p className="text-app-secondary mt-0.5">Orientation for new parents and students in September.</p>
                </div>
              </div>
            </div>

            {/* Why Join Us Card */}
            <div className="relative rounded-3xl overflow-hidden bg-primary-950 p-7 text-white shadow-soft flex flex-col justify-between">
              <img
                src={STOCK_IMAGES.classroomOverview}
                alt="Academora Classroom"
                className="absolute inset-0 h-full w-full object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/85 to-primary-900/70" />

              <div className="relative z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500 text-white font-bold mb-4 shadow-soft">
                  <FiStar className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  Why Choose Academora?
                </h3>
                <p className="mt-2 text-xs text-white/80 leading-relaxed">
                  Join a high-achieving, compassionate academic family where your child will thrive.
                </p>

                <div className="mt-5 space-y-3 text-xs text-white/90">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="h-4 w-4 text-accent-400 shrink-0" />
                    <span>Top 1% National and Cambridge examination rankings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="h-4 w-4 text-accent-400 shrink-0" />
                    <span>12 specialized STEAM, AI & Robotics laboratories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="h-4 w-4 text-accent-400 shrink-0" />
                    <span>Dedicated college advising & global placements</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-white/15">
                <Link
                  to="/signup"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-accent-600 transition-colors shadow-soft"
                >
                  <span>Start Online Application</span>
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FREQUENTLY ASKED QUESTIONS */}
      <section className="mx-auto max-w-5xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Admissions FAQ"
          title="Frequently Asked Questions"
          description="Have questions before applying? Here are quick answers to our most common inquiries."
        />

        <div className="mt-10 space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl app-surface border app-border p-6 shadow-card">
              <h4 className="font-semibold text-app-primary text-base flex items-center gap-2">
                <FiHelpCircle className="h-4 w-4 text-accent-500 shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="mt-2 text-sm text-app-secondary leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary-950 p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <img
            src={STOCK_IMAGES.heroCampus}
            alt="Campus Aerial"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/85 to-primary-900/70" />
          
          <div className="relative z-10">
            <h3 className="font-display text-2xl sm:text-3xl font-bold">
              Ready to Submit Your Application?
            </h3>
            <p className="mt-2 text-white/80 max-w-xl text-sm sm:text-base">
              Online registration takes less than 5 minutes. Secure your admission for the 2024/2025 academic session today.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-3.5 shrink-0">
            <Button as={Link} to="/signup" iconRight={<FiArrowRight />} size="lg">
              Apply Online Now
            </Button>
            <Button as={Link} to="/contact" variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white/10">
              Speak to Admissions
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
