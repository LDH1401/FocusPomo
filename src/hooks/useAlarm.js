import { useCallback, useRef } from 'react'

/** Chuông báo bằng WebAudio — không cần file mp3 nào cả. */
export function useAlarm() {
  const ctxRef = useRef(null)

  const getCtx = () => {
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return null
      ctxRef.current = new Ctx()
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }

  /** Mở khoá audio trong một cử chỉ người dùng (yêu cầu của trình duyệt). */
  const unlock = useCallback(() => {
    getCtx()
  }, [])

  const play = useCallback((pattern = [880, 660, 990]) => {
    const ctx = getCtx()
    if (!ctx) return
    const now = ctx.currentTime
    pattern.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = now + i * 0.28
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, start)
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.28, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.26)
      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.3)
    })
  }, [])

  return { play, unlock }
}
