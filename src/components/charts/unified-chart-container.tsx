"use client"

import * as React from "react"
import { designTokens } from "@/lib/design-system"
import { cn } from "@/lib/utils"

interface UnifiedChartContainerProps {
  children: React.ReactNode
  className?: string
  width?: string | number
  height?: string | number
}

export function UnifiedChartContainer({ 
  children, 
  className,
  width = designTokens.spacing.graph.tvlChart.width,
  height = designTokens.spacing.graph.tvlChart.height,
}: UnifiedChartContainerProps) {
  return (
    <div 
      className={cn("relative", className)}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        backgroundColor: designTokens.colors.background.main,
        borderRadius: designTokens.spacing.graph.tvlChart.outerRadius,
      }}
    >
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[16px]"
        style={{ 
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          backgroundColor: designTokens.colors.background.main,
          boxShadow: designTokens.shadows.graphOuter
        }}
      />
      <div 
        className="absolute left-1/2 -translate-x-1/2 border-2 border-solid rounded-[12px]"
        style={{ 
          top: designTokens.spacing.graph.tvlChart.innerTop,
          width: designTokens.spacing.graph.tvlChart.innerWidth,
          height: designTokens.spacing.graph.tvlChart.innerHeight,
          borderWidth: designTokens.spacing.graph.tvlChart.borderWidth,
          backgroundColor: designTokens.colors.background.main,
          borderColor: designTokens.spacing.graph.tvlChart.borderColor,
          boxShadow: designTokens.shadows.graphInner
        }}
      />
      {children}
    </div>
  )
}
