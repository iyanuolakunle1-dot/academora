import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiBookOpen, FiAward, FiMonitor, FiTarget, FiUser,
  FiGlobe, FiFeather, FiBriefcase, FiArrowRight, FiCheckCircle,
  FiCpu, FiActivity, FiShield, FiStar, FiCheck
} from 'react-icons/fi'
import PageHero from '../../components/public/PageHero'
import Button from '../../components/ui/Button'
import { SectionHeading, FeatureCard } from '../../components/public/Shared'
import { STOCK_IMAGES } from '../../lib/stockImages'

const approachPillars = [
  {
    icon: FiBookOpen,
    title: 'NUC & Globally Accredited Degree Programs',
    description: 'Accredited by National Universities Commission and international university bodies delivering rigorous degree standards.',
    badge: 'Accreditation'
  },
  {
    icon: FiCpu,
    title: 'High-Performance STEAM & Computing Hubs',
    description: 'Empirical laboratories, AI neural computing clusters, robotics testbeds, and advanced prototyping studios.',
    badge: 'Innovation'
  },
  {
    icon: FiUser,
    title: 'Individualized Academic Supervision',
    description: 'Professors and research fellows maintain a 1:12 ratio for tailored thesis advising, mentorship, and honors tracks.',
    badge: 'Mentorship'
  },
  {
    icon: FiTarget,
    title: 'Research & Empirical Inquiry',
    description: 'Students conduct research, publish peer-reviewed papers, and build solutions addressing real industry challenges.',
    badge: 'Methodology'
  },
  {
    icon: FiGlobe,
    title: 'Industry Internships & Career Pathways',
    description: 'Corporate partnerships with leading global tech firms, investment banks, and research institutes for mandatory internships.',
    badge: 'Careers'
  },
  {
    icon: FiAward,
    title: 'Proven Academic Distinction',
    description: 'Our graduates consistently earn First-Class honors, national scholarship grants, and admissions to top global universities.',
    badge: 'Outcomes'
  }
]

const academicLevels = [
  {
    title: 'Faculty of Computing & IT',
    ages: '4-Year B.Sc Degree',
    tag: 'Computing',
    color: 'from-blue-600 to-indigo-600',
    image: STOCK_IMAGES.codingStudents,
    desc: 'Cutting-edge programs in Software Engineering, Artificial Intelligence, Cybersecurity, Data Science, and Cloud Architecture.',
    subjects: ['Software Architecture & DevOps', 'Machine Learning & Neural Nets', 'Cybersecurity & Ethical Hacking', 'Distributed Database Systems']
  },
  {
    title: 'Faculty of Engineering',
    ages: '5-Year B.Eng Degree',
    tag: 'Engineering',
    color: 'from-purple-600 to-pink-600',
    image: STOCK_IMAGES.roboticsLab,
    desc: 'COREN-accredited engineering degrees combining deep mathematical analysis with hands-on robotics, mechatronics, and renewable energy.',
    subjects: ['Robotics & Mechatronics', 'Embedded Systems & IoT', 'Renewable Energy & Power Systems', 'Structural Engineering & CAD']
  },
  {
    title: 'Faculty of Business & Economics',
    ages: '4-Year B.Sc Degree',
    tag: 'Management',
    color: 'from-emerald-600 to-teal-600',
    image: STOCK_IMAGES.classroomOverview,
    desc: 'Empowering future corporate leaders, entrepreneurs, and investment analysts with quantitative finance, strategy, and economics.',
    subjects: ['Corporate Finance & Investments', 'Financial Accounting & Auditing', 'Strategic Management & Ventures', 'Macroeconomics & Trade']
  },
  {
    title: 'Faculty of Arts & Social Sciences',
    ages: '4-Year B.Sc / B.A Degree',
    tag: 'Social Sciences',
    color: 'from-accent-600 to-orange-600',
    image: STOCK_IMAGES.debateSpeech,
    desc: 'Developing critical analytical minds in International Relations, Mass Communication, Media Journalism, and Public Policy.',
    subjects: ['Diplomacy & Global Affairs', 'Digital Media Journalism & PR', 'Public Policy & Governance', 'Sociology & Behavioral Science']
  },
  {
    title: 'School of Postgraduate Studies',
    ages: 'M.Sc, MBA & Ph.D',
    tag: 'Postgraduate',
    color: 'from-amber-600 to-red-600',
    image: STOCK_IMAGES.collegePrep,
    desc: 'Advanced research masterclasses, Executive MBA degrees, and doctoral fellowships with flexible executive schedules.',
    subjects: ['Doctoral Thesis Research', 'Executive MBA Leadership', 'Advanced Data Analytics M.Sc', 'Applied Research Seminars']
  }
]

