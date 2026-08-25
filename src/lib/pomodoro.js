export const PHASE = {
  FOCUS: 'focus',
  SHORT: 'short',
  LONG: 'long',
}

/** Màu của từng phiên nằm trong styles.css (`--accent-*`) để đổi theo theme sáng/tối. */
export const PHASE_META = {
  [PHASE.FOCUS]: { label: 'Tập trung', emoji: '🍅', accentVar: 'var(--accent-focus)' },
  [PHASE.SHORT]: { label: 'Nghỉ ngắn', emoji: '☕', accentVar: 'var(--accent-short)' },
  [PHASE.LONG]: { label: 'Nghỉ dài', emoji: '🌴', accentVar: 'var(--accent-long)' },
}

export const DEFAULT_SETTINGS = {
  focus: 25,        // phút
  shortBreak: 5,    // phút
  longBreak: 15,    // phút (15–30)
  rounds: 4,        // số phiên tập trung trước khi nghỉ dài
  autoStart: true,  // tự chạy phiên kế tiếp
  sound: true,      // chuông beep khi hết phiên
  notify: true,
  endMusic: true,   // phát nhạc khi hết phiên LÀM VIỆC
  musicVolume: 0.7,
  musicSeconds: 30, // phát bao lâu rồi tự tắt (0 = hết bài)
}

/**
 * Sinh chuỗi phiên cho một chu kỳ đầy đủ:
 * 25p làm → 5p nghỉ → 25p làm → 5p nghỉ → 25p làm → 5p nghỉ → 25p làm → nghỉ dài
 */
export function buildCycle(settings) {
  const { rounds } = settings
  const steps = []
  for (let i = 1; i <= rounds; i++) {
    steps.push({ phase: PHASE.FOCUS, round: i })
    steps.push({ phase: i === rounds ? PHASE.LONG : PHASE.SHORT, round: i })
  }
  return steps
}

export function durationOf(step, settings) {
  const minutes =
    step.phase === PHASE.FOCUS
      ? settings.focus
      : step.phase === PHASE.SHORT
        ? settings.shortBreak
        : settings.longBreak
  return Math.max(1, Math.round(minutes * 60))
}

export function formatTime(totalSeconds) {
  const s = Math.max(0, Math.ceil(totalSeconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}
