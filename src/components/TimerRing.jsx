import { formatTime, PHASE_META } from '../lib/pomodoro'
import { PHASE_ICON } from './phaseIcons'

const SIZE = 320
const STROKE = 10
const R = (SIZE - STROKE) / 2 - 18
const C = 2 * Math.PI * R
const CENTER = SIZE / 2
const TICKS = 60
const TICK_R_OUTER = R + 16
const TICK_R_INNER = R + 10

/** Vạch chia phút quanh mặt đồng hồ — vẽ một lần, không phụ thuộc tiến độ. */
const ticks = Array.from({ length: TICKS }, (_, i) => {
  const a = (i / TICKS) * Math.PI * 2 - Math.PI / 2
  const major = i % 5 === 0
  const inner = major ? TICK_R_INNER - 3 : TICK_R_INNER
  return {
    key: i,
    x1: CENTER + inner * Math.cos(a),
    y1: CENTER + inner * Math.sin(a),
    x2: CENTER + TICK_R_OUTER * Math.cos(a),
    y2: CENTER + TICK_R_OUTER * Math.sin(a),
    major,
  }
})

export default function TimerRing({ phase, remaining, progress, running, roundLabel, endsAt }) {
  const meta = PHASE_META[phase]
  const PhaseIcon = PHASE_ICON[phase]
  const urgent = running && remaining <= 10

  const head = progress * Math.PI * 2 - Math.PI / 2
  const hx = CENTER + R * Math.cos(head)
  const hy = CENTER + R * Math.sin(head)

  return (
    <div className={`dial${running ? ' is-running' : ''}${urgent ? ' is-urgent' : ''}`}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
        <defs>
          <linearGradient id="arc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent-soft)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>

        <g className="dial__ticks">
          {ticks.map((t) => (
            <line
              key={t.key}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              strokeWidth={t.major ? 2 : 1}
              opacity={t.major ? 0.55 : 0.25}
            />
          ))}
        </g>

        <circle className="dial__face" cx={CENTER} cy={CENTER} r={R - STROKE / 2} />
        <circle
          className="dial__track"
          cx={CENTER}
          cy={CENTER}
          r={R}
          fill="none"
          strokeWidth={STROKE}
        />
        <circle
          className="dial__arc"
          cx={CENTER}
          cy={CENTER}
          r={R}
          fill="none"
          stroke="url(#arc)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - progress)}
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
        />
        {progress > 0.002 && <circle className="dial__head" cx={hx} cy={hy} r={STROKE / 2 + 2} />}
      </svg>

      <div className="dial__body">
        <span className="dial__phase">
          <PhaseIcon size={15} />
          {meta.label}
        </span>

        <time className="dial__time" dateTime={`PT${Math.ceil(remaining)}S`}>
          {formatTime(remaining)}
        </time>

        <span className="dial__meta">{roundLabel}</span>
        <span className="dial__ends">{endsAt ? `kết thúc lúc ${endsAt}` : ' '}</span>
      </div>
    </div>
  )
}
