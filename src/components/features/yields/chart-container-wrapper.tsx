"use client"

import * as React from "react"
import { BaseChartContainer } from "@/components/charts/base-chart-container"

interface ChartContainerWrapperProps {
  children: React.ReactNode
  className?: string
  opacity?: number
}

export function ChartContainerWrapper({ 
  children, 
  className = "",
  opacity = 1 
}: ChartContainerWrapperProps) {
  return (
    <BaseChartContainer
      variant="dashboard"
      className={className}
      width="620px"
      height="400px"
      opacity={opacity}
    >
      {children}
    </BaseChartContainer>
  )
}

