import { useMemo, useRef, useState } from 'react'
import type { Item } from '../types'
import { useI18n } from '../hooks/useI18n'

interface ItemComboboxProps {
  items: Item[]
  selectedId: string
  onSelectId: (id: string) => void
  disabled?: boolean
}

interface ItemComboboxFieldProps {
  items: Item[]
  onSelectId: (id: string) => void
  disabled?: boolean
  /** Nombre del ítem seleccionado; al cambiar `selectedId`, el campo se remonta con este valor. */
  seedLabel: string
}

function ItemComboboxField({
  items,
  onSelectId,
  disabled,
  seedLabel,
}: ItemComboboxFieldProps) {
  const { t } = useI18n()
  const [query, setQuery] = useState(seedLabel)
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q
      ? items.filter((it) => it.name.toLowerCase().includes(q))
      : items
    return list.slice(0, 50)
  }, [items, query])

  const safeHighlight = Math.min(
    highlight,
    Math.max(filtered.length - 1, 0),
  )

  function choose(it: Item) {
    onSelectId(it.id)
    setQuery(it.name)
    setOpen(false)
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlurCapture={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <label className="block text-sm font-medium text-slate-300">
        {t('counter.itemCombo')}
        <input
          type="text"
          disabled={disabled || items.length === 0}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls="item-combobox-list"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setHighlight(0)
            setOpen(true)
          }}
          onFocus={() => {
            setHighlight(0)
            setOpen(true)
          }}
          onKeyDown={(e) => {
            if (!open || filtered.length === 0) return
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setHighlight((h) => Math.min(h + 1, filtered.length - 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setHighlight((h) => Math.max(h - 1, 0))
            } else if (e.key === 'Enter') {
              e.preventDefault()
              const it = filtered[safeHighlight]
              if (it) choose(it)
            } else if (e.key === 'Escape') {
              setOpen(false)
            }
          }}
          placeholder={
            items.length === 0
              ? t('counter.noItemsLoaded')
              : t('counter.itemPlaceholder')
          }
          className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-3 text-slate-100 outline-none ring-purple-500/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </label>

      {open && filtered.length > 0 ? (
        <ul
          id="item-combobox-list"
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-auto rounded-xl border border-dl-border bg-dl-surface py-1 shadow-xl"
        >
          {filtered.map((it, idx) => (
            <li key={it.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={idx === safeHighlight}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-dl-elevated ${
                  idx === safeHighlight ? 'bg-dl-elevated/90' : ''
                }`}
                onMouseEnter={() => setHighlight(idx)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(it)}
              >
                <img
                  src={it.image}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded-lg border border-dl-border object-cover"
                />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate font-medium text-white">{it.name}</span>
                  <span className="text-[11px] text-slate-500">
                    {it.soulCost.toLocaleString()} {t('common.almasWord')}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {open && query.trim() && filtered.length === 0 ? (
        <p className="absolute left-0 right-0 top-full z-30 mt-1 rounded-xl border border-dl-border bg-dl-surface px-3 py-2 text-sm text-slate-500 shadow-xl">
          {t('counter.noMatches')}
        </p>
      ) : null}
    </div>
  )
}

/** Un solo campo: escribís para filtrar y elegís ítem de la lista. */
export function ItemCombobox({
  items,
  selectedId,
  onSelectId,
  disabled,
}: ItemComboboxProps) {
  const seedLabel =
    items.find((i) => i.id === selectedId)?.name ??
    (items[0]?.name ?? '')

  return (
    <ItemComboboxField
      key={selectedId || '__none__'}
      items={items}
      onSelectId={onSelectId}
      disabled={disabled}
      seedLabel={seedLabel}
    />
  )
}
