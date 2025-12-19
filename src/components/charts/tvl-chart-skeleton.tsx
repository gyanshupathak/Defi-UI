/**
 * TVL Chart Skeleton - Loading state for TVL charts
 * Matches the design system and provides smooth loading experience
 */

"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { UnifiedChartContainer } from "./unified-chart-container"
import { ChartContainerWrapper } from "@/components/features/yields/chart-container-wrapper"
import { cn } from "@/lib/utils"

interface TVLChartSkeletonProps {
  variant?: "home" | "yields"
  className?: string
}

export function TVLChartSkeleton({ 
  variant = "home",
  className 
}: TVLChartSkeletonProps) {
  // Generate skeleton bars with fixed heights to avoid hydration mismatch
  // Using a deterministic pattern instead of Math.random()
  const getBarHeight = (index: number) => {
    // Use a simple pattern based on index to create variation
    const pattern = [150, 180, 200, 170, 190, 160, 175, 185, 165, 195, 155, 180]
    return pattern[index % pattern.length]
  }
  
  const skeletonBars = Array(54).fill(0).map((_, i) => (
    <div
      key={i}
      className="animate-pulse"
      style={{
        width: '10px',
        height: `${getBarHeight(i)}px`,
        backgroundColor: designTokens.colors.background.gradient,
        borderRadius: '2px',
        opacity: 0.3,
      }}
    />
  ))

  if (variant === "home") {
    return (
      <UnifiedChartContainer className={cn("animate-pulse", className)}>
        {/* Skeleton bars */}
        <div 
          className="absolute flex items-end gap-[4px]"
          style={{ 
            left: designTokens.spacing.graph.tvlChart.contentPaddingX,
            top: designTokens.spacing.graph.tvlChart.barsTop,
            width: designTokens.spacing.graph.tvlChart.contentWidth,
            height: designTokens.spacing.graph.tvlChart.barsHeight,
          }}
        >
          {skeletonBars}
        </div>

        {/* Skeleton date labels */}
        <div 
          className="absolute flex items-center justify-between"
          style={{ 
            left: designTokens.spacing.graph.tvlChart.contentPaddingX,
            top: designTokens.spacing.graph.tvlChart.datesTop,
            width: designTokens.spacing.graph.tvlChart.contentWidth,
            opacity: 0.3,
          }}
        >
          {Array(7).fill(0).map((_, i) => (
            <div
              key={i}
              className="h-4 w-12 bg-current rounded"
              style={{ opacity: 0.2 }}
            />
          ))}
        </div>

        {/* Skeleton header */}
        <div 
          className="absolute flex flex-col"
          style={{ 
            left: designTokens.spacing.graph.tvlChart.contentPaddingX,
            top: designTokens.spacing.graph.tvlChart.contentTop,
            width: designTokens.spacing.graph.tvlChart.contentWidth,
            gap: designTokens.spacing.text.labelHeadingGap,
          }}
        >
          <div className="h-4 w-32 bg-current rounded" style={{ opacity: 0.2 }} />
          <div className="h-12 w-48 bg-current rounded" style={{ opacity: 0.15 }} />
          <div className="h-4 w-24 bg-current rounded" style={{ opacity: 0.2 }} />
        </div>
      </UnifiedChartContainer>
    )
  }

  // Yields variant skeleton
  return (
    <>
      <div 
        className="absolute flex flex-col items-start animate-pulse"
        style={{
          left: designTokens.spacing.card.paddingX,
          top: designTokens.spacing.card.paddingY,
          gap: designTokens.spacing.text.headingTickerGap,
        }}
      >
        <div className="h-12 w-48 bg-current rounded" style={{ opacity: 0.15 }} />
        <div className="h-4 w-32 bg-current rounded" style={{ opacity: 0.2 }} />
      </div>

      <ChartContainerWrapper>
        <div 
          className="absolute flex items-end gap-[4px] animate-pulse"
          style={{
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            padding: designTokens.spacing.card.paddingX,
          }}
        >
          {skeletonBars}
        </div>
      </ChartContainerWrapper>
    </>
  )
}

