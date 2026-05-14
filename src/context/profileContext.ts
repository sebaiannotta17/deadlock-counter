import { createContext } from 'react'
import type { AdminProfile } from '../data/profiles'

export interface ProfileContextValue {
  profile: AdminProfile
  profileId: string
  setProfileId: (id: string) => void
  profiles: readonly AdminProfile[]
}

export const ProfileContext = createContext<ProfileContextValue | null>(null)
