type View = 'menu' | 'match' | 'counters' | 'admin'

interface MainMenuProps {
  onNavigate: (v: Exclude<View, 'menu'>) => void
}

export function MainMenu({ onNavigate }: MainMenuProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(249,115,22,0.12),transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(34,211,238,0.08),transparent_50%)]" />
      <div className="w-full max-w-lg text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-dl-accent">
          Deadlock
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Guía rápida de counters
        </h1>
        <p className="mt-4 text-sm text-slate-400 sm:text-base">
          Elegí tu héroe, marcá dos rivales de línea y recibí ítems combinados.
          Pensado para mirar en segundos mientras jugás.
        </p>

        <nav className="mt-10 flex flex-col gap-4">
          <button
            type="button"
            onClick={() => onNavigate('match')}
            className="group relative w-full overflow-hidden rounded-2xl border border-dl-border bg-dl-surface py-5 text-lg font-semibold text-white shadow-xl transition hover:border-dl-accent/60 hover:shadow-orange-500/10"
          >
            <span className="relative z-10">Recomendador de partida</span>
            <span className="absolute inset-0 bg-gradient-to-r from-dl-accent/0 via-dl-accent/10 to-dl-accent/0 opacity-0 transition group-hover:opacity-100" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('counters')}
            className="w-full rounded-2xl border border-dl-border bg-dl-surface py-5 text-lg font-semibold text-white shadow-lg transition hover:border-cyan-500/40 hover:shadow-cyan-500/5"
          >
            Counters por personaje
          </button>
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="w-full rounded-2xl border border-dl-border bg-dl-elevated py-5 text-lg font-semibold text-slate-200 transition hover:border-purple-500/40"
          >
            Panel de administrador
          </button>
        </nav>
      </div>
    </div>
  )
}
