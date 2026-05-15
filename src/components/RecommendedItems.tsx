import { useMemo } from 'react'
import type { Hero } from '../types'
import type { CombinedEntry } from '../utils/recommendations'
import { partitionLaneRecommendations } from '../utils/recommendations'
import type { EnrichedHeroStat } from '../lib/deadlockAnalyticsApi'
import { parseDmHeroNumericId } from '../lib/deadlockAnalyticsApi'
import { HeroCard } from './HeroCard'
import { ItemCard } from './ItemCard'
import { HeroLaneStats } from './HeroLaneStats'
import { useI18n } from '../hooks/useI18n'
import { interpolate } from '../i18n/strings'

interface RecommendedItemsProps {
  player: Hero
  enemies: [Hero, Hero]
  entries: CombinedEntry[]
  enrichedByHeroId: Map<number, EnrichedHeroStat> | null
}

function enrichedFor(
  hero: Hero,
  enrichedByHeroId: Map<number, EnrichedHeroStat> | null,
): EnrichedHeroStat | null {
  if (!enrichedByHeroId) return null
  const n = parseDmHeroNumericId(hero.id)
  if (n === null) return null
  return enrichedByHeroId.get(n) ?? null
}

function ItemGrid({ list }: { list: CombinedEntry[] }) {
  if (list.length === 0) return null
  return (
    <div className="grid gap-2">
      {list.map((e) => (
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
      ))}
    </div>
  )
}

export function RecommendedItems({
  player,
  enemies,
  entries,
  enrichedByHeroId,
}: RecommendedItemsProps) {
  const { t } = useI18n()
  const { shared, onlyA, onlyB } = useMemo(
    () => partitionLaneRecommendations(entries, enemies),
    [entries, enemies],
  )

  const hasAnyItems = entries.length > 0

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
              {enrichedFor(player, enrichedByHeroId) ? (
                <HeroLaneStats stat={enrichedFor(player, enrichedByHeroId)!} />
              ) : null}
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs uppercase text-slate-500">{t('recommended.enemyLane')}</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <div>
                <HeroCard hero={enemies[0]} compact />
                {enrichedFor(enemies[0], enrichedByHeroId) ? (
                  <HeroLaneStats stat={enrichedFor(enemies[0], enrichedByHeroId)!} />
                ) : null}
              </div>
              <div>
                <HeroCard hero={enemies[1]} compact />
                {enrichedFor(enemies[1], enrichedByHeroId) ? (
                  <HeroLaneStats stat={enrichedFor(enemies[1], enrichedByHeroId)!} />
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
        {!hasAnyItems ? (
          <p className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 text-amber-100">
            {t('recommended.noRecs')}
          </p>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="order-2 rounded-2xl border border-dl-border bg-dl-surface/40 p-4 lg:order-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {interpolate(t('recommended.colVs'), { name: enemies[0].name })}
              </p>
              {onlyA.length > 0 ? (
                <ItemGrid list={onlyA} />
              ) : (
                <p className="mt-3 text-sm text-slate-500">{t('recommended.colEmpty')}</p>
              )}
            </div>
            <div className="order-1 rounded-2xl border border-dl-accent/40 bg-dl-surface/50 p-4 ring-1 ring-orange-500/20 lg:order-2">
              <p className="text-xs font-bold uppercase tracking-wider text-dl-accent">
                {t('recommended.colBoth')}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">{t('recommended.colBothHint')}</p>
              {shared.length > 0 ? (
                <ItemGrid list={shared} />
              ) : (
                <p className="mt-3 text-sm text-slate-500">{t('recommended.colBothEmpty')}</p>
              )}
            </div>
            <div className="order-3 rounded-2xl border border-dl-border bg-dl-surface/40 p-4 lg:order-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {interpolate(t('recommended.colVs'), { name: enemies[1].name })}
              </p>
              {onlyB.length > 0 ? (
                <ItemGrid list={onlyB} />
              ) : (
                <p className="mt-3 text-sm text-slate-500">{t('recommended.colEmpty')}</p>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
