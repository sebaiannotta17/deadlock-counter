import type { AnalyticsHeroStatRow } from '../lib/deadlockAnalyticsApi'
import { winRateFromRow } from '../lib/deadlockAnalyticsApi'
import { useI18n } from '../hooks/useI18n'
import { interpolate } from '../i18n/strings'

function formatSampleSize(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 10_000) return `${Math.round(n / 1000)}k`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

interface HeroWinrateLineProps {
  row: AnalyticsHeroStatRow
  /** compact = una línea más corta */
  compact?: boolean
}

export function HeroWinrateLine({ row, compact }: HeroWinrateLineProps) {
  const { t } = useI18n()
  const pct = winRateFromRow(row)
  const pctStr = pct.toFixed(1)
  const n = formatSampleSize(row.matches)

  return (
    <div className="mt-2 space-y-0.5">
      <p
        className={`font-mono text-emerald-300/95 ${compact ? 'text-[11px]' : 'text-xs'}`}
      >
        {interpolate(t('match.stats.winrateLine'), {
          pct: pctStr,
          n,
        })}
      </p>
      {!compact ? (
        <p className="text-[10px] text-slate-500">{t('match.stats.source')}</p>
      ) : null}
    </div>
  )
}
