/**
 * Single place that decides whether the hero shows a generated avatar or the
 * procedural chrome cluster.
 *
 * Drop a .glb at src/assets/avatar.glb and it is picked up automatically:
 * Vite's `import.meta.glob` resolves it at build time, so no import breaks
 * while the file is absent.
 */
const found = import.meta.glob('./assets/avatar.glb', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

export const AVATAR_URL: string | undefined = Object.values(found)[0]
