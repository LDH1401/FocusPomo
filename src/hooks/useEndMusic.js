import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export const MUSIC_SRC = `${import.meta.env.BASE_URL}sounds/end-focus.mp3`

const FADE_MS = 1500
const FADE_STEP_MS = 50

/**
 * Phát bản nhạc trong public/sounds/ khi hết phiên làm việc.
 * Tự tắt sau `limitSeconds` giây (0 = phát hết bài) kèm fade-out.
 */
export function useEndMusic() {
  const audioRef = useRef(null)
  const stopTimerRef = useRef(null)
  const fadeTimerRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const getAudio = () => {
    if (!audioRef.current) {
      const el = new Audio(MUSIC_SRC)
      el.preload = 'auto'
      el.addEventListener('ended', () => setPlaying(false))
      audioRef.current = el
    }
    return audioRef.current
  }

  const clearTimers = () => {
    clearTimeout(stopTimerRef.current)
    clearInterval(fadeTimerRef.current)
    stopTimerRef.current = null
    fadeTimerRef.current = null
  }

  const stop = useCallback(() => {
    clearTimers()
    const el = audioRef.current
    if (el) {
      el.pause()
      el.currentTime = 0
    }
    setPlaying(false)
  }, [])

  const fadeOutAndStop = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    const start = el.volume
    const steps = Math.max(1, Math.round(FADE_MS / FADE_STEP_MS))
    let i = 0
    clearInterval(fadeTimerRef.current)
    fadeTimerRef.current = setInterval(() => {
      i += 1
      el.volume = Math.max(0, start * (1 - i / steps))
      if (i >= steps) {
        stop()
        el.volume = start
      }
    }, FADE_STEP_MS)
  }, [stop])

  /**
   * @returns {Promise<boolean>} false nếu trình duyệt chặn autoplay
   *   (khi đó App sẽ rơi về chuông beep).
   */
  const play = useCallback(
    async ({ volume = 0.7, limitSeconds = 30 } = {}) => {
      const el = getAudio()
      clearTimers()
      el.volume = Math.min(1, Math.max(0, volume))
      el.currentTime = 0
      try {
        await el.play()
      } catch {
        setPlaying(false)
        return false
      }
      setPlaying(true)
      if (limitSeconds > 0) {
        stopTimerRef.current = setTimeout(
          fadeOutAndStop,
          Math.max(0, limitSeconds * 1000 - FADE_MS),
        )
      }
      return true
    },
    [fadeOutAndStop],
  )

  /** Nạp sẵn file trong một cử chỉ người dùng để lúc hết giờ phát tức thì. */
  const prime = useCallback(() => {
    const el = getAudio()
    if (el.paused) el.load() // load() sẽ cắt ngang bài đang phát
  }, [])

  useEffect(() => () => {
    clearTimers()
    audioRef.current?.pause()
  }, [])

  return useMemo(() => ({ play, stop, prime, playing }), [play, stop, prime, playing])
}
