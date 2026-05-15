/**
 * Analytics público de Deadlock API (stats agregadas de partidas, no assets del juego).
 * Docs: https://api.deadlock-api.com/docs
 */

export const DEADLOCK_ANALYTICS_HERO_STATS_URL =
  'https://api.deadlock-api.com/v1/analytics/hero-stats'

export interface AnalyticsHeroStatRow {
  hero_id: number
  wins: number
  losses: number
  matches: number
}

/** Extrae el id numérico de héroe desde `dm-27` → 27 */
export function parseDmHeroNumericId(heroId: string): number | null {
  const m = /^dm-(\d+)$/.exec(heroId.trim())
  if (!m) return null
  const n = Number(m[1])
  return Number.isFinite(n) ? n : null
}

export function winRateFromRow(row: AnalyticsHeroStatRow): number {
  const d = row.wins + row.losses
  if (d <= 0) return 0
  return (row.wins / d) * 100
}

let cachedMap: Map<number, AnalyticsHeroStatRow> | null = null
let inflight: Promise<Map<number, AnalyticsHeroStatRow>> | null = null

/**
 * Una petición por carga de página (compartida); mapa cacheado en memoria.
 */
export function fetchHeroStatsMap(): Promise<Map<number, AnalyticsHeroStatRow>> {
  if (cachedMap) return Promise.resolve(cachedMap)
  if (inflight) return inflight

  inflight = (async () => {
    try {
      const url = new URL(DEADLOCK_ANALYTICS_HERO_STATS_URL)
      url.searchParams.set('game_mode', 'normal')
      const res = await fetch(url.toString())
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
      }
      const rows = (await res.json()) as AnalyticsHeroStatRow[]
      const map = new Map<number, AnalyticsHeroStatRow>()
      for (const r of rows) {
        if (typeof r.hero_id === 'number') map.set(r.hero_id, r)
      }
      cachedMap = map
      return map
    } finally {
      inflight = null
    }
  })()

  return inflight
}

/** Solo para tests */
export function __resetHeroStatsCacheForTests(): void {
  cachedMap = null
  inflight = null
}
