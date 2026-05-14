import type {
  CounterRecommendation,
  GameDataSnapshot,
  Hero,
  Item,
} from '../types'

export interface GameDataContextValue extends GameDataSnapshot {
  /** Manual flush (auto-save también corre en cada cambio) */
  persist(): void
  resetSeed(): void
  addHero(hero: Omit<Hero, 'id'>): Hero
  updateHero(id: string, patch: Partial<Hero>): void
  deleteHero(id: string): void
  addItem(item: Omit<Item, 'id'>): Item
  updateItem(id: string, patch: Partial<Item>): void
  deleteItem(id: string): void
  addRecommendation(
    rec: Omit<CounterRecommendation, 'id'>,
  ): CounterRecommendation
  updateRecommendation(
    id: string,
    patch: Partial<CounterRecommendation>,
  ): void
  deleteRecommendation(id: string): void
  /** Reemplaza héroes con mismo `id` y mantiene el resto (útil para importaciones masivas `dm-*`). */
  mergeHeroes(imported: Hero[]): void
  /** Reemplaza ítems con mismo `id` y mantiene el resto (`dm-item-*`). */
  mergeItems(imported: Item[]): void
}
