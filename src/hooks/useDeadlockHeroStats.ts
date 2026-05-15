import { useEffect, useState } from 'react'
import type { EnrichedHeroStat } from '../lib/deadlockAnalyticsApi'
import { fetchLaneAnalyticsBundle } from '../lib/deadlockAnalyticsApi'

export function useDeadlockHeroStats() {
  const [enrichedByHeroId, setEnrichedByHeroId] = useState<Map<
    number,
    EnrichedHeroStat
  > | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchLaneAnalyticsBundle()
      .then((b) => {
        if (!cancelled) {
          setEnrichedByHeroId(b.enrichedByHeroId)
          setLoading(false)
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setEnrichedByHeroId(null)
          setLoading(false)
          setError(e instanceof Error ? e.message : 'fetch failed')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { enrichedByHeroId, loading, error }
}
