"use client"

import * as React from "react"
import { DashboardTabs } from "@/components/ui/dashboard-tabs"

interface PortfolioTabsProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  className?: string
}

export function PortfolioTabs({ 
  activeTab = "deposited",
  onTabChange,
  className 
}: PortfolioTabsProps) {
  const tabs = [
    { id: "deposited", label: "Deposited Yields" },
    { id: "withdrawal", label: "Withdrawal Requests", badge: 2 },
    { id: "activity", label: "Your Activity" },
  ]

  return (
    <DashboardTabs
      tabs={tabs}
      activeTab={activeTab || "deposited"}
      onTabChange={onTabChange || (() => {})}
      className={className}
    />
  )
}
