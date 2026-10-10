---
name: Artem — P100
description: A broadcast teletext service for one engineer: eight colours, forty columns, every claim on a keyed page.
colors:
  tt-black: "#000000"
  tt-white: "#FFFFFF"
  tt-yellow: "#FFFF00"
  tt-cyan: "#00FFFF"
  tt-green: "#00FF00"
  tt-magenta: "#FF00FF"
  tt-red: "#FF0000"
  tt-blue: "#0000FF"
typography:
  display:
    fontFamily: "Authored 5x7 mosaic alphabet (drawn as SVG rects, not a font)"
    fontSize: "calc(var(--cell) * 3) per row"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "1 cell"
  headline:
    fontFamily: "Press Start 2P, monospace"
    fontSize: "clamp(14px, 1vw + 10px, 20px)"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "calc(var(--cell) * 0.06)"
  title:
    fontFamily: "Press Start 2P, monospace"
    fontSize: "clamp(12px, 0.7vw + 9.3px, 16px)"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0"
  body:
    fontFamily: "Press Start 2P, monospace"
    fontSize: "clamp(11px, 0.6vw + 8.6px, 14px)"
    fontWeight: 400
    lineHeight: 2
    letterSpacing: "0"
  label:
    fontFamily: "Press Start 2P, monospace"
    fontSize: "clamp(10px, 0.55vw + 8px, 13px)"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0"
rounded:
  none: "0"
spacing:
  hairline: "calc(var(--cell) * 0.16)"
  tight: "calc(var(--cell) * 0.4)"
  snug: "calc(var(--cell) * 0.6)"
  pad: "calc(var(--cell) * 0.75)"
  block: "calc(var(--cell) * 0.9)"
  section: "calc(var(--cell) * 1.5)"
components:
  panel-head:
    backgroundColor: "{colors.tt-blue}"
    textColor: "{colors.tt-yellow}"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
    padding: "calc(var(--cell) * 0.5) calc(var(--cell) * 0.75)"
  panel-body:
    backgroundColor: "{colors.tt-black}"
    textColor: "{colors.tt-white}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "calc(var(--cell) * 0.9) calc(var(--cell) * 0.75) calc(var(--cell) * 0.4)"
  action-primary:
    backgroundColor: "{colors.tt-cyan}"
    textColor: "{colors.tt-black}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "calc(var(--cell) * 0.5) calc(var(--cell) * 0.9)"
    height: "max(44px, calc(var(--cell) * 2))"
  action-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.tt-cyan}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "calc(var(--cell) * 0.5) calc(var(--cell) * 0.9)"
    height: "max(44px, calc(var(--cell) * 2))"
  tag:
    backgroundColor: "{colors.tt-cyan}"
    textColor: "{colors.tt-black}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "calc(var(--cell) * 0.28) calc(var(--cell) * 0.5)"
  alert-strip:
    backgroundColor: "{colors.tt-red}"
    textColor: "{colors.tt-black}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "calc(var(--cell) * 0.6) calc(var(--cell) * 0.75)"
    height: "max(44px, calc(var(--cell) * 2))"
  fastext-key:
    backgroundColor: "{colors.tt-cyan}"
    textColor: "{colors.tt-black}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "calc(var(--cell) * 0.5) calc(var(--cell) * 0.3)"
    height: "max(44px, calc(var(--cell) * 2))"
  still-frame-label:
    backgroundColor: "{colors.tt-cyan}"
    textColor: "{colors.tt-black}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "calc(var(--cell) * 0.3) calc(var(--cell) * 0.5)"
---

# Design System: Artem — P100

## Overview

**Creative North Star: "The Broadcast Service"**

This is one engineer's work published the way a television network published a page
service: three bits of colour, a fixed character grid, and a number you key to reach
anything. Nothing on the surface is graded, tinted or lit. Every colour is fully on
or fully off, every measurement is a whole number of character cells, and the display
voice is drawn out of the same cells the letters are drawn in. The density is high
and the rhythm is mechanical — solid fields of saturated colour separated by dashed
rules, with body text set at a generous line-height so a forty-column page stays
readable at a skim.

The world is a constraint machine, and the constraint is the argument: a service that
can only show eight colours cannot decorate its way out of a weak claim, so every
panel has to carry a figure, a capture, or a page number that proves it. The medium's
own devices do the work that gradients and shadows would do elsewhere — a blue ground
means "this is a section", a cyan frame means "this is a capture, not a drawing", red
means "this is the thing to act on".

Two things are explicitly refused, and both are named in the build's own direction
comment: the dark developer portfolio (scrolling card grid, one neon accent over
near-black) and its opposite, the austere white CV page. This world is neither
atmospheric nor neutral; it is a broadcast signal.

