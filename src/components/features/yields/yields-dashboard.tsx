"use client"

import * as React from "react"
import { designTokens } from "@/lib/design-system"
import { DashboardTabs } from "@/components/ui/dashboard-tabs"
import { DashboardCard } from "@/components/ui/dashboard-card"
import { YieldsNoteCard } from "./yields-note-card"
import { YieldsDateLabels } from "./yields-date-labels"
import { TVLTab } from "./tvl-tab"
import { BaseAPYTab } from "./base-apy-tab"
import { AllocationsTab } from "./allocations-tab"
import { ReturnsAttributionTab } from "./returns-attribution-tab"
import { IncentivesTab } from "./incentives-tab"
import { FAQsTab } from "./faqs-tab"
import { DetailsTab } from "./details-tab"
import { usePathname } from "next/navigation"
import { useVaultTVL } from "@/lib/hooks/use-vault"
import { useAnalytics } from "@/lib/hooks/use-analytics"
import { useTimeTracker } from "@/lib/hooks/use-time-tracker"

interface YieldsDashboardProps {
  currentValue?: string
  currentDate?: string
  hasDeposits?: boolean
  vaultName?: "syUSD" | "syETH" | "syBTC"
}

export function YieldsDashboard({ 
  currentValue,
  currentDate,
  hasDeposits,
  vaultName = "syUSD",
}: YieldsDashboardProps) {
  // Fetch TVL data for the vault
  const { formattedValue: apiFormattedValue, isLoading: isTvlLoading } = useVaultTVL(vaultName, {
    staleTime: 30_000,
  })

  // Use API value if available, otherwise use prop
  const effectiveValue = apiFormattedValue || currentValue || "$185,053"
  const effectiveDate = currentDate || new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
  const [activeTab, setActiveTab] = React.useState("tvl")
  const pathname = usePathname()
  const { analytics } = useAnalytics()
  const tabTimeTracker = useTimeTracker()
  const previousTabRef = React.useRef<string>("tvl")

  React.useEffect(() => {
    setActiveTab("tvl")
    previousTabRef.current = "tvl"
  }, [pathname])

  // Track tab time spent
  React.useEffect(() => {
    tabTimeTracker.start()
    return () => {
      const duration = tabTimeTracker.stop()
      if (duration && duration > 0) {
        analytics.tabTimeSpent(previousTabRef.current, duration)
      }
    }
  }, [activeTab, analytics, tabTimeTracker])

  const handleTabChange = (tabId: string) => {
    // Track tab change
    if (previousTabRef.current !== tabId) {
      analytics.yieldsTabChanged(previousTabRef.current, tabId)
      previousTabRef.current = tabId
    }
    setActiveTab(tabId)
  }

  const resolvedHasDeposits = React.useMemo(() => {
    if (typeof hasDeposits === "boolean") return hasDeposits
    if (!currentValue) return false
    const numericValue = parseFloat(currentValue.replace(/[^0-9.]/g, "")) || 0
    return numericValue > 0
  }, [currentValue, hasDeposits])

  const tabs = [
    { id: "tvl", label: "TVL" },
    { id: "base-apy", label: "Base APY" },
    { id: "allocations", label: "Allocations" },
    { id: "returns", label: "Returns Attribution" },
    { id: "incentives", label: "Incentives" },
    { id: "faqs", label: "FAQs" },
    { id: "details", label: "Details" },
  ]

  const cardHeight = '640px'

  return (
    <div className="relative w-full">
      <DashboardTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div 
        className="relative w-full"
        style={{
          height: cardHeight,
          marginTop: '24px',
        }}
      >
        {(activeTab === "tvl" || activeTab === "base-apy" || activeTab === "allocations" || activeTab === "returns") ? (
          <DashboardCard height={cardHeight}>
            {activeTab === "tvl" && (
              <TVLTab 
                currentValue={effectiveValue} 
                currentDate={effectiveDate} 
                isEmpty={!resolvedHasDeposits}
                vaultName={vaultName}
              />
            )}
            {activeTab === "base-apy" && (
              <BaseAPYTab 
                currentDate={currentDate} 
                isEmpty={!resolvedHasDeposits}
              />
            )}
            {activeTab === "allocations" && (
              <AllocationsTab isEmpty={!resolvedHasDeposits} />
            )}
            {activeTab === "returns" && <ReturnsAttributionTab />}

            {activeTab === "tvl" && (
              <>
                <YieldsDateLabels />
                <YieldsNoteCard 
                  content="By initiating a withdrawal, your vault shares (syUSD) will be converted into the underlying asset based on the latest market rates, which may fluctuate slightly; once the request is submitted."
                />
              </>
            )}

            {activeTab === "base-apy" && (
              <>
                <YieldsDateLabels />
                <YieldsNoteCard 
                  content="By initiating a withdrawal, your vault shares (syUSD) will be converted into the underlying asset based on the latest market rates, which may fluctuate slightly; once the request is submitted."
                />
              </>
            )}
          </DashboardCard>
        ) : (
          <>
            {activeTab === "incentives" && <IncentivesTab />}
            {activeTab === "faqs" && <FAQsTab />}
            {activeTab === "details" && <DetailsTab />}
          </>
        )}
      </div>
    </div>
  )
}
