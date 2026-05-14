import type { Hero } from '../types'

interface HeroCardProps {
  hero: Hero
  selected?: boolean
  onClick?: () => void
  compact?: boolean
}

export function HeroCard({
  hero,
  selected,
  onClick,
  compact,
}: HeroCardProps) {
  const interactive = typeof onClick === 'function'
  const className = `flex w-full text-left transition ${
    compact ? 'gap-3 rounded-xl p-3' : 'flex-col gap-2 rounded-2xl p-4'
  } border bg-dl-surface ${
    selected
      ? 'border-dl-accent shadow-[0_0_24px_-8px_rgba(249,115,22,0.45)]'
      : 'border-dl-border'
  } ${interactive ? 'cursor-pointer hover:border-slate-500' : 'cursor-default'}`

  const inner = (
    <>
      <img
        src={hero.image}
        alt=""
        className={`rounded-lg object-cover ${compact ? 'h-14 w-14 shrink-0' : 'aspect-square w-full max-h-40'}`}
      />
      <div className="min-w-0 flex-1">
        <p className="font-[family-name:var(--font-display)] text-base font-semibold tracking-wide text-white">
          {hero.name}
        </p>
        {hero.role ? (
          <p className="mt-1 text-xs uppercase tracking-wider text-dl-accent">
            {hero.role}
          </p>
        ) : null}
        {!compact ? (
          <p className="mt-2 line-clamp-3 text-sm text-slate-400">
            {hero.description}
          </p>
        ) : null}
      </div>
    </>
  )

  if (interactive) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {inner}
      </button>
    )
  }

  return <div className={className}>{inner}</div>
}
