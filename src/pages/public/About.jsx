import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiUsers, FiTarget, FiEye, FiHeart, FiArrowRight,
  FiAward, FiShield, FiGlobe, FiCheckCircle, FiBookOpen,
  FiCpu, FiActivity, FiStar, FiFeather, FiMail, FiLinkedin
} from 'react-icons/fi'
import PageHero from '../../components/public/PageHero'
import Button from '../../components/ui/Button'
import { StatStrip, SectionHeading } from '../../components/public/Shared'
import { STOCK_IMAGES } from '../../lib/stockImages'

const coreValues = [
  {
    icon: FiTarget,
    title: 'Our Mission',
    color: 'from-accent-500 to-orange-600',
    desc: 'To ignite intellectual curiosity, advance cutting-edge scientific research, and graduate visionary leaders equipped with the knowledge, digital skills, and moral character required to transform society.'
  },
  {
    icon: FiEye,
    title: 'Our Vision',
    color: 'from-primary-600 to-indigo-600',
    desc: 'To be a world-renowned university recognized globally for academic excellence, pioneering technological breakthroughs, ethical leadership, and transformative research.'
  },
  {
    icon: FiHeart,
    title: 'Our Core Values',
    color: 'from-emerald-500 to-teal-600',
    desc: 'Scholarly Rigor, Uncompromising Integrity, Innovation, Diversity, Compassion, and Global Responsibility.'
  }
]

const pillars = [
  {
    icon: FiBookOpen,
    title: 'Degree Academic Rigor',
    desc: 'Comprehensive degree curricula recognized by international accreditation boards, cultivating deep theoretical and applied mastery.'
  },
  {
    icon: FiCpu,
    title: 'Computing & Research Hubs',
    desc: 'Empowering researchers with AI compute clusters, robotics labs, 3D prototyping suites, and biotechnology testbeds.'
  },
  {
    icon: FiUsers,
    title: 'Dedicated Faculty Mentorship',
    desc: 'A 1:12 faculty-to-student ratio ensuring individualized thesis supervision, career guidance, and academic acceleration.'
  },
  {
    icon: FiShield,
    title: 'World-Class Smart Campus',
    desc: 'A purpose-built modern university sanctuary with digital research libraries, modern halls of residence, and athletic complexes.'
  }
]

const leadershipTeam = [
  {
    name: 'Prof. Elizabeth Sterling, PhD',
    role: 'Vice-Chancellor & President',
    qualifications: 'Oxford Alumna · 22 Yrs Higher Ed Leadership',
    image: STOCK_IMAGES.principal,
    bio: 'Championing world-class university excellence, research commercialization, and international degree collaborations.'
  },
  {
    name: 'Prof. Marcus Adebayo, D.Sc',
    role: 'Deputy Vice-Chancellor (Academic Affairs)',
    qualifications: 'Imperial College London · Senior Fellow',
    image: STOCK_IMAGES.deanAcademics,
    bio: 'Overseeing degree accreditation standards, curriculum modernization, and inter-faculty research councils.'
  },
  {
    name: 'Engr. Prof. Tariq Al-Mansoor',
    role: 'Dean, Faculty of Computing & Innovation',
    qualifications: 'MIT Fellow · AI & Robotics Chair',
    image: STOCK_IMAGES.stemDirector,
    bio: 'Directing the university robotics arenas, computing research labs, and venture incubation studio.'
  },
  {
    name: 'Prof. Grace Nwosu, PhD',
    role: 'Dean of Student Affairs & Registrar',
    qualifications: 'Psychology & University Administration',
    image: STOCK_IMAGES.vicePrincipal,
    bio: 'Ensuring holistic student welfare, leadership governance, and dynamic collegiate life.'
  }
]

