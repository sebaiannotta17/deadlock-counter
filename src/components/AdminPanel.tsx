import { useState } from 'react'
import { ProfileToolbar } from './ProfileToolbar'
import { useGameData } from '../hooks/useGameData'
import { useProfile } from '../hooks/useProfile'
import { HeroManager } from './HeroManager'
import { ItemManager } from './ItemManager'
import { CounterManager } from './CounterManager'

type Tab = 'heroes' | 'items' | 'counters'

export function AdminPanel({ onBack }: { onBack: () => void }) {
  const { persist, resetSeed } = useGameData()
  const { profile } = useProfile()
  const [tab, setTab] = useState<Tab>('heroes')

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
      <ProfileToolbar className="mb-4" />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-dl-border bg-dl-surface px-4 py-3 text-sm font-medium text-slate-200 hover:border-slate-500"
        >
          ← Menú
        </button>
        <button
          type="button"
          onClick={() => persist()}
          className="rounded-xl border border-emerald-800/60 bg-emerald-950/30 px-4 py-3 text-sm font-medium text-emerald-200 hover:bg-emerald-950/50"
        >
          Guardar ahora
        </button>
        <button
          type="button"
          onClick={() => {
            if (
              confirm(
                '¿Restaurar datos de ejemplo? Se sobrescribe todo lo guardado localmente.',
              )
            )
              resetSeed()
          }}
          className="rounded-xl border border-amber-800/50 bg-amber-950/25 px-4 py-3 text-sm font-medium text-amber-100 hover:bg-amber-950/45"
        >
          Reset a datos semilla
        </button>
      </div>

      <header className="mt-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white md:text-3xl">
          Panel de administrador
        </h1>
        <p className="mt-1 text-sm text-purple-300/90">
          Editando como <span className="font-semibold">{profile.displayName}</span>{' '}
          · rol <span className="uppercase">{profile.role}</span>
        </p>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Los cambios se sincronizan automáticamente con{' '}
          <code className="rounded bg-dl-elevated px-1.5 py-0.5 text-xs text-orange-200">
            localStorage
          </code>
          . El botón “Guardar ahora” fuerza escritura por si querés confirmación manual.
          La capa{' '}
          <code className="rounded bg-dl-elevated px-1.5 py-0.5 text-xs">
            GameDataRepository
          </code>{' '}
          en código permite cambiar a API más adelante.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-dl-border pb-4">
        {(
          [
            ['heroes', 'Personajes'],
            ['items', 'Ítems'],
            ['counters', 'Counters'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              tab === id
                ? 'bg-dl-accent text-slate-950'
                : 'bg-dl-surface text-slate-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'heroes' ? <HeroManager /> : null}
        {tab === 'items' ? <ItemManager /> : null}
        {tab === 'counters' ? <CounterManager /> : null}
      </div>
    </div>
  )
}
