import type { FormEvent } from 'react'
import { useState } from 'react'
import type { Hero } from '../types'
import { useGameData } from '../hooks/useGameData'
import { buildHeroesFromDeadlockMetadata } from '../lib/deadlockMetadataImport'

const emptyHero: Omit<Hero, 'id'> = {
  name: '',
  image: '',
  description: '',
  role: '',
  notes: '',
}

export function HeroManager() {
  const { heroes, addHero, updateHero, deleteHero, mergeHeroes } = useGameData()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Hero, 'id'>>(emptyHero)
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState<string | null>(null)
  const [importErr, setImportErr] = useState<string | null>(null)
  const [includeInDevHeroes, setIncludeInDevHeroes] = useState(false)

  async function runMetadataImport() {
    if (
      !confirm(
        'Se va a descargar heroes/base.json desde GitHub y luego retratos/descripciones desde assets.deadlock-api.com (muchas peticiones en paralelo). ¿Continuar?',
      )
    ) {
      return
    }
    setImportErr(null)
    setImportProgress('Descargando lista de héroes…')
    setImporting(true)
    try {
      const list = await buildHeroesFromDeadlockMetadata({
        includeInDevelopment: includeInDevHeroes,
        onProgress: (done, total) => {
          setImportProgress(`Descargando retratos (${done}/${total})…`)
        },
      })
      mergeHeroes(list)
      setImportProgress(`Listo: ${list.length} personajes importados (ids dm-*).`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setImportErr(msg)
      setImportProgress(null)
    } finally {
      setImporting(false)
    }
  }

  function startEdit(h: Hero) {
    setEditingId(h.id)
    setForm({
      name: h.name,
      image: h.image,
      description: h.description,
      role: h.role ?? '',
      notes: h.notes ?? '',
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyHero)
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.image.trim()) return
    const payload = {
      ...form,
      role: form.role?.trim() || undefined,
      notes: form.notes?.trim() || undefined,
    }
    if (editingId) {
      updateHero(editingId, payload)
      cancelEdit()
    } else {
      addHero(payload)
      setForm(emptyHero)
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-purple-900/40 bg-purple-950/20 p-6">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
          Importar desde deadlock-metadata
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          Lee{' '}
          <code className="rounded bg-dl-elevated px-1 text-xs text-purple-200">
            heroes/base.json
          </code>{' '}
          de{' '}
          <a
            href="https://github.com/leamare/deadlock-metadata"
            target="_blank"
            rel="noreferrer"
            className="text-purple-300 underline decoration-purple-500/50 hover:text-purple-200"
          >
            leamare/deadlock-metadata
          </a>{' '}
          y completa retratos + descripciones con la{' '}
          <a
            href="https://assets.deadlock-api.com/docs"
            target="_blank"
            rel="noreferrer"
            className="text-purple-300 underline decoration-purple-500/50 hover:text-purple-200"
          >
            Deadlock Assets API
          </a>
          . Los personajes importados usan id tipo{' '}
          <code className="text-xs text-slate-300">dm-63</code> (número de id de
          juego). Los counters viejos siguen apuntando a tus héroes manuales
          hasta que reasignes enemigos a estos ids.
        </p>
        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={includeInDevHeroes}
            onChange={(e) => setIncludeInDevHeroes(e.target.checked)}
            className="size-4 rounded border-dl-border bg-dl-elevated"
          />
          Incluir héroes en desarrollo (<code className="text-xs">in_devel</code>
          )
        </label>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={importing}
            onClick={() => void runMetadataImport()}
            className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {importing ? 'Importando…' : 'Ejecutar importación'}
          </button>
        </div>
        {importProgress ? (
          <p className="mt-3 text-sm text-emerald-300/95">{importProgress}</p>
        ) : null}
        {importErr ? (
          <p className="mt-3 text-sm text-rose-300">{importErr}</p>
        ) : null}
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
      <form
        onSubmit={submit}
        className="space-y-4 rounded-2xl border border-dl-border bg-dl-surface p-6"
      >
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
          {editingId ? 'Editar personaje' : 'Agregar personaje'}
        </h3>
        <label className="block text-sm font-medium text-slate-300">
          Nombre
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-300">
          URL de imagen
          <input
            required
            value={form.image}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-300">
          Descripción breve
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-300">
          Rol (opcional)
          <input
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-300">
          Notas (opcional)
          <textarea
            rows={2}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-slate-100 outline-none ring-dl-accent/30 focus:ring-2"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-xl bg-dl-accent px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-slate-950"
          >
            {editingId ? 'Guardar cambios' : 'Agregar'}
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
      </form>

      <div className="rounded-2xl border border-dl-border bg-dl-surface p-6">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
          Personajes ({heroes.length})
        </h3>
        <ul className="mt-4 max-h-[560px] space-y-3 overflow-y-auto pr-1">
          {heroes.map((h) => (
            <li
              key={h.id}
              className="flex gap-3 rounded-xl border border-dl-border bg-dl-elevated/60 p-3"
            >
              <img
                src={h.image}
                alt=""
                className="h-14 w-14 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-white">{h.name}</p>
                <p className="truncate text-xs text-slate-500">{h.role}</p>
                <p className="truncate font-mono text-[10px] text-slate-600">
                  {h.id}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(h)}
                  className="rounded-lg border border-slate-600 px-3 py-1 text-xs text-slate-200 hover:bg-dl-surface"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      confirm(
                        `¿Eliminar a ${h.name}? También se borrarán sus vínculos de counters.`,
                      )
                    )
                      deleteHero(h.id)
                  }}
                  className="rounded-lg border border-rose-900/60 px-3 py-1 text-xs text-rose-300 hover:bg-rose-950/40"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  )
}
