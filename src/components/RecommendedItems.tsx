import type { Hero } from '../types'
import type { CombinedEntry } from '../utils/recommendations'
import { HeroCard } from './HeroCard'
import { ItemCard } from './ItemCard'

interface RecommendedItemsProps {
  player: Hero
  enemies: [Hero, Hero]
  entries: CombinedEntry[]
}

export function RecommendedItems({
  player,
  enemies,
  entries,
}: RecommendedItemsProps) {
  return (
    <div className="space-y-8">
      <header className="rounded-2xl border border-dl-border bg-gradient-to-br from-dl-surface to-dl-bg p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dl-accent">
          Resumen de partida
        </p>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase text-slate-500">Tu personaje</p>
            <div className="mt-2">
              <HeroCard hero={player} />
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs uppercase text-slate-500">Línea contraria</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <HeroCard hero={enemies[0]} compact />
              <HeroCard hero={enemies[1]} compact />
            </div>
          </div>
        </div>
      </header>

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-white md:text-2xl">
          Ítems sugeridos
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Ordenados por utilidad combinada en la línea. Los que aparecen como
          &quot;Muy recomendado&quot; son fuertes contra ambos rivales.
        </p>
        <div className="mt-6 space-y-5">
          {entries.length === 0 ? (
            <p className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 text-amber-100">
              No hay recomendaciones cargadas para esta pareja de enemigos.
              Abrí el panel de administrador y asigná ítems a esos personajes.
            </p>
          ) : (
            entries.map((e) => (
              <ItemCard
                key={e.item.id}
                item={e.item}
                priority={e.bestPriority}
                timing={e.earliestTiming}
                highlight={e.veryRecommended}
                explanationBlocks={e.sources.map((s) => ({
                  title: `vs ${s.enemy.name}`,
                  text: s.explanation,
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
