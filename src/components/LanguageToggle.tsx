import type { Locale } from '../i18n/strings'
import { useI18n } from '../hooks/useI18n'

export function LanguageToggle() {
  const { locale, setLocale } = useI18n()

  function pill(active: boolean) {
    return active
      ? 'bg-dl-accent text-slate-950 shadow-sm'
      : 'text-slate-400 hover:bg-dl-elevated hover:text-white'
  }

  return (
    <div
      className="flex shrink-0 items-center rounded-lg border border-dl-border bg-dl-bg/80 p-0.5 text-[11px] font-bold uppercase tracking-wide"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLocale('es' satisfies Locale)}
        className={`rounded-md px-2.5 py-1 transition ${pill(locale === 'es')}`}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLocale('en' satisfies Locale)}
        className={`rounded-md px-2.5 py-1 transition ${pill(locale === 'en')}`}
      >
        EN
      </button>
    </div>
  )
}
