"use client"

import * as React from "react"
import { NeumorphicNav } from "@/components/layout/neumorphic-nav"
import { PageContainer } from "@/components/ui/page-container"
import { 
  PortfolioChart, 
  PortfolioStrategyCard, 
  PortfolioTabs,
  PortfolioRequests,
  PortfolioActivity,
} from "@/components/features/portfolio"
import { designTokens } from "@/lib/design-system"

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = React.useState("deposited")

  const handleCancelRequest = (requestId: string) => {
    console.log("Cancel request:", requestId)
  }

  return (
    <div 
      className="relative w-full h-screen overflow-hidden flex flex-col"
      style={{ backgroundColor: designTokens.colors.background.main }}
    >
      <NeumorphicNav activeMenuItem="portfolio" />

      <PageContainer>
        <div 
          className="flex-1 flex"
          style={{ 
            gap: designTokens.spacing.card.gap 
          }}
        >
          <div className="flex-shrink-0 flex items-start">
            <PortfolioChart />
          </div>

          <div 
            className="flex-1 flex flex-col"
            style={{ 
              maxWidth: '668px',
            }}
          >
            <PortfolioTabs 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div style={{ marginTop: '24px' }}>
              {activeTab === "deposited" && (
                <div className="flex gap-[32px]">
                  <PortfolioStrategyCard
                    name="Stable Yield USD"
                    symbol="syUSD"
                    pnl={18.18}
                    totalBalance="$115,447.00"
                    variant="usd"
                  />
                  <PortfolioStrategyCard
                    name="Stable Yield ETH"
                    symbol="syETH"
                    pnl={-18.18}
                    totalBalance="$115,447.00"
                    variant="eth"
                  />
                </div>
              )}

              {activeTab === "withdrawal" && (
                <PortfolioRequests
                  onCancelRequest={handleCancelRequest}
                />
              )}

              {activeTab === "activity" && (
                <PortfolioActivity />
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

