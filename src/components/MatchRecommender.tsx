import { useMemo, useState } from 'react'
import { ProfileToolbar } from './ProfileToolbar'
import { useGameData } from '../hooks/useGameData'
import { useDeadlockHeroStats } from '../hooks/useDeadlockHeroStats'
import { combineLaneRecommendations } from '../utils/recommendations'
import { EnemySelector } from './EnemySelector'
import { HeroSelector } from './HeroSelector'
import { RecommendedItems } from './RecommendedItems'
import { useI18n } from '../hooks/useI18n'

type Step = 'hero' | 'enemies' | 'result'

export function MatchRecommender({ onBack }: { onBack: () => void }) {
  const { t } = useI18n()
  const { heroes, items, recommendations } = useGameData()
  const { statsByHeroId, loading: statsLoading, error: statsError } =
    useDeadlockHeroStats()
  const itemsById = useMemo(
    () => new Map(items.map((i) => [i.id, i])),
    [items],
  )

  const [step, setStep] = useState<Step>('hero')
  const [player, setPlayer] = useState<(typeof heroes)[0] | null>(null)
  const [enemyOne, setEnemyOne] = useState<(typeof heroes)[0] | null>(null)
  const [enemyTwo, setEnemyTwo] = useState<(typeof heroes)[0] | null>(null)

  const combined = useMemo(() => {
    if (!enemyOne || !enemyTwo) return []
    return combineLaneRecommendations(
      recommendations,
      [enemyOne, enemyTwo],
      itemsById,
    )
  }, [enemyOne, enemyTwo, recommendations, itemsById])

  function setEnemySlot(slot: 0 | 1, hero: typeof player) {
    if (slot === 0) setEnemyOne(hero)
    else setEnemyTwo(hero)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
      <ProfileToolbar className="mb-4" />
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-dl-border bg-dl-surface px-4 py-3 text-sm font-medium text-slate-200 hover:border-slate-500"
        >
          {t('nav.backMenu')}
        </button>
        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <span className={step === 'hero' ? 'text-dl-accent' : ''}>
            {t('match.steps.hero')}
          </span>
          <span aria-hidden>/</span>
          <span className={step === 'enemies' ? 'text-dl-accent' : ''}>
            {t('match.steps.enemies')}
          </span>
          <span aria-hidden>/</span>
          <span className={step === 'result' ? 'text-dl-accent' : ''}>
            {t('match.steps.items')}
          </span>
        </div>
      </div>

      {step === 'hero' ? (
        <div className="space-y-6">
          <HeroSelector
            title={t('match.heroTitle')}
            heroes={heroes}
            selectedId={player?.id ?? null}
            onSelect={(h) => setPlayer(h)}
          />
          <div className="flex justify-end">
            <button
              type="button"
              disabled={!player}
              onClick={() => setStep('enemies')}
              className="rounded-2xl bg-dl-accent px-8 py-4 text-base font-bold uppercase tracking-wide text-slate-950 shadow-lg shadow-orange-500/25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t('match.continue')}
            </button>
          </div>
        </div>
      ) : null}

      {step === 'enemies' ? (
        <div className="space-y-6">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white md:text-3xl">
            {t('match.enemiesTitle')}
          </h1>
          <EnemySelector
            heroes={heroes}
            playerHeroId={player?.id ?? null}
            enemyOne={enemyOne}
            enemyTwo={enemyTwo}
            onSelectSlot={setEnemySlot}
            statsByHeroId={statsByHeroId}
            statsLoading={statsLoading}
            statsError={statsError}
          />
          <div className="flex flex-wrap justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep('hero')}
              className="rounded-xl border border-dl-border px-5 py-3 text-sm text-slate-300 hover:bg-dl-surface"
            >
              {t('match.back')}
            </button>
            <button
              type="button"
              disabled={!enemyOne || !enemyTwo}
              onClick={() => setStep('result')}
              className="rounded-2xl bg-dl-accent px-8 py-4 text-base font-bold uppercase tracking-wide text-slate-950 shadow-lg shadow-orange-500/25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t('match.viewRecs')}
            </button>
          </div>
        </div>
      ) : null}

      {step === 'result' && player && enemyOne && enemyTwo ? (
        <div className="space-y-8">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setStep('enemies')}
              className="rounded-xl border border-dl-border px-4 py-2 text-sm text-slate-300 hover:bg-dl-surface"
            >
              {t('match.changeEnemies')}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('hero')
                setPlayer(null)
                setEnemyOne(null)
                setEnemyTwo(null)
              }}
              className="rounded-xl border border-dl-border px-4 py-2 text-sm text-slate-300 hover:bg-dl-surface"
            >
              {t('match.newQuery')}
            </button>
          </div>
          <RecommendedItems
            player={player}
            enemies={[enemyOne, enemyTwo]}
            entries={combined}
            statsByHeroId={statsByHeroId}
          />
        </div>
      ) : null}
    </div>
  )
}
