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
  
  label?: string
  date?: string
  formattedValue?: string
  formattedDate?: string
}

export interface UnifiedStackedBarChartProps {
  data: StackedBarChartDataPoint[]
  stackKeys: string[] 
  colors: string[] 
  onHover?: (dataPoint: StackedBarChartDataPoint | null, index: number | null) => void
  className?: string
  height?: number
  maxValue?: number
  barGap?: string
  radius?: { [key: string]: [number, number, number, number] } 
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

  
  const calculatedMaxValue = maxValue || Math.max(
    ...data.map(d => 
      stackKeys.reduce((sum, key) => sum + (typeof d[key] === 'number' ? d[key] : 0), 0)
    ),
    0
  )

  
  const chartData = data.map((item, index) => ({
    ...item,
    index,
  }))

  
  const CustomCell = ({ 
    index, 
    fill 
  }: { 
    index: number
    fill?: string
  }) => {
    const isHovered = hoveredIndex === index
    const hasHover = hoveredIndex !== null
    
    
    
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

  
  const handleMouseEnter = (data: any, index?: number) => {
    
    let barIndex = index
    if (barIndex === undefined && data) {
      
      barIndex = chartData.findIndex(d => {
        if (d.index !== undefined && data.index !== undefined) {
          return d.index === data.index
        }
        
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
