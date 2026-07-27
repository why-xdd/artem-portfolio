import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
  createBrandEnvironment,
  chromeMaterial,
  graphiteMaterial,
  accentMaterial,
} from '../three/environment'

/**
 * Four 3D objects parked in the corners of the About section, replacing the
 * flat renders that used to sit there. One canvas covers the whole section
 * rather than four separate ones, because each WebGL context is expensive and
 * browsers cap how many a page may hold.
 *
 * Scroll drives rotation, so the objects turn as the section passes rather
 * than spinning on a timer of their own.
 */
type Variant = 'corners' | 'edges'

export default function DecorScene({
  className = '',
  variant = 'corners',
}: {
  className?: string
  /** `corners` frames a centred block; `edges` hugs the sides of a tall list. */
  variant?: Variant
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0, 10)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    container.appendChild(renderer.domElement)

    const env = createBrandEnvironment(renderer)
    scene.environment = env

    const light = new THREE.DirectionalLight(0xffffff, 1.2)
    light.position.set(2, 4, 5)
    scene.add(light)
    scene.add(new THREE.AmbientLight(0x3a4450, 0.7))

    const chrome = chromeMaterial(env)
    const graphite = graphiteMaterial(env)
    const accent = accentMaterial(env, 0x7621b0)
    const disposables: Array<{ dispose: () => void }> = [env, chrome, graphite, accent]

    // Corner anchors in normalised space; converted to world units on resize so
    // the objects stay pinned to the section's corners at any viewport.
    const items: Array<{
      mesh: THREE.Mesh
      anchor: [number, number]
      scale: number
      spin: [number, number]
      float: number
    }> = []

    function add(
      geo: THREE.BufferGeometry,
      mat: THREE.Material,
      anchor: [number, number],
      scale: number,
      spin: [number, number],
      float: number,
    ) {
      disposables.push(geo)
      const mesh = new THREE.Mesh(geo, mat)
      scene.add(mesh)
      items.push({ mesh, anchor, scale, spin, float })
    }

    // Anchors stay inside ±0.78 so the widest object still clears the edge.
    if (variant === 'corners') {
      add(new THREE.TorusKnotGeometry(0.55, 0.17, 220, 32), chrome, [-0.74, 0.6], 1, [0.3, 0.5], 0.16)
      add(new THREE.IcosahedronGeometry(0.72, 0), accent, [0.76, 0.6], 1, [-0.25, 0.4], 0.2)
      add(new THREE.OctahedronGeometry(0.7, 0), graphite, [-0.7, -0.6], 1, [0.4, -0.3], 0.14)
      add(new THREE.TorusGeometry(0.6, 0.19, 32, 140), chrome, [0.72, -0.6], 1, [0.35, 0.45], 0.18)
    } else {
      // Spread down both sides so a long scrolling list keeps company without
      // anything drifting over the cards.
      add(new THREE.TorusGeometry(0.5, 0.16, 32, 140), chrome, [-0.78, 0.72], 0.9, [0.3, 0.5], 0.16)
      add(new THREE.OctahedronGeometry(0.58, 0), accent, [0.8, 0.3], 0.9, [-0.3, 0.4], 0.2)
      add(new THREE.IcosahedronGeometry(0.52, 0), graphite, [-0.8, -0.12], 0.9, [0.35, -0.3], 0.14)
      add(new THREE.TorusKnotGeometry(0.4, 0.13, 180, 28), chrome, [0.78, -0.68], 0.9, [0.4, 0.45], 0.18)
    }

    function resize() {
      const w = container!.clientWidth
      const h = container!.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()

      const vh = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
      const vw = vh * camera.aspect
      // Shrink the objects on narrow screens so they frame the text instead of
      // covering it.
      const s = Math.min(1, w / 1100) * 0.55 + 0.45

      for (const it of items) {
        it.mesh.position.x = (it.anchor[0] * vw) / 2
        it.mesh.position.y = (it.anchor[1] * vh) / 2
        it.mesh.scale.setScalar(it.scale * s)
      }
    }
    resize()
    window.addEventListener('resize', resize)

    let scrollProgress = 0
    let frame = 0
    function readScroll() {
      frame = 0
      const rect = container!.getBoundingClientRect()
      // 0 as the section enters the viewport, 1 as it leaves.
      scrollProgress =
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(readScroll)
    }
    readScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const started = performance.now()
    let raf = requestAnimationFrame(function render(now) {
      const t = (now - started) / 1000
      for (const it of items) {
        if (reduce) {
          it.mesh.rotation.set(0.4, 0.6, 0)
        } else {
          it.mesh.rotation.x = scrollProgress * Math.PI * 2 * it.spin[0] + t * 0.08
          it.mesh.rotation.y = scrollProgress * Math.PI * 2 * it.spin[1] + t * 0.12
          it.mesh.position.z = Math.sin(t * 0.5 + it.anchor[0]) * it.float
        }
      }
      renderer.render(scene, camera)
      raf = requestAnimationFrame(render)
    })

    return () => {
      cancelAnimationFrame(raf)
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      for (const d of disposables) d.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [variant])

  return <div ref={containerRef} className={className} aria-hidden="true" />
}
