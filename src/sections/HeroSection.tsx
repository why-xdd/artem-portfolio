import { lazy, Suspense } from 'react'
import FadeIn from '../components/FadeIn'
import Magnet from '../components/Magnet'
import { ContactButton } from '../components/Buttons'
import { AVATAR_URL } from '../avatar'

// Three.js is the heaviest dependency here and only the centrepiece needs it,
// so it loads in its own chunk once the rest of the hero has painted.
const HeroObject = lazy(() => import('../components/HeroObject'))

const PORTRAIT_BOX = 'h-[340px] w-full sm:h-[420px] md:h-[500px] lg:h-[580px]'

const NAV = [
  { href: '#about', label: 'About' },
  { href: '#stack', label: 'Stack' },
  { href: '#projects', label: 'Projects' },
  { href: 'mailto:why.not.live.alone@gmail.com', label: 'Contact' },
]

export default function HeroSection() {
  return (
    <section
      className="flex h-screen flex-col"
      style={{ overflowX: 'clip' }}
    >
      <FadeIn as="nav" delay={0} y={-20} className="px-6 pt-6 md:px-10 md:pt-8">
        <ul className="flex items-center justify-between text-sm font-medium tracking-wider text-[#D7E2EA] uppercase md:text-lg lg:text-[1.4rem]">
          {NAV.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="transition-opacity duration-200 hover:opacity-70"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </FadeIn>

      <div className="overflow-hidden">
        <FadeIn delay={0.15} y={40}>
          {/* Capped at 16vw: "Hi, i'm artem" is a longer string than the
              reference design's, and 17.5vw clips the final M. */}
          <h1 className="hero-heading mt-6 w-full text-[14vw] leading-none font-black tracking-tight whitespace-nowrap uppercase sm:mt-4 sm:text-[15vw] md:-mt-5 md:text-[15.5vw] lg:text-[16vw]">
            Hi, i&apos;m artem
          </h1>
        </FadeIn>
      </div>

      <div className="relative flex flex-1 items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20} className="relative z-20">
          <p
            className="max-w-[160px] leading-snug font-light tracking-wide text-[#D7E2EA] uppercase sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            a backend developer building bots, audio tooling and systems that hold
            up in production
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20} className="relative z-20">
          <ContactButton />
        </FadeIn>

        <FadeIn
          delay={0.6}
          y={30}
          className="absolute left-1/2 z-10 w-[280px] -translate-x-1/2 sm:bottom-0 sm:translate-y-0 sm:w-[360px] md:w-[440px] lg:w-[520px] top-1/2 -translate-y-1/2 sm:top-auto"
        >
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
          >
            <Suspense fallback={<div className={PORTRAIT_BOX} />}>
              <HeroObject modelUrl={AVATAR_URL} className={PORTRAIT_BOX} />
            </Suspense>
          </Magnet>
        </FadeIn>
      </div>
    </section>
  )
}
