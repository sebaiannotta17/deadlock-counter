import type { CounterPriority, Item, PurchaseTiming } from '../types'
import { useI18n } from '../hooks/useI18n'
import { priorityBadgeClass, typeBadgeClass } from './badges'

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
  /** Vista densa: nombre + almas; el resto va detrás de un desplegable. */
  variant?: 'full' | 'compact'
}

export function ItemCard({
  item,
  priority,
  timing,
  highlight,
  explanationBlocks,
  className = '',
  variant = 'full',
}: ItemCardProps) {
  const { t } = useI18n()

  const blocksWithText =
    explanationBlocks?.filter((b) => b.text.trim()) ?? []

  function timingPhrase(tim: PurchaseTiming) {
    return `${t(`timing.short.${tim}`)} ${t('timing.suffix')}`
  }

  function priorityPhrase(p: CounterPriority) {
    return `${t('itemCard.priorityWord')} ${t(`priority.${p}`)}`
  }

  const hasCompactExtra =
    Boolean(item.description) ||
    Boolean(item.descriptionImage) ||
    blocksWithText.length > 0 ||
    Boolean(priority) ||
    Boolean(timing)

  if (variant === 'compact') {
    return (
      <article
        className={`rounded-xl border bg-dl-surface p-3 text-left shadow-md ${
          highlight
            ? 'border-dl-accent ring-1 ring-dl-accent/35'
            : 'border-dl-border'
        } ${className}`}
      >
        <div className="flex gap-3">
          <img
            src={item.image}
            alt=""
            className="h-11 w-11 shrink-0 rounded-lg border border-dl-border object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate font-[family-name:var(--font-display)] text-sm font-semibold text-white">
                {item.name}
              </h3>
              {highlight ? (
                <span className="shrink-0 rounded-full border border-dl-accent bg-dl-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-200">
                  {t('itemCard.highlyRecommended')}
                </span>
              ) : null}
            </div>
            <p className="text-xs text-slate-400">
              {item.soulCost.toLocaleString()} {t('common.almasWord')}
            </p>
          </div>
        </div>

        {hasCompactExtra ? (
          <details className="group mt-2 border-t border-dl-border pt-2">
            <summary className="cursor-pointer list-none text-xs font-medium text-dl-accent [&::-webkit-details-marker]:hidden">
              {t('itemCard.viewDetail')}
              <span className="ml-1 text-slate-500 group-open:hidden">
                {t('itemCard.detailHint')}
              </span>
            </summary>
            <div className="mt-2 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                <span
                  className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${typeBadgeClass(item.type)}`}
                >
                  {item.type}
                </span>
                <span className="rounded-md border border-slate-600/60 px-2 py-0.5 text-[10px] text-slate-300">
                  {t('itemCard.tier')} {item.tier}
                </span>
                {priority ? (
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${priorityBadgeClass(priority)}`}
                  >
                    {priorityPhrase(priority)}
                  </span>
                ) : null}
                {timing ? (
                  <span className="rounded-md border border-sky-800/50 px-2 py-0.5 text-[10px] text-sky-200">
                    {timingPhrase(timing)}
                  </span>
                ) : null}
              </div>
              {item.description ? (
                <p className="text-xs text-slate-400">{item.description}</p>
              ) : null}
              {blocksWithText.length ? (
                <ul className="space-y-2">
                  {blocksWithText.map((b, i) => (
                    <li key={i} className="rounded-lg bg-dl-elevated/70 px-2 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-dl-muted">
                        {b.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-200">{b.text}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {b.priority ? (
                          <span
                            className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${priorityBadgeClass(b.priority)}`}
                          >
                            {t(`priority.${b.priority}`)}
                          </span>
                        ) : null}
                        {b.timing ? (
                          <span className="rounded border border-sky-500/30 bg-sky-950/30 px-1.5 py-0.5 text-[10px] text-sky-200">
                            {timingPhrase(b.timing)}
                          </span>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
              {item.descriptionImage ? (
                <div className="rounded-lg border border-dl-border bg-dl-bg/40 p-2">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {t('itemCard.panelTitle')}
                  </p>
                  <img
                    src={item.descriptionImage}
                    alt=""
                    className="max-h-40 w-full rounded-md border border-dl-border object-contain"
                  />
                </div>
              ) : null}
            </div>
          </details>
        ) : null}
      </article>
    )
  }

  const fullBlocksWithText =
    explanationBlocks?.filter((b) => b.text.trim()) ?? []

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
                {t('itemCard.highlyRecommended')}
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
              {t('itemCard.tier')} {item.tier}
            </span>
            <span className="rounded-lg border border-slate-500/40 bg-slate-900/60 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
              {item.soulCost.toLocaleString()} {t('common.almasWord')}
            </span>
            {priority ? (
              <span
                className={`rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${priorityBadgeClass(priority)}`}
              >
                {priorityPhrase(priority)}
              </span>
            ) : null}
            {timing ? (
              <span className="rounded-lg border border-sky-500/35 bg-sky-950/40 px-2.5 py-0.5 text-xs font-semibold text-sky-200">
                {timingPhrase(timing)}
              </span>
            ) : null}
          </div>
          {item.description ? (
            <p className="text-sm text-slate-400">{item.description}</p>
          ) : null}
          {fullBlocksWithText.length ? (
            <ul className="space-y-2 border-t border-dl-border pt-3">
              {fullBlocksWithText.map((b, i) => (
                <li key={i} className="rounded-xl bg-dl-elevated/80 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-dl-muted">
                    {b.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-200">{b.text}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {b.priority ? (
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${priorityBadgeClass(b.priority)}`}
                      >
                        {t(`priority.${b.priority}`)}
                      </span>
                    ) : null}
                    {b.timing ? (
                      <span className="rounded-md border border-sky-500/30 bg-sky-950/30 px-2 py-0.5 text-[11px] text-sky-200">
                        {timingPhrase(b.timing)}
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
        <details className="mt-4 border-t border-dl-border pt-3">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t('itemCard.full.panelSummary')}
          </summary>
          <img
            src={item.descriptionImage}
            alt=""
            className="mt-3 max-h-56 w-full rounded-xl border border-dl-border object-contain sm:max-h-72"
          />
        </details>
      ) : null}
    </article>
  )
}