const stats = [
  { icon: FiUsers, value: '5,000+', label: 'Undergrad & Postgrad', subtext: 'Active Scholars' },
  { icon: FiAward, value: '250+', label: 'Professors & Faculty', subtext: 'Global Researchers' },
  { icon: FiShield, value: '15+', label: 'Years of Heritage', subtext: 'Founded 2009' },
  { icon: FiStar, value: '99.4%', label: 'Graduate Employment', subtext: 'Top Global Firms' },
  { icon: FiActivity, value: '45+', label: 'Accredited Degree Majors', subtext: 'BSc, BEng, BA, MSc, PhD' },
  { icon: FiGlobe, value: '100%', label: 'Global Degree Recognition', subtext: 'NUC & Worldwide' }
]

export default function About() {
  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      <PageHero
        crumb="About Us"
        eyebrow="Who We Are"
        title="Nurturing Brilliance."
        highlight="Inspiring Futures."
        description="Founded with a vision for transformative higher education, Academora University prepares young leaders and researchers to lead with knowledge, courage, and moral clarity."
        badgeText="Premier University"
        highlights={[
          { title: 'Founded in 2009', desc: '15+ years of transformative university education' },
          { title: 'Global Standard', desc: 'NUC and internationally accredited degrees' },
          { title: 'Research Excellence', desc: 'Computing, Engineering, Business & Sciences' }
        ]}
        actions={
          <>
            <Button as={Link} to="/signup" iconRight={<FiArrowRight />} size="lg">
              Apply for Admission
            </Button>
            <Button
              as={Link}
              to="/academics"
              variant="outline"
              size="lg"
            >
              Academic Faculties
            </Button>
          </>
        }
      />

      {/* 1. OUR STORY & PHILOSOPHY */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Narrative Column (7 cols) */}
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-accent-600 dark:text-accent-400 mb-3 border border-accent-500/20">
              Our Heritage & Philosophy
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-app-primary sm:text-4xl">
              Building a Legacy of Transformative Higher Education
            </h2>
            <p className="mt-5 text-base text-app-secondary leading-relaxed">
              At Academora University, we believe that university education is the cornerstone of societal advancement. Our mission is to create a dynamic collegiate research environment where undergraduates and postgraduate scholars are challenged intellectually, mentored closely by distinguished professors, and equipped to solve real-world problems.
            </p>
            <p className="mt-4 text-base text-app-secondary leading-relaxed">
              Over the last fifteen years, we have built an enviable reputation for exceptional academic achievement, championship varsity sports, cutting-edge AI and robotics laboratories, and a global alumni network leading in technology, finance, medicine, and public policy.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border app-border app-surface p-4 shadow-card">
                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-300 font-bold text-lg">
                  <FiCheckCircle className="h-5 w-5 text-accent-500" />
                  <span>Research Mentorship</span>
                </div>
                <p className="mt-1 text-xs text-app-secondary">Close 1:12 supervision with professors on real-world industry research.</p>
              </div>

              <div className="rounded-2xl border app-border app-surface p-4 shadow-card">
                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-300 font-bold text-lg">
                  <FiCheckCircle className="h-5 w-5 text-accent-500" />
                  <span>Global Graduates</span>
                </div>
                <p className="mt-1 text-xs text-app-secondary">99.4% employment and master's placements at Oxford, MIT, and Toronto.</p>
              </div>
            </div>
          </div>

          {/* Visual Highlight Card with Real Campus Photo (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden bg-primary-950 p-8 text-white shadow-soft min-h-[380px] flex flex-col justify-between">
              <img
                src={STOCK_IMAGES.campusQuad}
                alt="Academora University Campus Quad"
                className="absolute inset-0 h-full w-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/80 to-primary-900/60" />
              <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-accent-500/20 blur-2xl" />
              
              <div className="relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-500 text-white font-bold text-lg mb-6 shadow-soft">
                  15+
                </div>
                <h3 className="font-display text-2xl font-bold text-white">Years of Shaping Leaders</h3>
                <p className="mt-3 text-sm text-white/80 leading-relaxed">
                  From our founding class to today’s diverse university scholars, Academora alumni now lead top multinational technology firms, financial institutions, and global research laboratories.
                </p>
              </div>

              <div className="relative z-10 mt-6 pt-6 border-t border-white/15 space-y-2.5 text-xs text-white/90">
                <div className="flex items-center justify-between">
                  <span>Student Enrollment</span>
                  <span className="font-bold text-accent-400">5,000+ Undergrad & Postgrad</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Graduate Employability</span>
                  <span className="font-bold text-accent-400">99.4% Career Rate</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Degree Accreditation</span>
                  <span className="font-bold text-accent-400">NUC & Global Boards</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MISSION, VISION & VALUES */}
      <section className="bg-primary-50/50 dark:bg-primary-950/40 py-16 border-y app-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="Our Guiding Principles"
            title="Mission, Vision &"
            highlight="Core Values"
            description="Our core values guide every lecture hall interaction, academic research thesis, and university policy."
          />

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {coreValues.map((v, i) => {
              const Icon = v.icon
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-3xl app-surface border app-border p-7 shadow-card hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${v.color} text-white shadow-soft mb-5`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-app-primary">{v.title}</h3>
                    <p className="mt-3 text-sm text-app-secondary leading-relaxed">{v.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. FOUR PILLARS OF EXCELLENCE */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="The Academora Advantage"
          title="Four Pillars of Our"
          highlight="University Model"
          description="A balanced ecosystem ensuring comprehensive intellectual mastery, empirical research, and leadership development."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, idx) => {
            const Icon = p.icon
            return (
              <div
                key={p.title}
                className="rounded-3xl app-surface border app-border p-6 shadow-card hover:shadow-soft transition-all"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-soft mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-app-primary">{p.title}</h3>
                <p className="mt-2 text-xs text-app-secondary leading-relaxed">{p.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 4. EXECUTIVE LEADERSHIP & FACULTY */}
      <section className="bg-primary-50/40 dark:bg-primary-950/30 py-16 border-y app-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="University Governance & Council"
            title="Meet Our Principal"
            highlight="Academic Officers"
            description="Distinguished university administrators, chaired professors, and research fellows leading the institution."
          />

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadershipTeam.map((lead, idx) => (
              <motion.div
                key={lead.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="rounded-3xl app-surface border app-border overflow-hidden shadow-card hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
              >
                <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                  <img
                    src={lead.image}
                    alt={lead.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-bold text-base leading-tight drop-shadow">{lead.name}</p>
                    <p className="text-accent-300 text-xs font-semibold mt-0.5">{lead.role}</p>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="inline-block rounded-full bg-accent-50 dark:bg-accent-950/60 text-accent-700 dark:text-accent-300 px-2.5 py-0.5 text-[10px] font-bold mb-2.5">
                      {lead.qualifications}
                    </span>
                    <p className="text-xs text-app-secondary leading-relaxed">
                      {lead.bio}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. METRICS STRIP */}
      <StatStrip stats={stats} />

      {/* 6. CALL TO ACTION BANNER */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary-950 p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <img
            src={STOCK_IMAGES.modernBuilding}
            alt="Academora Building"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/85 to-primary-900/70" />
          
          <div className="relative z-10">
            <h3 className="font-display text-2xl sm:text-3xl font-bold">
              Join the Academora University Community
            </h3>
            <p className="mt-2 text-white/80 max-w-xl text-sm sm:text-base">
              Take the first step toward earning your accredited degree. Schedule a campus visit or start your online admission application.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-3.5 shrink-0">
            <Button as={Link} to="/signup" iconRight={<FiArrowRight />} size="lg">
              Apply for Admission
            </Button>
            <Button as={Link} to="/contact" variant="outline" size="lg" className="!text-white !border-white/30 hover:!bg-white/10">
              Schedule Tour
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
