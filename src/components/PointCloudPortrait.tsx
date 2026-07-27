import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

type Props = {
  src: string
  className?: string
  /** Sampling grid width; height follows the image aspect. */
  columns?: number
  /** How far the brightest pixels push toward the camera, in world units. */
  depth?: number
  /** Pixels below this alpha are background and never become particles. */
  alphaCutoff?: number
}

/**
 * Turns the cut-out portrait into a cloud of points in real 3D: each sampled
 * pixel becomes a particle pushed along Z by its own brightness, so the face
 * gains actual relief. The cloud tilts with the pointer, which is what
 * separates this from a CSS filter.
 *
 * Colour is remapped onto the same steel ramp as the hero heading, so the
 * portrait reads as part of the page rather than a photo dropped into it.
 */
export default function PointCloudPortrait({
  src,
  className = '',
  columns = 200,
  depth = 0.5,
  alphaCutoff = 0.5,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let disposed = false
    let cleanupScene: (() => void) | undefined

    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = src
    image.onerror = () => !disposed && setFailed(true)

    image.onload = () => {
      if (disposed) return

      const aspect = image.height / image.width
      const cols = columns
      const rows = Math.max(1, Math.round(cols * aspect))

      const sampler = document.createElement('canvas')
      sampler.width = cols
      sampler.height = rows
      const sctx = sampler.getContext('2d', { willReadFrequently: true })!
      sctx.clearRect(0, 0, cols, rows)
      sctx.drawImage(image, 0, 0, cols, rows)
      const data = sctx.getImageData(0, 0, cols, rows).data

      const positions: number[] = []
      const colors: number[] = []
      const seeds: number[] = []

      const planeW = 3.2
      const planeH = planeW * aspect

      // Ends of the steel ramp, matching the .hero-heading gradient.
      const DARK = [0.24, 0.27, 0.32]
      const LIGHT = [0.78, 0.85, 0.9]

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4
          const a = data[i + 3] / 255
          if (a < alphaCutoff) continue

          const R = data[i] / 255
          const G = data[i + 1] / 255
          const B = data[i + 2] / 255
          const lum = 0.2126 * R + 0.7152 * G + 0.0722 * B

          const u = x / (cols - 1)
          const v = y / (rows - 1)

          positions.push(
            (u - 0.5) * planeW,
            -(v - 0.5) * planeH,
            (lum - 0.45) * depth * 2,
          )

          // Ramp keeps the black shirt visible against the near-black page,
          // then a little of the original colour returns so the blue lenses
          // still read as blue.
          // Gamma below 1 lifts the shirt and hair out of the near-black page
          // without blowing out the face.
          const t = Math.pow(lum, 0.55)
          colors.push(
            (DARK[0] + (LIGHT[0] - DARK[0]) * t) * 0.82 + R * 0.18,
            (DARK[1] + (LIGHT[1] - DARK[1]) * t) * 0.82 + G * 0.18,
            (DARK[2] + (LIGHT[2] - DARK[2]) * t) * 0.82 + B * 0.18,
          )
          seeds.push(Math.random())
        }
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3),
      )
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
      geometry.setAttribute('aSeed', new THREE.Float32BufferAttribute(seeds, 1))

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uSize: { value: 3.1 * Math.min(window.devicePixelRatio, 2) },
          uTime: { value: 0 },
          uDisperse: { value: 0 },
        },
        vertexShader: /* glsl */ `
          attribute float aSeed;
          uniform float uSize;
          uniform float uTime;
          uniform float uDisperse;
          varying vec3 vColor;

          void main() {
            vColor = color;
            vec3 pos = position;

            // Constant low drift keeps the cloud alive when idle.
            pos.z += sin(uTime * 0.7 + aSeed * 12.0) * 0.018;

            // Hovering scatters particles along their own random direction.
            float a = aSeed * 6.2831;
            pos.x += cos(a) * uDisperse * (0.3 + aSeed * 0.5);
            pos.y += sin(a) * uDisperse * (0.3 + aSeed * 0.5);
            pos.z += (aSeed - 0.5) * uDisperse * 2.0;

            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = uSize * (1.0 / -mv.z) * 2.6;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec3 vColor;
          void main() {
            // Round the square point sprite into a soft dot.
            vec2 c = gl_PointCoord - 0.5;
            float d = dot(c, c);
            if (d > 0.25) discard;
            gl_FragColor = vec4(vColor, smoothstep(0.25, 0.04, d));
          }
        `,
        transparent: true,
        depthWrite: false,
        vertexColors: true,
      })

      const points = new THREE.Points(geometry, material)
      const scene = new THREE.Scene()
      scene.add(points)

      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
      camera.position.set(0, 0, 4)

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      container.appendChild(renderer.domElement)

      function resize() {
        const w = container!.clientWidth
        const h = container!.clientHeight
        if (!w || !h) return
        renderer.setSize(w, h)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      resize()

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      let targetRotX = 0
      let targetRotY = 0
      let targetDisperse = 0

      function onPointerMove(e: PointerEvent) {
        const b = container!.getBoundingClientRect()
        const inside =
          e.clientX >= b.left &&
          e.clientX <= b.right &&
          e.clientY >= b.top &&
          e.clientY <= b.bottom
        targetDisperse = inside ? 0.1 : 0

        // Track across the whole window so the head follows you around.
        const px = (e.clientX - (b.left + b.width / 2)) / window.innerWidth
        const py = (e.clientY - (b.top + b.height / 2)) / window.innerHeight
        targetRotY = px * 0.45
        targetRotX = py * 0.28
      }

      if (!reduce) {
        window.addEventListener('pointermove', onPointerMove, { passive: true })
      }
      window.addEventListener('resize', resize)

      const started = performance.now()
      let raf = requestAnimationFrame(function render() {
        material.uniforms.uTime.value = (performance.now() - started) / 1000
        const d = material.uniforms.uDisperse
        d.value += (targetDisperse - d.value) * 0.07
        points.rotation.y += (targetRotY - points.rotation.y) * 0.06
        points.rotation.x += (targetRotX - points.rotation.x) * 0.06
        renderer.render(scene, camera)
        raf = requestAnimationFrame(render)
      })

      cleanupScene = () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('resize', resize)
        geometry.dispose()
        material.dispose()
        renderer.dispose()
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement)
        }
      }
    }

    return () => {
      disposed = true
      cleanupScene?.()
    }
  }, [src, columns, depth, alphaCutoff])

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center border border-dashed border-[#D7E2EA]/25 ${className}`}
      >
        <span className="px-4 text-center text-xs tracking-widest text-[#D7E2EA]/40 uppercase">
          portrait unavailable
        </span>
      </div>
    )
  }

  return <div ref={containerRef} className={className} aria-hidden="true" />
}
