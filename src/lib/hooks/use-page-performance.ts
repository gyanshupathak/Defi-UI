/**
 * Hook for tracking page performance metrics
 */
import { useEffect, useRef } from "react"
import { useAnalytics } from "./use-analytics"
import type { analytics as AnalyticsType } from "@/lib/analytics"

export function usePagePerformance(pageName: string, analytics?: typeof AnalyticsType) {
  const { analytics: analyticsFromHook } = useAnalytics()
  const analyticsToUse = analytics || analyticsFromHook
  const performanceTrackedRef = useRef(false)

  useEffect(() => {
    if (performanceTrackedRef.current) return
    performanceTrackedRef.current = true

    // Track page load time using Performance API
    if (typeof window !== "undefined" && window.performance) {
      const trackLoadTime = () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
          if (navigation) {
            const loadTime = navigation.loadEventEnd - navigation.fetchStart
            analyticsToUse.pageLoadTime(pageName, loadTime)
          }
        }, 0)
      }

      if (document.readyState === "complete") {
        trackLoadTime()
      } else {
        window.addEventListener("load", trackLoadTime)
        return () => {
          window.removeEventListener("load", trackLoadTime)
        }
      }
    }
  }, [pageName, analyticsToUse])
}