**Key Characteristics:**
- Eight colours, fully saturated, never blended or tinted
- A forty-column character grid (twenty-six under 760px) that scales its cell instead of reflowing
- Display type drawn from 5x7 mosaic cells, never a scaled font
- Flat and ungraded throughout: no gradient, blur, glass, or drop shadow
- Motion is mechanical — `steps()`, blink, damped turn — and always reduced-motion aware
- Solid colour fields carry meaning; black text sits on every saturated fill

## Colors

The broadcast eight: one bit each for red, green and blue, fully on or fully off,
which is the entire palette and the entire grading model.

### Primary
- **Signal Cyan** (`{colors.tt-cyan}`): the service's working accent. It frames every
  still, labels every figure, fills the default action button, and marks the INDEX key
  in the FASTEXT bar. It is the colour of "here is the evidence".
- **Panel Blue** (`{colors.tt-blue}`): the ground under every section head and the rule
  under the header row. It is a field colour only — see the Field Rule below.

### Secondary
- **Caption Yellow** (`{colors.tt-yellow}`): section titles on blue, the page number in
  the header, the keyed-digit echo, the WHAT I DO key, and the default display-headline
  colour. Yellow is the voice that speaks from inside a panel.
- **Alert Red** (`{colors.tt-red}`): the double-width alert strip, the CONTACT key at the
  end of the FASTEXT run, and nothing else. Its scarcity is what makes it an alert.

### Tertiary
- **Live Green** (`{colors.tt-green}`) and **Mosaic Magenta** (`{colors.tt-magenta}`):
  status signalling (`LIVE`) and the avatar's hair material respectively. Both are
  legitimate text colours on black; neither is used as a general surface.

### Neutral
- **Tube Black** (`{colors.tt-black}`): the page ground everywhere, and the text colour on
  every saturated fill.
- **Broadcast White** (`{colors.tt-white}`): body copy, the dashed rules, the station name
  in the header, and the active-key outline in the FASTEXT bar.

### Named Rules

**The Field Rule.** Blue is a field and never a voice. `#0000FF` on black measures 2.4:1
and fails as text at every size; it is used as a panel ground with yellow or white set on
top, and as a hairline border. Never set body copy, a label, or a link in blue.

**The Black-On-Fill Rule.** Every saturated fill takes black text. White on red is 4.0:1 —
survivable on a double-height alert word, wrong for a sentence — so red panels, cyan
buttons, green and yellow FASTEXT keys and all tags are black-on-colour without exception.

**The Three-Bit Rule.** Colour values are `#000`, `#FFF`, and the six full-channel
combinations. No tint, no blend, no alpha over a colour, no interpolation between two of
the eight. The only alpha in the build is the scanline overlay, which is black on black.

## Typography

**Display Font:** an authored 5x7 mosaic alphabet, rendered as SVG rectangles with
`shape-rendering: crispEdges`
**Body Font:** Press Start 2P (with `monospace`)
**Label Font:** Press Start 2P, same face at the small end of the ramp

**Character:** a single bitmap face doing every job, at a ramp so short it barely counts
as a hierarchy — the size difference between a section title and body copy is four pixels
at the small end. Emphasis is carried by colour and by field, not by weight, because a
bitmap face has exactly one weight.

### Hierarchy
- **Display** (mosaic alphabet, `calc(var(--cell) * 3)` per row, leading of 3 glyph units):
  headlines only. Multi-row headlines share one SVG so every row shares one scale.
- **Headline** (400, `clamp(14px, 1vw + 10px, 20px)`, 1.4): panel titles, set in yellow on
  the blue head with one-tenth-cell tracking.
- **Title** (400, `clamp(12px, 0.7vw + 9.3px, 16px)`, 1.4): index-row names, figure values,
  the numbers a visitor keys.
- **Body** (400, `clamp(11px, 0.6vw + 8.6px, 14px)`, line-height 2): paragraphs. The doubled
  leading is what makes a bitmap face readable in quantity.
- **Label** (400, `clamp(10px, 0.55vw + 8px, 13px)`, 1.7): figure labels, captions, tags,
  status words, FASTEXT key names.

Font smoothing is disabled globally (`-webkit-font-smoothing: none`, `font-smooth: never`):
a bitmap face wants its pixels, not the rasteriser's opinion of them.

### Named Rules

**The Drawn-Display Rule.** Display type is drawn from cells, never a scaled font. Any
headline larger than the title step is authored in the 5x7 alphabet and rendered as
rectangles. Scaling a webfont up produces smooth curves this medium cannot make.

**The Legibility Floor Rule.** The grid rules structure; it may not rule legibility. Text
is sized on its own clamped scale with a hard pixel floor (10px minimum), never on
`--cell`, because forty columns of a phone is a nine-pixel cell — a set could get away with
that where a recruiter with sixty seconds cannot. The one exception is `.tt-grid-text`,
which locks a run of characters to the column grid at `calc(var(--cell) * 0.62)`.

