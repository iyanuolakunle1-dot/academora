import React, { useState } from 'react'
import toast from 'react-hot-toast'
import {
  FiMapPin, FiPhone, FiMail, FiGlobe, FiFacebook,
  FiInstagram, FiTwitter, FiLinkedin, FiYoutube, FiSend,
  FiCalendar, FiClock, FiCheckCircle, FiHelpCircle, FiArrowRight
} from 'react-icons/fi'
import PageHero from '../../components/public/PageHero'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { supabase } from '../../lib/supabaseClient'
import { validateEmail } from '../../utils/validators'

const contactCards = [
  {
    icon: FiMapPin,
    title: 'Campus Address',
    lines: ['123 Academora Way, Victoria Island', 'Lagos State, Nigeria'],
    actionText: 'View on Google Maps'
  },
  {
    icon: FiPhone,
    title: 'Admissions & Inquiries',
    lines: ['+234 (0) 800-ACADEMORA', '+234 803 456 7890'],
    actionText: 'Call Admissions Desk'
  },
  {
    icon: FiMail,
    title: 'Email Communications',
    lines: ['admissions@academora.edu', 'info@academora.edu'],
    actionText: 'Send Email'
  }
]

const operatingHours = [
  { day: 'Monday – Friday', time: '7:30 AM – 5:00 PM' },
  { day: 'Saturday (Admissions & Tours)', time: '9:00 AM – 2:00 PM' },
  { day: 'Sunday & Public Holidays', time: 'Closed' }
]

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Admissions Inquiry',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Your full name is required.'
    if (!validateEmail(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (!form.subject.trim()) nextErrors.subject = 'Subject is required.'
    if (!form.message.trim()) nextErrors.message = 'Please enter your message.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSubmitting(true)
    try {
      const { error } = await supabase.from('contact_messages').insert({
        full_name: form.name,
        email: form.email,
        phone: form.phone || null,
        subject: `[${form.inquiryType}] ${form.subject}`,
        message: form.message
      })
      if (error) throw error
      toast.success("Thank you! Your message has been received. Our team will contact you shortly.")
      setForm({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'Admissions Inquiry',
        subject: '',
        message: ''
      })
    } catch (err) {
      toast.error(err.message || 'Could not send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      <PageHero
        crumb="Contact Us"
        eyebrow="We're Here to Help"
        title="Get in Touch with"
        highlight="Academora"
        description="Have questions about admissions, academic programs, scholarships, or scheduling a personal campus tour? Our team is always ready to assist you."
        badgeText="Admissions & Help Desk"
        highlights={[
          { title: 'Campus Tours', desc: 'Book guided tours Mon – Sat' },
          { title: 'Fast Response', desc: 'Inquiries answered within 24 hours' },
          { title: 'Dedicated Help', desc: 'Direct access to admissions advisors' }
        ]}
      />

      {/* 1. CONTACT INFORMATION & FORM GRID */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Contact Cards & Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-accent-600 dark:text-accent-400 mb-3 border border-accent-500/20">
                Direct Channels
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-app-primary">
                Reach Out Directly
              </h2>
              <p className="mt-2 text-sm text-app-secondary leading-relaxed">
                Connect with our front desk, admissions counselors, or school administration.
              </p>
            </div>

            <div className="space-y-4">
              {contactCards.map((c) => {
                const Icon = c.icon
                return (
                  <div
                    key={c.title}
                    className="flex gap-4 rounded-3xl app-surface border app-border p-6 shadow-card hover:shadow-soft transition-all"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-soft">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-app-primary text-base">{c.title}</h3>
                      <div className="mt-1 space-y-0.5">
                        {c.lines.map((l, i) => (
                          <p key={i} className="text-xs text-app-secondary">{l}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Operating Hours Card */}
            <div className="rounded-3xl app-surface border app-border p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <FiClock className="h-5 w-5 text-accent-500" />
                <h3 className="font-bold text-app-primary text-base">Office & Visiting Hours</h3>
              </div>
              <div className="space-y-2.5 text-xs text-app-secondary">
                {operatingHours.map((h) => (
                  <div key={h.day} className="flex items-center justify-between border-b app-border pb-2 last:border-0 last:pb-0">
                    <span className="font-medium">{h.day}</span>
                    <span className="font-bold text-app-primary">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media Channels */}
            <div className="rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 p-6 text-white shadow-soft">
              <h3 className="font-bold text-white text-sm">Follow Our Social Community</h3>
              <p className="mt-1 text-xs text-white/70">Catch daily classroom highlights and student achievements.</p>
              <div className="mt-4 flex items-center gap-2.5">
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
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-accent-500 text-white transition-colors"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Send Message Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl app-surface border app-border p-8 sm:p-10 shadow-card">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-300 mb-3 border border-primary-500/20">
                Online Inquiry
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-app-primary">
                Send Us a Message
              </h2>
              <p className="mt-2 text-sm text-app-secondary leading-relaxed mb-8">
                Please fill out the form below and an admissions counselor will reach out to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Input
                    label="Full Name *"
                    placeholder="e.g. Adebayo Ogunleye"
                    value={form.name}
                    onChange={update('name')}
                    error={errors.name}
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="e.g. adebayo@example.com"
                    value={form.email}
                    onChange={update('email')}
                    error={errors.email}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Input
                    label="Phone Number"
                    placeholder="e.g. +234 801 234 5678"
                    value={form.phone}
                    onChange={update('phone')}
                  />
                  <div>
                    <label className="block text-sm font-medium text-app-primary mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      value={form.inquiryType}
                      onChange={update('inquiryType')}
                      className="w-full rounded-xl border app-border app-surface text-app-primary px-3.5 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25"
                    >
                      <option value="Admissions Inquiry">Admissions & Enrollment</option>
                      <option value="Book Campus Tour">Book a Campus Tour</option>
                      <option value="Scholarship & Aid">Scholarship & Financial Aid</option>
                      <option value="General Information">General School Inquiry</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Subject *"
                  placeholder="e.g. Inquiring about Grade 7 Admission for September"
                  value={form.subject}
                  onChange={update('subject')}
                  error={errors.subject}
                />

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-app-primary">
                    Your Message *
                  </span>
                  <textarea
                    rows={5}
                    placeholder="Please provide any details regarding your child’s grade, interests, or questions..."
                    value={form.message}
                    onChange={update('message')}
                    className={`w-full rounded-xl border app-border app-surface px-3.5 py-2.5 text-sm text-app-primary placeholder:text-app-secondary/60 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25 ${
                      errors.message ? 'border-red-400' : ''
                    }`}
                  />
                  {errors.message && (
                    <span className="mt-1 block text-xs text-red-500">{errors.message}</span>
                  )}
                </label>

                <Button
                  type="submit"
                  loading={submitting}
                  iconRight={<FiSend />}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Send Inquiry Now
                </Button>
              </form>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
