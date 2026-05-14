import type { GameDataSnapshot } from '../types'
import {
  seedHeroes,
  seedItems,
  seedRecommendations,
} from '../data/seed'

const STORAGE_KEY = 'deadlock-counter-guide:v1'

export function loadSnapshot(): GameDataSnapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getSeedSnapshot()
    const parsed = JSON.parse(raw) as GameDataSnapshot
    if (
      !parsed.heroes ||
      !parsed.items ||
      !parsed.recommendations ||
      !Array.isArray(parsed.heroes)
    ) {
      return getSeedSnapshot()
    }
    return parsed
  } catch {
    return getSeedSnapshot()
  }
}

export function saveSnapshot(data: GameDataSnapshot): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function resetToSeed(): GameDataSnapshot {
  const snap = getSeedSnapshot()
  saveSnapshot(snap)
  return snap
}

function getSeedSnapshot(): GameDataSnapshot {
  return {
    heroes: structuredClone(seedHeroes),
    items: structuredClone(seedItems),
    recommendations: structuredClone(seedRecommendations),
  }
}

/** Reserved for future API: same contract as persist */
export interface GameDataRepository {
  load(): Promise<GameDataSnapshot>
  save(data: GameDataSnapshot): Promise<void>
}

export const localRepository: GameDataRepository = {
  async load() {
    return loadSnapshot()
  },
  async save(data) {
    saveSnapshot(data)
  },
}
