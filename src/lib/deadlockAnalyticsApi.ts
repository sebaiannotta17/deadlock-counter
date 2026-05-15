/**
 * Analytics público de Deadlock API (stats agregadas de partidas, no assets del juego).
 * Docs: https://api.deadlock-api.com/docs
 */

export const DEADLOCK_ANALYTICS_HERO_STATS_URL =
  'https://api.deadlock-api.com/v1/analytics/hero-stats'
export const DEADLOCK_ANALYTICS_HERO_BAN_STATS_URL =
  'https://api.deadlock-api.com/v1/analytics/hero-ban-stats'
export const DEADLOCK_ANALYTICS_GAME_STATS_URL =
  'https://api.deadlock-api.com/v1/analytics/game-stats'

const GAME_MODE_NORMAL = 'normal'
const PLAYERS_PER_MATCH = 12

export interface AnalyticsHeroStatRow {
  hero_id: number
  wins: number
  losses: number
  matches: number
}

export interface AnalyticsGameStatBucket {
  bucket: number
  total_matches: number
}

export interface AnalyticsBanRow {
  hero_id: number
  bans: number
}

/** Top 10 y 11–20 por WR global en el pool; el resto “chill”. */
export type WrTier = 'top10' | 'mid10' | 'rest'

export interface EnrichedHeroStat {
  heroId: number
  wins: number
  losses: number
  matches: number
  bans: number
  winRate: number
  /** Aprox. % de slots de héroe en partidas normal que son este héroe */
  pickRate: number
  /** % de todos los eventos de ban agregados que corresponden a este héroe */
  banShare: number
  wrRank: number
  wrTier: WrTier
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

function withGameMode(url: string): string {
  const u = new URL(url)
  u.searchParams.set('game_mode', GAME_MODE_NORMAL)
  return u.toString()
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

export function buildEnrichedHeroStats(
  heroMap: Map<number, AnalyticsHeroStatRow>,
  banMap: Map<number, number>,
  totalMatches: number,
): Map<number, EnrichedHeroStat> {
  const totalBanCount = [...banMap.values()].reduce((a, b) => a + b, 0)
  const denomPick = totalMatches * PLAYERS_PER_MATCH

  const sorted = [...heroMap.entries()]
    .map(([heroId, row]) => ({
      heroId,
      winRate: winRateFromRow(row),
    }))
    .sort((a, b) => {
      if (b.winRate !== a.winRate) return b.winRate - a.winRate
      return a.heroId - b.heroId
    })

  const rankByHeroId = new Map<number, number>()
  sorted.forEach((x, i) => rankByHeroId.set(x.heroId, i + 1))

  const out = new Map<number, EnrichedHeroStat>()
  for (const [heroId, row] of heroMap) {
    const rank = rankByHeroId.get(heroId) ?? 999
    let wrTier: WrTier = 'rest'
    if (rank <= 10) wrTier = 'top10'
    else if (rank <= 20) wrTier = 'mid10'

    const bans = banMap.get(heroId) ?? 0
    out.set(heroId, {
      heroId,
      wins: row.wins,
      losses: row.losses,
      matches: row.matches,
      bans,
      winRate: winRateFromRow(row),
      pickRate:
        denomPick > 0 ? (row.matches / denomPick) * 100 : 0,
      banShare:
        totalBanCount > 0 ? (bans / totalBanCount) * 100 : 0,
      wrRank: rank,
      wrTier,
    })
  }
  return out
}

export interface LaneAnalyticsBundle {
  enrichedByHeroId: Map<number, EnrichedHeroStat>
}

let cachedBundle: LaneAnalyticsBundle | null = null
let inflight: Promise<LaneAnalyticsBundle> | null = null

export async function fetchLaneAnalyticsBundle(): Promise<LaneAnalyticsBundle> {
  if (cachedBundle) return cachedBundle
  if (inflight) return inflight

  inflight = (async () => {
    try {
      const [heroRows, banRows, gameRows] = await Promise.all([
        fetchJson<AnalyticsHeroStatRow[]>(
          withGameMode(DEADLOCK_ANALYTICS_HERO_STATS_URL),
        ),
        fetchJson<AnalyticsBanRow[]>(
          withGameMode(DEADLOCK_ANALYTICS_HERO_BAN_STATS_URL),
        ),
        fetchJson<AnalyticsGameStatBucket[]>(
          withGameMode(DEADLOCK_ANALYTICS_GAME_STATS_URL),
        ),
      ])

      const heroMap = new Map<number, AnalyticsHeroStatRow>()
      for (const r of heroRows) {
        if (typeof r.hero_id === 'number') heroMap.set(r.hero_id, r)
      }
      const banMap = new Map<number, number>()
      for (const r of banRows) {
        if (typeof r.hero_id === 'number')
          banMap.set(r.hero_id, r.bans ?? 0)
      }
      const totalMatches =
        gameRows[0]?.total_matches && gameRows[0].total_matches > 0
          ? gameRows[0].total_matches
          : 1

      const enrichedByHeroId = buildEnrichedHeroStats(
        heroMap,
        banMap,
        totalMatches,
      )
      cachedBundle = { enrichedByHeroId }
      return cachedBundle
    } finally {
      inflight = null
    }
  })()

  return inflight
}

/** Compat: mapa crudo de hero-stats (si hiciera falta); preferí `fetchLaneAnalyticsBundle`. */
export function fetchHeroStatsMap(): Promise<Map<number, AnalyticsHeroStatRow>> {
  return fetchLaneAnalyticsBundle().then((b) => {
    const raw = new Map<number, AnalyticsHeroStatRow>()
    for (const [id, e] of b.enrichedByHeroId) {
      raw.set(id, {
        hero_id: id,
        wins: e.wins,
        losses: e.losses,
        matches: e.matches,
      })
    }
    return raw
  })
}

export function __resetHeroStatsCacheForTests(): void {
  cachedBundle = null
  inflight = null
}
