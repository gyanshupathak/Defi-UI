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

interface YieldsDashboardProps {
  currentValue?: string
  currentDate?: string
  hasDeposits?: boolean
}

export function YieldsDashboard({ 
  currentValue = "$185,053",
  currentDate = "Current Date",
  hasDeposits,
}: YieldsDashboardProps) {
  const [activeTab, setActiveTab] = React.useState("tvl")
  const pathname = usePathname()

  React.useEffect(() => {
    setActiveTab("tvl")
  }, [pathname])

  const resolvedHasDeposits = React.useMemo(() => {
    if (typeof hasDeposits === "boolean") return hasDeposits
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
        onTabChange={setActiveTab}
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
                currentValue={currentValue} 
                currentDate={currentDate} 
                isEmpty={!resolvedHasDeposits}
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
