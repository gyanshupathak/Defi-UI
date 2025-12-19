/**
 * Hook for tracking time spent on interactions
 * Returns start/stop functions and automatically calculates duration
 */
import { useRef, useCallback } from "react"

export interface TimeTracker {
  start: () => void
  stop: () => number | null // Returns duration in milliseconds
  getDuration: () => number | null // Gets current duration without stopping
}

export function useTimeTracker(): TimeTracker {
  const startTimeRef = useRef<number | null>(null)

  const start = useCallback(() => {
    startTimeRef.current = Date.now()
  }, [])

  const stop = useCallback(() => {
    if (startTimeRef.current === null) return null
    const duration = Date.now() - startTimeRef.current
    startTimeRef.current = null
    return duration
  }, [])

  const getDuration = useCallback(() => {
    if (startTimeRef.current === null) return null
    return Date.now() - startTimeRef.current
  }, [])

  return { start, stop, getDuration }
}

