import type { CounterPriority, Item, PurchaseTiming } from '../types'
import { priorityBadgeClass, timingLabel, typeBadgeClass } from './badges'

interface ItemCardProps {
  item: Item
  priority?: CounterPriority
  timing?: PurchaseTiming
  /** highlight for "muy recomendado" */
  highlight?: boolean
  explanationBlocks?: Array<{
    title: string
    text: string
    priority?: CounterPriority
    timing?: PurchaseTiming
  }>
  className?: string
}

export function ItemCard({
  item,
  priority,
  timing,
  highlight,
  explanationBlocks,
  className = '',
}: ItemCardProps) {
  return (
    <article
      className={`rounded-2xl border bg-dl-surface p-4 text-left shadow-lg ${
        highlight
          ? 'border-dl-accent ring-2 ring-dl-accent/30'
          : 'border-dl-border'
      } ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="shrink-0">
          <img
            src={item.image}
            alt=""
            className="h-28 w-28 rounded-xl border border-dl-border object-cover sm:h-32 sm:w-32"
          />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
              {item.name}
            </h3>
            {highlight ? (
              <span className="rounded-full border border-dl-accent bg-dl-accent/20 px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-orange-200">
                Muy recomendado
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${typeBadgeClass(item.type)}`}
            >
              {item.type}
            </span>
            <span className="rounded-lg border border-slate-500/40 bg-slate-800/80 px-2.5 py-0.5 text-xs font-semibold text-slate-200">
              Tier {item.tier}
            </span>
            <span className="rounded-lg border border-slate-500/40 bg-slate-900/60 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
              {item.soulCost.toLocaleString()} almas
            </span>
            {priority ? (
              <span
                className={`rounded-lg border px-2.5 py-0.5 text-xs font-semibold capitalize ${priorityBadgeClass(priority)}`}
              >
                Prioridad {priority}
              </span>
            ) : null}
            {timing ? (
              <span className="rounded-lg border border-sky-500/35 bg-sky-950/40 px-2.5 py-0.5 text-xs font-semibold text-sky-200">
                {timingLabel(timing)} game
              </span>
            ) : null}
          </div>
          {item.description ? (
            <p className="text-sm text-slate-400">{item.description}</p>
          ) : null}
          {explanationBlocks?.length ? (
            <ul className="space-y-2 border-t border-dl-border pt-3">
              {explanationBlocks.map((b, i) => (
                <li key={i} className="rounded-xl bg-dl-elevated/80 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-dl-muted">
                    {b.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-200">{b.text}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {b.priority ? (
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[11px] font-medium capitalize ${priorityBadgeClass(b.priority)}`}
                      >
                        {b.priority}
                      </span>
                    ) : null}
                    {b.timing ? (
                      <span className="rounded-md border border-sky-500/30 bg-sky-950/30 px-2 py-0.5 text-[11px] text-sky-200">
                        {timingLabel(b.timing)}
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      {item.descriptionImage ? (
        <div className="mt-4 border-t border-dl-border pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Panel del ítem
          </p>
          <img
            src={item.descriptionImage}
            alt=""
            className="max-h-56 w-full rounded-xl border border-dl-border object-contain sm:max-h-72"
          />
        </div>
      ) : null}
    </article>
  )
}
