import React from 'react'
import { Link } from 'react-router-dom'
import {
  FiFacebook, FiInstagram, FiTwitter, FiLinkedin,
  FiYoutube, FiMail, FiPhone, FiMapPin, FiClock,
  FiArrowRight, FiShield, FiAward, FiLock
} from 'react-icons/fi'
import toast from 'react-hot-toast'

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/academics', label: 'Academic Pathways' },
  { to: '/admissions', label: 'Admissions & Aid' },
  { to: '/student-life', label: 'Student Life & Clubs' },
  { to: '/news-events', label: 'News & Announcements' },
  { to: '/contact', label: 'Contact Us' }
]

const portalLinks = [
  { to: '/login', label: 'University Single Sign-On' },
  { to: '/signup', label: 'Online Student Admission' },
  { to: '/admissions', label: 'Academic Prospectus & Fees' },
  { to: '/academics', label: 'Curriculum & Degree Programs' },
  { to: '/contact', label: 'ICT Directorate & Helpdesk' }
]

export default function PublicFooter() {
  const handleSubscribe = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    if (!email) return
    toast.success('Thank you! You are now subscribed to the Academora University Newsletter.')
    e.target.reset()
  }

  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800/80 dark:bg-slate-950 dark:text-slate-400 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand & Mission (4 cols on lg) */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 font-display text-xl font-bold text-white shadow-soft">
                A
              </div>
              <div>
                <p className="font-display text-xl font-bold tracking-wider text-slate-900 dark:text-white">
                  ACADEMORA
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent-600 dark:text-accent-400">
                  Inspire • Grow • Lead
                </p>
              </div>
            </Link>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Academora is a premier institution dedicated to nurturing intellectual curiosity, ethical leadership, and creative brilliance across foundational learning and higher education.
            </p>

            {/* Social Channels */}
            <div className="mt-6 flex items-center gap-2.5">
              {[
                { icon: FiFacebook, href: '#' },
                { icon: FiInstagram, href: '#' },
                { icon: FiTwitter, href: '#' },
                { icon: FiLinkedin, href: '#' },
                { icon: FiYoutube, href: '#' }
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-primary-600 hover:bg-primary-600 hover:text-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-primary-600 dark:hover:text-white transition-all shadow-sm"
                  aria-label="Social Link"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-primary-700 dark:text-accent-300 font-medium">
              <FiShield className="h-4 w-4" />
              <span>Fully Accredited by National & Cambridge International Boards</span>
            </div>
          </div>

          {/* Quick Links (2 cols on lg) */}
          <div className="lg:col-span-2 sm:col-span-1">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Quick Links
            </p>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <FiArrowRight className="h-3 w-3 text-slate-400" />
                    <span>{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals & Resources (3 cols on lg) */}
          <div className="lg:col-span-3 sm:col-span-1">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Portals & Access
            </p>
            <ul className="space-y-2.5 text-sm">
              {portalLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <FiLock className="h-3 w-3 text-accent-500" />
                    <span>{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 shadow-sm">
              <p className="font-semibold text-slate-900 dark:text-white">Need Portal Support?</p>
              <p className="mt-1">Contact the ICT Directorate at it-support@academora.edu.ng</p>
            </div>
          </div>

          {/* Contact & Newsletter (3 cols on lg) */}
          <div className="lg:col-span-3">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Campus Contact
            </p>
            
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 mb-5">
              <div className="flex items-start gap-2">
                <FiMapPin className="h-4 w-4 text-accent-500 shrink-0 mt-0.5" />
                <span>123 Academora Way, Victoria Island, Lagos</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="h-4 w-4 text-accent-500 shrink-0" />
                <span>+234 (0) 800-ACADEMORA</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMail className="h-4 w-4 text-accent-500 shrink-0" />
                <span>info@academora.edu.ng</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="h-4 w-4 text-accent-500 shrink-0" />
                <span>Mon – Fri: 8:00 AM – 5:00 PM</span>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-900 dark:text-white mb-2">Subscribe to Bulletin</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 transition shadow-sm"
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-xl bg-primary-600 px-3.5 hover:bg-primary-700 text-white transition-colors shadow-soft"
                aria-label="Subscribe"
              >
                <FiMail className="h-4 w-4 text-white" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Academora Educational Institution. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Admission</Link>
            <span className="italic text-primary-600 dark:text-accent-400 font-medium">Inspire. Grow. Lead.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
