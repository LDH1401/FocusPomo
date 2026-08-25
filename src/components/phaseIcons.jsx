import { PHASE } from '../lib/pomodoro'
import { Coffee, Flame, Monitor, Moon, Palm, Sun } from './icons'

export const PHASE_ICON = {
  [PHASE.FOCUS]: Flame,
  [PHASE.SHORT]: Coffee,
  [PHASE.LONG]: Palm,
}

export const THEME_ICON = { system: Monitor, light: Sun, dark: Moon }
