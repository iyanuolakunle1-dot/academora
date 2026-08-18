import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiUsers, FiHeart, FiAward, FiMusic, FiSmile,
  FiShield, FiCamera, FiArrowRight, FiActivity,
  FiBookOpen, FiCpu, FiCheckCircle, FiStar, FiClock
} from 'react-icons/fi'
import PageHero from '../../components/public/PageHero'
import Button from '../../components/ui/Button'
import { SectionHeading } from '../../components/public/Shared'
import { STOCK_IMAGES } from '../../lib/stockImages'

const pillars = [
  {
    icon: FiUsers,
    title: 'Vibrant Community',
    desc: 'A diverse, welcoming family where every student is seen, respected, and valued for their unique voice.'
  },
  {
    icon: FiHeart,
    title: 'Holistic Wellness',
    desc: 'Nurturing physical health, mental resilience, and emotional intelligence alongside academic focus.'
  },
  {
    icon: FiAward,
    title: 'Leadership in Action',
    desc: 'Empowering students with real governance roles through the Student Council, prefectships, and Model UN.'
  },
  {
    icon: FiMusic,
    title: 'Creative Passion',
    desc: 'From orchestra to theatre productions and fine arts exhibitions, creativity is celebrated daily.'
  },
  {
    icon: FiCpu,
    title: 'Innovation Hubs',
    desc: 'Robotics teams, coding leagues, and science fairs giving students early real-world technical mastery.'
  },
  {
    icon: FiShield,
    title: 'Safe Sanctuary',
    desc: 'Comprehensive 24/7 security, health center, and dedicated wellness counselors ensuring total peace of mind.'
  }
]

const clubs = [
  {
    category: 'Athletics & Sports',
    icon: FiActivity,
    color: 'from-orange-500 to-amber-600',
    title: 'Sports & Martial Arts',
    image: STOCK_IMAGES.footballPitch,
    desc: 'Football, Basketball, Volleyball, Track & Field, Swimming, Table Tennis, and Taekwondo with inter-school tournaments.',
    stats: '14 Sports'
  },
  {
    category: 'Creative Arts',
    icon: FiMusic,
    color: 'from-purple-600 to-pink-600',
    title: 'Music & Performing Arts',
    image: STOCK_IMAGES.orchestraMusic,
    desc: 'Chamber Orchestra, Brass Band, Drama & Theatre Troupe, Contemporary Choir, and Studio Sound Production.',
    stats: '8 Ensembles'
  },
  {
    category: 'STEAM & Computing',
    icon: FiCpu,
    color: 'from-blue-600 to-indigo-600',
    title: 'Robotics & Coding Guild',
    image: STOCK_IMAGES.roboticsLab,
    desc: 'Autonomous robotics, Python & web design, 3D printing prototyping, and regional hackathon competitions.',
    stats: '12 Labs'
  },
  {
    category: 'Leadership & Debate',
    icon: FiAward,
    color: 'from-emerald-600 to-teal-600',
    title: 'Model UN & Debating Society',
    image: STOCK_IMAGES.debateSpeech,
    desc: 'Parliamentary debate, Model United Nations conferences, public speaking masterclasses, and ethics forums.',
    stats: 'Regional Champs'
  },
  {
    category: 'Social Impact',
    icon: FiHeart,
    color: 'from-red-500 to-rose-600',
    title: 'Community & Environment Club',
    image: STOCK_IMAGES.fineArts,
    desc: 'Tree planting initiatives, charity food drives, peer tutoring, and sustainable campus recycling projects.',
    stats: '500+ Volunteer Hrs'
  },
  {
    category: 'Media & Journalism',
    icon: FiCamera,
    color: 'from-amber-600 to-yellow-600',
    title: 'Press & Media Production',
    image: STOCK_IMAGES.codingStudents,
    desc: 'School newspaper, photography club, podcast production, and annual yearbook editing team.',
    stats: 'Student Run'
  }
]

const galleryImages = [
  { title: 'Olympic Swimming Pool', image: STOCK_IMAGES.swimmingPool, tag: 'Athletics' },
  { title: 'Inter-House Sports Meet', image: STOCK_IMAGES.sportsDay, tag: 'Championship' },
  { title: 'Arts & Cultural Gala', image: STOCK_IMAGES.artsGala, tag: 'Fine Arts' },
  { title: 'Championship Basketball', image: STOCK_IMAGES.basketballCourt, tag: 'Tournament' },
  { title: 'National Science Fair', image: STOCK_IMAGES.chemistryExp, tag: 'Innovation' },
  { title: 'Senior Class Graduation', image: STOCK_IMAGES.graduationEvent, tag: 'Milestone' }
]

const dailySchedule = [
  {
    time: '7:45 AM – 8:15 AM',
    title: 'Arrival & Morning Assembly',
    desc: 'Inspirational morning address, school hymns, national anthem, and student achievement announcements.'
  },
  {
    time: '8:15 AM – 12:00 PM',
    title: 'Morning Academic Blocks',
    desc: 'Focused core academic sessions in mathematics, sciences, languages, and humanities with interactive labs.'
  },
  {
    time: '12:00 PM – 1:00 PM',
    title: 'Nutritious Lunch & Socialization',
    desc: 'Chef-prepared balanced meals in the dining hall, outdoor recreation, and quiet library time.'
  },
  {
    time: '1:00 PM – 3:15 PM',
    title: 'STEAM Labs & Creative Studies',
    desc: 'Hands-on robotics, computer programming, visual arts, music practice, and collaborative projects.'
  },
  {
    time: '3:30 PM – 5:00 PM',
    title: 'Clubs, Sports & Tutoring',
    desc: 'Inter-house athletic training, competitive team practices, enrichment clubs, and voluntary homework support.'
  }
]

