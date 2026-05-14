import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { interpolate, STRINGS, type Locale } from '../i18n/strings'
import { LocaleContext } from './localeContext'

const STORAGE_KEY = 'deadlock-locale:v1'

function readStoredLocale(): Locale {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s === 'en' || s === 'es') return s
  } catch {
    /* ignore */
  }
  return 'es'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale())

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const t = useCallback(
    (key: string, vars?: Record<string, string>) => {
      const table = STRINGS[locale]
      const fallback = STRINGS.es
      const raw = table[key] ?? fallback[key] ?? key
      return vars ? interpolate(raw, vars) : raw
    },
    [locale],
  )

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}
