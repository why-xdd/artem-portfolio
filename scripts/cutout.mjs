/**
 * Cuts the background out of the hero portrait locally, using the bundled
 * ONNX segmentation model. The photo never leaves this machine.
 *
 *   node scripts/cutout.mjs
 *
 * Writes src/assets/portrait-cutout.png with a real alpha channel, which the
 * point cloud uses to drop every transparent pixel.
 */
import { removeBackground } from '@imgly/background-removal-node'
import { writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'src', 'assets', 'portrait.jpg')
const OUT = join(ROOT, 'src', 'assets', 'portrait-cutout.png')

console.log('loading model (first run downloads weights)...')

const blob = await removeBackground(pathToFileURL(SRC).href, {
  output: { format: 'image/png', quality: 1 },
  progress: (key, current, total) => {
    if (total) console.log(`  ${key} ${Math.round((current / total) * 100)}%`)
  },
})

const buf = Buffer.from(await blob.arrayBuffer())
await writeFile(OUT, buf)
console.log(`wrote ${OUT} (${(buf.length / 1024).toFixed(0)}kb)`)
