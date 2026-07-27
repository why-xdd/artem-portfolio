import { useEffect, useState } from 'react'

/**
 * Subscribes to a media query.
 *
 * Used to skip mounting decorative WebGL scenes on small screens: a CSS
 * `hidden` class still mounts the component and allocates a GL context, which
 * costs a context slot and memory for something nobody sees.
 */
export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
