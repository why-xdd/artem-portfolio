import { motion, useReducedMotion } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'

type FadeInProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  delay?: number
  duration?: number
  x?: number
  y?: number
}

/**
 * Enters once when scrolled into view. Every reveal on the page goes through
 * here so the timing curve stays identical across sections.
 */
export default function FadeIn({
  children,
  as = 'div',
  className,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
}: FadeInProps) {
  const reduce = useReducedMotion()
  const Tag = motion.create(as as ElementType)

  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </Tag>
  )
}
