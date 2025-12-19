"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { trackPageView } from "@/lib/analytics"
import { useExternalLinkTracker } from "@/lib/hooks/use-external-link-tracker"

/**
 * Analytics Provider - Tracks page views on route changes
 * GoogleAnalytics component from @next/third-parties handles initial page load
 * This provider tracks subsequent route changes in Next.js App Router
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track external link clicks globally
  useExternalLinkTracker()

  useEffect(() => {
    // Track page views on route changes
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")
      trackPageView(url)
    }
  }, [pathname, searchParams])

  // Track global JavaScript errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (typeof window !== "undefined" && window.gtag) {
        const { analytics } = require("@/lib/analytics")
        analytics.errorOccurred(
          "JavaScript Error",
          event.message || "Unknown error",
          event.filename || "Unknown",
          event.error?.stack
        )
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (typeof window !== "undefined" && window.gtag) {
        const { analytics } = require("@/lib/analytics")
        const errorMessage = event.reason?.message || String(event.reason) || "Unhandled Promise Rejection"
        analytics.errorOccurred(
          "Unhandled Promise Rejection",
          errorMessage,
          "Global",
          event.reason?.stack
        )
      }
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return <>{children}</>
}
