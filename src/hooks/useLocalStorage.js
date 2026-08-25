import { useEffect, useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? { ...initialValue, ...JSON.parse(raw) } : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* bỏ qua: chế độ riêng tư / hết quota */
    }
  }, [key, value])

  return [value, setValue]
}
