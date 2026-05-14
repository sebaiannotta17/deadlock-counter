import type {
  CounterPriority,
  CounterRecommendation,
  Hero,
  Item,
  PurchaseTiming,
} from '../types'

const priorityRank: Record<CounterPriority, number> = {
  alta: 3,
  media: 2,
  baja: 1,
}

const timingRank: Record<PurchaseTiming, number> = {
  early: 1,
  mid: 2,
  late: 3,
}

export interface CombinedEntry {
  item: Item
  /** true if recommended against both lane enemies */
  veryRecommended: boolean
  enemyHits: number
  /** Best single priority among matching recs */
  bestPriority: CounterPriority
  /** Earliest timing among matches (early preferred for sort tiebreak) */
  earliestTiming: PurchaseTiming
  sources: Array<{
    enemy: Hero
    explanation: string
    priority: CounterPriority
    timing: PurchaseTiming
    notes?: string
  }>
}

export function combineLaneRecommendations(
  recs: CounterRecommendation[],
  enemies: [Hero, Hero],
  itemsById: Map<string, Item>,
): CombinedEntry[] {
  const [e1, e2] = enemies
  const byEnemy = new Map<string, Hero>([
    [e1.id, e1],
    [e2.id, e2],
  ])

  const byItem = new Map<
    string,
    {
      hits: Map<string, CounterRecommendation>
    }
  >()

  for (const r of recs) {
    const enemy = byEnemy.get(r.enemyHeroId)
    if (!enemy) continue
    let bucket = byItem.get(r.itemId)
    if (!bucket) {
      bucket = { hits: new Map() }
      byItem.set(r.itemId, bucket)
    }
    bucket.hits.set(`${r.enemyHeroId}:${r.itemId}`, r)
  }

  const entries: CombinedEntry[] = []

  for (const [itemId, { hits }] of byItem) {
    const item = itemsById.get(itemId)
    if (!item) continue

    const list = [...hits.values()]
    const enemyHits = new Set(list.map((x) => x.enemyHeroId)).size
    const veryRecommended = enemyHits >= 2

    let bestPriority: CounterPriority = 'baja'
    let earliestTiming: PurchaseTiming = 'late'

    for (const r of list) {
      if (priorityRank[r.priority] > priorityRank[bestPriority]) {
        bestPriority = r.priority
      }
      if (timingRank[r.timing] < timingRank[earliestTiming]) {
        earliestTiming = r.timing
      }
    }

    const sources = list.map((r) => ({
      enemy: byEnemy.get(r.enemyHeroId)!,
      explanation: r.explanation,
      priority: r.priority,
      timing: r.timing,
      notes: r.notes,
    }))

    entries.push({
      item,
      veryRecommended,
      enemyHits,
      bestPriority,
      earliestTiming,
      sources,
    })
  }

  entries.sort((a, b) => {
    if (a.veryRecommended !== b.veryRecommended) {
      return a.veryRecommended ? -1 : 1
    }
    const pr = priorityRank[b.bestPriority] - priorityRank[a.bestPriority]
    if (pr !== 0) return pr
    const tr = timingRank[a.earliestTiming] - timingRank[b.earliestTiming]
    if (tr !== 0) return tr
    return a.item.name.localeCompare(b.item.name)
  })

  return entries
}

export function recommendationsForEnemy(
  enemyId: string,
  recs: CounterRecommendation[],
  itemsById: Map<string, Item>,
): Array<
  CounterRecommendation & {
    item: Item
  }
> {
  const filtered = recs.filter((r) => r.enemyHeroId === enemyId)
  const out: Array<CounterRecommendation & { item: Item }> = []
  for (const r of filtered) {
    const item = itemsById.get(r.itemId)
    if (item) out.push({ ...r, item })
  }
  out.sort((a, b) => {
    const pr = priorityRank[b.priority] - priorityRank[a.priority]
    if (pr !== 0) return pr
    const tr = timingRank[a.timing] - timingRank[b.timing]
    if (tr !== 0) return tr
    return a.item.name.localeCompare(b.item.name)
  })
  return out
}
