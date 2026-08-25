import { useCallback, useEffect, useState } from 'react'
import CycleTrack from './components/CycleTrack'
import Settings from './components/Settings'
import TimerRing from './components/TimerRing'
import { Gear, Music, Pause, Play, Rotate, SkipBack, SkipForward } from './components/icons'
import { THEME_ICON } from './components/phaseIcons'
import { useAlarm } from './hooks/useAlarm'
import { useEndMusic } from './hooks/useEndMusic'
import { useLocalStorage } from './hooks/useLocalStorage'
import { usePomodoro } from './hooks/usePomodoro'
import { useTheme } from './hooks/useTheme'
import { DEFAULT_SETTINGS, formatTime, PHASE, PHASE_META } from './lib/pomodoro'

function notify(title, body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  try {
    new Notification(title, { body, silent: true })
  } catch {
    /* một số trình duyệt chặn Notification ngoài service worker */
  }
}

function clockAfter(seconds) {
  const d = new Date(Date.now() + seconds * 1000)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function App() {
  const [settings, setSettings] = useLocalStorage('focuspomo.settings', DEFAULT_SETTINGS)
  const [task, setTask] = useLocalStorage('focuspomo.task', { text: '' })
  const [showSettings, setShowSettings] = useState(false)
  const { play, unlock } = useAlarm()
  const theme = useTheme()
  const music = useEndMusic()

  const handlePhaseEnd = useCallback(
    (finished, next) => {
      const done = PHASE_META[finished.phase]
      const upcoming = PHASE_META[next.phase]

      if (finished.phase === PHASE.FOCUS && settings.endMusic) {
        // Hết phiên làm việc → phát nhạc; nếu trình duyệt chặn autoplay thì beep bù.
        music
          .play({ volume: settings.musicVolume, limitSeconds: settings.musicSeconds })
          .then((ok) => {
            if (!ok && settings.sound) play([880, 660, 990])
          })
      } else if (settings.sound) {
        play(finished.phase === PHASE.FOCUS ? [880, 660, 990] : [660, 880])
      }

      if (settings.notify) {
        notify(
          `Hết ${done.label.toLowerCase()}!`,
          `Tiếp theo: ${upcoming.label}${settings.autoStart ? ' — đang chạy' : ' — bấm Bắt đầu'}`,
        )
      }
    },
    [
      settings.sound,
      settings.notify,
      settings.autoStart,
      settings.endMusic,
      settings.musicVolume,
      settings.musicSeconds,
      play,
      music,
    ],
  )

  const timer = usePomodoro(settings, { onPhaseEnd: handlePhaseEnd })
  const meta = PHASE_META[timer.step.phase]
  const ThemeIcon = THEME_ICON[theme.preference]

  useEffect(() => {
    document.title = `${formatTime(timer.remaining)} · ${meta.label} — FocusPomo`
  }, [timer.remaining, meta.label])

  useEffect(() => {
    document.body.dataset.phase = timer.step.phase
  }, [timer.step.phase])

  const startOrPause = useCallback(() => {
    unlock()
    music.stop()
    music.prime()
    timer.toggle()
  }, [unlock, music, timer])

  // Phím tắt
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowSettings(false)
        return
      }
      if (showSettings || e.target.matches('input, textarea, button')) return

      if (e.code === 'Space') {
        e.preventDefault()
        startOrPause()
      } else if (e.key.toLowerCase() === 'r') {
        timer.reset()
      } else if (e.key.toLowerCase() === 's') {
        timer.skip()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [timer, startOrPause, showSettings])

  const focusLeft = settings.rounds - (timer.completedFocus % settings.rounds)
  const roundLabel =
    timer.step.phase === PHASE.LONG
      ? 'Trọn một chu kỳ'
      : `Phiên ${timer.step.round} / ${settings.rounds}`

  return (
    <>
      <div className="ambient" aria-hidden="true">
        <span className="ambient__blob ambient__blob--a" />
        <span className="ambient__blob ambient__blob--b" />
      </div>

      <div className="app">
        <header className="topbar">
          <div className="brand">
            <span className="brand__dot" />
            <span className="brand__name">
              Focus<b>Pomo</b>
            </span>
          </div>

          <div className="topbar__actions">
            <button
              type="button"
              className="iconbtn"
              onClick={theme.cycle}
              title={`Giao diện: ${theme.current.label}`}
              aria-label={`Đổi giao diện, đang dùng: ${theme.current.label}`}
            >
              <ThemeIcon size={18} />
            </button>
            <button
              type="button"
              className="iconbtn"
              onClick={() => setShowSettings(true)}
              title="Cài đặt"
              aria-label="Mở cài đặt"
            >
              <Gear size={18} />
            </button>
          </div>
        </header>

        <main className="card">
          <input
            className="task"
            placeholder="Phiên này bạn làm gì?"
            value={task.text}
            onChange={(e) => setTask({ text: e.target.value })}
            maxLength={80}
            aria-label="Việc đang làm"
          />

          <TimerRing
            phase={timer.step.phase}
            remaining={timer.remaining}
            progress={timer.progress}
            running={timer.running}
            roundLabel={roundLabel}
            endsAt={timer.running ? clockAfter(timer.remaining) : null}
          />

          <div className="controls">
            <button
              type="button"
              className="iconbtn iconbtn--lg"
              onClick={timer.previous}
              title="Phiên trước"
              aria-label="Phiên trước"
            >
              <SkipBack size={18} />
            </button>

            <button type="button" className="primary" onClick={startOrPause}>
              {timer.running ? <Pause size={20} /> : <Play size={20} />}
              {timer.running ? 'Tạm dừng' : 'Bắt đầu'}
            </button>

            <button
              type="button"
              className="iconbtn iconbtn--lg"
              onClick={timer.skip}
              title="Bỏ qua phiên"
              aria-label="Bỏ qua phiên"
            >
              <SkipForward size={18} />
            </button>
          </div>

          <button type="button" className="linkbtn" onClick={timer.reset}>
            <Rotate size={14} /> Đặt lại phiên này
          </button>

          <CycleTrack
            cycle={timer.cycle}
            index={timer.index}
            progress={timer.progress}
            settings={settings}
            onSelect={(i) => timer.goTo(i)}
          />
        </main>

        {music.playing && (
          <div className="nowplaying">
            <span className="nowplaying__wave" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <Music size={15} />
            <span>Đang phát nhạc kết thúc phiên</span>
            <button type="button" className="linkbtn" onClick={music.stop}>
              Tắt
            </button>
          </div>
        )}

        <section className="stats">
          <div className="stats__item">
            <strong>{timer.completedFocus}</strong>
            <span>phiên tập trung</span>
          </div>
          <div className="stats__item">
            <strong>{timer.cyclesDone}</strong>
            <span>chu kỳ hoàn tất</span>
          </div>
          <div className="stats__item">
            <strong>{focusLeft}</strong>
            <span>phiên tới nghỉ dài</span>
          </div>
        </section>

        <footer className="hint">
          <span>
            <kbd>Space</kbd> chạy / dừng
          </span>
          <span>
            <kbd>R</kbd> đặt lại
          </span>
          <span>
            <kbd>S</kbd> bỏ qua
          </span>
          <button type="button" className="linkbtn" onClick={timer.resetAll}>
            Xoá thống kê
          </button>
        </footer>
      </div>

      {showSettings && (
        <Settings
          settings={settings}
          onChange={setSettings}
          onClose={() => setShowSettings(false)}
          onPreview={(opts) => music.play(opts)}
          theme={theme}
        />
      )}
    </>
  )
}
