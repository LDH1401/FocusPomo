import { useCallback, useEffect, useState } from 'react'

const KEY = 'focuspomo.theme'

export const THEMES = [
  { value: 'system', label: 'Hệ thống' },
  { value: 'light', label: 'Sáng' },
  { value: 'dark', label: 'Tối' },
]

const query = () => window.matchMedia('(prefers-color-scheme: dark)')

function readPreference() {
  try {
    const saved = window.localStorage.getItem(KEY)
    return THEMES.some((t) => t.value === saved) ? saved : 'system'
  } catch {
    return 'system'
  }
}

/**
 * `preference` là lựa chọn của người dùng (có thể là 'system'),
 * `resolved` là theme thực sự đang áp lên <html data-theme>.
 */
export function useTheme() {
  const [preference, setPreference] = useState(readPreference)
  const [resolved, setResolved] = useState(() =>
    preference === 'system' ? (query().matches ? 'dark' : 'light') : preference,
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, preference)
    } catch {
      /* bỏ qua */
    }

    if (preference !== 'system') {
      setResolved(preference)
      return
    }

    const mq = query()
    const sync = () => setResolved(mq.matches ? 'dark' : 'light')
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [preference])

  useEffect(() => {
    document.documentElement.dataset.theme = resolved
  }, [resolved])

  const cycle = useCallback(() => {
    setPreference((current) => {
      const i = THEMES.findIndex((t) => t.value === current)
      return THEMES[(i + 1) % THEMES.length].value
    })
  }, [])

  const current = THEMES.find((t) => t.value === preference) ?? THEMES[0]

  return { preference, resolved, current, setPreference, cycle }
}
