# Artem — portfolio

A personal site for Artem (`why-xdd`), backend and ML, built as a **broadcast
teletext service**. Ten works are ten keyed pages; the whole thing exists to
get one email written.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build
npm run lint       # oxlint
```

## Why it looks like this

The previous version of this site was the dark developer portfolio: near-black
ground, one neon accent, a scrolling grid of project cards with generated
artwork where the work should have been. That is the arrangement every
candidate ships, and a recruiter comparing thirty tabs cannot tell any of them
apart.

Teletext is the opposite bet. It is a medium with three bits of colour, one
character grid and no photographs, and everything it ever did was scannable in
seconds — which is exactly the budget this page gets.

## The world, in five rules

1. **The broadcast eight, flat.** `#000 #F00 #0F0 #FF0 #00F #F0F #0FF #FFF`,
   fully on or fully off. No tint, no blend, no gradient anywhere in the build.
   Blue is a field and never a voice: `#00F` on black is 2.4:1 and fails as text
   at any size, which is why broadcast pages used it as a panel ground with
   white or yellow set on top.
2. **A character grid rules the layout.** `--cell` is the page width over forty
   columns, and every padding, gap, border and offset is a whole number of
   cells. The cell scales with the viewport; the structure never reflows into
   something else.
3. **Legibility is not part of the costume.** Forty columns of a phone is a
   nine-pixel cell, and a broadcast set could get away with that where this
   audience cannot. Text is sized on its own scale with a floor
   (`--t-xs`…`--t-lg`), and the grid keeps the rhythm.
4. **Display type is drawn, not scaled.** Headlines are built from mosaic cells
   by [`src/teletext/font.ts`](src/teletext/font.ts), a hand-authored 5×7
   alphabet rendered as SVG rectangles. Scaling a webfont up would produce
   smooth curves the medium could not make. A multi-row headline shares one
   SVG, and therefore one scale.
5. **Keying digits is the whole input.** Type any three numerals anywhere and
   the page changes, the way a set worked. The FASTEXT bar along the bottom
   keeps `500 CONTACT` one press from every screen.

## Pages

| Page | What is on it |
|---|---|
| 100 | Front page: the claim, the avatar, the three figures, one hook |
| 200 | Index of the work, with status colour and page numbers |
| 201–210 | One work per page: figures, real screenshots, what it does and why |
| 300 | What I do — five capabilities |
| 400 | About, and how the work is done |
| 500 | Contact — the page the service exists to deliver |

## The avatar

[`src/avatar/StylisedAvatar.tsx`](src/avatar/StylisedAvatar.tsx) builds a
stylised character in code — head, fringe, sunglasses, shoulders — with no
model file and no photograph. It renders at grid resolution, fifty-four cells
across, and every pixel is snapped to one of the eight colours with an ordered
dither.

Every material is an **exact** broadcast colour, so shading changes brightness
without changing hue. That detail is the whole trick: with an approximate skin
tone, the shaded half of a cheek falls between yellow and red and the quantiser
dithers it into speckle. With `#FFFF00`, it cannot.

`REVEAL THE MODEL` re-renders the same scene at the element's real resolution,
smooth and shaded. It is the medium's own control for hidden content, spent on
showing that the mosaic was a 3D model all along.

Three.js is loaded in its own chunk behind `React.lazy`, so the page paints on
text alone and the renderer arrives afterwards.

## Evidence

Everything in [`public/work/`](public/work/) is a capture of a program running —
the same ones the [GitHub profile](https://github.com/why-xdd) uses, resized for
the web. There is no generated artwork on this site.

Private work is named without a link rather than given a button that 404s.

## Content

Every factual claim lives in [`src/content.ts`](src/content.ts) — one array, ten
entries, each with its stack, its measured figures and the screenshots that show
them. Nothing about a project is written twice.

Product truth, including the audience and what must never be invented, is in
[`PRODUCT.md`](PRODUCT.md). The direction contract for the visual world is the
comment at the top of the document body in `index.html`, and it survives the
production build.

## Stack

React 19, Vite, Tailwind 4 (tokens only — the world is written in explicit
styles), Three.js for the avatar alone, and `@fontsource/press-start-2p`
self-hosted. No UI library, no animation library, no icon set: in a world made
of cells, an icon is drawn from cells.

MIT © [why-xdd](https://github.com/why-xdd)
