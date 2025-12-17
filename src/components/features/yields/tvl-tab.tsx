"use client"

import { TVLChart } from "@/components/charts/tvl-chart"

interface TVLTabProps {
  currentValue?: string
  currentDate?: string
  isEmpty?: boolean
  vaultName?: "syUSD" | "syETH" | "syBTC"
}

export function TVLTab({ 
  currentValue,
  currentDate,
  isEmpty = false,
  vaultName = "syUSD",
}: TVLTabProps) {
  return (
    <TVLChart
      variant="yields"
      isEmpty={isEmpty}
      totalValue={currentValue}
      date={currentDate}
      vaultName={vaultName}
      useApi={true}
    />
  )
}
