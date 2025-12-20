"use client"

import * as React from "react"
import { NeumorphicNav } from "@/components/layout/neumorphic-nav"
import { TVLChart } from "@/components/charts/tvl-chart"
import { YieldStrategyCard } from "@/components/features/yields/yield-strategy-card"
import { PageContainer } from "@/components/ui/page-container"
import { DashboardTabs } from "@/components/ui/dashboard-tabs"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"
import { Flame } from "lucide-react"
import { useAnalytics } from "@/lib/hooks/use-analytics"
import { useTimeTracker } from "@/lib/hooks/use-time-tracker"
import { useScrollDepth } from "@/lib/hooks/use-scroll-depth"
import { usePagePerformance } from "@/lib/hooks/use-page-performance"
// COMMENTED OUT: API calls disabled - using dummy data
// import { useMultipleVaultTVL } from "@/lib/hooks/use-vault"

export default function Home() {
  const [activeTab, setActiveTab] = React.useState("top-yields")
  const { analytics } = useAnalytics()
  const pageTimeTracker = useTimeTracker()
  const tabTimeTracker = useTimeTracker()
  const previousTabRef = React.useRef<string>("top-yields")

  // Track page-level time
  React.useEffect(() => {
    pageTimeTracker.start()
    return () => {
      const duration = pageTimeTracker.stop()
      if (duration && duration > 0) {
        analytics.pageTimeSpent("home_page", duration)
      }
    }
  }, [analytics, pageTimeTracker])

  // Track tab time spent
  React.useEffect(() => {
    tabTimeTracker.start()
    return () => {
      const duration = tabTimeTracker.stop()
      if (duration && duration > 0) {
        analytics.tabTimeSpent(`home_${previousTabRef.current}`, duration)
      }
    }
  }, [activeTab, analytics, tabTimeTracker])

  // Track scroll depth
  useScrollDepth("home_page", analytics)

  // Track page performance
  usePagePerformance("home_page", analytics)

  // COMMENTED OUT: API calls disabled - using dummy data
  // Fetch TVL for all vaults (syUSD, syETH, syBTC)
  // const { 
  //   tvlMap, 
  //   formattedMap, 
  //   isLoading: isTvlLoading 
  // } = useMultipleVaultTVL(["syUSD", "syETH", "syBTC"], {
  //   staleTime: 30_000, // 30 seconds
  // })

  // Use dummy total TVL value
  const formattedTotalTvl = "$585,937"

  const handleTabChange = (tabId: string) => {
    // Track tab change
    if (previousTabRef.current !== tabId) {
      analytics.tabSwitched(previousTabRef.current)
      previousTabRef.current = tabId
    }
    setActiveTab(tabId)
  }

  const tabs = [
    { id: "top-yields", label: "Top Yields" },
    { id: "flagship", label: "Flagship", icon: "/images/icons/flagship-icon.svg" },
    { id: "delta-neutral", label: "Delta neutral", icon: "/images/icons/delta-neutral-icon.svg" },
    { id: "leverage-looping", label: "Leverage Looping", icon: "/images/icons/leverage-looping-icon.svg" },
  ]

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
        <NeumorphicNav activeMenuItem="none" />
      </div>

      <PageContainer>
        <div 
          className="flex-1 flex w-full"
          style={{ 
            gap: designTokens.spacing.card.gap 
          }}
        >
        <div className="flex-1 flex items-start">
          <TVLChart 
            isEmpty={false}
            totalValue={formattedTotalTvl}
            date={new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
            vaultName="syUSD"
            useApi={false}
          />
        </div>

        <div 
          className="flex-1 flex flex-col"
        >
          <DashboardTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <div 
            className="relative rounded-[12px] mt-[24px]"
            style={{
              width: designTokens.spacing.layout.yieldsMaxWidth,
              height: '42px',
              backgroundColor: designTokens.colors.background.main,
              boxShadow: '4px 4px 4px 0px rgba(127,86,217,0.15), -4px -4px 4px 0px white',
            }}
          >
            <div className="absolute inset-0 flex items-center px-[24px]">
              <p 
                className="flex-1 text-[12px] leading-[18px] tracking-[0.15px] whitespace-pre-wrap"
                style={{ 
                  color: designTokens.colors.text.primary,
                  fontFamily: "'Hanken Grotesk', sans-serif",
                }}
              >
                <span className="font-semibold">Note: </span>
                <span className="font-normal">By initiating a withdrawal, your vault shares (syUSD) will be converted into the underlying asset</span>
              </p>
              <Flame 
                size={24}
                className="shrink-0 ml-[24px]"
                style={{ color: designTokens.colors.strategy.btc }}
              />
            </div>
          </div>

          <div 
            className="flex-1 flex flex-col justify-start mt-[32px]"
            style={{ gap: designTokens.spacing.card.gapInternal }}
          >
            <div 
              className="flex"
              style={{ gap: designTokens.spacing.card.gap }}
            >
              <YieldStrategyCard
                name="Stable Yield USD"
                symbol="syUSD"
                apy={18.18}
                variant="usd"
              />
              <YieldStrategyCard
                name="Stable Yield ETH"
                symbol="syETH"
                apy={10.37}
                variant="eth"
              />
            </div>

            <div 
              className="flex"
              style={{ gap: designTokens.spacing.card.gap }}
            >
              <YieldStrategyCard
                name="Stable Yield BTC"
                symbol="syBTC"
                apy={12.06}
                variant="btc"
              />
            </div>
          </div>
        </div>
        </div>
      </PageContainer>
    </div>
  )
}
