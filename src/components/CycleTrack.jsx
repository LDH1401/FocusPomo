import { durationOf, PHASE_META } from '../lib/pomodoro'

const RING_R = 22
const RING_C = 2 * Math.PI * RING_R

/**
 * Chu kỳ hiển thị bằng biểu tượng từng phiên: cà chua = làm, cốc cà phê = nghỉ ngắn,
 * cây dừa = nghỉ dài. Phiên đang chạy có vòng tiến độ bao quanh.
 */
export default function CycleTrack({ cycle, index, progress, settings, onSelect }) {
  return (
    <ol className="track" aria-label="Chu kỳ Pomodoro">
      {cycle.map((step, i) => {
        const meta = PHASE_META[step.phase]
        const state = i === index ? 'current' : i < index ? 'done' : 'todo'
        const minutes = Math.round(durationOf(step, settings) / 60)

        return (
          <li key={i} className="track__slot">
            <button
              type="button"
              className={`track__dot track__dot--${step.phase} is-${state}`}
              style={{ '--accent': meta.accentVar }}
              onClick={() => onSelect(i)}
              title={`${meta.label} · ${minutes} phút`}
              aria-current={i === index ? 'step' : undefined}
              aria-label={`${meta.label} ${minutes} phút`}
            >
              <span className="track__emoji">{meta.emoji}</span>

              {state === 'current' && (
                <svg className="track__ring" viewBox="0 0 48 48" aria-hidden="true">
                  <circle className="track__ring-bg" cx="24" cy="24" r={RING_R} />
                  <circle
                    className="track__ring-fg"
                    cx="24"
                    cy="24"
                    r={RING_R}
                    strokeDasharray={RING_C}
                    strokeDashoffset={RING_C * (1 - progress)}
                    transform="rotate(-90 24 24)"
                  />
                </svg>
              )}
            </button>
          </li>
        )
      })}
    </ol>
  )
}
