import { useState } from 'react'
import { ProfileProvider } from './context/ProfileProvider'
import { GameDataProvider } from './context/GameDataProvider'
import { AdminPanel } from './components/AdminPanel'
import { CharacterCounters } from './components/CharacterCounters'
import { MainMenu } from './components/MainMenu'
import { MatchRecommender } from './components/MatchRecommender'

type View = 'menu' | 'match' | 'counters' | 'admin'

export default function App() {
  const [view, setView] = useState<View>('menu')

  return (
    <ProfileProvider>
      <GameDataProvider>
        <div className="min-h-svh">
        {view === 'menu' ? (
          <MainMenu
            onNavigate={(v) => setView(v)}
          />
        ) : null}
        {view === 'match' ? (
          <MatchRecommender onBack={() => setView('menu')} />
        ) : null}
        {view === 'counters' ? (
          <CharacterCounters onBack={() => setView('menu')} />
        ) : null}
        {view === 'admin' ? (
          <AdminPanel onBack={() => setView('menu')} />
        ) : null}
        </div>
      </GameDataProvider>
    </ProfileProvider>
  )
}
