import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import type { MotionValue } from 'framer-motion'

type AnimatedTextProps = {
  text: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Reveals the paragraph one character at a time as it crosses the viewport.
 *
 * Characters are grouped into words and each word is its own inline-block, so
 * the browser can only break between words. Animating bare per-character spans
 * lets a line break land inside a word.
 */
export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  })

  const words = text.split(' ')
  const totalChars = text.length
  let consumed = 0

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((word, wi) => {
        const start = consumed
        // +1 for the space that follows this word.
        consumed += word.length + 1

        return (
          <span key={wi} className="inline-block whitespace-pre">
            {[...word].map((char, ci) => {
              const at = start + ci
              return (
                <Char
                  key={ci}
                  char={char}
                  range={[at / totalChars, (at + 1) / totalChars]}
                  progress={scrollYProgress}
                  reduce={!!reduce}
                />
              )
            })}
            {wi < words.length - 1 && (
              <Char
                char=" "
                range={[
                  (start + word.length) / totalChars,
                  (start + word.length + 1) / totalChars,
                ]}
                progress={scrollYProgress}
                reduce={!!reduce}
              />
            )}
          </span>
        )
      })}
    </p>
  )
}

function Char({
  char,
  range,
  progress,
  reduce,
}: {
  char: string
  range: [number, number]
  progress: MotionValue<number>
  reduce: boolean
}) {
  const opacity = useTransform(progress, range, [0.2, 1])
  return (
    <motion.span
      className="inline-block whitespace-pre"
      style={{ opacity: reduce ? 1 : opacity }}
    >
      {char}
    </motion.span>
  )
}
