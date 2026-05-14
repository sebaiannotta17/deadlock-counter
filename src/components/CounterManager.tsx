import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import type { CounterPriority, PurchaseTiming } from '../types'
import { useGameData } from '../hooks/useGameData'
import { useI18n } from '../hooks/useI18n'
import { ItemCombobox } from './ItemCombobox'
import { priorityBadgeClass, typeBadgeClass } from './badges'

export function CounterManager() {
  const { t } = useI18n()
  const {
    heroes,
    items,
    recommendations,
    addRecommendation,
    updateRecommendation,
    deleteRecommendation,
  } = useGameData()

  const [enemyId, setEnemyId] = useState<string>(() => heroes[0]?.id ?? '')
  const [pickItemId, setPickItemId] = useState<string>(() => items[0]?.id ?? '')
  const [priority, setPriority] = useState<CounterPriority>('media')
  const [timing, setTiming] = useState<PurchaseTiming>('early')
  const [explanation, setExplanation] = useState('')

  const resolvedEnemyId = useMemo(() => {
    if (heroes.some((h) => h.id === enemyId)) return enemyId
    return heroes[0]?.id ?? ''
  }, [heroes, enemyId])

  const enemyHero = useMemo(
    () => heroes.find((h) => h.id === resolvedEnemyId),
    [heroes, resolvedEnemyId],
  )

  const enemyRecs = useMemo(
    () => recommendations.filter((r) => r.enemyHeroId === resolvedEnemyId),
    [recommendations, resolvedEnemyId],
  )

  const itemsById = useMemo(() => new Map(items.map((i) => [i.id, i])), [items])

  const resolvedPickItemId = useMemo(() => {
    if (items.length === 0) return ''
    if (pickItemId && items.some((i) => i.id === pickItemId)) return pickItemId
    return items[0].id
  }, [items, pickItemId])

  const pickedItem = itemsById.get(resolvedPickItemId)

  const pickValid = Boolean(resolvedPickItemId)

  function timingBadgePhrase(tim: PurchaseTiming) {
    return `${t(`timing.short.${tim}`)} ${t('timing.suffix')}`
  }

  function submitLink(e: FormEvent) {
    e.preventDefault()
    if (!resolvedEnemyId || !pickValid || !resolvedPickItemId) return
    const explanationTrimmed = explanation.trim() || undefined
    const dup = enemyRecs.find((r) => r.itemId === resolvedPickItemId)
    if (dup) {
      updateRecommendation(dup.id, {
        priority,
        timing,
        explanation: explanationTrimmed,
      })
    } else {
      addRecommendation({
        enemyHeroId: resolvedEnemyId,
        itemId: resolvedPickItemId,
        priority,
        timing,
        explanation: explanationTrimmed,
      })
    }
    setExplanation('')
  }

  const enemyName =
    heroes.find((h) => h.id === resolvedEnemyId)?.name ?? '—'

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-dl-border bg-dl-surface p-6">
        <div className="flex flex-wrap items-start gap-4">
          {enemyHero ? (
            <img
              src={enemyHero.image}
              alt=""
              className="h-24 w-24 shrink-0 rounded-xl border border-dl-border object-cover sm:h-28 sm:w-28"
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <label className="block text-sm font-medium text-slate-300">
              {t('counter.enemyLabel')}
              <select
                value={resolvedEnemyId}
                onChange={(e) => setEnemyId(e.target.value)}
                className="mt-2 w-full max-w-xl rounded-xl border border-dl-border bg-dl-elevated px-3 py-3 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
              >
                {heroes.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <form
          onSubmit={submitLink}
          className="space-y-4 rounded-2xl border border-dl-border bg-dl-surface p-6"
        >
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
            {t('counter.linkTitle', { name: enemyName })}
          </h3>
          <p className="text-sm text-slate-500">{t('counter.linkHint')}</p>
          <div className="flex flex-wrap items-start gap-3">
            <div className="min-w-0 flex-1">
              <ItemCombobox
                items={items}
                selectedId={resolvedPickItemId}
                onSelectId={setPickItemId}
              />
            </div>
            {pickedItem ? (
              <img
                src={pickedItem.image}
                alt=""
                className="h-16 w-16 shrink-0 rounded-xl border border-dl-border object-cover sm:h-[72px] sm:w-[72px]"
              />
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-300">
              {t('counter.priority')}
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as CounterPriority)
                }
                className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
              >
                <option value="alta">{t('priority.alta')}</option>
                <option value="media">{t('priority.media')}</option>
                <option value="baja">{t('priority.baja')}</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-300">
              {t('counter.timing')}
              <select
                value={timing}
                onChange={(e) =>
                  setTiming(e.target.value as PurchaseTiming)
                }
                className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
              >
                <option value="early">{t('timing.early')}</option>
                <option value="mid">{t('timing.mid')}</option>
                <option value="late">{t('timing.late')}</option>
              </select>
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-300">
            {t('counter.explanation')}
            <textarea
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
            />
          </label>
          <button
            type="submit"
            disabled={items.length === 0 || !pickValid}
            className="w-full rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            {t('counter.saveLink')}
          </button>
        </form>

        <div className="rounded-2xl border border-dl-border bg-dl-surface p-6">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
            {t('counter.currentVs', { name: enemyName })}
          </h3>
          <ul className="mt-4 max-h-[520px] space-y-2 overflow-y-auto pr-1">
            {enemyRecs.map((r) => {
              const it = itemsById.get(r.itemId)
              if (!it) return null
              return (
                <li
                  key={r.id}
                  className="rounded-lg border border-dl-border bg-dl-elevated/60 px-3 py-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <img
                        src={it.image}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg border border-dl-border object-cover"
                      />
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-white">
                          {it.name}
                        </span>
                        <span className="ml-2 text-xs text-slate-500">
                          {it.soulCost.toLocaleString()} {t('common.almasWord')}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPickItemId(it.id)
                          setPriority(r.priority)
                          setTiming(r.timing)
                          setExplanation(r.explanation ?? '')
                        }}
                        className="rounded-lg border border-slate-600 px-2 py-1 text-[11px] text-slate-200 hover:bg-dl-surface"
                      >
                        {t('counter.loadForm')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(t('counter.deleteConfirm')))
                            deleteRecommendation(r.id)
                        }}
                        className="rounded-lg border border-rose-900/60 px-2 py-1 text-[11px] text-rose-300 hover:bg-rose-950/40"
                      >
                        {t('counter.delete')}
                      </button>
                    </div>
                  </div>
                  <details className="mt-2 border-t border-dl-border pt-2">
                    <summary className="cursor-pointer text-[11px] text-dl-accent">
                      {t('counter.detailsSummary')}
                    </summary>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${typeBadgeClass(it.type)}`}
                      >
                        {it.type}
                      </span>
                      <span className="rounded-md border border-slate-600 px-2 py-0.5 text-[10px] text-slate-300">
                        {t('itemCard.tier')} {it.tier}
                      </span>
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold capitalize ${priorityBadgeClass(r.priority)}`}
                      >
                        {t(`priority.${r.priority}`)}
                      </span>
                      <span className="rounded-md border border-sky-800/60 px-2 py-0.5 text-[10px] text-sky-200">
                        {timingBadgePhrase(r.timing)}
                      </span>
                    </div>
                    {r.explanation?.trim() ? (
                      <p className="mt-2 text-xs text-slate-300">{r.explanation}</p>
                    ) : null}
                  </details>
                </li>
              )
            })}
          </ul>
          {enemyRecs.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              {t('counter.noLinks')}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
