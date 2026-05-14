import type { Hero } from '../types'
import { HeroSelector } from './HeroSelector'
import { useI18n } from '../hooks/useI18n'

interface EnemySelectorProps {
  heroes: Hero[]
  playerHeroId: string | null
  enemyOne: Hero | null
  enemyTwo: Hero | null
  onSelectSlot: (slot: 0 | 1, hero: Hero | null) => void
}

export function EnemySelector({
  heroes,
  playerHeroId,
  enemyOne,
  enemyTwo,
  onSelectSlot,
}: EnemySelectorProps) {
  const { t } = useI18n()
  const exclude1 = new Set(
    [playerHeroId, enemyTwo?.id].filter(Boolean) as string[],
  )
  const exclude2 = new Set(
    [playerHeroId, enemyOne?.id].filter(Boolean) as string[],
  )

  return (
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
  )
}
