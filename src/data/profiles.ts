/** Perfiles locales de equipo — todos con rol administrador en esta app. */

export interface AdminProfile {
  id: string
  displayName: string
  role: 'admin'
}

export const ADMIN_PROFILES: AdminProfile[] = [
  { id: 'ale', displayName: 'Ale', role: 'admin' },
  { id: 'cucuzza', displayName: 'Cucuzza', role: 'admin' },
  { id: 'frasso', displayName: 'Frasso', role: 'admin' },
  { id: 'seba', displayName: 'Seba (MVP)', role: 'admin' },
  { id: 'lol', displayName: 'LoL', role: 'admin' },
  { id: 'choquin5', displayName: 'Choquin5', role: 'admin' },
]
