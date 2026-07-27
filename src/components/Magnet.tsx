import { useEffect, useRef, useState, type ReactNode } from 'react'

type MagnetProps = {
  children: ReactNode
  /** How far outside the element the pull starts, in px. */
  padding?: number
  /** Higher divides the pull down; 3 means the element moves a third as far. */
  strength?: number
  activeTransition?: string
  inactiveTransition?: string
  className?: string
  wrapperClassName?: string
}

/**
 * Pulls its children toward the cursor once the cursor is within `padding` of
 * the element. Position is written straight to a transform rather than through
 * state on every mouse event, so React only re-renders when the magnet arms or
 * disarms.
 */
export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
  wrapperClassName,
}: MagnetProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const inner = innerRef.current
    if (!wrap || !inner) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let armed = false

    function onMove(e: PointerEvent) {
      const rect = wrap!.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2

      const withinX = Math.abs(e.clientX - cx) < rect.width / 2 + padding
      const withinY = Math.abs(e.clientY - cy) < rect.height / 2 + padding

      if (withinX && withinY) {
        if (!armed) {
          armed = true
          setActive(true)
        }
        const dx = (e.clientX - cx) / strength
        const dy = (e.clientY - cy) / strength
        inner!.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
      } else if (armed) {
        armed = false
        setActive(false)
        inner!.style.transform = 'translate3d(0, 0, 0)'
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [padding, strength])

  return (
    <div ref={wrapRef} className={wrapperClassName}>
      <div
        ref={innerRef}
        className={className}
        style={{
          transition: active ? activeTransition : inactiveTransition,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}
