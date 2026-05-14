import { useProfile } from '../hooks/useProfile'
import { useI18n } from '../hooks/useI18n'
import { LanguageToggle } from './LanguageToggle'

interface ProfileToolbarProps {
  variant?: 'menu' | 'bar'
  className?: string
}

export function ProfileToolbar({
  variant = 'bar',
  className = '',
}: ProfileToolbarProps) {
  const { profile, profileId, setProfileId, profiles } = useProfile()
  const { t } = useI18n()

  const shell =
    variant === 'menu'
      ? `flex flex-wrap items-start justify-between gap-3 mx-auto w-full max-w-lg rounded-2xl border border-dl-border bg-dl-surface/90 p-4 text-left backdrop-blur-sm ${className}`
      : `flex flex-wrap items-center gap-3 rounded-xl border border-dl-border bg-dl-surface/90 px-3 py-2 backdrop-blur-sm ${className}`

  return (
    <div className={shell}>
      <div className="min-w-0 flex-1">
        <label
          htmlFor="profile-select"
          className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500"
        >
          {t('profile.adminLabel')}
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <select
            id="profile-select"
            value={profileId}
            onChange={(e) => setProfileId(e.target.value)}
            className="min-w-[180px] flex-1 rounded-xl border border-dl-border bg-dl-elevated px-3 py-2 text-sm font-medium text-white outline-none ring-purple-500/30 focus:ring-2 sm:min-w-[220px]"
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.displayName}
              </option>
            ))}
          </select>
          <span className="rounded-lg border border-purple-500/45 bg-purple-950/40 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-purple-200">
            {profile.role}
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {t('profile.session')}{' '}
          <span className="text-slate-300">{profile.displayName}</span>
        </p>
      </div>
      <LanguageToggle />
    </div>
  )
}
