import type { Hero } from '../types'
import type { CombinedEntry } from '../utils/recommendations'
import type { AnalyticsHeroStatRow } from '../lib/deadlockAnalyticsApi'
import { parseDmHeroNumericId } from '../lib/deadlockAnalyticsApi'
import { HeroCard } from './HeroCard'
import { ItemCard } from './ItemCard'
import { HeroWinrateLine } from './HeroWinrateLine'
import { useI18n } from '../hooks/useI18n'

interface RecommendedItemsProps {
  player: Hero
  enemies: [Hero, Hero]
  entries: CombinedEntry[]
  statsByHeroId: Map<number, AnalyticsHeroStatRow> | null
}

function statRowFor(
  hero: Hero,
  statsByHeroId: Map<number, AnalyticsHeroStatRow> | null,
): AnalyticsHeroStatRow | null {
  if (!statsByHeroId) return null
  const n = parseDmHeroNumericId(hero.id)
  if (n === null) return null
  return statsByHeroId.get(n) ?? null
}

export function RecommendedItems({
  player,
  enemies,
  entries,
  statsByHeroId,
}: RecommendedItemsProps) {
  const { t } = useI18n()

  return (
    <div className="space-y-8">
      <header className="rounded-2xl border border-dl-border bg-gradient-to-br from-dl-surface to-dl-bg p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dl-accent">
          {t('recommended.summary')}
        </p>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase text-slate-500">{t('recommended.yourHero')}</p>
            <div className="mt-2">
              <HeroCard hero={player} />
              {statRowFor(player, statsByHeroId) ? (
                <HeroWinrateLine row={statRowFor(player, statsByHeroId)!} />
              ) : null}
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs uppercase text-slate-500">{t('recommended.enemyLane')}</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <div>
                <HeroCard hero={enemies[0]} compact />
                {statRowFor(enemies[0], statsByHeroId) ? (
                  <HeroWinrateLine row={statRowFor(enemies[0], statsByHeroId)!} />
                ) : null}
              </div>
              <div>
                <HeroCard hero={enemies[1]} compact />
                {statRowFor(enemies[1], statsByHeroId) ? (
                  <HeroWinrateLine row={statRowFor(enemies[1], statsByHeroId)!} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-white md:text-2xl">
          {t('recommended.title')}
        </h2>
        <p className="mt-1 text-sm text-slate-400">{t('recommended.subtitle')}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {entries.length === 0 ? (
            <p className="col-span-full rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 text-amber-100">
              {t('recommended.noRecs')}
            </p>
          ) : (
            entries.map((e) => (
              <ItemCard
                key={e.item.id}
                variant="compact"
                item={e.item}
                priority={e.bestPriority}
                timing={e.earliestTiming}
                highlight={e.veryRecommended}
                explanationBlocks={e.sources
                  .filter((s) => (s.explanation ?? '').trim())
                  .map((s) => ({
                    title: `vs ${s.enemy.name}`,
                    text: s.explanation ?? '',
                    priority: s.priority,
                    timing: s.timing,
                  }))}
              />
            ))
          )}
        </div>
      </section>
    </div>
  )
}
