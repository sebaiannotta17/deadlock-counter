export type ItemType = 'Disparo' | 'Vida' | 'Espiritual'

export type ItemTier = 1 | 2 | 3 | 4

export type CounterPriority = 'alta' | 'media' | 'baja'

export type PurchaseTiming = 'early' | 'mid' | 'late'

export interface Hero {
  id: string
  name: string
  image: string
  description: string
  role?: string
  notes?: string
}

export interface Item {
  id: string
  name: string
  image: string
  soulCost: number
  type: ItemType
  tier: ItemTier
  descriptionImage?: string
  description?: string
  notes?: string
}

export interface CounterRecommendation {
  id: string
  enemyHeroId: string
  itemId: string
  priority: CounterPriority
  timing: PurchaseTiming
  explanation: string
  notes?: string
}

/** Shape ready to swap for API / DB layer */
export interface GameDataSnapshot {
  heroes: Hero[]
  items: Item[]
  recommendations: CounterRecommendation[]
}
