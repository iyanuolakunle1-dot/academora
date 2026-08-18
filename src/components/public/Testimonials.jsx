import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiStar, FiChevronLeft, FiChevronRight, FiCheckCircle } from 'react-icons/fi'
import { STOCK_IMAGES } from '../../lib/stockImages'

const testimonials = [
  {
    name: 'Dr. Adesola Williams',
    role: 'Parent & Guardian of 300L Computer Science Scholar',
    avatar: 'AW',
    photo: STOCK_IMAGES.avatarParent1,
    avatarBg: 'from-amber-500 to-orange-600',
    rating: 5,
    quote:
      'Academora University has transformed our son into an innovative software engineer. The balance between rigorous computing coursework, practical lab internships, and character mentorship is unmatched.',
    tag: 'Guardian'
  },
  {
    name: 'Toluwanimi Balogun',
    role: 'B.Sc Software Engineering Alumnus (Now Software Engineer at Microsoft)',
    avatar: 'TB',
    photo: STOCK_IMAGES.avatarAlumnus1,
    avatarBg: 'from-blue-600 to-indigo-700',
    rating: 5,
    quote:
      'The AI laboratory and faculty thesis supervision at Academora gave me a massive head start. My professors did not just lecture — they mentored me to build production-grade distributed systems.',
    tag: 'Alumnus'
  },
  {
    name: 'Mrs. Chidinma Okafor',
    role: 'Parent of 200L Mechatronics Engineering Student',
    avatar: 'CO',
    photo: STOCK_IMAGES.avatarParent2,
    avatarBg: 'from-emerald-500 to-teal-700',
    rating: 5,
    quote:
      'From day one, the modern campus facilities, 24/7 power, fast internet, and individualized faculty mentorship helped my daughter excel in robotics and engineering mathematics.',
    tag: 'Parent'
  },
  {
    name: 'Korede Adeleke',
    role: 'President, Student Union Government (400L Economics)',
    avatar: 'KA',
    photo: STOCK_IMAGES.avatarStudentLead,
    avatarBg: 'from-purple-600 to-pink-600',
    rating: 5,
    quote:
      'Studying at Academora University has taught me leadership, analytical discipline, and collaboration. The faculty encourages every scholar to pioneer impactful research in policy and commerce.',
    tag: 'Student Leader'
  }
]

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0)

  const next = () => setActiveIdx((i) => (i + 1) % testimonials.length)
  const prev = () => setActiveIdx((i) => (i - 1 + testimonials.length) % testimonials.length)

  return (
    <div className="relative">
      {/* Desktop Grid Layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((t, idx) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            whileHover={{ y: -4 }}
            className="flex flex-col justify-between rounded-2xl app-surface border app-border p-6 shadow-card hover:shadow-soft transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <FiStar key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 dark:bg-accent-900/20 px-2.5 py-0.5 text-xs font-semibold text-accent-600 dark:text-accent-400">
                  <FiCheckCircle className="h-3 w-3" /> {t.tag}
                </span>
              </div>
              <p className="text-sm text-app-secondary leading-relaxed italic mb-6">
                "{t.quote}"
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t app-border">
              {t.photo ? (
                <img
                  src={t.photo}
                  alt={t.name}
                  className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-accent-500/20 shadow-soft"
                />
              ) : (
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.avatarBg} text-white font-bold text-xs shadow-soft`}
                >
                  {t.avatar}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-app-primary">{t.name}</p>
                <p className="truncate text-xs text-app-secondary">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile Carousel / Card */}
      <div className="md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl app-surface border app-border p-6 shadow-soft"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(testimonials[activeIdx].rating)].map((_, i) => (
                  <FiStar key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 dark:bg-accent-900/20 px-2.5 py-0.5 text-xs font-semibold text-accent-600 dark:text-accent-400">
                <FiCheckCircle className="h-3 w-3" /> {testimonials[activeIdx].tag}
              </span>
            </div>
            <p className="text-sm text-app-secondary leading-relaxed italic mb-6">
              "{testimonials[activeIdx].quote}"
            </p>
            <div className="flex items-center gap-3 pt-4 border-t app-border">
              {testimonials[activeIdx].photo ? (
                <img
                  src={testimonials[activeIdx].photo}
                  alt={testimonials[activeIdx].name}
                  className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-accent-500/20 shadow-soft"
                />
              ) : (
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${testimonials[activeIdx].avatarBg} text-white font-bold text-sm shadow-soft`}
                >
                  {testimonials[activeIdx].avatar}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold text-app-primary">{testimonials[activeIdx].name}</p>
                <p className="truncate text-xs text-app-secondary">{testimonials[activeIdx].role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex items-center justify-between px-2">
          <div className="flex gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === activeIdx ? 'w-6 bg-accent-500' : 'w-2 bg-black/20 dark:bg-white/20'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border app-border app-surface text-app-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border app-border app-surface text-app-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
