import * as THREE from 'three'

/**
 * Builds an environment map from a small procedural room instead of loading an
 * HDRI. A 1k HDR costs ~1.6 MB and gives generic studio reflections; this costs
 * nothing to download and puts the site's own magenta and cyan into every
 * chrome surface, which is what makes the models look like they belong here.
 *
 * The returned texture must be disposed by the caller.
 */
export function createBrandEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0c0c0c)

  const panel = (
    color: number,
    intensity: number,
    w: number,
    h: number,
    pos: [number, number, number],
    lookAt: [number, number, number] = [0, 0, 0],
  ) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(intensity),
        side: THREE.DoubleSide,
      }),
    )
    mesh.position.set(...pos)
    mesh.lookAt(...lookAt)
    scene.add(mesh)
    return mesh
  }

  // Key light, cool and broad: the main highlight running down chrome edges.
  panel(0x8fd8ff, 5.2, 12, 12, [-7, 4, 5])
  // Magenta rim from behind, straight out of the CTA gradient.
  panel(0xb600a8, 6.5, 10, 10, [6, 1, -6])
  // Violet fill, low and wide.
  panel(0x7621b0, 3.4, 14, 6, [4, -5, 4])
  // Small warm accent so the palette is not purely cool.
  panel(0xbe4c00, 2.6, 4, 4, [-4, -3, -6])
  // Soft top bounce keeps upper surfaces from going black.
  panel(0xffffff, 1.1, 16, 16, [0, 9, 0], [0, 0, 0])

  const pmrem = new THREE.PMREMGenerator(renderer)
  pmrem.compileEquirectangularShader()
  const target = pmrem.fromScene(scene, 0.04)

  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose()
      ;(obj.material as THREE.Material).dispose()
    }
  })
  pmrem.dispose()

  return target.texture
}

/** Polished chrome. Reads almost entirely as reflected environment. */
export function chromeMaterial(env: THREE.Texture) {
  return new THREE.MeshPhysicalMaterial({
    color: 0xdfe6ec,
    metalness: 1,
    roughness: 0.08,
    envMap: env,
    envMapIntensity: 1.5,
  })
}

/** Darker brushed metal, for objects that should sit back rather than pop. */
export function graphiteMaterial(env: THREE.Texture) {
  return new THREE.MeshPhysicalMaterial({
    color: 0x2a2d33,
    metalness: 0.95,
    roughness: 0.28,
    envMap: env,
    envMapIntensity: 1.2,
  })
}

/**
 * Coloured accent metal with a clearcoat and iridescence.
 *
 * Deliberately not `transmission`-based glass: the canvas is alpha-transparent
 * with nothing behind it, so a transmissive material has nothing to refract and
 * renders as a flat silhouette.
 */
export function accentMaterial(env: THREE.Texture, color = 0x7621b0) {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.9,
    roughness: 0.12,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    iridescence: 0.8,
    iridescenceIOR: 1.8,
    envMap: env,
    envMapIntensity: 1.7,
  })
}