export default function StudentLife() {
  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      <PageHero
        crumb="Student Life"
        eyebrow="Beyond the Classroom"
        title="Grow. Connect."
        highlight="Thrive at Academora."
        description="At Academora, learning extends far beyond textbooks. We nurture friendships, creative talents, championship athletics, and ethical leadership in a joyful, supportive community."
        badgeText="Vibrant Campus"
        highlights={[
          { title: '30+ Clubs & Societies', desc: 'Arts, STEAM, Sports & Media' },
          { title: 'House Championship', desc: 'Annual sports, arts & debate cups' },
          { title: 'Global Excursions', desc: 'Local & international field trips' }
        ]}
        actions={
          <>
            <Button as={Link} to="/admissions" iconRight={<FiArrowRight />} size="lg">
              Experience Academora
            </Button>
            <Button
              as={Link}
              to="/contact"
              variant="outline"
              size="lg"
            >
              Book a Visit
            </Button>
          </>
        }
      />

      {/* 1. CORE PILLARS OF STUDENT LIFE */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="The Student Experience"
          title="A Dynamic Community Where"
          highlight="Every Child Belongs"
          description="We provide balanced opportunities for personal growth, joyful discovery, and genuine community connection."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.title}
                className="rounded-3xl app-surface border app-border p-6 sm:p-7 shadow-card hover:shadow-soft transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-soft mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-app-primary">{p.title}</h3>
                <p className="mt-2 text-sm text-app-secondary leading-relaxed">{p.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 2. CLUBS, SOCIETIES & ATHLETICS WITH IMAGES */}
      <section className="bg-primary-50/50 dark:bg-primary-950/40 py-16 border-y app-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="Extracurricular Life"
            title="Clubs, Sports & Enrichment"
            description="Discover the wide range of competitive sports, performing arts ensembles, and innovative STEAM leagues available to every student."
          />

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clubs.map((c, idx) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="rounded-3xl app-surface border app-border overflow-hidden shadow-card hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="rounded-full bg-white/90 dark:bg-black/80 backdrop-blur px-2.5 py-0.5 text-[11px] font-bold text-primary-900 dark:text-white uppercase tracking-wider">
                      {c.category}
                    </span>
                    <span className="rounded-full bg-accent-500 text-white font-bold text-[11px] px-2.5 py-0.5 shadow-sm">
                      {c.stats}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-display text-lg font-bold text-white drop-shadow">{c.title}</h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-app-secondary leading-relaxed mb-4">{c.desc}</p>
                  <div className="pt-3 border-t app-border">
                    <span className="text-xs font-semibold text-accent-600 dark:text-accent-400">
                      Active Year-Round
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CAMPUS LIFE PHOTO GALLERY */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Moments at Academora"
          title="Campus Life in"
          highlight="Vivid Motion"
          description="A glimpse into daily life, athletic tournaments, artistic showcases, and academic celebrations."
        />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((img, i) => (
            <motion.div
              key={img.title}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="relative h-64 rounded-3xl overflow-hidden shadow-card border app-border group"
            >
              <img
                src={img.image}
                alt={img.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="rounded-full bg-accent-500/90 backdrop-blur px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  {img.tag}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="font-bold text-white text-base drop-shadow-md">{img.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. TYPICAL DAY SCHEDULE */}
      <section className="bg-primary-50/40 dark:bg-primary-950/30 py-16 border-y app-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="Rhythm of the Day"
            title="A Typical Day at Academora"
            description="Our structured daily schedule balances intellectual discovery, nutrition, STEAM creativity, and athletic wellness."
          />

          <div className="mt-12 space-y-4 max-w-3xl mx-auto">
            {dailySchedule.map((s, idx) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl app-surface border app-border p-5 shadow-sm hover:shadow-card transition-all"
              >
                <div className="inline-flex items-center gap-2 sm:w-44 shrink-0 rounded-xl bg-accent-50 dark:bg-accent-950/60 text-accent-700 dark:text-accent-300 px-3 py-1.5 text-xs font-bold font-mono">
                  <FiClock className="h-3.5 w-3.5" />
                  <span>{s.time}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-app-primary">{s.title}</h4>
                  <p className="text-xs text-app-secondary mt-0.5">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary-950 p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <img
            src={STOCK_IMAGES.footballPitch}
            alt="Campus Sports"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/85 to-primary-900/70" />
          
          <div className="relative z-10">
            <h3 className="font-display text-2xl sm:text-3xl font-bold">
              Experience Student Life in Person
            </h3>
            <p className="mt-2 text-white/80 max-w-xl text-sm sm:text-base">
              Take a guided tour of our athletics arenas, robotics labs, visual arts studios, and student dining pavilion.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-3.5 shrink-0">
            <Button as={Link} to="/contact" iconRight={<FiArrowRight />} size="lg">
              Book a Campus Tour
            </Button>
            <Button as={Link} to="/admissions" variant="outline" size="lg" className="!text-white !border-white/30 hover:!bg-white/10">
              Apply for Admission
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
