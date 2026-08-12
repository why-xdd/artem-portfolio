import { useEffect, useState } from 'react'
import { cells } from './grid'
import { TT } from './palette'

/** The header row a set painted before the page itself arrived. */
export function Header({ page, keyed }: { page: number; keyed: string }) {
  const [clock, setClock] = useState(() => stamp())

  useEffect(() => {
    const id = window.setInterval(() => setClock(stamp()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: cells(1),
        padding: `${cells(0.6)} ${cells(0.75)}`,
        fontSize: 'var(--t-sm)',
        borderBottom: `${cells(0.16)} solid ${TT.blue}`,
      }}
    >
      <span style={{ color: TT.yellow }}>P{page}</span>
      <span style={{ color: TT.white, letterSpacing: cells(0.08) }}>ARTEM</span>
      <span style={{ color: TT.cyan, marginLeft: 'auto', whiteSpace: 'nowrap' }}>
        {keyed ? (
          <span style={{ color: TT.yellow }}>{keyed.padEnd(3, '-')}</span>
        ) : (
          <span style={{ color: TT.white }}>{page}</span>
        )}{' '}
        {/* The clock is the medium's signature and the first thing to go when
            the row runs out of columns; the page number never does. */}
        <span className="tt-clock" aria-hidden>
          {clock}
        </span>
      </span>
    </header>
  )
}

function stamp(): string {
  const now = new Date()
  const day = now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })
  const time = now.toLocaleTimeString('en-GB', { hour12: false })
  return `${day.toUpperCase()} ${time}`
}

/**
 * Red first, because red is the loudest key on the bar and this service has
 * exactly one thing it wants pressed. The index can afford the cool end.
 */
const LINKS = [
  { page: 500, label: 'CONTACT', colour: TT.red },
  { page: 200, label: 'WORK', colour: TT.green },
  { page: 300, label: 'WHAT I DO', colour: TT.yellow },
  { page: 100, label: 'INDEX', colour: TT.cyan },
] as const

/**
 * FASTEXT: four coloured keys along the bottom edge, the one navigation a
 * viewer never had to look up. Black on saturated fill throughout, which is
 * both the medium's own treatment and the only one that clears contrast on
 * red.
 */
export function Fastext({ page, onGo }: { page: number; onGo: (page: number) => void }) {
  return (
    <nav
      aria-label="Fastext"
      style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 30,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: cells(0.16),
        background: TT.black,
        paddingTop: cells(0.16),
      }}
    >
      {LINKS.map((link) => {
        const active = page === link.page || (link.page === 200 && page > 200 && page < 300)
        return (
          <button
            key={link.page}
            type="button"
            onClick={() => onGo(link.page)}
            aria-current={active ? 'page' : undefined}
            style={{
              background: link.colour,
              color: TT.black,
              border: 0,
              fontFamily: 'inherit',
              cursor: 'pointer',
              padding: `${cells(0.5)} ${cells(0.3)}`,
              minHeight: 'max(44px, calc(var(--cell) * 2))',
              fontSize: 'var(--t-xs)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: cells(0.2),
              outline: active ? `${cells(0.16)} solid ${TT.white}` : 'none',
              outlineOffset: `-${cells(0.32)}`,
            }}
          >
            <span style={{ fontSize: 'var(--t-sm)' }}>{link.page}</span>
            <span>{link.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
