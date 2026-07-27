import FadeIn from '../components/FadeIn'
import AnimatedText from '../components/AnimatedText'
import { ContactButton } from '../components/Buttons'

const ABOUT_TEXT =
  'I build the parts users never see: APIs, bots and pipelines that have to keep ' +
  'running unattended. Most of my work ships to real users, from a card game bot ' +
  'in production to a real-time voice changer and a simulation of a robotic ' +
  'sorting hub. I like problems where correctness is measurable.'

const DECOR = [
  {
    slug: 'decor-moon',
    className:
      'absolute top-[4%] left-[1%] w-[120px] sm:left-[2%] sm:w-[160px] md:left-[4%] md:w-[210px]',
    delay: 0.1,
    x: -80,
  },
  {
    slug: 'decor-blocks',
    className:
      'absolute bottom-[8%] left-[3%] w-[100px] sm:left-[6%] sm:w-[140px] md:left-[10%] md:w-[180px]',
    delay: 0.25,
    x: -80,
  },
  {
    slug: 'decor-torus',
    className:
      'absolute top-[4%] right-[1%] w-[120px] sm:right-[2%] sm:w-[160px] md:right-[4%] md:w-[210px]',
    delay: 0.15,
    x: 80,
  },
  {
    slug: 'decor-group',
    className:
      'absolute right-[3%] bottom-[8%] w-[130px] sm:right-[6%] sm:w-[170px] md:right-[10%] md:w-[220px]',
    delay: 0.3,
    x: 80,
  },
]

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-20 sm:px-8 md:px-10"
    >
      {DECOR.map((d) => (
        <FadeIn
          key={d.slug}
          delay={d.delay}
          duration={0.9}
          x={d.x}
          y={0}
          className={`${d.className} pointer-events-none select-none`}
        >
          {/* Alpha cut-outs produced by scripts/cutout-decor.mjs, so the object
              floats on the page instead of sitting in a visible dark box. */}
          <img
            src={`/gen/${d.slug}.png`}
            alt=""
            loading="lazy"
            className="w-full"
          />
        </FadeIn>
      ))}

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
