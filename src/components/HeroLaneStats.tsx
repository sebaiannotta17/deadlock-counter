import type { EnrichedHeroStat, WrTier } from '../lib/deadlockAnalyticsApi'
import { useI18n } from '../hooks/useI18n'
import { interpolate } from '../i18n/strings'

function formatSampleSize(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 10_000) return `${Math.round(n / 1000)}k`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function wrTierTextClass(tier: WrTier): string {
  switch (tier) {
    case 'top10':
      return 'text-rose-400'
    case 'mid10':
      return 'text-orange-400'
    default:
      return 'text-emerald-300'
  }
}

interface HeroLaneStatsProps {
  stat: EnrichedHeroStat
  /** compact = menos líneas / más chico */
  compact?: boolean
}

export function HeroLaneStats({ stat, compact }: HeroLaneStatsProps) {
  const { t } = useI18n()
  const tierClass = wrTierTextClass(stat.wrTier)
  const wrStr = stat.winRate.toFixed(1)
  const pkStr = stat.pickRate.toFixed(1)
  const bnStr = stat.banShare.toFixed(1)
  const n = formatSampleSize(stat.matches)

  return (
    <div className="mt-2 space-y-1">
      <p
        className={`font-mono font-semibold ${tierClass} ${compact ? 'text-[11px] leading-snug' : 'text-xs'}`}
      >
        {interpolate(t('match.stats.winrateLine'), {
          pct: wrStr,
          n,
        })}{' '}
        <span className="font-normal text-slate-500">
          · #{stat.wrRank}
        </span>
      </p>
      <p
        className={`font-mono text-slate-400 ${compact ? 'text-[10px]' : 'text-[11px]'}`}
      >
        {interpolate(t('match.stats.pickBanLine'), {
          pick: pkStr,
          ban: bnStr,
        })}
      </p>
      {!compact ? (
        <p className="text-[10px] text-slate-500">{t('match.stats.source')}</p>
      ) : null}
    </div>
  )
}
