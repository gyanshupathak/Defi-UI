"use client"

import * as React from "react"
import { designTokens } from "@/lib/design-system"
import { cn } from "@/lib/utils"

interface ChartContainerProps {
  children: React.ReactNode
  className?: string
  width?: string
  height?: string
}

/**
 * ChartContainer Component - Reusable Neumorphic Container
 * 
 * Provides the outer shadow and inner border styling used by all chart components.
 * This container matches the exact Figma specifications for chart containers.
 * 
 * Props:
 * - children: Content to render inside the container
 * - className: Additional CSS classes
 * - width: Container width (default: 668px from design tokens)
 * - height: Container height (default: 716px from design tokens)
 * 
 * Exact Figma Specifications:
 * - Outer container: 668px × 716px with 16px border radius
 * - Outer shadow: 4px 4px 12px 0px rgba(127,86,217,0.12), -4px -4px 10px 0px #ffffff
 * - Inner container: 644px × 692px with 12px border radius, 12px from top
 * - Inner border: 2px solid rgba(255,255,255,0.64)
 * - Inner shadow: inset 10px 10px 18px 0px rgba(127,86,217,0.12), inset -8px -8px 10px 0px rgba(255,255,255,0.8)
 */
export function ChartContainer({ 
  children, 
  className,
  width = designTokens.spacing.graph.tvlChart.width,
  height = designTokens.spacing.graph.tvlChart.height,
}: ChartContainerProps) {
  return (
    <div 
      className={cn("relative", className)}
      style={{ 
        width,
        height,
        backgroundColor: designTokens.colors.background.main,
        borderRadius: designTokens.spacing.graph.tvlChart.outerRadius,
      }}
    >
      {}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ 
          width,
          height,
          borderRadius: designTokens.spacing.graph.tvlChart.outerRadius,
          backgroundColor: designTokens.colors.background.main,
          boxShadow: designTokens.shadows.graphOuter
        }}
      />
      
      {}
      <div 
        className="absolute left-1/2 -translate-x-1/2 border-2 border-solid"
        style={{ 
          top: designTokens.spacing.graph.tvlChart.innerTop,
          width: designTokens.spacing.graph.tvlChart.innerWidth,
          height: designTokens.spacing.graph.tvlChart.innerHeight,
          borderRadius: designTokens.spacing.graph.tvlChart.innerRadius,
          borderWidth: designTokens.spacing.graph.tvlChart.borderWidth,
          backgroundColor: designTokens.colors.background.main,
          borderColor: designTokens.spacing.graph.tvlChart.borderColor,
          boxShadow: designTokens.shadows.graphInner
        }}
      />
      
      {}
      {children}
    </div>
  )
}
