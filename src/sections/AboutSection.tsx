import { lazy, Suspense } from 'react'
import FadeIn from '../components/FadeIn'
import AnimatedText from '../components/AnimatedText'
import { ContactButton } from '../components/Buttons'

// One WebGL context for all four corner objects, loaded lazily with the rest
// of the Three.js chunk.
const DecorScene = lazy(() => import('../components/DecorScene'))

const ABOUT_TEXT =
  'I build the parts users never see: APIs, bots and pipelines that have to keep ' +
  'running unattended. Most of my work ships to real users, from a card game bot ' +
  'in production to a real-time voice changer and a simulation of a robotic ' +
  'sorting hub. I like problems where correctness is measurable.'

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-20 sm:px-8 md:px-10"
    >
      <Suspense fallback={null}>
        <DecorScene className="pointer-events-none absolute inset-0 z-0" />
      </Suspense>

      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading text-center leading-none font-black tracking-tight uppercase"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About me
          </h2>
        </FadeIn>

        <AnimatedText
          text={ABOUT_TEXT}
          className="max-w-[560px] text-center leading-relaxed font-medium text-[#D7E2EA]"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
        />
      </div>

      <div className="relative z-10 mt-16 sm:mt-20 md:mt-24">
        <FadeIn delay={0.15} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  )
}