**The One-Scale-Per-Headline Rule.** All rows of a multi-row headline render into a single
SVG viewBox. Rendering each row separately at `width: 100%` gives the shorter row bigger
letters, which is two headlines, not one.

## Layout

The page is a fixed forty-column character grid: `--cols: 40`, `--page: min(100vw - 2 *
--gutter, 1120px)`, `--cell: var(--page) / var(--cols)`, `--row: var(--cell) * 1.35`. Under
760px the grid drops to twenty-six columns so the cell grows rather than the structure
reflowing — the same page on a smaller set, which is exactly how a broadcast page behaved
on a portable. The gutter is `clamp(8px, 2vw, 32px)`.

Every measurement in the system is expressed through the `cells(n)` helper as a multiple of
`--cell`: hairlines at 0.16, tight gaps at 0.4, panel padding at 0.75, block padding at 0.9,
section separation at 1.5. There is no second spacing scale.

The front page is a two-column composition (`1.35fr / 1fr`, gap 1.2 cells) with the claim on
the left and the avatar window on the right; the avatar caps at 12 cells wide and hangs to
the trailing edge. Under 760px it collapses to one column and the claim still leads — opening
on the portrait would put the sentence that says what this person does below the fold. The
alert strip is one row on a set and two on a phone, keeping its page reference either way.
The header's clock is the first thing dropped when columns run out; the page number never is.

Interactive targets never fall below `max(44px, calc(var(--cell) * 2))`, so touch survives
every cell size the grid produces.

## Elevation & Depth

This system is flat and has no elevation model. There are no drop shadows, no blurs, no
glass, no gradients, and no tonal layering — depth would require values between the eight,
which the palette forbids. Separation is done with solid colour fields, hairline borders at
0.16 cells, and dashed rules.

The single `box-shadow` in the build is not a shadow: the filled action button carries a
doubled outline drawn as two zero-offset rings (`0 0 0 0.16cell black, 0 0 0 0.32cell
<colour>`), which reads as a keyline around the key, not as a light source.

The whole page sits under a CRT surface: a fixed 1-in-3px scanline field at
`rgba(0,0,0,0.22)` in `multiply` at `z-index: 40`, pointer-events off. It is the tube the
page is printed on, never an effect layered over content.

### Named Rules

**The No-Light-Source Rule.** Nothing in this world is lit from outside the screen. No
offset shadow, no glow, no bevel, no inner shadow. Rings are allowed because they are
keylines; offsets are not.

## Shapes

Every corner is square. Radius is zero everywhere — panels, buttons, tags, frames, the
avatar window — because a character cell has no corner radius. Borders are hairlines at
`calc(var(--cell) * 0.16)` in a palette colour; the still frame and the avatar window use
them as visible enclosure, the header uses one as a blue underline. Dashed rules are drawn
as `repeating-linear-gradient` at 0.34-cell dashes, 0.16 cells tall. Silhouettes are
rectangles the width of the column run; nothing is circular except the avatar's own
geometry, which is quantised into square cells anyway.

## Components

### Buttons
- **Shape:** square (0 radius), at least `max(44px, 2 cells)` tall
- **Primary (Action):** solid fill in a palette colour (cyan by default), black text,
  0.5 × 0.9 cell padding, and a doubled outline — a black ring then a colour ring, both at
  zero offset. The fill is the affordance; the doubled ring is what says "this is the key
  you are on".
- **Quiet (Action `quiet`):** transparent ground, colour text, single 0.16-cell border in the
  same colour, no rings. A quiet button beside a filled one can never be mistaken for it.
- **Focus:** global `:focus-visible` is a 0.16-cell cyan outline at 0.16-cell offset.

### Chips (Tag)
- **Style:** solid palette-colour fill, black text, 0.28 × 0.5 cell padding, no radius, no
  border, never wrapped.

### Cards / Containers (Panel)
- **Corner Style:** square
- **Head:** a solid ground (blue by default) with the title in yellow at headline size and an
  optional white right-hand slot at label size
- **Body:** black ground, white body copy, 0.9 / 0.75 / 0.4 cell padding
- **Border:** none; the head's colour field is the container's edge
- **Separation:** 1.5 cells below each panel

### Navigation (FASTEXT)
- Four sticky keys along the bottom edge, one grid row, 0.16-cell gaps on a black backing.
  Numbers ascend left to right — 100 INDEX cyan, 200 WORK green, 300 WHAT I DO yellow,
  500 CONTACT red — and the red key lands last. A red key forced to the left end broke the
  count on a service whose entire instruction is "key a number", and the primary action
  belongs at the end of a run anyway. Each key is black on its fill; the active key takes a
  white inset outline.

