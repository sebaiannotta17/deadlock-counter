import { useContext } from 'react'
import { LocaleContext } from '../context/localeContext'

export function useI18n() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useI18n must be used within LocaleProvider')
  return ctx
}
