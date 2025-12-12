"use client"

import { TVLChart } from "@/components/charts/tvl-chart"

interface TVLTabProps {
  currentValue?: string
  currentDate?: string
  isEmpty?: boolean
}

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
