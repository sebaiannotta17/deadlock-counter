import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import type { CounterPriority, ItemTier, ItemType, PurchaseTiming } from '../types'
import { useGameData } from '../hooks/useGameData'
import { FilterBar } from './FilterBar'
import { SearchInput } from './SearchInput'
import { priorityBadgeClass, timingLabel, typeBadgeClass } from './badges'

export function CounterManager() {
  const {
    heroes,
    items,
    recommendations,
    addRecommendation,
    updateRecommendation,
    deleteRecommendation,
  } = useGameData()

  const [enemyId, setEnemyId] = useState<string>(() => heroes[0]?.id ?? '')
  const [itemQ, setItemQ] = useState('')
  const [typeFilter, setTypeFilter] = useState<ItemType | 'all'>('all')
  const [tierFilter, setTierFilter] = useState<ItemTier | 'all'>('all')

  const [pickItemId, setPickItemId] = useState<string>(() => items[0]?.id ?? '')
  const [priority, setPriority] = useState<CounterPriority>('media')
  const [timing, setTiming] = useState<PurchaseTiming>('early')
  const [explanation, setExplanation] = useState('')
  const [notes, setNotes] = useState('')

  const filteredItems = useMemo(() => {
    const s = itemQ.trim().toLowerCase()
    return items.filter((it) => {
      if (typeFilter !== 'all' && it.type !== typeFilter) return false
      if (tierFilter !== 'all' && it.tier !== tierFilter) return false
      if (!s) return true
      return it.name.toLowerCase().includes(s)
    })
  }, [items, itemQ, typeFilter, tierFilter])

  const resolvedEnemyId = useMemo(() => {
    if (heroes.some((h) => h.id === enemyId)) return enemyId
    return heroes[0]?.id ?? ''
  }, [heroes, enemyId])

  const resolvedPickItemId = useMemo(() => {
    if (filteredItems.some((it) => it.id === pickItemId)) return pickItemId
    return filteredItems[0]?.id ?? pickItemId
  }, [filteredItems, pickItemId])

  const enemyRecs = useMemo(
    () => recommendations.filter((r) => r.enemyHeroId === resolvedEnemyId),
    [recommendations, resolvedEnemyId],
  )

  const itemsById = useMemo(() => new Map(items.map((i) => [i.id, i])), [items])

  function submitLink(e: FormEvent) {
    e.preventDefault()
    if (
      !resolvedEnemyId ||
      !resolvedPickItemId ||
      !explanation.trim() ||
      filteredItems.length === 0
    )
      return
    const dup = enemyRecs.find((r) => r.itemId === resolvedPickItemId)
    if (dup) {
      updateRecommendation(dup.id, {
        priority,
        timing,
        explanation: explanation.trim(),
        notes: notes.trim() || undefined,
      })
    } else {
      addRecommendation({
        enemyHeroId: resolvedEnemyId,
        itemId: resolvedPickItemId,
        priority,
        timing,
        explanation: explanation.trim(),
        notes: notes.trim() || undefined,
      })
    }
    setExplanation('')
    setNotes('')
  }

  const enemyName =
    heroes.find((h) => h.id === resolvedEnemyId)?.name ?? '—'

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-dl-border bg-dl-surface p-6">
        <label className="block text-sm font-medium text-slate-300">
          Personaje enemigo a configurar
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

      <div className="grid gap-8 lg:grid-cols-2">
        <form
          onSubmit={submitLink}
          className="space-y-4 rounded-2xl border border-dl-border bg-dl-surface p-6"
        >
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
            Asociar ítem como counter a {enemyName}
          </h3>
          <p className="text-sm text-slate-500">
            Elegí un ítem de la lista filtrada y completá prioridad, momento y
            explicación. Si ya existe la pareja enemigo + ítem, se actualiza.
          </p>
          <SearchInput value={itemQ} onChange={setItemQ} placeholder="Buscar ítem…" />
          <FilterBar
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            tierFilter={tierFilter}
            onTierChange={setTierFilter}
          />
          <label className="block text-sm font-medium text-slate-300">
            Ítem
            {filteredItems.length === 0 ? (
              <p className="mt-2 rounded-xl border border-rose-900/40 bg-rose-950/25 p-3 text-sm text-rose-200">
                No hay ítems que coincidan con la búsqueda y filtros.
              </p>
            ) : (
              <select
                value={resolvedPickItemId}
                onChange={(e) => setPickItemId(e.target.value)}
                className="mt-1 max-h-48 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
              >
                {filteredItems.map((it) => (
                  <option key={it.id} value={it.id}>
                    [{it.type} T{it.tier}] {it.name} — {it.soulCost} almas
                  </option>
                ))}
              </select>
            )}
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-300">
              Prioridad
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as CounterPriority)
                }
                className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Momento de compra
              <select
                value={timing}
                onChange={(e) =>
                  setTiming(e.target.value as PurchaseTiming)
                }
                className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
              >
                <option value="early">Early game</option>
                <option value="mid">Mid game</option>
                <option value="late">Late game</option>
              </select>
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-300">
            Explicación (por qué sirve contra este personaje)
            <textarea
              required
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
            />
          </label>
          <label className="block text-sm font-medium text-slate-300">
            Nota opcional
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
            />
          </label>
          <button
            type="submit"
            disabled={filteredItems.length === 0}
            className="w-full rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            Guardar vínculo
          </button>
        </form>

        <div className="rounded-2xl border border-dl-border bg-dl-surface p-6">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
            Counters actuales vs {enemyName}
          </h3>
          <ul className="mt-4 max-h-[520px] space-y-3 overflow-y-auto pr-1">
            {enemyRecs.map((r) => {
              const it = itemsById.get(r.itemId)
              if (!it) return null
              return (
                <li
                  key={r.id}
                  className="rounded-xl border border-dl-border bg-dl-elevated/60 p-4"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="font-semibold text-white">{it.name}</span>
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${typeBadgeClass(it.type)}`}
                    >
                      {it.type}
                    </span>
                    <span className="rounded-md border border-slate-600 px-2 py-0.5 text-[11px] text-slate-300">
                      T{it.tier}
                    </span>
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold capitalize ${priorityBadgeClass(r.priority)}`}
                    >
                      {r.priority}
                    </span>
                    <span className="rounded-md border border-sky-800/60 px-2 py-0.5 text-[11px] text-sky-200">
                      {timingLabel(r.timing)} game
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{r.explanation}</p>
                  {r.notes ? (
                    <p className="mt-2 text-xs text-slate-500">{r.notes}</p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPickItemId(it.id)
                        setPriority(r.priority)
                        setTiming(r.timing)
                        setExplanation(r.explanation)
                        setNotes(r.notes ?? '')
                      }}
                      className="rounded-lg border border-slate-600 px-3 py-1 text-xs text-slate-200 hover:bg-dl-surface"
                    >
                      Cargar en formulario
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('¿Eliminar esta recomendación?'))
                          deleteRecommendation(r.id)
                      }}
                      className="rounded-lg border border-rose-900/60 px-3 py-1 text-xs text-rose-300 hover:bg-rose-950/40"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
          {enemyRecs.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              Todavía no hay ítems vinculados a este personaje.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
