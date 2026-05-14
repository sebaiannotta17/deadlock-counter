import { useMemo, useState } from 'react'
import { useGameData } from '../hooks/useGameData'
import { recommendationsForEnemy } from '../utils/recommendations'
import { HeroSelector } from './HeroSelector'
import { ItemCard } from './ItemCard'

export function CharacterCounters({ onBack }: { onBack: () => void }) {
  const { heroes, items, recommendations } = useGameData()
  const itemsById = useMemo(
    () => new Map(items.map((i) => [i.id, i])),
    [items],
  )

  const [enemy, setEnemy] = useState<(typeof heroes)[0] | null>(null)

  const list = useMemo(() => {
    if (!enemy) return []
    return recommendationsForEnemy(enemy.id, recommendations, itemsById)
  }, [enemy, recommendations, itemsById])

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 rounded-xl border border-dl-border bg-dl-surface px-4 py-3 text-sm font-medium text-slate-200 hover:border-slate-500"
      >
        ← Menú
      </button>

      <HeroSelector
        title="¿Cómo counterear a…?"
        heroes={heroes}
        selectedId={enemy?.id ?? null}
        onSelect={setEnemy}
      />

      {enemy ? (
        <section className="mt-10 space-y-6">
          <div className="overflow-hidden rounded-2xl border border-dl-border bg-dl-surface">
            <div className="grid gap-6 p-6 md:grid-cols-[160px_1fr] md:items-start">
              <img
                src={enemy.image}
                alt=""
                className="aspect-square w-full rounded-xl border border-dl-border object-cover md:max-w-[160px]"
              />
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
                  {enemy.name}
                </h2>
                {enemy.role ? (
                  <p className="mt-1 text-sm uppercase tracking-wider text-dl-accent">
                    {enemy.role}
                  </p>
                ) : null}
                <p className="mt-4 text-slate-300">{enemy.description}</p>
                {enemy.notes ? (
                  <p className="mt-3 text-sm text-slate-500">{enemy.notes}</p>
                ) : null}
              </div>
            </div>
          </div>

          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
            Ítems recomendados
          </h3>
          {list.length === 0 ? (
            <p className="rounded-2xl border border-slate-600/50 bg-dl-elevated p-6 text-slate-400">
              Todavía no hay counters cargados para {enemy.name}. Usá el panel
              de administrador para vincular ítems.
            </p>
          ) : (
            <div className="space-y-5">
              {list.map((row) => (
                <ItemCard
                  key={row.id}
                  item={row.item}
                  priority={row.priority}
                  timing={row.timing}
                  explanationBlocks={[
                    {
                      title: 'Por qué sirve',
                      text: row.explanation,
                      priority: row.priority,
                      timing: row.timing,
                    },
                  ]}
                />
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  )
}
