/**
 * Cuts the backdrop out of the About-section decor renders so the objects sit
 * on the page instead of inside a visible dark rectangle.
 *
 * Pollinations only returns JPEG, which has no alpha, and a dark backdrop on a
 * dark page cannot be removed with blend modes: screen against black is the
 * identity. So the objects go through the same local segmentation model as the
 * portrait, and are written back out as PNG with a real alpha channel.
 *
 *   node scripts/cutout-decor.mjs
 */
import { removeBackground } from '@imgly/background-removal-node'
import { writeFile, access } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIR = join(ROOT, 'public', 'gen')

const SLUGS = ['decor-moon', 'decor-blocks', 'decor-torus', 'decor-group']

for (const slug of SLUGS) {
  const src = join(DIR, `${slug}.jpg`)
  const out = join(DIR, `${slug}.png`)

  try {
    await access(src)
  } catch {
    console.log(`skip   ${slug} (source not generated yet)`)
    continue
  }

  try {
    const blob = await removeBackground(pathToFileURL(src).href, {
      output: { format: 'image/png', quality: 1 },
    })
    const buf = Buffer.from(await blob.arrayBuffer())
    await writeFile(out, buf)
    console.log(`ok     ${slug}.png  ${(buf.length / 1024).toFixed(0)}kb`)
  } catch (err) {
    console.log(`FAIL   ${slug}: ${err.message}`)
  }
}
