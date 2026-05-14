import { createContext } from 'react'
import type { GameDataContextValue } from './gameDataTypes'

export const GameDataContext = createContext<GameDataContextValue | null>(null)
