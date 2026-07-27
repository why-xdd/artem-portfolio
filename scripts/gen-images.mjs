/**
 * Generates every decorative render the site uses, via Pollinations
 * (keyless, free). Output lands in public/gen as local files so the site
 * never hotlinks a third party.
 *
 * Re-running skips files that already exist, so a partial run is resumable.
 *   node scripts/gen-images.mjs [--force]
 */
import { mkdir, writeFile, access } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'gen')
const FORCE = process.argv.includes('--force')

// One shared look so 27 separate generations still read as a single set.
const STYLE =
  'isolated 3d render on pure black background, brushed chrome and dark steel, ' +
  'cool blue-grey rim light, single subtle magenta accent light, studio product ' +
  'photography, octane render, high detail, centered composition, no text, no watermark'

/** Marquee tiles: one per domain Artem actually works in. */
const MARQUEE = [
  ['cards', 'a fanned deck of collectible trading cards floating in mid air'],
  ['microphone', 'a studio microphone with a glowing sound waveform ribbon curling around it'],
  ['robot', 'a compact warehouse sorting robot carrying a parcel'],
  ['rack', 'a server rack with glowing status lights'],
  ['terminal', 'a floating terminal window pane with abstract glowing code lines'],
  ['container', 'stacked shipping containers as abstract glossy cubes'],
  ['database', 'a chrome database cylinder stack'],
  ['neural', 'a sphere built from connected glowing nodes and filaments'],
  ['plane', 'a folded paper plane in polished chrome'],
  ['waveform', 'an audio waveform sculpture as parallel chrome bars'],
  ['gears', 'interlocking metal gears in an exploded arrangement'],
  ['conveyor', 'a conveyor belt segment with glossy parcel boxes'],
  ['chip', 'a processor chip with glowing circuit traces'],
  ['graph', 'a floating 3d bar chart of polished metal blocks'],
]

/** Corner decoration for the About section. */
const DECOR = [
  ['decor-moon', 'a cratered moon sphere, matte grey stone, soft key light'],
  ['decor-blocks', 'a small cluster of glossy interlocking toy building blocks'],
  ['decor-torus', 'a twisted chrome torus knot'],
  ['decor-group', 'a small group of floating geometric primitives, cube sphere cone'],
]

/** Placeholder project imagery until real screenshots land. */
const PROJECTS = [
  ['friendcards-1', 'collectible card game interface abstracted into glossy 3d panels'],
  ['friendcards-2', 'a stack of glowing game cards with coins'],
  ['friendcards-3', 'a tall vertical arrangement of trading cards and chips'],
  ['voxshift-1', 'a chrome microphone head close up'],
  ['voxshift-2', 'spectrogram bars rendered as polished metal ridges'],
  ['voxshift-3', 'a tall audio mixing console rendered in dark chrome'],
  ['sorting-1', 'an overhead view of a robotic sorting floor with parcels'],
  ['sorting-2', 'a parcel chute mechanism in dark metal'],
  ['sorting-3', 'a tall warehouse aisle with automated sorting arms'],
]

const JOBS = [
  ...MARQUEE.map(([slug, p]) => ({ slug, prompt: p, w: 840, h: 540 })),
  ...DECOR.map(([slug, p]) => ({ slug, prompt: p, w: 640, h: 640 })),
  ...PROJECTS.map(([slug, p]) => ({
    slug,
    prompt: p,
    w: slug.endsWith('-3') ? 720 : 900,
    h: slug.endsWith('-3') ? 1000 : 620,
  })),
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function generate({ slug, prompt, w, h }, attempt = 1) {
  const file = join(OUT, `${slug}.jpg`)
  if (!FORCE && (await exists(file))) {
    console.log(`skip   ${slug}`)
    return true
  }

  const full = `${prompt}, ${STYLE}`
  const url =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(full)}` +
    `?width=${w}&height=${h}&nologo=true&seed=${hash(slug)}`

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(180_000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    // A truncated or error response comes back far too small to be a render.
    if (buf.length < 5_000) throw new Error(`suspiciously small (${buf.length}b)`)
    await writeFile(file, buf)
    console.log(`ok     ${slug}  ${(buf.length / 1024).toFixed(0)}kb`)
    return true
  } catch (err) {
    if (attempt < 3) {
      console.log(`retry  ${slug} (${err.message})`)
      await sleep(4000 * attempt)
      return generate({ slug, prompt, w, h }, attempt + 1)
    }
    console.log(`FAIL   ${slug}: ${err.message}`)
    return false
  }
}

// Stable seed per slug keeps re-runs visually identical.
function hash(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h) % 100000
}

await mkdir(OUT, { recursive: true })

let failed = 0
for (const job of JOBS) {
  const ok = await generate(job)
  if (!ok) failed++
  await sleep(1200)
}

console.log(`\ndone: ${JOBS.length - failed}/${JOBS.length} images in public/gen`)
process.exit(failed > 0 ? 1 : 0)
