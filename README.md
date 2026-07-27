# Artem — portfolio

Personal portfolio for Artem (`why-xdd`), a backend and bot developer.

Sections: hero, scroll-driven marquee, about, what I do, projects.

## Notable pieces

**Point-cloud portrait.** `src/components/PointCloudPortrait.tsx` samples a
cut-out photo into a particle grid and pushes each particle along Z by its own
brightness, so the face gains real relief under a perspective camera. The cloud
tilts toward the pointer and scatters on hover. Colour is remapped onto the same
steel ramp as the hero heading so the portrait belongs to the page rather than
sitting on it.

**No third-party assets.** Every image is either generated locally into
`public/gen` or derived from Artem's own photo. Nothing is hotlinked.

## Asset pipeline

Three scripts, all re-runnable, skipping work that already exists:

```bash
node scripts/gen-images.mjs      # 27 renders via Pollinations (keyless, free)
node scripts/cutout.mjs          # alpha cut-out of the hero portrait
node scripts/cutout-decor.mjs    # alpha cut-outs of the About decor objects
```

Cut-outs run a segmentation model locally through
`@imgly/background-removal-node`; the photo never leaves the machine. They are
needed because Pollinations only returns JPEG, and a dark backdrop on a dark
page cannot be removed with a blend mode — `screen` against black is the
identity.

Generated files are committed, so a fresh clone builds without running any of
the scripts.

## Stack

Vite, React 19, TypeScript, Tailwind v4, Framer Motion, Three.js, Kanit.

Three.js loads in its own lazy chunk, keeping the entry bundle at 336 kB
(107 kB gzipped) rather than 855 kB.

All motion is gated behind `prefers-reduced-motion`.

Note on the CSS reset: it lives inside `@layer base` on purpose. Unlayered
rules outrank every layered one, so a bare `* { padding: 0 }` silently beats all
of Tailwind's spacing utilities.

## Running it

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Deploying

Vercel detects Vite automatically: build command `npm run build`, output
directory `dist`, no configuration file needed.

```bash
vercel          # preview deployment
vercel --prod   # production
```
