import { useMemo } from 'react'
import { GLYPH_H, pixelsFor } from './font'
import { TT, type TTColour } from './palette'

type Props = {
  /** One string, or several for a headline that breaks across rows. */
  children: string | string[]
  colour?: TTColour
  /** Height of one row, in character cells. Broadcast headlines were two. */
  cells?: number
  className?: string
  ariaHidden?: boolean
}

/** One blank row between headline rows, in glyph units. */
const LEADING = 3

/**
 * A headline built from mosaic cells.
 *
 * Every row of a headline shares one SVG, and therefore one scale. Rendering
 * each row separately at `width: 100%` looks reasonable until two rows of
 * different lengths sit above each other and the shorter one comes out in
 * bigger letters — which is not a headline, it is two headlines.
 *
 * Drawn as rectangles rather than a div per pixel: a six-word line is roughly
 * nine hundred lit cells, nothing for the rasteriser and a great deal for the
 * DOM. `crispEdges` keeps the blocks square at every scale, which is the whole
 * point of the medium.
 */
export default function BlockText({
  children,
  colour = 'yellow',
  cells = 3,
  className,
  ariaHidden,
}: Props) {
  const rows = useMemo(() => (Array.isArray(children) ? children : [children]), [children])

  const { rects, width, height } = useMemo(() => {
    const drawn = rows.map((row) => pixelsFor(row))
    const widest = Math.max(...drawn.map((row) => row.width), 0)
    const items = drawn.flatMap((row, index) =>
      row.pixels.map((pixel) => ({
        x: pixel.x,
        y: pixel.y + index * (GLYPH_H + LEADING),
        key: `${index}-${pixel.x}-${pixel.y}`,
      })),
    )
    return {
      rects: items,
      width: widest,
      height: rows.length * GLYPH_H + (rows.length - 1) * LEADING,
    }
  }, [rows])

  if (!width) return null
  const label = rows.join(' ')

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={`calc(var(--cell) * ${cells * rows.length})`}
      preserveAspectRatio="xMinYMid meet"
      shapeRendering="crispEdges"
      role={ariaHidden ? 'presentation' : 'img'}
      aria-label={ariaHidden ? undefined : label}
      aria-hidden={ariaHidden || undefined}
      style={{ display: 'block', maxWidth: '100%' }}
    >
      {rects.map((rect) => (
        <rect key={rect.key} x={rect.x} y={rect.y} width={1} height={1} fill={TT[colour]} />
      ))}
    </svg>
  )
}
