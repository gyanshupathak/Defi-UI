"use client"

import * as React from "react"
import { NeumorphicNav } from "@/components/layout/neumorphic-nav"
import { BaseCircularComponent } from "@/components/features/yields/base-circular-component"
import { YieldsDashboard } from "@/components/features/yields/yields-dashboard"
import { PageContainer } from "@/components/ui/page-container"
import { designTokens } from "@/lib/design-system"
import { useAnalytics } from "@/lib/hooks/use-analytics"
import { useTimeTracker } from "@/lib/hooks/use-time-tracker"
import { useScrollDepth } from "@/lib/hooks/use-scroll-depth"
import { usePagePerformance } from "@/lib/hooks/use-page-performance"

export type StrategyType = "flagship" | "delta-neutral" | "leverage-looping"

export default function YieldsPage() {
  const { analytics } = useAnalytics()
  const pageTimeTracker = useTimeTracker()

  // Track page-level time
  React.useEffect(() => {
    pageTimeTracker.start()
    return () => {
      const duration = pageTimeTracker.stop()
      if (duration && duration > 0) {
        analytics.pageTimeSpent("yields_page", duration)
      }
    }
  }, [analytics, pageTimeTracker])

  // Track scroll depth
  useScrollDepth("yields_page", analytics)

  // Track page performance
  usePagePerformance("yields_page", analytics)

  return (
    <div 
      className="relative w-full h-screen flex flex-col"
      style={{ 
        backgroundColor: designTokens.colors.background.main,
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      <div style={{ overflow: 'visible', position: 'relative', zIndex: 10 }}>
        <NeumorphicNav activeMenuItem="yields" />
      </div>

      <PageContainer>
        <div 
          className="flex-1 flex w-full"
          style={{ 
            gap: designTokens.spacing.card.gap 
          }}
        >
          <div className="flex flex-col items-start gap-6" style={{ flex: '0 0 45%' }}>
            <div className="flex items-start gap-4">
              <div
                style={{
                  width: 4,
                  height: 72,
                  backgroundColor: "#f4f0ff",
                  borderRadius: 9,
                  boxShadow: "2px 2px 2px rgba(127,86,217,0.15), -2px -2px 2px #fff",
                }}
              />
              <div className="flex flex-col gap-1">
                <p
                  className="font-medium"
                  style={{
                    fontSize: 20,
                    color: designTokens.colors.text.primary,
                    lineHeight: "28px",
                  }}
                >
                  Transparency Dashboard
                </p>
                <p
                  className="opacity-60"
                  style={{
                    fontSize: 14,
                    color: designTokens.colors.text.primary,
                    lineHeight: "20px",
                    maxWidth: 560,
                  }}
                >
                  Maximize your investment returns and diversify your portfolio. Unlock higher earnings with smart yield strategies.
                </p>
              </div>
            </div>
            <div 
              className="flex items-center justify-center relative w-full"
            >
              <BaseCircularComponent />
            </div>
          </div>

          <div 
            className="flex flex-col"
            style={{ flex: '1 1 auto', marginLeft: '56px' }}
          >
            <YieldsDashboard
              vaultName="syUSD"
            />
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
