import { useCallback, useEffect, useState } from 'react'
import { WORKS } from './content'
import { AboutPage, ContactPage, FrontPage, SkillsPage, WorkIndex, WorkPage } from './pages'
import { Fastext, Header } from './teletext/Chrome'
import { cells } from './teletext/grid'
import { TT } from './teletext/palette'

const VALID = new Set<number>([100, 200, 300, 400, 500, ...WORKS.map((work) => work.page)])
/** The range the footer quotes comes from the works themselves, so a new page cannot leave it stale. */
const WORK_RANGE = `${WORKS[0].page} TO ${WORKS[WORKS.length - 1].page}`
const HOME = 100

function pageFromHash(): number {
  const raw = Number(window.location.hash.replace('#', ''))
  return VALID.has(raw) ? raw : HOME
}

export default function App() {
  const [page, setPage] = useState<number>(() => pageFromHash())
  const [keyed, setKeyed] = useState('')
  const [missed, setMissed] = useState<string | null>(null)

  const go = useCallback((next: number) => {
    if (!VALID.has(next)) return
    window.location.hash = String(next)
    setPage(next)
    setKeyed('')
    setMissed(null)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    const onHash = () => setPage(pageFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // A page arrives at its first row, however the viewer got to it — keyed,
  // clicked, or opened straight from a pasted link.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [page])

  // Keying digits is the whole input of this medium, so it is the whole input
  // here: three numerals anywhere on the page change it.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return

      if (event.key === 'Escape' || event.key === 'Backspace') {
        setKeyed('')
        setMissed(null)
        return
      }
      if (!/^[0-9]$/.test(event.key)) return

      setMissed(null)
      setKeyed((current) => {
        const next = (current + event.key).slice(-3)
        if (next.length === 3) {
          const number = Number(next)
          if (VALID.has(number)) {
            window.setTimeout(() => go(number), 0)
          } else {
            window.setTimeout(() => setMissed(next), 0)
          }
          return ''
        }
        return next
      })
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const work = WORKS.find((item) => item.page === page)

  return (
    <div className="tt-screen" style={{ minHeight: '100dvh', background: TT.black }}>
      <div
        style={{
          width: 'var(--page)',
          marginInline: 'auto',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header page={page} keyed={keyed} />

        <main
          key={page}
          className="tt-page-in"
          style={{ flex: 1, padding: `${cells(1.2)} ${cells(0.75)} ${cells(2)}` }}
        >
          {page === 100 ? <FrontPage onGo={go} /> : null}
          {page === 200 ? <WorkIndex onGo={go} /> : null}
          {work ? <WorkPage work={work} onGo={go} /> : null}
          {page === 300 ? <SkillsPage /> : null}
          {page === 400 ? <AboutPage onGo={go} /> : null}
          {page === 500 ? <ContactPage onGo={go} /> : null}
        </main>

        <p
          role="status"
          style={{
            color: missed ? TT.black : TT.cyan,
            background: missed ? TT.yellow : 'transparent',
            fontSize: 'var(--t-xs)',
            lineHeight: 2,
            padding: `${cells(0.4)} ${cells(0.5)}`,
            textAlign: 'center',
          }}
        >
          {missed
            ? `PAGE ${missed} NOT IN THIS MAGAZINE — TRY 100, 200, 300, 400, 500`
            : `KEY A PAGE NUMBER ON THE KEYBOARD — ${WORK_RANGE} ARE THE WORK`}
        </p>

        <Fastext page={page} onGo={go} />
      </div>
    </div>
  )
}
