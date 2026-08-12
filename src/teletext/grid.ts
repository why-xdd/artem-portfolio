/**
 * Every measurement on this service is a whole number of character cells.
 *
 * `--cell` is the page width divided by the forty columns the medium fixed,
 * so a layout written in cells scales with the screen instead of reflowing —
 * which is exactly what a broadcast page did on a portable set.
 */
export const cells = (n: number) => `calc(var(--cell) * ${n})`
