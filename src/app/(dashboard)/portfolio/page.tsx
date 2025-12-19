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
  PortfolioDashboardEmptyState,
} from "@/components/features/portfolio"
import { designTokens } from "@/lib/design-system"
import { useAnalytics } from "@/lib/hooks/use-analytics"
import { useTimeTracker } from "@/lib/hooks/use-time-tracker"
import { useScrollDepth } from "@/lib/hooks/use-scroll-depth"
import { usePagePerformance } from "@/lib/hooks/use-page-performance"

export default function PortfolioPage() {
  const { analytics } = useAnalytics()
  const pageTimeTracker = useTimeTracker()
  const tabTimeTracker = useTimeTracker()
  const [activeTab, setActiveTab] = React.useState("deposited")
  const previousTabRef = React.useRef<string>("deposited")
  const [withdrawalRequestsCount, setWithdrawalRequestsCount] = React.useState(0)
  
  const hasDeposits = false
  const hasWithdrawalRequests = false
  const hasActivity = false

  // Track page-level time
  React.useEffect(() => {
    pageTimeTracker.start()
    return () => {
      const duration = pageTimeTracker.stop()
      if (duration && duration > 0) {
        analytics.pageTimeSpent("portfolio_page", duration)
      }
    }
  }, [analytics, pageTimeTracker])

  // Track tab time spent
  React.useEffect(() => {
    tabTimeTracker.start()
    return () => {
      const duration = tabTimeTracker.stop()
      if (duration && duration > 0) {
        analytics.tabTimeSpent(`portfolio_${previousTabRef.current}`, duration)
      }
    }
  }, [activeTab, analytics, tabTimeTracker])

  // Track scroll depth
  useScrollDepth("portfolio_page", analytics)

  // Track page performance
  usePagePerformance("portfolio_page", analytics)

  const handleTabChange = (tabId: string) => {
    // Track tab change
    if (previousTabRef.current !== tabId) {
      analytics.portfolioTabChanged(previousTabRef.current, tabId)
      previousTabRef.current = tabId
    }
    setActiveTab(tabId)
  }

  const handleCancelRequest = (requestId: string) => {
    console.log("Cancel request:", requestId)
  }

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
        <NeumorphicNav activeMenuItem="portfolio" />
      </div>

      <PageContainer>
        <div 
          className="flex-1 flex w-full"
          style={{ 
            gap: designTokens.spacing.card.gap 
          }}
        >
          <div className="flex-1 flex items-start">
            <PortfolioChart isEmpty={false}/>
          </div>

          <div 
            className="flex-1 flex flex-col"
          >
            <PortfolioTabs 
              activeTab={activeTab}
              onTabChange={handleTabChange}
              withdrawalRequestsCount={withdrawalRequestsCount}
            />

            <div style={{ marginTop: '24px' }}>
              {activeTab === "deposited" && (
                !hasDeposits ? (
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
                ) : (
                  <PortfolioDashboardEmptyState
                    icon={
                      <svg
                        width="56"
                        height="56"
                        viewBox="0 0 56 56"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="8"
                          y="12"
                          width="40"
                          height="44"
                          rx="4"
                          fill="rgba(127, 86, 217, 0.1)"
                          stroke="#7F56D9"
                          strokeWidth="2"
                        />
                        <path
                          d="M28 16V40M28 20C26.8954 20 26 20.8954 26 22C26 23.1046 26.8954 24 28 24C29.1046 24 30 24.8954 30 26C30 27.1046 29.1046 28 28 28M28 32C29.1046 32 30 32.8954 30 34C30 35.1046 29.1046 36 28 36C26.8954 36 26 35.1046 26 34"
                          stroke="#7F56D9"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="40"
                          cy="36"
                          r="6"
                          fill="#E91E63"
                        />
                        <path
                          d="M40 32V34M40 38V38.01"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    }
                    title="Get Started with Deposits"
                    description="You haven't deposited into any strategies yet. Make your first deposit to start earning yields."
                    buttonText="Make a Deposit"
                    buttonVariant="default"
                  />
                )
              )}

              {activeTab === "withdrawal" && (
                !hasWithdrawalRequests ? (
                  <PortfolioRequests
                    onCancelRequest={handleCancelRequest}
                    useApi={true}
                    vaultAddress="0x279CAD277447965AF3d24a78197aad1B02a2c589" // syUSD vault
                    onRequestsCountChange={setWithdrawalRequestsCount}
                  />
                ) : (
                  <PortfolioDashboardEmptyState
                    icon={
                      <svg
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="20"
                          y="20"
                          width="54"
                          height="68"
                          rx="4"
                          fill="rgba(127, 86, 217, 0.1)"
                          stroke="#7F56D9"
                          strokeWidth="2"
                        />
                        <rect
                          x="28"
                          y="14"
                          width="38"
                          height="12"
                          rx="2"
                          fill="rgba(127, 86, 217, 0.1)"
                          stroke="#7F56D9"
                          strokeWidth="2"
                        />
                        <rect
                          x="30"
                          y="32"
                          width="5.586"
                          height="5.586"
                          rx="1"
                          fill="#7F56D9"
                          stroke="#7F56D9"
                          strokeWidth="2"
                        />
                        <line
                          x1="42"
                          y1="36"
                          x2="52"
                          y2="36"
                          stroke="#7F56D9"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <rect
                          x="30"
                          y="43.71"
                          width="5.586"
                          height="5.586"
                          rx="1"
                          fill="none"
                          stroke="#7F56D9"
                          strokeWidth="2"
                        />
                        <line
                          x1="42"
                          y1="46.5"
                          x2="52"
                          y2="46.5"
                          stroke="#7F56D9"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <rect
                          x="30"
                          y="55.95"
                          width="5.586"
                          height="5.586"
                          rx="1"
                          fill="none"
                          stroke="#7F56D9"
                          strokeWidth="2"
                        />
                        <line
                          x1="42"
                          y1="58.75"
                          x2="52"
                          y2="58.75"
                          stroke="#7F56D9"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="70"
                          cy="54"
                          r="10"
                          fill="#7F56D9"
                          stroke="none"
                        />
                        <path
                          d="M70 48V52M70 56V56.01"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    }
                    title="No Pending Withdrawals"
                    description="Ready to grow your funds? Start a secure on-chain deposit"
                    buttonText="Make a Deposit"
                    buttonVariant="default"
                  />
                )
              )}

              {activeTab === "activity" && (
                !hasActivity ? (
                  <PortfolioActivity useApi={true} />
                ) : (
                  <PortfolioDashboardEmptyState
                    icon={
                      <svg
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="20"
                          y="28"
                          width="60"
                          height="56"
                          rx="4"
                          fill="rgba(127, 86, 217, 0.1)"
                          stroke="#7F56D9"
                          strokeWidth="2"
                        />
                        <path
                          d="M20 32L40 20L60 20L80 32"
                          stroke="#7F56D9"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                        <line
                          x1="30"
                          y1="48"
                          x2="70"
                          y2="48"
                          stroke="#7F56D9"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <line
                          x1="30"
                          y1="60"
                          x2="70"
                          y2="60"
                          stroke="#7F56D9"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="28"
                          cy="72"
                          r="10"
                          fill="#7F56D9"
                          stroke="none"
                        />
                        <path
                          d="M28 66V70M28 74V74.01"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <line
                          x1="68"
                          y1="20"
                          x2="72"
                          y2="20"
                          stroke="#7F56D9"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray="2 2"
                        />
                        <line
                          x1="68"
                          y1="16"
                          x2="72"
                          y2="16"
                          stroke="#7F56D9"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray="2 2"
                        />
                      </svg>
                    }
                    title="No Activity Yet"
                    description="Deposit now to start tracking your activity!"
                    buttonText="Make a Deposit"
                    buttonVariant="blue"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
