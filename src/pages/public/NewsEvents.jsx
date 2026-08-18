import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiCalendar, FiArrowRight, FiUser, FiCompass, FiAward,
  FiUsers, FiImage, FiVolume2, FiMail, FiMapPin, FiClock,
  FiCheckCircle, FiTag
} from 'react-icons/fi'
import PageHero from '../../components/public/PageHero'
import Button from '../../components/ui/Button'
import { supabase } from '../../lib/supabaseClient'
import { STOCK_IMAGES } from '../../lib/stockImages'
import toast from 'react-hot-toast'

const fallbackNews = [
  {
    id: 'f1',
    title: 'Academora Robotics Team Clinches 1st Place in National STEM League',
    excerpt: 'Our senior robotics squad designed an autonomous solar-powered sorting robot, beating 45 competing regional schools.',
    published_at: new Date().toISOString(),
    category: 'STEM & Robotics',
    readTime: '3 min read',
    author: 'Science Dept',
    image: STOCK_IMAGES.roboticsChamps
  },
  {
    id: 'f2',
    title: 'Cambridge IGCSE & Checkpoint Exam Results: 99.4% Distinction Rate',
    excerpt: 'Academora celebrates outstanding global examination results with 42 students receiving top honors across sciences and arts.',
    published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    category: 'Academics',
    readTime: '4 min read',
    author: 'Admissions Office',
    image: STOCK_IMAGES.graduationEvent
  },
  {
    id: 'f3',
    title: 'Annual Arts & Cultural Gala 2024: A Celebration of Global Heritage',
    excerpt: 'Students showcased dramatic performances, orchestral suites, and fine art installations celebrating world cultures.',
    published_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    category: 'Performing Arts',
    readTime: '2 min read',
    author: 'Student Council',
    image: STOCK_IMAGES.artsGala
  },
  {
    id: 'f4',
    title: 'New Eco-Sanctuary & Solar Prototyping Facility Unveiled on Campus',
    excerpt: 'Students and faculty commission a 50kW solar testing laboratory for renewable engineering experiments and green studies.',
    published_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    category: 'Campus Facilities',
    readTime: '3 min read',
    author: 'Campus Ops',
    image: STOCK_IMAGES.openHouseTour
  }
]

const fallbackEvents = [
  {
    id: 'e1',
    title: '2024/2025 Open House & Campus Discovery Tour',
    event_date: new Date(Date.now() + 86400000 * 5).toISOString(),
    time: '10:00 AM – 2:00 PM',
    location: 'Main Auditorium & STEM Complex',
    tag: 'Admissions',
    image: STOCK_IMAGES.openHouseTour
  },
  {
    id: 'e2',
    title: 'Inter-House Athletics & Swimming Championship',
    event_date: new Date(Date.now() + 86400000 * 12).toISOString(),
    time: '8:30 AM – 4:00 PM',
    location: 'Olympic Sports Pavilion',
    tag: 'Athletics',
    image: STOCK_IMAGES.sportsDay
  },
  {
    id: 'e3',
    title: 'Parent-Teacher Academic Forum & Goal Setting',
    event_date: new Date(Date.now() + 86400000 * 19).toISOString(),
    time: '9:00 AM – 1:00 PM',
    location: 'Virtual & On-Campus Dining Hall',
    tag: 'Community',
    image: STOCK_IMAGES.classroomOverview
  }
]

const categories = ['All', 'STEM & Robotics', 'Academics', 'Performing Arts', 'Campus Facilities', 'Athletics']

