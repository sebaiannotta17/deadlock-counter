import type { CSSProperties } from 'react'
import { BACKGROUND_SLIDES } from '../constants/backgroundSlides'

const SECONDS_PER_SLIDE = 12

/** Rotación lenta + velos: la foto se ve “tamizada”, no pantalla literal. */
export function AppBackground() {
  const n = BACKGROUND_SLIDES.length
  const cycleSeconds = n * SECONDS_PER_SLIDE

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-dl-bg" />

      <div className="dl-bg-layers absolute inset-0">
        {BACKGROUND_SLIDES.map((src, index) => {
          const style: CSSProperties = {
            backgroundImage: `url('${src}')`,
            animationDuration: `${cycleSeconds}s`,
            animationDelay: `${(-index / n) * cycleSeconds}s`,
          }
          return (
            <div
              key={src}
              className="dl-bg-layer absolute inset-0 bg-cover bg-center [-webkit-backface-visibility:hidden]"
              style={style}
            />
          )
        })}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-dl-bg/88 via-dl-bg/78 to-dl-bg/92" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%-8%,rgba(249,115,22,0.07),transparent_55%)]" />
    </div>
  )
}
