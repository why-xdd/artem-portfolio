import type { ReactNode } from 'react'
import { cells } from './grid'
import { TT, type TTColour } from './palette'

export function Panel({
  title,
  ground = 'blue',
  titleColour = 'yellow',
  right,
  children,
  id,
}: {
  title: string
  ground?: TTColour
  titleColour?: TTColour
  right?: ReactNode
  children: ReactNode
  id?: string
}) {
  return (
    <section id={id} style={{ marginBottom: cells(1.5) }}>
      <div
        style={{
          background: TT[ground],
          color: TT[titleColour],
          padding: `${cells(0.5)} ${cells(0.75)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: cells(1),
        }}
      >
        <h2 style={{ fontSize: 'var(--t-lg)', letterSpacing: cells(0.06) }}>{title}</h2>
        {right ? <span style={{ fontSize: 'var(--t-sm)', color: TT.white }}>{right}</span> : null}
      </div>
      <div style={{ padding: `${cells(0.9)} ${cells(0.75)} ${cells(0.4)}` }}>{children}</div>
    </section>
  )
}

/** The dashed rule that separated blocks on a broadcast page. */
export function Rule({ colour = 'white' }: { colour?: TTColour }) {
  return (
    <div
      role="presentation"
      style={{
        height: cells(0.16),
        margin: `${cells(0.6)} 0`,
        backgroundImage: `repeating-linear-gradient(to right, ${TT[colour]} 0 ${cells(0.34)}, transparent ${cells(0.34)} ${cells(0.68)})`,
      }}
    />
  )
}

/**
 * A row of the index: what it is, a leader across the gap, what state it is
 * in, and the number you key to reach it. The leader is not decoration — a
 * name on the left and a number eight hundred pixels to the right are two
 * separate things without it, which is why every printed index has one.
 */
export function IndexRow({
  name,
  status,
  statusColour,
  page,
  onSelect,
}: {
  name: string
  status: string
  statusColour: TTColour
  page: number
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        display: 'flex',
        width: '100%',
        alignItems: 'baseline',
        gap: cells(0.6),
        padding: `${cells(0.34)} ${cells(0.4)}`,
        background: 'transparent',
        color: TT.white,
        border: 0,
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 'var(--t-md)',
        textAlign: 'left',
        minHeight: 'max(44px, calc(var(--cell) * 2.2))',
      }}
    >
      <span style={{ whiteSpace: 'nowrap' }}>{name}</span>
      <span
        aria-hidden
        style={{
          flex: 1,
          alignSelf: 'center',
          minWidth: cells(1),
          height: cells(0.16),
          backgroundImage: `repeating-linear-gradient(to right, ${TT[statusColour]} 0 ${cells(0.16)}, transparent ${cells(0.16)} ${cells(0.5)})`,
        }}
      />
      <span style={{ color: TT[statusColour], fontSize: 'var(--t-xs)', whiteSpace: 'nowrap' }}>
        {status}
      </span>
      {/* The number carries the status colour too. The copy promises one code;
          it cannot live on only half the row. */}
      <span style={{ color: TT[statusColour], minWidth: cells(2.4), textAlign: 'right' }}>
        {page}
      </span>
    </button>
  )
}

/** A labelled figure. The label is small and cyan; the value carries the size. */
export function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ color: TT.cyan, fontSize: 'var(--t-xs)', marginBottom: cells(0.3) }}>{label}</div>
      <div style={{ color: TT.white, fontSize: 'var(--t-md)', lineHeight: 1.4 }}>{value}</div>
    </div>
  )
}

export function Tag({ label, colour }: { label: string; colour: TTColour }) {
  return (
    <span
      style={{
        background: TT[colour],
        color: TT.black,
        padding: `${cells(0.28)} ${cells(0.5)}`,
        fontSize: 'var(--t-xs)',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

/**
 * The medium's button: a solid field with black text, and a doubled outline
 * when it is the one you are on. Sized to stay past the 44px touch floor at
 * every cell size the grid produces.
 */
export function Action({
  children,
  href,
  onClick,
  colour = 'cyan',
}: {
  children: ReactNode
  href?: string
  onClick?: () => void
  colour?: TTColour
}) {
  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: cells(0.4),
    background: TT[colour],
    color: TT.black,
    padding: `${cells(0.5)} ${cells(0.9)}`,
    fontSize: 'var(--t-sm)',
    minHeight: 'max(44px, calc(var(--cell) * 2))',
    border: 0,
    cursor: 'pointer',
    fontFamily: 'inherit',
    textDecoration: 'none',
    boxShadow: `0 0 0 ${cells(0.16)} ${TT.black}, 0 0 0 ${cells(0.32)} ${TT[colour]}`,
  } as const

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer' : undefined}
        style={style}
      >
        {children}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} style={style}>
      {children}
    </button>
  )
}

/**
 * A still held on the page, the way a broadcast service framed a photograph
 * it could not draw in mosaic: a labelled window with the picture inside.
 */
export function Still({
  src,
  alt,
  caption,
  source = 'OFF-AIR CAPTURE',
}: {
  src: string
  alt: string
  caption: string
  /** Named on the frame, so a still that is not in the eight says so. */
  source?: string
}) {
  return (
    <figure style={{ marginBottom: cells(1.2) }}>
      <div
        style={{
          background: TT.cyan,
          color: TT.black,
          padding: `${cells(0.3)} ${cells(0.5)}`,
          fontSize: 'var(--t-xs)',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>STILL</span>
        <span className="tt-scroll-hint">SCROLL TO READ &gt;&gt;</span>
        <span className="tt-still-source">{source}</span>
      </div>
      {/* A still holds measured output, and output that has been shrunk until
          the digits blur has stopped being evidence. Below the width where it
          stays legible the frame scrolls rather than scaling further. */}
      <div
        className="tt-still-window"
        style={{
          border: `${cells(0.16)} solid ${TT.cyan}`,
          borderTop: 0,
          background: TT.black,
          overflowX: 'auto',
          overscrollBehaviorX: 'contain',
        }}
      >
        {/* `min(100%, 560px)` was the bug: on a 330px screen it evaluates to
            100%, so there was no minimum and nothing ever scrolled. A flat
            floor is what makes the capture readable and the scroll real. */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="tt-still-image"
          style={{ display: 'block', width: '100%' }}
        />
      </div>
      <figcaption
        style={{
          color: TT.cyan,
          fontSize: 'var(--t-xs)',
          lineHeight: 1.7,
          marginTop: cells(0.5),
        }}
      >
        {caption}
      </figcaption>
    </figure>
  )
}

export function Body({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        color: TT.white,
        fontSize: 'var(--t-sm)',
        lineHeight: 2,
        marginBottom: cells(0.9),
      }}
    >
      {children}
    </p>
  )
}
