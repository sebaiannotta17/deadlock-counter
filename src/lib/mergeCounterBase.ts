import {
  COUNTER_ITEM_ALIASES,
  counterListBase,
  type CounterBaseRow,
} from '../data/counterListBase'
import type { CounterRecommendation, Hero, Item } from '../types'

function normKey(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

/** Aplica aliases comunitarios y devuelve el nombre usado en la API. */
export function resolveCounterItemDisplayName(raw: string): string {
  const key = normKey(raw)
  const alias = COUNTER_ITEM_ALIASES[key]
  if (alias) return alias
  return raw.trim()
}

function buildNameToItemId(items: Item[]): Map<string, string> {
  const m = new Map<string, string>()
  for (const it of items) {
    m.set(normKey(it.name), it.id)
  }
  return m
}

function findItemIdForCanonical(canonicalName: string, byName: Map<string, string>) {
  const resolved = resolveCounterItemDisplayName(canonicalName)
  const id = byName.get(normKey(resolved))
  if (id) return id
  return byName.get(normKey(canonicalName))
}

/**
 * Añade recomendaciones del catálogo base que aún no existan
 * (misma pareja enemyHeroId + itemId).
 */
export function mergeCounterBaseRecommendations(
  heroes: Hero[],
  items: Item[],
  existing: CounterRecommendation[],
  newId: () => string,
  baseRows: CounterBaseRow[] = counterListBase,
): CounterRecommendation[] {
  const heroIds = new Set(heroes.map((h) => h.id))
  const byName = buildNameToItemId(items)
  const seen = new Set(existing.map((r) => `${r.enemyHeroId}|${r.itemId}`))
  const out = [...existing]

  for (const row of baseRows) {
    if (!heroIds.has(row.enemyHeroId)) continue
    const itemId = findItemIdForCanonical(row.itemName, byName)
    if (!itemId) continue
    const key = `${row.enemyHeroId}|${itemId}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push({
      id: newId(),
      enemyHeroId: row.enemyHeroId,
      itemId,
      priority: row.priority,
      timing: row.timing,
      explanation: row.explanation,
    })
  }

  return out
}
