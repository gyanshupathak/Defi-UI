"use client"

import * as React from "react"
import { NeumorphicNav } from "@/components/layout/neumorphic-nav"
import { TVLChart } from "@/components/charts/tvl-chart"
import { YieldStrategyCard } from "@/components/features/yields/yield-strategy-card"
import { PageContainer } from "@/components/ui/page-container"
import { DashboardTabs } from "@/components/ui/dashboard-tabs"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"
import { Flame } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = React.useState("top-yields")

  const tabs = [
    { id: "top-yields", label: "Top Yields" },
    { id: "flagship", label: "Flagship" },
    { id: "delta-neutral", label: "Delta neutral" },
    { id: "leverage-looping", label: "Leverage Looping" },
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
          className="flex-1 flex"
          style={{ 
            gap: designTokens.spacing.card.gap 
          }}
        >
        <div className="flex-shrink-0 flex items-start">
          <TVLChart 
            isEmpty={false}
            totalValue="$585,937"
            date="12 November 2025"
          />
        </div>

        <div 
          className="flex-1 flex flex-col"
          style={{ 
            maxWidth: designTokens.spacing.layout.yieldsMaxWidth,
          }}
        >
          <DashboardTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
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
