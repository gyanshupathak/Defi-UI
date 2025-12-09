"use client"

import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

export interface StackedBarChartDataPoint {
  [key: string]: number | string | undefined
  // Common fields
  label?: string
  date?: string
  formattedValue?: string
  formattedDate?: string
}

export interface UnifiedStackedBarChartProps {
  data: StackedBarChartDataPoint[]
  stackKeys: string[] // e.g., ["segment1", "segment2", "segment3"]
  colors: string[] // Colors for each stack segment
  onHover?: (dataPoint: StackedBarChartDataPoint | null, index: number | null) => void
  className?: string
  height?: number
  maxValue?: number
  barGap?: string
  radius?: { [key: string]: [number, number, number, number] } // Radius for each stack key
}

/**
 * Unified Stacked Bar Chart Component with Hover States
 * 
 * Features:
 * - All bars start dark (full opacity)
 * - On hover: hovered bar stays dark, others lighten to opacity 0.2
 * - Supports dynamic value/date updates via onHover callback
 * - Can be used for Portfolio and Allocations charts
 */
export function UnifiedStackedBarChart({
  data,
  stackKeys,
  colors,
  onHover,
  className = "",
  height = 400,
  maxValue,
  barGap = "4px",
  radius = {},
}: UnifiedStackedBarChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  // Calculate max value if not provided (sum of all segments)
  const calculatedMaxValue = maxValue || Math.max(
    ...data.map(d => 
      stackKeys.reduce((sum, key) => sum + (typeof d[key] === 'number' ? d[key] : 0), 0)
    ),
    0
  )

  // Format data for Recharts with index
  const chartData = data.map((item, index) => ({
    ...item,
    index,
  }))

  // Custom cell component for hover states
  const CustomCell = ({ 
    index, 
    fill 
  }: { 
    index: number
    fill?: string
  }) => {
    const isHovered = hoveredIndex === index
    const hasHover = hoveredIndex !== null
    
    // If no bar is hovered, all bars are dark (opacity 1)
    // If a bar is hovered, that bar is dark (opacity 1), others are light (opacity 0.25)
    const opacity = hasHover ? (isHovered ? 1 : 0.25) : 1

    return (
      <Cell
        key={`cell-${index}`}
        fill={fill}
        opacity={opacity}
        style={{
          transition: "opacity 0.2s ease-in-out",
          cursor: "pointer",
        }}
      />
    )
  }

  // Handle mouse enter on bar - works for any segment of the stacked bar
  const handleMouseEnter = (data: any, index?: number) => {
    // Find index from data if not provided
    let barIndex = index
    if (barIndex === undefined && data) {
      // Find by matching index property or by comparing data
      barIndex = chartData.findIndex(d => {
        if (d.index !== undefined && data.index !== undefined) {
          return d.index === data.index
        }
        // Try to match by comparing all stack key values
        return stackKeys.every(key => d[key] === data[key])
      })
    }
    
    if (barIndex !== undefined && barIndex >= 0 && barIndex < chartData.length) {
      setHoveredIndex(barIndex)
      if (onHover) {
        const dataPoint = chartData[barIndex]
        onHover(dataPoint, barIndex)
      }
    }
  }

  // Handle mouse leave from bar
  const handleMouseLeave = () => {
    setHoveredIndex(null)
    if (onHover) {
      onHover(null, null)
    }
  }

  return (
    <div 
      className={className} 
      style={{ width: "100%", height }}
      onMouseLeave={() => {
        setHoveredIndex(null)
        if (onHover) {
          onHover(null, null)
        }
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          barCategoryGap={barGap}
        >
          <CartesianGrid strokeDasharray="none" stroke="transparent" />
          <XAxis hide />
          <YAxis hide domain={[0, calculatedMaxValue]} />
          <Tooltip contentStyle={{ display: 'none' }} />
          {stackKeys.map((key, stackIndex) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={colors[stackIndex] || "#7F56D9"}
              radius={radius[key] || [0, 0, 0, 0]}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              barSize={stackIndex === 0 ? 10 : undefined}
            >
              {chartData.map((entry, index) => (
                <CustomCell 
                  key={`cell-${key}-${index}`} 
                  index={index}
                  fill={colors[stackIndex]}
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

