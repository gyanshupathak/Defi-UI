"use client"

import * as React from "react"
import { designTokens } from "@/lib/design-system"
import { cn } from "@/lib/utils"

interface BaseChartContainerProps {
  children: React.ReactNode
  className?: string
  width?: string | number
  height?: string | number
  opacity?: number
  variant?: "neumorphic" | "simple" | "dashboard"
}

export function BaseChartContainer({ 
  children, 
  className,
  width,
  height,
  opacity = 1,
  variant = "simple"
}: BaseChartContainerProps) {
  if (variant === "neumorphic") {
    const containerWidth = width || designTokens.spacing.graph.tvlChart.width
    const containerHeight = height || designTokens.spacing.graph.tvlChart.height
    
    return (
      <div 
        className={cn("relative", className)}
        style={{ 
          width: containerWidth,
          height: containerHeight,
          backgroundColor: designTokens.colors.background.main,
          borderRadius: designTokens.spacing.graph.tvlChart.outerRadius,
        }}
      >
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ 
            width: containerWidth,
            height: containerHeight,
            borderRadius: designTokens.spacing.graph.tvlChart.outerRadius,
            backgroundColor: designTokens.colors.background.main,
            boxShadow: designTokens.shadows.graphOuter
          }}
        />
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
        {children}
      </div>
    )
  }
  if (variant === "dashboard") {
    return (
      <div 
        className={cn("absolute overflow-hidden", className)}
        style={{
          left: '24px',
          top: '108px',
          width: width || '620px',
          height: height || '400px',
          opacity,
        }}
      >
        {children}
      </div>
    )
  }
  return (
    <div 
      className={cn("relative overflow-hidden", className)}
      style={{
        width: width || '100%',
        height: height || '100%',
        opacity,
      }}
    >
      {children}
    </div>
  )
}
