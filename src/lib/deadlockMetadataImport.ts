import type { Hero } from '../types'

/** Fuente de metadata local al juego (Simon / leamare). */
export const DEADLOCK_METADATA_HEROES_BASE_URL =
  'https://raw.githubusercontent.com/leamare/deadlock-metadata/main/heroes/base.json'

export const deadlockAssetsHeroUrl = (numericId: number) =>
  `https://assets.deadlock-api.com/v2/heroes/${numericId}`

export interface MetadataHeroRow {
  tag: string
  internal_tag: string
  name: string
  alt_name: string | null
  status: string
}

interface AssetsHeroImages {
  icon_image_small?: string
  icon_hero_card?: string
}

interface AssetsHeroPayload {
  id: number
  name: string
  hero_type?: string
  images?: AssetsHeroImages
  description?: {
    lore?: string
    role?: string
    playstyle?: string
  }
}

function heroPlaceholderImage(name: string): string {
  const short = name.slice(0, 10)
  return `https://placehold.co/128x128/1a1d28/a78bfa?text=${encodeURIComponent(short)}`
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

async function fetchHeroAssetsSafe(
  numericId: number,
): Promise<AssetsHeroPayload | null> {
  try {
    return await fetchJson<AssetsHeroPayload>(deadlockAssetsHeroUrl(numericId))
  } catch {
    return null
  }
}

async function promisePool<T, R>(
  items: readonly T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>,
  onChunkDone?: (doneCount: number, total: number) => void,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let cursor = 0
  let finished = 0
  const total = items.length

  async function worker() {
    while (true) {
      const idx = cursor++
      if (idx >= total) break
      results[idx] = await mapper(items[idx], idx)
      finished++
      onChunkDone?.(finished, total)
    }
  }

  const n = Math.max(1, Math.min(concurrency, total || 1))
  await Promise.all(Array.from({ length: n }, () => worker()))
  return results
}

function rowAndAssetToHero(
  metaKey: string,
  row: MetadataHeroRow,
  asset: AssetsHeroPayload | null,
): Hero {
  const numericId = Number(metaKey)
  const descriptionParts: string[] = []
  if (asset?.description?.role) descriptionParts.push(asset.description.role)
  if (asset?.description?.playstyle) {
    descriptionParts.push(asset.description.playstyle)
  }
  const description =
    descriptionParts.join('\n\n') ||
    `${row.internal_tag} · datos desde deadlock-metadata`

  const role =
    typeof row.alt_name === 'string' && row.alt_name.trim()
      ? row.alt_name
      : asset?.hero_type
        ? asset.hero_type.replace(/_/g, ' ')
        : undefined

  const image =
    asset?.images?.icon_image_small ??
    asset?.images?.icon_hero_card ??
    heroPlaceholderImage(row.name)

  return {
    id: `dm-${metaKey}`,
    name: row.name,
    image,
    description,
    role,
    notes: `Importado · deadlock-metadata game id ${numericId} · ${row.internal_tag}`,
  }
}

export interface BuildHeroesFromMetadataOptions {
  /** Si true, incluye héroes con status `in_devel` además de `available`. */
  includeInDevelopment: boolean
  /** Llamado al avanzar descargas (assets API). */
  onProgress?: (done: number, total: number) => void
  /** Peticiones paralelas a la Assets API (default 6). */
  concurrency?: number
}

/**
 * Descarga heroes/base.json de deadlock-metadata y enriquece con
 * Assets API deadlock-api.com /v2/heroes/{id}.
 */
export async function buildHeroesFromDeadlockMetadata(
  opts: BuildHeroesFromMetadataOptions,
): Promise<Hero[]> {
  const raw = await fetchJson<Record<string, MetadataHeroRow>>(
    DEADLOCK_METADATA_HEROES_BASE_URL,
  )

  const entries = Object.entries(raw).filter(([key, row]) => {
    if (!Number.isFinite(Number(key))) return false
    if (row.status === 'available') return true
    if (opts.includeInDevelopment && row.status === 'in_devel') return true
    return false
  })

  const concurrency = opts.concurrency ?? 6

  const heroes = await promisePool(
    entries,
    concurrency,
    async ([key, row]) => {
      const asset = await fetchHeroAssetsSafe(Number(key))
      return rowAndAssetToHero(key, row, asset)
    },
    (done, t) => {
      opts.onProgress?.(done, t)
    },
  )

  heroes.sort((a, b) =>
    a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }),
  )

  return heroes
}
