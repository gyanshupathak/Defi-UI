/**
 * Hook for tracking external link clicks
 */
import { useEffect } from "react"
import { useAnalytics } from "./use-analytics"

export function useExternalLinkTracker() {
  const { analytics } = useAnalytics()

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a")
      
      if (link && link.href) {
        try {
          const url = new URL(link.href)
          const currentOrigin = window.location.origin
          
          // Check if it's an external link
          if (url.origin !== currentOrigin) {
            const linkText = link.textContent?.trim() || link.getAttribute("aria-label") || undefined
            const location = window.location.pathname
            
            analytics.externalLinkClicked(url.href, linkText, location)
          }
        } catch (error) {
          // Invalid URL, ignore
        }
      }
    }

    document.addEventListener("click", handleClick, true)
    
    return () => {
      document.removeEventListener("click", handleClick, true)
    }
  }, [analytics])
}

