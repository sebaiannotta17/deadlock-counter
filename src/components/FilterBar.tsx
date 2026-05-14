import type { ItemTier, ItemType } from '../types'
import { useI18n } from '../hooks/useI18n'

const types: ItemType[] = ['Disparo', 'Vida', 'Espiritual']
const tiers: ItemTier[] = [1, 2, 3, 4]

interface FilterBarProps {
  typeFilter: ItemType | 'all'
  onTypeChange: (t: ItemType | 'all') => void
  tierFilter: ItemTier | 'all'
  onTierChange: (t: ItemTier | 'all') => void
}

export function FilterBar({
  typeFilter,
  onTypeChange,
  tierFilter,
  onTierChange,
}: FilterBarProps) {
  const { t } = useI18n()

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {t('filter.type')}
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onTypeChange('all')}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              typeFilter === 'all'
                ? 'border-dl-accent bg-dl-accent/20 text-orange-200'
                : 'border-dl-border bg-dl-surface text-slate-400 hover:border-slate-500'
            }`}
          >
            {t('filter.all')}
          </button>
          {types.map((ty) => (
            <button
              key={ty}
              type="button"
              onClick={() => onTypeChange(ty)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                typeFilter === ty
                  ? 'border-dl-accent bg-dl-accent/20 text-orange-200'
                  : 'border-dl-border bg-dl-surface text-slate-400 hover:border-slate-500'
              }`}
            >
              {ty}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {t('filter.tier')}
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onTierChange('all')}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              tierFilter === 'all'
                ? 'border-dl-accent bg-dl-accent/20 text-orange-200'
                : 'border-dl-border bg-dl-surface text-slate-400 hover:border-slate-500'
            }`}
          >
            {t('filter.all')}
          </button>
          {tiers.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onTierChange(n)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                tierFilter === n
                  ? 'border-dl-accent bg-dl-accent/20 text-orange-200'
                  : 'border-dl-border bg-dl-surface text-slate-400 hover:border-slate-500'
              }`}
            >
              T{n}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
