import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  CounterRecommendation,
  Hero,
  Item,
} from '../types'
import type { GameDataContextValue } from './gameDataTypes'
import { GameDataContext } from './gameDataContext'
import { loadSnapshot, resetToSeed, saveSnapshot } from '../lib/persist'

function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`
}

export function GameDataProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(() => loadSnapshot(), [])
  const [heroes, setHeroes] = useState<Hero[]>(initial.heroes)
  const [items, setItems] = useState<Item[]>(initial.items)
  const [recommendations, setRecommendations] = useState<
    CounterRecommendation[]
  >(initial.recommendations)

  const persist = useCallback(() => {
    saveSnapshot({ heroes, items, recommendations })
  }, [heroes, items, recommendations])

  useEffect(() => {
    saveSnapshot({ heroes, items, recommendations })
  }, [heroes, items, recommendations])

  const resetSeed = useCallback(() => {
    const snap = resetToSeed()
    setHeroes(snap.heroes)
    setItems(snap.items)
    setRecommendations(snap.recommendations)
  }, [])

  const addHero = useCallback((hero: Omit<Hero, 'id'>) => {
    const h: Hero = { ...hero, id: newId('hero') }
    setHeroes((prev) => [...prev, h])
    return h
  }, [])

  const updateHero = useCallback((id: string, patch: Partial<Hero>) => {
    setHeroes((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...patch } : h)),
    )
  }, [])

  const deleteHero = useCallback((id: string) => {
    setHeroes((prev) => prev.filter((h) => h.id !== id))
    setRecommendations((prev) => prev.filter((r) => r.enemyHeroId !== id))
  }, [])

  const addItem = useCallback((item: Omit<Item, 'id'>) => {
    const it: Item = { ...item, id: newId('item') }
    setItems((prev) => [...prev, it])
    return it
  }, [])

  const updateItem = useCallback((id: string, patch: Partial<Item>) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    )
  }, [])

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
    setRecommendations((prev) => prev.filter((r) => r.itemId !== id))
  }, [])

  const addRecommendation = useCallback(
    (rec: Omit<CounterRecommendation, 'id'>) => {
      const r: CounterRecommendation = { ...rec, id: newId('rec') }
      setRecommendations((prev) => [...prev, r])
      return r
    },
    [],
  )

  const updateRecommendation = useCallback(
    (id: string, patch: Partial<CounterRecommendation>) => {
      setRecommendations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      )
    },
    [],
  )

  const deleteRecommendation = useCallback((id: string) => {
    setRecommendations((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const value = useMemo<GameDataContextValue>(
    () => ({
      heroes,
      items,
      recommendations,
      persist,
      resetSeed,
      addHero,
      updateHero,
      deleteHero,
      addItem,
      updateItem,
      deleteItem,
      addRecommendation,
      updateRecommendation,
      deleteRecommendation,
    }),
    [
      heroes,
      items,
      recommendations,
      persist,
      resetSeed,
      addHero,
      updateHero,
      deleteHero,
      addItem,
      updateItem,
      deleteItem,
      addRecommendation,
      updateRecommendation,
      deleteRecommendation,
    ],
  )

  return (
    <GameDataContext.Provider value={value}>{children}</GameDataContext.Provider>
  )
}
