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

/**
 * UnifiedChartContainer Component
 * 
 * Provides the neumorphic box UI for both TVL and Portfolio charts.
 * This ensures consistent styling and spacing across all chart components.
 * 
 * Exact Figma Specifications:
 * - Outer container: 668px × 716px with 16px border radius
 * - Outer shadow: 4px 4px 12px 0px rgba(127,86,217,0.12), -4px -4px 10px 0px #ffffff
 * - Inner container: 644px × 692px with 12px border radius, 12px from top
 * - Inner border: 2px solid rgba(255,255,255,0.64)
 * - Inner shadow: inset 10px 10px 18px 0px rgba(127,86,217,0.12), inset -8px -8px 10px 0px rgba(255,255,255,0.8)
 */
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
      {/* Outer Container - Drop Shadow */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[16px]"
        style={{ 
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          backgroundColor: designTokens.colors.background.main,
          boxShadow: designTokens.shadows.graphOuter
        }}
      />
      
      {/* Inner Container - Border + Inset Shadow */}
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
      
      {/* Content */}
      {children}
    </div>
  )
}

