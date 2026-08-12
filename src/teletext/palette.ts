/**
 * The broadcast eight.
 *
 * Teletext had three bits of colour and no more: one bit each for red, green
 * and blue, fully on or fully off. Nothing here is tinted, blended or graded,
 * because the medium could not do it and the discipline is what makes the
 * world legible.
 */
export const TT = {
  black: '#000000',
  red: '#FF0000',
  green: '#00FF00',
  yellow: '#FFFF00',
  blue: '#0000FF',
  magenta: '#FF00FF',
  cyan: '#00FFFF',
  white: '#FFFFFF',
} as const

export type TTColour = keyof typeof TT

/**
 * Blue is a field, never a voice.
 *
 * #00F on black is 2.4:1 — it fails as text at any size, which is exactly why
 * broadcast pages used it as a panel ground with white or yellow set on top.
 * Red is the other trap: white on red is 4.0:1, fine for the double-height
 * alert strip and wrong for a sentence, so red panels take black text.
 */
export const TEXT_ON_BLACK: TTColour[] = ['white', 'yellow', 'cyan', 'green', 'magenta']
export const FIELD_COLOURS: TTColour[] = ['blue', 'red', 'cyan', 'white', 'green', 'magenta']

/** Status vocabulary, borrowed from the medium's own signalling. */
export const STATUS = {
  live: { colour: 'green' as TTColour, label: 'LIVE' },
  shipped: { colour: 'cyan' as TTColour, label: 'SHIPPED' },
  private: { colour: 'yellow' as TTColour, label: 'PRIVATE' },
} as const