### Header row
- One flex row: yellow `P<page>` at the left, white `ARTEM` centred with 0.08-cell tracking,
  the keyed digits (yellow, padded with `-`) or the page number plus a live clock at the
  right, over a blue hairline. The clock is hidden under 760px.

### Index Row (signature)
- Name, a dotted leader, a status word, and the page number, on one baseline. The leader is
  drawn in the row's own status colour and is not decoration: a name on the left and a number
  eight hundred pixels to the right are two separate things without it. The status colour
  (green LIVE, cyan SHIPPED, yellow PRIVATE) carries on the leader, the status word and the
  number together — the copy promises one code, so it cannot live on only half the row.

### Still (signature)
- A framed off-air window: a cyan label bar (`STILL` at the left, the source at the right),
  a cyan hairline enclosure with no top edge, black ground, and a cyan caption below. Under
  760px the capture stops scaling and starts scrolling at a 620px floor, with a
  `SCROLL TO READ >>` hint in the label bar — a terminal capture shrunk until the digits blur
  has stopped being evidence.

### Mosaic Avatar (signature)
- A three.js figure rendered into a 54 × 58 cell canvas, every pixel snapped to the nearest of
  the eight with a 4x4 Bayer dither at ±42 bias, framed in a blue hairline. Every material is
  an exact broadcast colour so shading changes brightness without changing hue; the shading
  light is blue and only blue, which is what lets a lit yellow face cross into white and
  dither at the boundary instead of falling into red. A white light would raise all three
  channels and leave the face flat. The `REVEAL THE MODEL` key re-renders the same scene at
  full resolution — the medium's own reveal control, spent on showing the picture was a model
  all along. The figure damps toward the pointer and drifts when nobody is reading it; under
  reduced motion it holds a fixed three-quarter pose.

### Motion
- **Page reveal:** `tt-page-in`, a `clip-path` wipe from the top over 420ms in `steps(24, end)` —
  row by row, mechanical rather than decorative. Disabled entirely under reduced motion.
- **Caret:** `tt-blink`, 1s `steps(1, end)`, infinite.
- **Avatar turn:** damped lerp at 0.08 per frame.
- Everything else is instant. Under `prefers-reduced-motion: reduce`, all animation and
  transition durations collapse to 0.01ms globally.

## Do's and Don'ts

### Do:
- **Do** express every measurement as a multiple of `--cell` via `cells(n)`, and size every
  piece of text on the clamped `--t-*` scale with its pixel floor.
- **Do** put black text on every saturated fill (red, cyan, green, yellow, magenta, white).
- **Do** use blue as a ground and a hairline only, with yellow or white on top.
- **Do** draw any headline above the title step in the 5x7 mosaic alphabet, and render all
  rows of one headline in a single SVG.
- **Do** frame captures as off-air windows re-rendered in the eight, with the source named on
  the frame.
- **Do** keep every interactive target at `max(44px, calc(var(--cell) * 2))`.
- **Do** make motion mechanical — `steps()`, blink, damped turn — and honour
  `prefers-reduced-motion`.

### Don't:
- **Don't** introduce a colour outside the eight: no tint, no blend, no alpha over a colour,
  no interpolated value.
- **Don't** set text in blue, or set white text on a red fill for anything longer than a word.
- **Don't** add a gradient, blur, glass surface, or offset drop shadow. Zero-offset keyline
  rings are the only ring vocabulary; a light source is not.
- **Don't** round a corner. Radius is 0 everywhere.
- **Don't** scale a webfont up to make a headline.
- **Don't** size body text on `--cell` — twenty-six columns of a small phone gives a nine-pixel
  cell, and the grid may not rule legibility.
- **Don't** let a still scale below the width where its measured output is still readable;
  scroll the frame instead.
- **Don't** reflow the column grid to fit content; change the column count at the breakpoint
  and let the cell resize.

### The documented exceptions
Stills are re-rendered in the eight. Two works are the exceptions in the build, and each frame
carries its own label saying so:

- **queueviz** — `LIVE RECORDING, OWN COLOURS`. Its three tenant lanes are distinguished by
  colour, and posterising them to eight would destroy the evidence the capture exists to provide.
- **post-office-twin** (P210) — `APP CAPTURE, OWN COLOURS`. Tried both ways before deciding:
  nearest-of-eight and a lightness-inverted remap each erase the dashed move arrows, the ghosted
  original positions and the hatching on the offending objects, which are the whole content of
  the capture, and break the small figures in the panel. The 3D still loses its depth the same way.

The exceptions are licensed by that test only: posterising must actually destroy the evidence,
and the frame must say so. It is not a general licence for full-colour imagery.

<!-- Known debt at time of writing: the finish review ran without an approved comp (no image
generation available in that session), and the queueviz exception was reasoned rather than
verified against a reviewer capture. Both should be re-checked on the next pass. -->
