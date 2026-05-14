import type { FormEvent } from 'react'
import { useState } from 'react'
import type { Hero } from '../types'
import { useGameData } from '../hooks/useGameData'

const emptyHero: Omit<Hero, 'id'> = {
  name: '',
  image: '',
  description: '',
  role: '',
  notes: '',
}

export function HeroManager() {
  const { heroes, addHero, updateHero, deleteHero } = useGameData()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Hero, 'id'>>(emptyHero)

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
  )
}
