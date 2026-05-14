import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import type { Item, ItemTier, ItemType } from '../types'
import { useGameData } from '../hooks/useGameData'
import { buildShopItemsFromAssetsApi } from '../lib/deadlockItemsImport'
import { FilterBar } from './FilterBar'
import { SearchInput } from './SearchInput'
import { typeBadgeClass } from './badges'

const types: ItemType[] = ['Disparo', 'Vida', 'Espiritual']
const tiers: ItemTier[] = [1, 2, 3, 4]

const emptyItem: Omit<Item, 'id'> = {
  name: '',
  image: '',
  soulCost: 500,
  type: 'Disparo',
  tier: 1,
  descriptionImage: '',
  description: '',
  notes: '',
}

export function ItemManager() {
  const { items, addItem, updateItem, deleteItem, mergeItems } = useGameData()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Item, 'id'>>(emptyItem)
  const [q, setQ] = useState('')
  const [typeFilter, setTypeFilter] = useState<ItemType | 'all'>('all')
  const [tierFilter, setTierFilter] = useState<ItemTier | 'all'>('all')
  const [itemsImporting, setItemsImporting] = useState(false)
  const [itemsImportProgress, setItemsImportProgress] = useState<string | null>(
    null,
  )
  const [itemsImportErr, setItemsImportErr] = useState<string | null>(null)

  async function runAssetsItemsImport() {
    if (
      !confirm(
        'Se descargará el catálogo de ítems desde assets.deadlock-api.com/v2/items en una sola petición (~170 ítems de tienda). Los ids dm-item-* existentes se reemplazan. ¿Continuar?',
      )
    )
      return
    setItemsImportErr(null)
    setItemsImportProgress('Descargando catálogo…')
    setItemsImporting(true)
    try {
      const list = await buildShopItemsFromAssetsApi()
      mergeItems(list)
      setItemsImportProgress(`Listo: ${list.length} ítems de tienda importados.`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setItemsImportErr(msg)
      setItemsImportProgress(null)
    } finally {
      setItemsImporting(false)
    }
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return items.filter((it) => {
      if (typeFilter !== 'all' && it.type !== typeFilter) return false
      if (tierFilter !== 'all' && it.tier !== tierFilter) return false
      if (!s) return true
      return it.name.toLowerCase().includes(s)
    })
  }, [items, q, typeFilter, tierFilter])

  const grouped = useMemo(() => {
    const map = new Map<string, Item[]>()
    for (const t of types) {
      for (const tier of tiers) {
        map.set(`${t}-${tier}`, [])
      }
    }
    for (const it of filtered) {
      const key = `${it.type}-${it.tier}`
      map.get(key)?.push(it)
    }
    return map
  }, [filtered])

  function startEdit(it: Item) {
    setEditingId(it.id)
    setForm({
      name: it.name,
      image: it.image,
      soulCost: it.soulCost,
      type: it.type,
      tier: it.tier,
      descriptionImage: it.descriptionImage ?? '',
      description: it.description ?? '',
      notes: it.notes ?? '',
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyItem)
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.image.trim()) return
    const payload: Omit<Item, 'id'> = {
      ...form,
      soulCost: Number(form.soulCost) || 0,
      descriptionImage: form.descriptionImage?.trim() || undefined,
      description: form.description?.trim() || undefined,
      notes: form.notes?.trim() || undefined,
    }
    if (editingId) {
      updateItem(editingId, payload)
      cancelEdit()
    } else {
      addItem(payload)
      setForm(emptyItem)
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-cyan-900/45 bg-cyan-950/15 p-6">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
          Importar ítems desde Deadlock Assets API
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          Una petición a{' '}
          <code className="rounded bg-dl-elevated px-1 text-xs text-cyan-200">
            /v2/items
          </code>{' '}
          trae todos los upgrades{' '}
          <strong className="text-slate-300">shopable</strong> del juego (~172).
          Se mapean a{' '}
          <strong className="text-slate-300">Disparo / Vida / Espiritual</strong>{' '}
          según el slot de tienda (
          <code className="text-xs">weapon · vitality · spirit</code>) y el tier
          de tienda (los de tier 5 se muestran como tier 4 en esta app).
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={itemsImporting}
            onClick={() => void runAssetsItemsImport()}
            className="rounded-xl bg-cyan-700 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {itemsImporting ? 'Importando…' : 'Importar ítems de tienda'}
          </button>
        </div>
        {itemsImportProgress ? (
          <p className="mt-3 text-sm text-emerald-300/95">{itemsImportProgress}</p>
        ) : null}
        {itemsImportErr ? (
          <p className="mt-3 text-sm text-rose-300">{itemsImportErr}</p>
        ) : null}
      </section>

      <form
        onSubmit={submit}
        className="grid gap-6 rounded-2xl border border-dl-border bg-dl-surface p-6 lg:grid-cols-2"
      >
        <div className="space-y-4">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
            {editingId ? 'Editar ítem' : 'Agregar ítem'}
          </h3>
          <label className="block text-sm font-medium text-slate-300">
            Nombre
            <input
              required
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
            />
          </label>
          <label className="block text-sm font-medium text-slate-300">
            URL imagen del ítem
            <input
              required
              value={form.image}
              onChange={(e) =>
                setForm((f) => ({ ...f, image: e.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
            />
          </label>
          <label className="block text-sm font-medium text-slate-300">
            Costo en almas
            <input
              type="number"
              min={0}
              value={form.soulCost}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  soulCost: Number(e.target.value),
                }))
              }
              className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-300">
              Tipo
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    type: e.target.value as ItemType,
                  }))
                }
                className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
              >
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Tier
              <select
                value={form.tier}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    tier: Number(e.target.value) as ItemTier,
                  }))
                }
                className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
              >
                {tiers.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-300">
            URL imagen de descripción (opcional)
            <input
              value={form.descriptionImage ?? ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, descriptionImage: e.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
            />
          </label>
          <label className="block text-sm font-medium text-slate-300">
            Descripción escrita (opcional)
            <textarea
              rows={2}
              value={form.description ?? ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
            />
          </label>
          <label className="block text-sm font-medium text-slate-300">
            Notas (opcional)
            <textarea
              rows={2}
              value={form.notes ?? ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="rounded-xl bg-dl-accent px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-slate-950"
            >
              {editingId ? 'Guardar ítem' : 'Agregar ítem'}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl border border-dl-border px-5 py-2.5 text-sm text-slate-300"
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </div>
        <div className="rounded-xl border border-dl-border bg-dl-bg/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Vista previa
          </p>
          <div className="mt-3 flex gap-4">
            <img
              src={form.image || 'https://placehold.co/128x128/1f2937/94a3b8?text=?'}
              alt=""
              className="h-28 w-28 rounded-xl border border-dl-border object-cover"
            />
            <div>
              <p className="font-semibold text-white">{form.name || 'Nombre'}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span
                  className={`rounded-lg border px-2 py-0.5 text-xs font-semibold ${typeBadgeClass(form.type)}`}
                >
                  {form.type}
                </span>
                <span className="rounded-lg border border-slate-600 px-2 py-0.5 text-xs text-slate-200">
                  Tier {form.tier}
                </span>
                <span className="rounded-lg border border-slate-600 px-2 py-0.5 text-xs text-slate-200">
                  {form.soulCost} almas
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="rounded-2xl border border-dl-border bg-dl-surface p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
              Ítems cargados ({items.length})
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Agrupados por tipo y tier como en la tienda.
            </p>
          </div>
          <div className="w-full md:max-w-md">
            <SearchInput value={q} onChange={setQ} placeholder="Buscar ítem…" />
          </div>
        </div>
        <div className="mt-4">
          <FilterBar
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            tierFilter={tierFilter}
            onTierChange={setTierFilter}
          />
        </div>

        <div className="mt-8 space-y-10">
          {types.map((t) => (
            <div key={t}>
              <h4 className="font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.2em] text-dl-muted">
                {t}
              </h4>
              <div className="mt-4 grid gap-6 lg:grid-cols-4">
                {tiers.map((tier) => {
                  const list = grouped.get(`${t}-${tier}`) ?? []
                  return (
                    <div key={tier} className="rounded-xl border border-dl-border bg-dl-elevated/40 p-3">
                      <p className="text-center text-xs font-bold text-slate-400">
                        Tier {tier}
                      </p>
                      <ul className="mt-3 space-y-2">
                        {list.map((it) => (
                          <li
                            key={it.id}
                            className="rounded-lg border border-dl-border bg-dl-surface p-2"
                          >
                            <div className="flex gap-2">
                              <img
                                src={it.image}
                                alt=""
                                className="h-12 w-12 shrink-0 rounded-md object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-white">
                                  {it.name}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  {it.soulCost} almas
                                </p>
                                <p className="truncate font-mono text-[10px] text-slate-600">
                                  {it.id}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 flex gap-2">
                              <button
                                type="button"
                                onClick={() => startEdit(it)}
                                className="flex-1 rounded-md border border-slate-600 py-1 text-[11px] text-slate-200 hover:bg-dl-elevated"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (
                                    confirm(
                                      `¿Eliminar ${it.name}? Se borrarán vínculos de counters.`,
                                    )
                                  )
                                    deleteItem(it.id)
                                }}
                                className="flex-1 rounded-md border border-rose-900/50 py-1 text-[11px] text-rose-300 hover:bg-rose-950/40"
                              >
                                Eliminar
                              </button>
                            </div>
                          </li>
                        ))}
                        {list.length === 0 ? (
                          <li className="py-6 text-center text-[11px] text-slate-600">
                            —
                          </li>
                        ) : null}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
