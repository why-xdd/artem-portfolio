# Artem — portfolio

Personal portfolio for Artem (`why-xdd`), a backend and bot developer.

Sections: hero, scroll-driven marquee, about, what I do, projects.

## Notable pieces

**3D avatar.** `src/assets/avatar.glb` is a model generated from a photo, shown
by `src/components/HeroObject.tsx` with chrome rings orbiting its base. The
component frames whatever model it is given: it measures the bounding box,
centres it and scales to a fixed height, so swapping the file needs no code
change. With no model present it falls back to a procedural chrome cluster.

`src/avatar.ts` resolves the file through `import.meta.glob`, so the build does
not break when the asset is absent.

**Procedural environment.** `src/three/environment.ts` builds the reflection map
from coloured emissive panels rather than loading an HDRI. A 1k HDR costs about
1.6 MB and reflects a generic studio; this costs nothing to download and puts
the site's own magenta and cyan into every chrome surface.

Accent surfaces use clearcoat and iridescence rather than `transmission`.
Transmissive glass renders as a flat silhouette here, because the canvas is
alpha-transparent and has nothing behind it to refract.

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

### Replacing the avatar

Export a `.glb` and save it over `src/assets/avatar.glb`, then compress it:

```bash
npx gltf-transform optimize src/assets/avatar.glb src/assets/avatar.glb \
  --texture-compress webp --texture-size 2048 --compress draco
```

The source model was 16.2 MB; the same model Draco-compressed is 1.2 MB, and
texture compression alone only reaches 8.6 MB, so Draco earns its decoder. That
decoder lives in `public/draco/` and is copied from the `three` package —
without it the loader cannot read the file.

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