export default function NewsEvents() {
  const [news, setNews] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [{ data: newsData }, { data: eventsData }] = await Promise.all([
          supabase.from('news_posts').select('*').order('published_at', { ascending: false }).limit(6),
          supabase.from('school_events').select('*').order('event_date', { ascending: true }).limit(6)
        ])
        if (!mounted) return
        setNews(newsData && newsData.length > 0 ? newsData : fallbackNews)
        setEvents(eventsData && eventsData.length > 0 ? eventsData : fallbackEvents)
      } catch (err) {
        if (!mounted) return
        setNews(fallbackNews)
        setEvents(fallbackEvents)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    toast.success('Thank you for subscribing to the Academora Gazette!')
    e.target.reset()
  }

  const filteredNews = activeCategory === 'All'
    ? (news.length > 0 ? news : fallbackNews)
    : (news.length > 0 ? news : fallbackNews).filter((n) => n.category === activeCategory)

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      <PageHero
        crumb="News & Events"
        eyebrow="Campus Gazette"
        title="Stories. Milestones."
        highlight="Announcements"
        description="Stay connected with the vibrant life at Academora — celebrate student achievements, upcoming events, and campus updates."
        badgeText="Campus Newsroom"
        highlights={[
          { title: 'Weekly Updates', desc: 'Curated achievements & stories' },
          { title: 'Upcoming Events', desc: 'Assemblies, sports & open days' },
          { title: 'Newsletter', desc: 'Delivered directly to parents' }
        ]}
        actions={
          <>
            <Button as={Link} to="#events" variant="primary">
              View Upcoming Events
            </Button>
            <Button as={Link} to="/admissions" variant="outline" className="!text-white !border-white/30 hover:!bg-white/10">
              Admissions News
            </Button>
          </>
        }
      />

      {/* 1. MAIN NEWS & EVENTS SECTION */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* Left Column: News Articles (8 cols) */}
          <div className="lg:col-span-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-app-primary">
                  Latest School News
                </h2>
                <p className="text-xs sm:text-sm text-app-secondary mt-1">
                  Stories of excellence and celebration from across our classrooms.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5">
                {categories.slice(0, 4).map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      activeCategory === c
                        ? 'bg-primary-600 text-white shadow-soft'
                        : 'border app-border app-surface text-app-secondary hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-64 rounded-3xl skeleton" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {filteredNews.map((n, i) => {
                  const date = new Date(n.published_at || Date.now())
                  const imgSource = n.cover_image_url || n.image || STOCK_IMAGES.roboticsChamps
                  return (
                    <motion.article
                      key={n.id || i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -4 }}
                      className="rounded-3xl app-surface border app-border overflow-hidden shadow-card hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
                    >
                      <div>
                        {/* Article Cover Image */}
                        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                          <img
                            src={imgSource}
                            alt={n.title}
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute top-3 left-3">
                            <span className="rounded-full bg-black/70 backdrop-blur px-2.5 py-0.5 text-[10px] font-bold text-accent-400 uppercase tracking-wider">
                              {n.category || 'News'}
                            </span>
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="flex items-center justify-between text-[11px] text-app-secondary mb-2">
                            <span className="flex items-center gap-1">
                              <FiCalendar className="h-3.5 w-3.5 text-accent-500" />
                              {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span>{n.readTime || '3 min read'}</span>
                          </div>

                          <h3 className="font-display text-base font-bold text-app-primary leading-snug hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            {n.title}
                          </h3>

                          <p className="mt-2 text-xs text-app-secondary leading-relaxed line-clamp-2">
                            {n.excerpt || n.content}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 pt-0">
                        <div className="pt-3 border-t app-border flex items-center justify-between text-xs font-semibold text-primary-600 dark:text-primary-400">
                          <span>{n.author || 'Academora Editorial'}</span>
                          <span className="inline-flex items-center gap-1">
                            Read Story <FiArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right Column: Upcoming Calendar Events (4 cols) */}
          <div id="events" className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl app-surface border app-border p-6 shadow-card">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500 text-white shadow-soft">
                  <FiCalendar className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-app-primary">
                    Upcoming Events
                  </h3>
                  <p className="text-[11px] text-app-secondary">Campus Calendar Highlights</p>
                </div>
              </div>

              <div className="space-y-4">
                {(events.length > 0 ? events : fallbackEvents).map((e, idx) => {
                  const d = new Date(e.event_date || Date.now())
                  const day = d.getDate()
                  const month = d.toLocaleDateString(undefined, { month: 'short' }).toUpperCase()
                  return (
                    <div
                      key={e.id || idx}
                      className="flex gap-3.5 p-3 rounded-2xl border app-border app-surface-2 hover:border-accent-500 transition-colors"
                    >
                      {/* Date Badge */}
                      <div className="flex flex-col items-center justify-center h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-700 text-white font-bold shadow-soft">
                        <span className="text-base leading-none">{day}</span>
                        <span className="text-[9px] uppercase tracking-wider opacity-85 mt-0.5">{month}</span>
                      </div>

                      <div className="min-w-0">
                        <span className="inline-block text-[10px] font-bold text-accent-600 dark:text-accent-400 uppercase tracking-wider mb-0.5">
                          {e.tag || 'School Event'}
                        </span>
                        <h4 className="text-xs font-bold text-app-primary leading-tight truncate">
                          {e.title}
                        </h4>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-app-secondary">
                          <span className="flex items-center gap-1">
                            <FiClock className="h-3 w-3" /> {e.time || '10:00 AM'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Newsletter Subscription Card */}
            <div className="relative overflow-hidden rounded-3xl bg-primary-950 p-6 text-white shadow-soft">
              <div className="relative z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500 text-white shadow-soft mb-4">
                  <FiMail className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  Academora Newsletter
                </h3>
                <p className="mt-1 text-xs text-white/80 leading-relaxed">
                  Get term updates, academic milestones, and event dates directly in your inbox.
                </p>

                <form onSubmit={handleSubscribe} className="mt-4 space-y-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    className="w-full rounded-xl bg-white/10 border border-white/20 px-3.5 py-2 text-xs text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400"
                  />
                  <Button type="submit" size="sm" className="w-full justify-center text-xs">
                    Subscribe Free
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
