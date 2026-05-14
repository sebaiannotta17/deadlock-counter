import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ADMIN_PROFILES } from '../data/profiles'
import type { ProfileContextValue } from './profileContext'
import { ProfileContext } from './profileContext'

const STORAGE_KEY = 'deadlock-profile:v1'

function loadStoredId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function persistId(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    /* ignore */
  }
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileId, setProfileIdState] = useState<string>(() => {
    const saved = loadStoredId()
    if (saved && ADMIN_PROFILES.some((p) => p.id === saved)) return saved
    return ADMIN_PROFILES[0].id
  })

  useEffect(() => {
    persistId(profileId)
  }, [profileId])

  const setProfileId = useCallback((id: string) => {
    if (ADMIN_PROFILES.some((p) => p.id === id)) setProfileIdState(id)
  }, [])

  const profile = useMemo(
    () => ADMIN_PROFILES.find((p) => p.id === profileId)!,
    [profileId],
  )

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile,
      profileId,
      setProfileId,
      profiles: ADMIN_PROFILES,
    }),
    [profile, profileId, setProfileId],
  )

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  )
}
