import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
  createBrandEnvironment,
  chromeMaterial,
  graphiteMaterial,
  accentMaterial,
} from '../three/environment'

type Props = {
  /**
   * Optional .glb to display instead of the procedural cluster. Dropped in as
   * soon as the avatar exists; the component needs no other change.
   */
  modelUrl?: string
  className?: string
}

/**
 * The hero centrepiece: a real 3D scene lit by a procedurally built
 * environment map, so every surface reflects the site's own palette.
 *
 * With `modelUrl` it frames and displays that model. Without one it builds a
 * chrome cluster that orbits the centre. Either way the group leans toward the
 * pointer and drifts continuously, and everything stops under reduced motion.
 */
export default function HeroObject({ modelUrl, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    // The hero slot is portrait-shaped, so the horizontal frustum is the tight
    // constraint. Everything below is sized to stay inside it at this distance.
    camera.position.set(0, 0, 8.4)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)

    const env = createBrandEnvironment(renderer)
    scene.environment = env

    // A dim key light adds shading on top of the reflections so silhouettes
    // stay legible where the environment happens to be dark.
    const key = new THREE.DirectionalLight(0xffffff, 1.4)
    key.position.set(3, 5, 4)
    scene.add(key)
    scene.add(new THREE.AmbientLight(0x404a55, 0.6))

    const group = new THREE.Group()
    scene.add(group)

    const disposables: Array<{ dispose: () => void }> = [env]
    let mixer: THREE.AnimationMixer | null = null
    // Satellites orbit; the main body only drifts.
    const orbiters: Array<{
      mesh: THREE.Object3D
      radius: number
      speed: number
      phase: number
      tilt: number
      spin: number
    }> = []

    function buildProceduralCluster() {
      const chrome = chromeMaterial(env)
      const graphite = graphiteMaterial(env)
      const accent = accentMaterial(env)
      disposables.push(chrome, graphite, accent)

      const coreGeo = new THREE.IcosahedronGeometry(1.35, 1)
      const core = new THREE.Mesh(coreGeo, chrome)
      group.add(core)
      disposables.push(coreGeo)

      const shellGeo = new THREE.TorusGeometry(1.95, 0.07, 24, 160)
      const shell = new THREE.Mesh(shellGeo, chrome)
      shell.rotation.x = Math.PI / 2.6
      group.add(shell)
      disposables.push(shellGeo)
      orbiters.push({ mesh: shell, radius: 0, speed: 0.22, phase: 0, tilt: 0, spin: 0.3 })

      const shell2Geo = new THREE.TorusGeometry(2.32, 0.042, 20, 160)
      const shell2 = new THREE.Mesh(shell2Geo, graphite)
      shell2.rotation.x = Math.PI / 1.7
      shell2.rotation.z = 0.5
      group.add(shell2)
      disposables.push(shell2Geo)
      orbiters.push({ mesh: shell2, radius: 0, speed: -0.16, phase: 0, tilt: 0, spin: -0.22 })

      const satShapes = [
        new THREE.IcosahedronGeometry(0.3, 0),
        new THREE.TorusKnotGeometry(0.22, 0.075, 90, 14),
        new THREE.BoxGeometry(0.42, 0.42, 0.42),
        new THREE.OctahedronGeometry(0.34, 0),
        new THREE.SphereGeometry(0.26, 32, 32),
      ]
      satShapes.forEach((geo, i) => {
        disposables.push(geo)
        const mat = i === 2 ? accent : i % 2 === 0 ? chrome : graphite
        const mesh = new THREE.Mesh(geo, mat)
        group.add(mesh)
        orbiters.push({
          mesh,
          radius: 1.95 + (i % 3) * 0.3,
          speed: 0.18 + i * 0.045,
          phase: (i / satShapes.length) * Math.PI * 2,
          tilt: 0.35 + i * 0.22,
          spin: 0.6 + i * 0.2,
        })
      })
    }

    let disposed = false

    if (modelUrl) {
      new GLTFLoader().load(
        modelUrl,
        (gltf) => {
          if (disposed) return
          const model = gltf.scene

          // Frame whatever arrives: centre it and scale to a known height so a
          // bust and a full body both sit correctly without hand-tuning.
          const box = new THREE.Box3().setFromObject(model)
          const size = box.getSize(new THREE.Vector3())
          const centre = box.getCenter(new THREE.Vector3())
          const scale = 3.4 / Math.max(size.y, 0.001)
          model.scale.setScalar(scale)
          model.position.sub(centre.multiplyScalar(scale))

          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              const mat = child.material as THREE.MeshStandardMaterial
              if (mat) {
                mat.envMap = env
                mat.envMapIntensity = 1.25
                mat.needsUpdate = true
              }
            }
          })

          group.add(model)

          if (gltf.animations.length && !reduce) {
            mixer = new THREE.AnimationMixer(model)
            mixer.clipAction(gltf.animations[0]).play()
          }
        },
        undefined,
        () => {
          // A missing or broken model must not leave an empty hero.
          if (!disposed) buildProceduralCluster()
        },
      )
    } else {
      buildProceduralCluster()
    }

    let targetRotX = 0
    let targetRotY = 0

    function onPointerMove(e: PointerEvent) {
      const px = e.clientX / window.innerWidth - 0.5
      const py = e.clientY / window.innerHeight - 0.5
      targetRotY = px * 0.9
      targetRotX = py * 0.45
    }

    function resize() {
      const w = container!.clientWidth
      const h = container!.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()

    if (!reduce) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
    }
    window.addEventListener('resize', resize)

    const started = performance.now()
    let last = started
    let raf = requestAnimationFrame(function render(now) {
      const t = (now - started) / 1000
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      if (!reduce) {
        group.rotation.y += (targetRotY - group.rotation.y) * 0.05
        group.rotation.x += (targetRotX - group.rotation.x) * 0.05
        group.position.y = Math.sin(t * 0.6) * 0.12

        for (const o of orbiters) {
          if (o.radius > 0) {
            const a = t * o.speed + o.phase
            o.mesh.position.set(
              Math.cos(a) * o.radius,
              Math.sin(a * 1.3 + o.tilt) * 0.85,
              Math.sin(a) * o.radius,
            )
          }
          o.mesh.rotation.x += o.spin * dt * 0.6
          o.mesh.rotation.y += o.spin * dt
        }

        mixer?.update(dt)
      }

      renderer.render(scene, camera)
      raf = requestAnimationFrame(render)
    })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', resize)
      for (const d of disposables) d.dispose()
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose?.()
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [modelUrl])

  return <div ref={containerRef} className={className} aria-hidden="true" />
}
