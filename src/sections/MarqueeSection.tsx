import { useEffect, useRef, useState } from 'react'

const TILES = [
  'cards',
  'microphone',
  'robot',
  'rack',
  'terminal',
  'container',
  'database',
  'neural',
  'plane',
  'waveform',
  'gears',
  'conveyor',
  'chip',
  'graph',
]

const ROW_ONE = TILES.slice(0, 7)
const ROW_TWO = TILES.slice(7)

/**
 * Two rows of renders that slide in opposite directions, driven by how far the
 * section has travelled through the viewport rather than by a timer, so the
 * motion belongs to the scroll instead of running on its own.
 */
export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const update = () => {
      frame = 0
      const top = section.getBoundingClientRect().top + window.scrollY
      setOffset((window.scrollY - top + window.innerHeight) * 0.3)
    }

    const onScroll = () => {
      // Coalesce scroll events onto one frame; setState per event is what
      // makes this pattern stutter.
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-[#0C0C0C] pt-24 pb-10 sm:pt-32 md:pt-40"
    >
      <div className="flex flex-col gap-3">
        <Row slugs={ROW_ONE} x={offset - 200} />
        <Row slugs={ROW_TWO} x={-(offset - 200)} />
      </div>
    </section>
  )
}

function Row({ slugs, x }: { slugs: string[]; x: number }) {
  // Tripled so the strip still covers the viewport at either extreme.
  const tiles = [...slugs, ...slugs, ...slugs]
  return (
    <div
      className="flex gap-3"
      style={{ transform: `translateX(${x}px)`, willChange: 'transform' }}
    >
      {tiles.map((slug, i) => (
        <div
          key={`${slug}-${i}`}
          className="h-[180px] w-[280px] shrink-0 overflow-hidden rounded-2xl bg-[#141414] sm:h-[220px] sm:w-[340px] md:h-[270px] md:w-[420px]"
        >
          <img
            src={`/gen/${slug}.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  )
}
