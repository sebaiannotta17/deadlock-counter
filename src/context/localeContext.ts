import { createContext } from 'react'
import type { Locale } from '../i18n/strings'

export interface LocaleContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string, vars?: Record<string, string>) => string
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)
