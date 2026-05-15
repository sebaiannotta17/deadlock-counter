import { useEffect, useState } from 'react'
import type { AnalyticsHeroStatRow } from '../lib/deadlockAnalyticsApi'
import { fetchHeroStatsMap } from '../lib/deadlockAnalyticsApi'

export function useDeadlockHeroStats() {
  const [map, setMap] = useState<Map<number, AnalyticsHeroStatRow> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchHeroStatsMap()
      .then((m) => {
        if (!cancelled) {
          setMap(m)
          setLoading(false)
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setMap(null)
          setLoading(false)
          setError(e instanceof Error ? e.message : 'fetch failed')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { statsByHeroId: map, loading, error }
}
