import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { cells } from '../teletext/grid'
import { TT } from '../teletext/palette'

/**
 * A stylised character avatar, rendered through the character grid.
 *
 * Two commitments meet here. The avatar is a built figure with a face, hair
 * and shoulders — the kind a messenger app makes — not a scan of a photograph.
 * And this page is a broadcast service, which had no photographs at all: it
 * drew pictures out of the same cells it drew letters with.
 *
 * So MOSAIC renders the scene fifty-four cells wide and snaps every pixel to
 * one of the eight broadcast colours. REVEAL re-renders the same scene at the
 * element's real resolution, smooth and shaded — the medium's own control for
 * hidden content, spent on showing that the picture was a model all along.
 *
 * Every material is an exact broadcast colour, so shading changes brightness
 * without changing hue. That is what keeps a lit cheek from dithering into
 * red: the quantiser is never asked to choose between two colours.
 */

const GRID_W = 54
const GRID_H = 58

const PALETTE: [number, number, number][] = [
  [0, 0, 0],
  [255, 0, 0],
  [0, 255, 0],
  [255, 255, 0],
  [0, 0, 255],
  [255, 0, 255],
  [0, 255, 255],
  [255, 255, 255],
]

/** 4x4 Bayer matrix, normalised to ±0.5, to break up the few soft edges. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => v / 16 - 0.5)

function buildFigure(): THREE.Group {
  const group = new THREE.Group()
  const flat = (colour: number) =>
    new THREE.MeshLambertMaterial({ color: colour, flatShading: true })

  // Skin and shirt carry a little of the third channel on purpose. A material
  // of pure yellow can only ever quantise to yellow or black, so the face
  // comes out as one flat disc; lifting blue to 0x70 lets the lit side cross
  // into white and the boundary become a dithered checker — which is how this
  // medium shaded anything at all.
  const skin = flat(0xffff70)
  const hair = flat(0xff00ff)
  const dark = flat(0x000000)
  const shirt = flat(0x3030ff)
  const trim = flat(0x00ffff)

  const head = new THREE.Mesh(new THREE.SphereGeometry(1.18, 16, 13), skin)
  head.scale.set(1, 1.06, 0.9)
  head.position.y = 1.5
  group.add(head)

  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), skin)
    ear.position.set(side * 1.14, 1.46, -0.06)
    ear.scale.set(0.55, 1, 0.7)
    group.add(ear)
  }

  // A shallow cap and a straight fringe. Shallow on purpose: a deep cap
  // swallows the face, and the face is the only thing this picture owes.
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(1.24, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.44),
    hair,
  )
  cap.scale.set(1, 1.02, 0.92)
  cap.position.y = 1.5
  group.add(cap)

  const fringe = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.3, 0.55), hair)
  fringe.position.set(0, 2.02, 0.62)
  fringe.rotation.x = -0.2
  group.add(fringe)

  // Two lenses with daylight between them. Set any closer and the grid welds
  // them into one black bar across the face, which is a blindfold, not a pair
  // of sunglasses.
  const lensGeometry = new THREE.BoxGeometry(0.62, 0.38, 0.14)
  for (const side of [-1, 1]) {
    const lens = new THREE.Mesh(lensGeometry, dark)
    lens.position.set(side * 0.52, 1.58, 0.94)
    lens.rotation.z = side * 0.05
    group.add(lens)
  }
  // A hairline bridge, thin enough that the gap between the lenses survives
  // quantisation as skin rather than closing up.
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, 0.1), dark)
  bridge.position.set(0, 1.6, 0.95)
  group.add(bridge)

  // Sat proud of the face, or the sphere clips it into two stray marks.
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.08, 0.1), dark)
  mouth.position.set(0, 1.04, 1.02)
  group.add(mouth)


  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.55, 10), skin)
  neck.position.y = 0.52
  group.add(neck)

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.6, 1.3, 14), shirt)
  torso.position.y = -0.4
  group.add(torso)

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.1, 6, 16), trim)
  collar.position.y = 0.3
  collar.rotation.x = Math.PI / 2
  group.add(collar)

  return group
}

export default function StylisedAvatar({ label }: { label: string }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const revealedRef = useRef(revealed)
  revealedRef.current = revealed

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const scene = new THREE.Scene()
    const figure = buildFigure()
    scene.add(figure)

    // Lit flat and from the front. Shading here separates the parts; it is not
    // asked to carry atmosphere, because eight colours cannot hold any.
    scene.add(new THREE.AmbientLight(0xffffff, 1.15))
    const key = new THREE.DirectionalLight(0xffffff, 0.95)
    key.position.set(1.6, 2.4, 5)
    scene.add(key)

    // The shading light is blue, and only blue. On a yellow face it can lift
    // nothing but the third channel, so the surfaces it reaches cross into
    // white while the rest stay yellow — one clean tone step with a dithered
    // boundary, which is precisely how this medium shaded a curve. A white
    // light would raise all three channels and leave the face flat.
    const shaper = new THREE.DirectionalLight(0x0000ff, 2.4)
    shaper.position.set(-2.6, 2.2, 3.4)
    scene.add(shaper)

    const camera = new THREE.PerspectiveCamera(32, GRID_W / GRID_H, 0.1, 100)
    camera.position.set(0, 1.32, 7.1)
    camera.lookAt(0, 1.3, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setClearColor(0x000000, 1)

    const out = document.createElement('canvas')
    out.style.width = '100%'
    out.style.height = 'auto'
    out.style.display = 'block'
    out.style.aspectRatio = `${GRID_W} / ${GRID_H}`
    out.setAttribute('role', 'img')
    out.setAttribute('aria-label', label)
    host.appendChild(out)

    const ctx = out.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    let mode: 'mosaic' | 'reveal' | null = null

    /** The two modes differ only in how many pixels the scene is given. */
    const sizeFor = (next: 'mosaic' | 'reveal') => {
      if (mode === next) return
      mode = next
      if (next === 'mosaic') {
        out.width = GRID_W
        out.height = GRID_H
        out.style.imageRendering = 'pixelated'
        renderer.setPixelRatio(1)
        renderer.setSize(GRID_W, GRID_H, false)
      } else {
        const width = Math.min(Math.round(host.clientWidth * window.devicePixelRatio), 900)
        out.width = width
        out.height = Math.round((width * GRID_H) / GRID_W)
        out.style.imageRendering = 'auto'
        renderer.setPixelRatio(1)
        renderer.setSize(out.width, out.height, false)
      }
      ctx.imageSmoothingEnabled = next === 'reveal'
    }

    sizeFor('mosaic')

    let pointerX = 0
    let pointerY = 0
    const onPointer = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    }
    window.addEventListener('pointermove', onPointer)

    let frame = 0
    const started = performance.now()

    const draw = () => {
      const t = (performance.now() - started) / 1000
      sizeFor(revealedRef.current ? 'reveal' : 'mosaic')

      // It turns towards whoever is reading it, and drifts when nobody is.
      const targetY = reduced ? 0.3 : pointerX * 0.5 + Math.sin(t * 0.55) * 0.2
      const targetX = reduced ? 0.04 : pointerY * 0.16 + Math.sin(t * 0.4) * 0.05
      figure.rotation.y += (targetY - figure.rotation.y) * 0.08
      figure.rotation.x += (targetX - figure.rotation.x) * 0.08
      figure.position.y = reduced ? 0 : Math.sin(t * 0.9) * 0.04

      renderer.render(scene, camera)
      ctx.clearRect(0, 0, out.width, out.height)
      ctx.drawImage(renderer.domElement, 0, 0, out.width, out.height)

      if (mode === 'mosaic') {
        const image = ctx.getImageData(0, 0, GRID_W, GRID_H)
        const data = image.data
        for (let y = 0; y < GRID_H; y += 1) {
          for (let x = 0; x < GRID_W; x += 1) {
            const i = (y * GRID_W + x) * 4
            const bias = BAYER[(y % 4) * 4 + (x % 4)] * 42
            const r = data[i] + bias
            const g = data[i + 1] + bias
            const b = data[i + 2] + bias

            let best = 0
            let bestDistance = Infinity
            for (let p = 0; p < PALETTE.length; p += 1) {
              const [pr, pg, pb] = PALETTE[p]
              const distance = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2
              if (distance < bestDistance) {
                bestDistance = distance
                best = p
              }
            }
            data[i] = PALETTE[best][0]
            data[i + 1] = PALETTE[best][1]
            data[i + 2] = PALETTE[best][2]
          }
        }
        ctx.putImageData(image, 0, 0)
      }

      frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointer)
      out.remove()
      renderer.dispose()
      scene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry.dispose()
          ;(node.material as THREE.Material).dispose()
        }
      })
    }
  }, [label])

  return (
    <div>
      <div
        ref={hostRef}
        style={{
          border: `${cells(0.16)} solid ${TT.blue}`,
          background: TT.black,
          lineHeight: 0,
        }}
      />
      <button
        type="button"
        onClick={() => setRevealed((value) => !value)}
        aria-pressed={revealed}
        style={{
          width: '100%',
          background: revealed ? TT.white : TT.cyan,
          color: TT.black,
          border: 0,
          fontFamily: 'inherit',
          fontSize: 'var(--t-xs)',
          padding: `${cells(0.45)} ${cells(0.5)}`,
          minHeight: 'max(44px, calc(var(--cell) * 2))',
          cursor: 'pointer',
          marginTop: cells(0.16),
        }}
      >
        {revealed ? 'BACK TO MOSAIC' : 'REVEAL THE MODEL'}
      </button>
    </div>
  )
}
