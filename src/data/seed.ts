import type {
  CounterRecommendation,
  Hero,
  Item,
} from '../types'

/** Los héroes reales se cargan al iniciar desde deadlock-metadata + Assets API (ids dm-*). */
export const seedHeroes: Hero[] = []

/** Los ítems de tienda se importan al iniciar (`dm-item-*`) vía Assets API en GameDataProvider. */
export const seedItems: Item[] = []

/**
 * Vaciar localStorage o usar “Restaurar datos de ejemplo” repuebla desde aquí.
 * El listado comunitario por héroe vive en `counterListBase.ts` y se fusiona al cargar el catálogo.
 */
export const seedRecommendations: CounterRecommendation[] = []
