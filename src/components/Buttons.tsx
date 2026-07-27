import type { ReactNode } from 'react'

const CONTACT_GRADIENT =
  'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)'

export function ContactButton({
  href = 'mailto:why.not.live.alone@gmail.com',
  label = 'Contact Me',
}: {
  href?: string
  label?: string
}) {
  return (
    <a
      href={href}
      className="inline-block rounded-full px-8 py-3 text-xs font-medium tracking-widest text-white uppercase transition-transform duration-200 active:translate-y-px sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
      style={{
        background: CONTACT_GRADIENT,
        boxShadow:
          '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid #ffffff',
        outlineOffset: '-3px',
      }}
    >
      {label}
    </a>
  )
}

export function GhostButton({
  href,
  children,
}: {
  href?: string
  children: ReactNode
}) {
  const className =
    'inline-block rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium tracking-widest text-[#D7E2EA] uppercase transition-colors duration-200 hover:bg-[#D7E2EA]/10 active:translate-y-px sm:px-10 sm:py-3.5 sm:text-base'

  if (!href) {
    // Private work has nothing to link to; the label says so rather than
    // dead-ending the visitor on a 404.
    return (
      <span className={`${className} cursor-default opacity-50`}>{children}</span>
    )
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  )
}
