"use client"

import { TVLChart } from "@/components/charts/tvl-chart"

interface TVLTabProps {
  currentValue?: string
  currentDate?: string
  isEmpty?: boolean
}

/**
 * TVLTab Component - Wrapper for unified TVLChart in yields variant
 * 
 * This component is a thin wrapper around the unified TVLChart component
 * to maintain the existing API for the yields dashboard.
 */
export function TVLTab({ 
  currentValue = "$185,053",
  currentDate = "Current Date",
  isEmpty = false,
}: TVLTabProps) {
  return (
    <TVLChart
      variant="yields"
      isEmpty={isEmpty}
      totalValue={currentValue}
      date={currentDate}
    />
  )
}
