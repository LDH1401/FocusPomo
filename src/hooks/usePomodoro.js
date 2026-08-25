import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { buildCycle, durationOf, PHASE } from '../lib/pomodoro'

const TICK_MS = 200

/**
 * Bộ đếm dựa trên mốc thời gian thực (deadline) nên không bị trôi
 * khi tab bị throttle hoặc máy ngủ.
 */
export function usePomodoro(settings, { onPhaseEnd } = {}) {
  const cycle = useMemo(() => buildCycle(settings), [settings])

  const [index, setIndex] = useState(0)
  const [running, setRunning] = useState(false)
  const [remaining, setRemaining] = useState(() => durationOf(cycle[0], settings))
  const [completedFocus, setCompletedFocus] = useState(0)
  const [cyclesDone, setCyclesDone] = useState(0)

  const deadlineRef = useRef(null)
  const onPhaseEndRef = useRef(onPhaseEnd)
  onPhaseEndRef.current = onPhaseEnd

  const step = cycle[index] ?? cycle[0]
  const total = durationOf(step, settings)

  // Đổi thời lượng trong Cài đặt → cập nhật phiên đang dừng.
  // Dùng ref để không đụng vào `remaining` khi người dùng chỉ bấm Tạm dừng.
  const lastTotalRef = useRef(total)
  useEffect(() => {
    if (lastTotalRef.current === total) return
    lastTotalRef.current = total
    if (!running) setRemaining(total)
  }, [total, running])

  const goTo = useCallback(
    (nextIndex, { autoStart = false } = {}) => {
      const wrapped = ((nextIndex % cycle.length) + cycle.length) % cycle.length
      const nextStep = cycle[wrapped]
      const nextTotal = durationOf(nextStep, settings)
      setIndex(wrapped)
      setRemaining(nextTotal)
      if (autoStart) {
        deadlineRef.current = Date.now() + nextTotal * 1000
        setRunning(true)
      } else {
        deadlineRef.current = null
        setRunning(false)
      }
    },
    [cycle, settings],
  )

  const advance = useCallback(
    (finished) => {
      const finishedStep = cycle[finished]
      if (finishedStep.phase === PHASE.FOCUS) setCompletedFocus((n) => n + 1)
      if (finishedStep.phase === PHASE.LONG) setCyclesDone((n) => n + 1)

      const nextIndex = (finished + 1) % cycle.length
      onPhaseEndRef.current?.(finishedStep, cycle[nextIndex])
      goTo(nextIndex, { autoStart: settings.autoStart })
    },
    [cycle, goTo, settings.autoStart],
  )

  // Vòng lặp đồng hồ
  useEffect(() => {
    if (!running) return
    if (deadlineRef.current == null) {
      deadlineRef.current = Date.now() + remaining * 1000
    }
    const id = setInterval(() => {
      const left = (deadlineRef.current - Date.now()) / 1000
      if (left <= 0) {
        clearInterval(id)
        setRemaining(0)
        advance(index)
      } else {
        setRemaining(left)
      }
    }, TICK_MS)
    return () => clearInterval(id)
  }, [running, index, advance]) // eslint-disable-line react-hooks/exhaustive-deps

  const start = useCallback(() => {
    if (running) return
    deadlineRef.current = Date.now() + remaining * 1000
    setRunning(true)
  }, [running, remaining])

  const pause = useCallback(() => {
    if (!running) return
    if (deadlineRef.current != null) {
      setRemaining(Math.max(0, (deadlineRef.current - Date.now()) / 1000))
    }
    deadlineRef.current = null
    setRunning(false)
  }, [running])

  const toggle = useCallback(() => (running ? pause() : start()), [running, pause, start])

  const reset = useCallback(() => {
    deadlineRef.current = null
    setRunning(false)
    setRemaining(durationOf(step, settings))
  }, [step, settings])

  const skip = useCallback(() => advance(index), [advance, index])
  const previous = useCallback(() => goTo(index - 1), [goTo, index])

  const resetAll = useCallback(() => {
    setCompletedFocus(0)
    setCyclesDone(0)
    goTo(0)
  }, [goTo])

  return {
    cycle,
    index,
    step,
    total,
    remaining,
    running,
    progress: total > 0 ? 1 - remaining / total : 0,
    completedFocus,
    cyclesDone,
    start,
    pause,
    toggle,
    reset,
    skip,
    previous,
    goTo,
    resetAll,
  }
}
