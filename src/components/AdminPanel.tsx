import { useState } from 'react'
import { ProfileToolbar } from './ProfileToolbar'
import { useGameData } from '../hooks/useGameData'
import { useProfile } from '../hooks/useProfile'
import { useI18n } from '../hooks/useI18n'
import { HeroManager } from './HeroManager'
import { ItemManager } from './ItemManager'
import { CounterManager } from './CounterManager'

type Tab = 'heroes' | 'items' | 'counters'

export function AdminPanel({ onBack }: { onBack: () => void }) {
  const { persist, resetSeed } = useGameData()
  const { profile } = useProfile()
  const { t } = useI18n()
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
          {t('admin.backMenu')}
        </button>
        <button
          type="button"
          onClick={() => persist()}
          className="rounded-xl border border-emerald-800/60 bg-emerald-950/30 px-4 py-3 text-sm font-medium text-emerald-200 hover:bg-emerald-950/50"
        >
          {t('admin.saveNow')}
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm(t('admin.resetConfirm'))) resetSeed()
          }}
          className="rounded-xl border border-amber-800/50 bg-amber-950/25 px-4 py-3 text-sm font-medium text-amber-100 hover:bg-amber-950/45"
        >
          {t('admin.resetSeed')}
        </button>
      </div>

      <header className="mt-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white md:text-3xl">
          {t('admin.title')}
        </h1>
        <p className="mt-1 text-sm text-purple-300/90">
          {t('admin.editingAs')} <span className="font-semibold">{profile.displayName}</span>{' '}
          · {t('admin.role')} <span className="uppercase">{profile.role}</span>
        </p>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">{t('admin.blurb')}</p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-dl-border pb-4">
        {(
          [
            ['heroes', t('admin.tab.heroes')],
            ['items', t('admin.tab.items')],
            ['counters', t('admin.tab.counters')],
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
