/**
 * Hook for tracking scroll depth on pages
 */
import { useEffect, useRef } from "react"
import { useAnalytics } from "./use-analytics"
import type { analytics as AnalyticsType } from "@/lib/analytics"

export function useScrollDepth(pageName: string, analytics?: typeof AnalyticsType) {
  const trackedDepthsRef = useRef<Set<number>>(new Set())
  const { analytics: analyticsFromHook } = useAnalytics()
  const analyticsToUse = analytics || analyticsFromHook

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / scrollHeight) * 100)

      // Track milestones: 25%, 50%, 75%, 100%
      const milestones = [25, 50, 75, 100]
      
      milestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !trackedDepthsRef.current.has(milestone)) {
          trackedDepthsRef.current.add(milestone)
          analyticsToUse.scrollDepthReached(pageName, scrollTop, milestone)
        }
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [pageName, analyticsToUse])
}

