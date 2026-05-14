import type { ItemType } from '../types'

export function typeBadgeClass(type: ItemType): string {
  switch (type) {
    case 'Disparo':
      return 'bg-cyan-500/15 text-dl-shot border-cyan-500/40'
    case 'Vida':
      return 'bg-emerald-500/15 text-dl-life border-emerald-500/40'
    case 'Espiritual':
      return 'bg-purple-500/15 text-dl-spirit border-purple-500/40'
    default:
      return 'bg-slate-500/15 text-slate-300 border-slate-500/40'
  }
}

export function priorityBadgeClass(p: 'alta' | 'media' | 'baja'): string {
  switch (p) {
    case 'alta':
      return 'bg-rose-500/20 text-rose-300 border-rose-500/45'
    case 'media':
      return 'bg-amber-500/20 text-amber-200 border-amber-500/40'
    case 'baja':
      return 'bg-slate-500/20 text-slate-300 border-slate-500/35'
    default:
      return ''
  }
}

export function timingLabel(t: 'early' | 'mid' | 'late'): string {
  switch (t) {
    case 'early':
      return 'Early'
    case 'mid':
      return 'Mid'
    case 'late':
      return 'Late'
    default:
      return t
  }
}