const labsShowcase = [
  {
    name: 'Advanced Robotics & IoT Studio',
    image: STOCK_IMAGES.roboticsLab,
    desc: 'Equipped with microcontrollers, Arduino, 3D printers, and drone telemetry suites.'
  },
  {
    name: 'Chemistry & Molecular Biology Lab',
    image: STOCK_IMAGES.chemistryExp,
    desc: 'Fume hoods, digital microscopes, and spectrophotometers for deep empirical sciences.'
  },
  {
    name: 'Collaborative Media & Research Pods',
    image: STOCK_IMAGES.digitalLibrary,
    desc: 'High-speed digital research terminals, subscription journals, and ideation spaces.'
  }
]

export default function Academics() {
  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      <PageHero
        crumb="Academics"
        eyebrow="University Curriculum & Degrees"
        title="Academic Rigor."
        highlight="Limitless Discovery."
        description="At Academora, we empower every university scholar through world-class degree programs that balance intellectual depth, digital innovation, and moral leadership."
        badgeText="Accredited University"
        highlights={[
          { title: 'Degree Programs', desc: 'B.Sc, B.Eng, B.A, M.Sc, MBA, Ph.D' },
          { title: 'Research Labs', desc: '12 dedicated engineering & AI studios' },
          { title: 'Top 1% Outcomes', desc: '99.4% graduate career placement' }
        ]}
        actions={
          <>
            <Button as={Link} to="/signup" iconRight={<FiArrowRight />} size="lg">
              Apply for Admission
            </Button>
            <Button
              as={Link}
              to="/contact"
              variant="outline"
              size="lg"
            >
              Degree Inquiry
            </Button>
          </>
        }
      />

      {/* 1. OUR ACADEMIC APPROACH */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Academic Philosophy"
          title="Excellence in Higher Education."
          highlight="Leadership for Life."
          description="Our university curriculum combines academic rigor with hands-on research and industry mentorship, ensuring every graduate emerges as a globally competitive professional."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {approachPillars.map((a, i) => (
            <FeatureCard key={a.title} index={i} {...a} />
          ))}
        </div>
      </section>

      {/* 2. ACADEMIC LEVELS & PATHWAYS WITH REAL PHOTOGRAPHY */}
      <section className="bg-primary-50/50 dark:bg-primary-950/40 py-16 border-y app-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="University Colleges & Faculties"
            title="Comprehensive Degree Programs"
            description="Explore our accredited undergraduate faculties and postgraduate schools tailored for the modern knowledge economy."
          />

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {academicLevels.map((lvl, idx) => (
              <motion.div
                key={lvl.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                whileHover={{ y: -6 }}
                className="rounded-3xl app-surface border app-border overflow-hidden shadow-card hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
              >
                {/* Level Image Header */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={lvl.image}
                    alt={lvl.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="rounded-full bg-white/90 dark:bg-black/80 backdrop-blur px-2.5 py-0.5 text-[11px] font-bold text-primary-900 dark:text-white uppercase tracking-wider">
                      {lvl.tag}
                    </span>
                    <span className="rounded-full bg-black/60 backdrop-blur px-2.5 py-0.5 text-[11px] font-semibold text-white">
                      {lvl.ages}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-display text-xl font-bold text-white drop-shadow-sm">{lvl.title}</h3>
                    <div className={`mt-1.5 h-1 w-12 rounded-full bg-gradient-to-r ${lvl.color}`} />
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-app-secondary leading-relaxed mb-4">{lvl.desc}</p>
                    <div className="space-y-1.5 mb-4">
                      {lvl.subjects.map((sub) => (
                        <div key={sub} className="flex items-center gap-2 text-xs font-medium text-app-primary">
                          <FiCheck className="h-3.5 w-3.5 text-accent-500 shrink-0" />
                          <span>{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-3 border-t app-border">
                    <Link to="/signup" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">
                      Apply for {lvl.title} <FiArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. STEAM & RESEARCH LABS SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="World-Class Research Facilities"
          title="State-of-the-Art Laboratories &"
          highlight="Research Hubs"
          description="Purpose-built facilities engineered to turn curiosity into working prototypes, academic papers, and empirical discoveries."
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {labsShowcase.map((lab, i) => (
            <motion.div
              key={lab.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl app-surface border app-border overflow-hidden shadow-card"
            >
              <div className="h-48 w-full overflow-hidden bg-slate-900">
                <img
                  src={lab.image}
                  alt={lab.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h4 className="font-bold text-base text-app-primary mb-1.5">{lab.name}</h4>
                <p className="text-xs text-app-secondary leading-relaxed">{lab.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
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
              Begin Your University Degree at Academora
            </h3>
            <p className="mt-2 text-white/80 max-w-xl text-sm sm:text-base">
              Learn how our accredited degree programs prepare you for leadership in high-impact global careers.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-3.5 shrink-0">
            <Button as={Link} to="/signup" iconRight={<FiArrowRight />} size="lg">
              Apply Online
            </Button>
            <Button as={Link} to="/contact" variant="outline" size="lg" className="!text-white !border-white/30 hover:!bg-white/10">
              Speak to Admissions
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
