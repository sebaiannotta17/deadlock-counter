import { useMemo, useState } from 'react'
import type { Hero } from '../types'
import { HeroCard } from './HeroCard'
import { SearchInput } from './SearchInput'

interface HeroSelectorProps {
  title: string
  heroes: Hero[]
  selectedId: string | null
  onSelect: (hero: Hero) => void
  excludeIds?: Set<string>
}

export function HeroSelector({
  title,
  heroes,
  selectedId,
  onSelect,
  excludeIds,
}: HeroSelectorProps) {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return heroes.filter((h) => {
      if (excludeIds?.has(h.id)) return false
      if (!s) return true
      return (
        h.name.toLowerCase().includes(s) ||
        (h.role?.toLowerCase().includes(s) ?? false)
      )
    })
  }, [heroes, q, excludeIds])

  return (
    <section className="space-y-4">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-white md:text-2xl">
        {title}
      </h2>
      <SearchInput value={q} onChange={setQ} placeholder="Buscar por nombre o rol…" />
      <div className="grid max-h-[min(480px,55vh)] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((h) => (
          <HeroCard
            key={h.id}
            hero={h}
            compact
            selected={h.id === selectedId}
            onClick={() => onSelect(h)}
          />
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-slate-500">
          No hay personajes que coincidan.
        </p>
      ) : null}
    </section>
  )
}
