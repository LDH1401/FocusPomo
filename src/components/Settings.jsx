import { useEffect, useRef } from 'react'
import { THEMES } from '../hooks/useTheme'
import { clamp, DEFAULT_SETTINGS } from '../lib/pomodoro'
import { Check, Close, Music, Play } from './icons'
import { THEME_ICON } from './phaseIcons'

const DURATIONS = [
  { key: 'focus', label: 'Tập trung', min: 1, max: 90, unit: 'phút' },
  { key: 'shortBreak', label: 'Nghỉ ngắn', min: 1, max: 30, unit: 'phút' },
  { key: 'longBreak', label: 'Nghỉ dài', min: 15, max: 30, unit: 'phút' },
  { key: 'rounds', label: 'Phiên / chu kỳ', min: 2, max: 8, unit: 'phiên' },
]

const TOGGLES = [
  { key: 'autoStart', label: 'Tự động chạy phiên kế tiếp', hint: 'Hết giờ là phiên sau chạy luôn' },
  { key: 'endMusic', label: 'Nhạc khi hết phiên làm việc', hint: 'public/sounds/end-focus.mp3' },
  { key: 'sound', label: 'Chuông khi hết phiên nghỉ', hint: 'Tiếng beep ngắn' },
  { key: 'notify', label: 'Thông báo trình duyệt', hint: 'Hiện cả khi bạn đang ở tab khác' },
]

function Toggle({ checked, label, hint, onChange }) {
  return (
    <label className="toggle">
      <span className="toggle__text">
        <span className="toggle__label">{label}</span>
        {hint && <span className="toggle__hint">{hint}</span>}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__thumb" />
      </span>
    </label>
  )
}

export default function Settings({ settings, onChange, onClose, onPreview, theme }) {
  const panelRef = useRef(null)
  const set = (key, value) => onChange({ ...settings, [key]: value })

  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  return (
    <div className="modal" onMouseDown={onClose}>
      <div
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Cài đặt"
        tabIndex={-1}
        ref={panelRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="modal__head">
          <h2>Cài đặt</h2>
          <button type="button" className="iconbtn" onClick={onClose} aria-label="Đóng cài đặt">
            <Close size={18} />
          </button>
        </header>

        <div className="modal__body">
          <section className="group">
            <h3 className="group__title">Thời lượng</h3>
            <div className="group__grid">
              {DURATIONS.map(({ key, label, min, max, unit }) => (
                <label key={key} className="numfield">
                  <span className="numfield__label">{label}</span>
                  <span className="numfield__control">
                    <input
                      type="number"
                      min={min}
                      max={max}
                      value={settings[key]}
                      onChange={(e) => {
                        const n = Number(e.target.value)
                        set(key, Number.isFinite(n) ? clamp(n, min, max) : settings[key])
                      }}
                    />
                    <span className="numfield__unit">{unit}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className="group__note">Nghỉ dài giới hạn 15–30 phút theo công thức Pomodoro.</p>
          </section>

          <section className="group">
            <h3 className="group__title">Giao diện</h3>
            <div className="segmented">
              {THEMES.map((t) => {
                const ThemeIcon = THEME_ICON[t.value]
                const active = theme.preference === t.value
                return (
                  <button
                    key={t.value}
                    type="button"
                    className={active ? 'is-active' : undefined}
                    aria-pressed={active}
                    onClick={() => theme.setPreference(t.value)}
                  >
                    <ThemeIcon size={16} />
                    {t.label}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="group">
            <h3 className="group__title">Âm thanh &amp; thông báo</h3>
            <div className="group__list">
              {TOGGLES.map(({ key, label, hint }) => (
                <Toggle
                  key={key}
                  label={label}
                  hint={hint}
                  checked={settings[key]}
                  onChange={(e) => {
                    if (key === 'notify' && e.target.checked && 'Notification' in window) {
                      Notification.requestPermission()
                    }
                    set(key, e.target.checked)
                  }}
                />
              ))}
            </div>

            {settings.endMusic && (
              <div className="music">
                <div className="music__head">
                  <Music size={16} />
                  <span>Nhạc kết thúc phiên</span>
                </div>

                <label className="slider">
                  <span>
                    Âm lượng <b>{Math.round(settings.musicVolume * 100)}%</b>
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(settings.musicVolume * 100)}
                    onChange={(e) => set('musicVolume', Number(e.target.value) / 100)}
                  />
                </label>

                <label className="slider">
                  <span>
                    Phát trong{' '}
                    <b>{settings.musicSeconds === 0 ? 'hết bài' : `${settings.musicSeconds}s`}</b>
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={120}
                    step={5}
                    value={settings.musicSeconds}
                    onChange={(e) => set('musicSeconds', Number(e.target.value))}
                  />
                </label>

                <button
                  type="button"
                  className="btn btn--soft"
                  onClick={() =>
                    onPreview({
                      volume: settings.musicVolume,
                      limitSeconds: Math.min(8, settings.musicSeconds || 8),
                    })
                  }
                >
                  <Play size={15} /> Nghe thử 8 giây
                </button>
              </div>
            )}
          </section>
        </div>

        <footer className="modal__foot">
          <button type="button" className="btn btn--soft" onClick={() => onChange(DEFAULT_SETTINGS)}>
            Khôi phục mặc định
          </button>
          <button type="button" className="btn btn--solid" onClick={onClose}>
            <Check size={16} /> Xong
          </button>
        </footer>
      </div>
    </div>
  )
}
