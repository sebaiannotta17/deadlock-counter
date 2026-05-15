import type { Hero } from '../types'
import type { EnrichedHeroStat } from '../lib/deadlockAnalyticsApi'
import { parseDmHeroNumericId } from '../lib/deadlockAnalyticsApi'
import { HeroSelector } from './HeroSelector'
import { HeroCard } from './HeroCard'
import { HeroLaneStats } from './HeroLaneStats'
import { useI18n } from '../hooks/useI18n'

interface EnemySelectorProps {
  heroes: Hero[]
  playerHeroId: string | null
  enemyOne: Hero | null
  enemyTwo: Hero | null
  onSelectSlot: (slot: 0 | 1, hero: Hero | null) => void
  enrichedByHeroId: Map<number, EnrichedHeroStat> | null
  statsLoading: boolean
  statsError: string | null
}

function resolveEnriched(
  hero: Hero | null,
  enrichedByHeroId: Map<number, EnrichedHeroStat> | null,
): EnrichedHeroStat | null {
  if (!hero || !enrichedByHeroId) return null
  const n = parseDmHeroNumericId(hero.id)
  if (n === null) return null
  return enrichedByHeroId.get(n) ?? null
}

export function EnemySelector({
  heroes,
  playerHeroId,
  enemyOne,
  enemyTwo,
  onSelectSlot,
  enrichedByHeroId,
  statsLoading,
  statsError,
}: EnemySelectorProps) {
  const { t } = useI18n()
  const exclude1 = new Set(
    [playerHeroId, enemyTwo?.id].filter(Boolean) as string[],
  )
  const exclude2 = new Set(
    [playerHeroId, enemyOne?.id].filter(Boolean) as string[],
  )

  return (
    <div className="space-y-6">
      {statsError ? (
        <p className="rounded-xl border border-amber-500/35 bg-amber-950/25 px-4 py-2 text-sm text-amber-100">
          {t('match.stats.error')} <span className="font-mono text-amber-200/90">{statsError}</span>
        </p>
      ) : null}
      {statsLoading ? (
        <p className="text-sm text-slate-500">{t('match.stats.loading')}</p>
      ) : null}
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <HeroSelector
          title={t('enemy.slot1')}
          heroes={heroes}
          selectedId={enemyOne?.id ?? null}
          onSelect={(h) => {
            if (enemyTwo?.id === h.id) onSelectSlot(1, null)
            onSelectSlot(0, h)
          }}
          excludeIds={exclude1}
        />
        {enemyOne ? (
          <div className="mt-4 rounded-xl border border-dl-border bg-dl-bg/40 p-3">
            <HeroCard hero={enemyOne} compact />
            {resolveEnriched(enemyOne, enrichedByHeroId) ? (
              <HeroLaneStats
                stat={resolveEnriched(enemyOne, enrichedByHeroId)!}
                compact
              />
            ) : null}
          </div>
        ) : null}
        {enemyOne ? (
          <button
            type="button"
            onClick={() => onSelectSlot(0, null)}
            className="mt-3 w-full rounded-xl border border-dl-border py-2 text-sm text-slate-400 hover:bg-dl-elevated"
          >
            {t('enemy.clear1')}
          </button>
        ) : null}
      </div>
      <div>
        <HeroSelector
          title={t('enemy.slot2')}
          heroes={heroes}
          selectedId={enemyTwo?.id ?? null}
          onSelect={(h) => {
            if (enemyOne?.id === h.id) onSelectSlot(0, null)
            onSelectSlot(1, h)
          }}
          excludeIds={exclude2}
        />
        {enemyTwo ? (
          <div className="mt-4 rounded-xl border border-dl-border bg-dl-bg/40 p-3">
            <HeroCard hero={enemyTwo} compact />
            {resolveEnriched(enemyTwo, enrichedByHeroId) ? (
              <HeroLaneStats
                stat={resolveEnriched(enemyTwo, enrichedByHeroId)!}
                compact
              />
            ) : null}
          </div>
        ) : null}
        {enemyTwo ? (
          <button
            type="button"
            onClick={() => onSelectSlot(1, null)}
            className="mt-3 w-full rounded-xl border border-dl-border py-2 text-sm text-slate-400 hover:bg-dl-elevated"
          >
            {t('enemy.clear2')}
          </button>
        ) : null}
      </div>
    </div>
    </div>
  )
}
