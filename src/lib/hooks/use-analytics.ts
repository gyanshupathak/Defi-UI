/**
 * React hook for easy analytics event tracking
 */
import { useCallback } from "react"
import { analytics, trackEvent, AnalyticsEvent } from "@/lib/analytics"

export function useAnalytics() {
  const track = useCallback((event: AnalyticsEvent) => {
    trackEvent(event)
  }, [])

  return {
    track,
    analytics, // Access to all pre-defined analytics functions
  }
}

