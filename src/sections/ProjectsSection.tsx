import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import FadeIn from '../components/FadeIn'
import { GhostButton } from '../components/Buttons'

type Project = {
  n: string
  category: string
  name: string
  href?: string
  cta: string
  stack: string
  images: [string, string, string]
}

const PROJECTS: Project[] = [
  {
    n: '01',
    category: 'Production · private',
    name: 'FriendCards',
    cta: 'Private repo',
    stack: 'Python · aiogram · FastAPI · SQLite · Telegram WebApp · Docker',
    images: ['friendcards-1', 'friendcards-2', 'friendcards-3'],
  },
  {
    n: '02',
    category: 'Open source',
    name: 'VoxShift',
    href: 'https://github.com/why-xdd/voxshift',
    cta: 'View code',
    stack: 'Python · NumPy · sounddevice · CustomTkinter',
    images: ['voxshift-1', 'voxshift-2', 'voxshift-3'],
  },
  {
    n: '03',
    category: 'Hackathon',
    name: 'Sorting Center',
    cta: 'In progress',
    stack: 'Python · SimPy · FastAPI · React · Three.js',
    images: ['sorting-1', 'sorting-2', 'sorting-3'],
  },
]

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading mb-16 text-center leading-none font-black tracking-tight uppercase sm:mb-20"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Project
        </h2>
      </FadeIn>

      <div ref={containerRef} className="mx-auto max-w-6xl">
        {PROJECTS.map((project, i) => (
          <Card
            key={project.n}
            project={project}
            index={i}
            total={PROJECTS.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  )
}

function Card({
  project,
  index,
  total,
  progress,
}: {
  project: Project
  index: number
  total: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const reduce = useReducedMotion()
  // Each card settles a little smaller than the one that lands on top of it,
  // so the finished stack reads as depth rather than a pile.
  const targetScale = 1 - (total - 1 - index) * 0.03
  const range: [number, number] = [index / total, 1]
  const scale = useTransform(progress, range, [1, targetScale])

  return (
    <div className="sticky top-24 h-[85vh] md:top-32">
      <motion.article
        style={{
          scale: reduce ? 1 : scale,
          top: `${index * 28}px`,
        }}
        className="relative flex flex-col gap-6 rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <span
              className="leading-none font-black text-[#D7E2EA]"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 90px)' }}
            >
              {project.n}
            </span>
            <div>
              <div className="text-xs tracking-widest text-[#D7E2EA]/50 uppercase sm:text-sm">
                {project.category}
              </div>
              <h3
                className="font-medium text-[#D7E2EA] uppercase"
                style={{ fontSize: 'clamp(1.1rem, 2.4vw, 2.1rem)' }}
              >
                {project.name}
              </h3>
            </div>
          </div>
          <GhostButton href={project.href}>{project.cta}</GhostButton>
        </div>

        <p className="text-xs tracking-wide text-[#D7E2EA]/45 uppercase sm:text-sm">
          {project.stack}
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[40%_60%] sm:gap-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <img
              src={`/gen/${project.images[0]}.jpg`}
              alt=""
              loading="lazy"
              className="w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
              style={{ height: 'clamp(130px, 16vw, 230px)' }}
            />
            <img
              src={`/gen/${project.images[1]}.jpg`}
              alt=""
              loading="lazy"
              className="w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
              style={{ height: 'clamp(160px, 22vw, 340px)' }}
            />
          </div>
          <img
            src={`/gen/${project.images[2]}.jpg`}
            alt=""
            loading="lazy"
            className="h-full max-h-[590px] w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
          />
        </div>
      </motion.article>
    </div>
  )
}
