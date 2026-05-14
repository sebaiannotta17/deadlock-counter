import { useContext } from 'react'
import type { GameDataContextValue } from '../context/gameDataTypes'
import { GameDataContext } from '../context/gameDataContext'

export function useGameData(): GameDataContextValue {
  const ctx = useContext(GameDataContext)
  if (!ctx) throw new Error('useGameData must be used within GameDataProvider')
  return ctx
}
