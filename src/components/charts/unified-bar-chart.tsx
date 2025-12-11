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
import { designTokens } from "@/lib/design-system"

export interface BarChartDataPoint {
  value: number
  label?: string
  date?: string
  formattedValue?: string
  formattedDate?: string
}

export interface UnifiedBarChartProps {
  data: BarChartDataPoint[]
  barColor?: string
  onHover?: (dataPoint: BarChartDataPoint | null, index: number | null) => void
  className?: string
  height?: number
  maxValue?: number
  barWidth?: number
  barGap?: string
  radius?: [number, number, number, number]
}

/**
 * Unified Bar Chart Component with Hover States
 * 
 * Features:
 * - All bars start dark (full opacity)
 * - On hover: hovered bar stays dark, others lighten to opacity 0.2
 * - Supports dynamic value/date updates via onHover callback
 * - Can be used for TVL charts (home page and yields page)
 */
export function UnifiedBarChart({
  data,
  barColor = designTokens.colors.primary,
  onHover,
  className = "",
  height = 400,
  maxValue,
  barWidth = 10,
  barGap = "4px",
  radius = [2, 2, 0, 0],
}: UnifiedBarChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  
  const calculatedMaxValue = maxValue || Math.max(...data.map(d => d.value), 0)

  
  const chartData = data.map((item, index) => ({
    ...item,
    index,
  }))

  
  
  const CustomBarShape = (props: any) => {
    const { payload, x, y, width, height } = props
    
    
    let barIndex = -1
    if (payload?.index !== undefined) {
      barIndex = payload.index
    } else {
      
      barIndex = chartData.findIndex(d => {
        return d.value === payload?.value && d.label === payload?.label
      })
    }
    
    const isHovered = hoveredIndex === barIndex
    const hasHover = hoveredIndex !== null
    
    
    
    const opacity = hasHover ? (isHovered ? 1 : 0.25) : 1

    const handleMouseEnter = () => {
      if (barIndex >= 0 && barIndex < chartData.length) {
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
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={barColor}
          opacity={opacity}
          rx={radius[0]}
          ry={radius[1]}
          style={{
            transition: "opacity 0.2s ease-in-out",
            cursor: "pointer",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      </g>
    )
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
          <Bar
            dataKey="value"
            fill={barColor}
            radius={radius}
            shape={CustomBarShape}
            barSize={barWidth}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
