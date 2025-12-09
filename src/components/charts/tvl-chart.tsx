"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { UnifiedChartContainer } from "./unified-chart-container"
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

interface ChartDataPoint {
  value: number
  label?: string
  date?: string
  formattedValue?: string
  formattedDate?: string
  index?: number
}

interface TVLChartProps {
  data?: number[]
  totalValue?: string
  date?: string
  className?: string
}

// Default data - exact heights from Figma (in pixels, max 500px)
const defaultData = [
  100, 100, 100, 100, 100, 100, 100, 100, // First 8 bars at 100px
  378, 319, 319, 419, 319, 319, 334, 334, 219, 387, 378, // Bars 9-19
  425, 425, 413, 244, 244, 319, 169, 419, 419, 375, 354, // Bars 20-30
  354, 419, 378, 257, 366, 500, 225, 225, 253, 253, 213, // Bars 31-41 (bar 36 is tallest at 500px)
  260, 260, 249, 249, 369, 369, 433, 449, 470, 481, 487, 492, 492 // Bars 42-54 (ending high)
]

const dates = ["11 AUG", "12 AUG", "13 AUG", "14 AUG", "15 AUG", "16 AUG", "17 AUG"]

// Convert data array to ChartDataPoint format
const formatDataForChart = (
  data: number[],
  defaultTotalValue: string,
  defaultDate: string
): ChartDataPoint[] => {
  // Group bars by date (8 bars per day for first 6 days, 6 bars for last day)
  const barsPerDay = [8, 8, 8, 8, 8, 8, 6]
  let barIndex = 0
  
  return data.map((value, index) => {
    // Find which date this bar belongs to
    let dateIndex = 0
    let cumulativeBars = 0
    for (let i = 0; i < barsPerDay.length; i++) {
      cumulativeBars += barsPerDay[i]
      if (index < cumulativeBars) {
        dateIndex = i
        break
      }
    }
    
    // Calculate approximate value based on bar height (scaled to TVL)
    // Assuming max bar height (500px) corresponds to max TVL
    const maxBarHeight = 500
    const scaleFactor = parseFloat(defaultTotalValue.replace(/[^0-9.]/g, '')) / maxBarHeight
    const calculatedValue = value * scaleFactor
    
    return {
      value,
      label: `bar-${index}`,
      date: dates[dateIndex] || defaultDate,
      formattedValue: `$${Math.round(calculatedValue).toLocaleString()}`,
      formattedDate: dates[dateIndex] || defaultDate,
    }
  })
}

/**
 * TVLChart Component - Exact Figma Implementation with Hover States
 * 
 * Displays Total Value Locked with bar chart
 * All measurements, colors, and shadows from Figma design system
 * 
 * Props:
 * - data: Array of bar heights (default: 54 bars from Figma)
 * - dataPoints: Pre-formatted data points with dates/values (for yields page)
 * - totalValue: Default TVL amount to display (default: "$585,937")
 * - date: Default date to display (default: "12 November 2025")
 * - className: Additional CSS classes
 * - variant: "home" for home page (total TVL), "yields" for yields page (strategy TVL)
 * 
 * Exact Figma Specifications:
 * - Container: 668px × 716px
 * - Outer border radius: 16px
 * - Inner border radius: 12px
 * - Gap between containers: 12px
 * - Border: 2px solid rgba(255,255,255,0.64)
 * - Bar width: 10px, gap: 2px, max height: 500px
 * - Hover states: All bars dark initially, hovered bar stays dark, others lighten
 */
export function TVLChart({ 
  data = defaultData, 
  totalValue = "$585,937",
  date = "12 November 2025",
  className
}: TVLChartProps) {
  const [displayValue, setDisplayValue] = React.useState(totalValue)
  const [displayDate, setDisplayDate] = React.useState(date)
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  // Format data with index
  const chartData = formatDataForChart(data, totalValue, date).map((item, index) => ({
    ...item,
    index,
  }))

  // Custom bar shape that handles hover directly
  const CustomBarShape = (props: any) => {
    const { payload, x, y, width, height } = props
    const barIndex = payload?.index ?? chartData.findIndex(d => d.value === payload?.value && d.label === payload?.label)
    const isHovered = hoveredIndex === barIndex
    const hasHover = hoveredIndex !== null
    
    // All bars start light (opacity 0.25)
    // On hover: hovered bar becomes dark (opacity 1), others stay light (opacity 0.25)
    const opacity = isHovered ? 1 : 0.25

    const handleMouseEnter = () => {
      if (barIndex >= 0 && barIndex < chartData.length) {
        setHoveredIndex(barIndex)
        const dataPoint = chartData[barIndex]
        if (dataPoint.formattedValue && dataPoint.formattedDate) {
          setDisplayValue(dataPoint.formattedValue)
          setDisplayDate(dataPoint.formattedDate)
        }
      }
    }

    const handleMouseLeave = () => {
      setHoveredIndex(null)
      setDisplayValue(totalValue)
      setDisplayDate(date)
    }

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={designTokens.colors.primary}
        opacity={opacity}
        rx={2}
        ry={2}
        style={{
          transition: "opacity 0.2s ease-in-out",
          cursor: "pointer",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    )
  }

  return (
    <UnifiedChartContainer className={className}>
      {/* Chart Bars Container - Direct Recharts Implementation */}
      <div 
        className="absolute overflow-hidden"
        style={{ 
          left: designTokens.spacing.graph.tvlChart.contentPaddingX,
          top: designTokens.spacing.graph.tvlChart.barsTop,
          width: designTokens.spacing.graph.tvlChart.contentWidth,
          height: designTokens.spacing.graph.tvlChart.barsHeight,
        }}
        onMouseLeave={() => {
          setHoveredIndex(null)
          setDisplayValue(totalValue)
          setDisplayDate(date)
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            barCategoryGap="4px"
          >
            <CartesianGrid strokeDasharray="none" stroke="transparent" />
            <XAxis hide />
            <YAxis hide domain={[0, 500]} />
            <Tooltip contentStyle={{ display: 'none' }} />
            <Bar
              dataKey="value"
              fill={designTokens.colors.primary}
              shape={CustomBarShape}
              barSize={10}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Date Labels - Exact Figma Position */}
      <div 
        className="absolute flex items-center justify-between text-center"
        style={{ 
          left: designTokens.spacing.graph.tvlChart.contentPaddingX,
          top: designTokens.spacing.graph.tvlChart.datesTop,
          width: designTokens.spacing.graph.tvlChart.contentWidth,
          opacity: designTokens.spacing.graph.tvlChart.datesOpacity,
        }}
      >
        {dates.map((date, index) => (
          <p 
            key={index}
            className={typographyClasses.label1}
            style={{ 
              color: designTokens.colors.text.primary,
              opacity: designTokens.spacing.graph.tvlChart.dateOpacity,
            }}
          >
            {date}
          </p>
        ))}
      </div>

      {/* TVL Header - Exact Figma Position */}
      <div 
        className="absolute flex flex-col"
        style={{ 
          left: designTokens.spacing.graph.tvlChart.contentPaddingX,
          top: designTokens.spacing.graph.tvlChart.contentTop,
          width: designTokens.spacing.graph.tvlChart.contentWidth,
          gap: designTokens.spacing.text.labelHeadingGap,
        }}
      >
        {/* Label */}
        <div className="flex items-end w-full">
          <p 
            className={`flex-1 ${typographyClasses.label1}`}
            style={{ color: designTokens.colors.graph.labelMuted }}
          >
            Total Value Locked
          </p>
        </div>
        
        {/* Value and Date - Updates on hover */}
        <div 
          className="flex flex-col items-start w-full leading-normal whitespace-pre-wrap"
          style={{ 
            gap: designTokens.spacing.graph.tvlChart.headerGap,
            color: designTokens.colors.graph.heading,
          }}
        >
          <p 
            className={`${typographyClasses.display1} w-full`}
            style={{ letterSpacing: designTokens.spacing.graph.tvlChart.valueTracking }}
          >
            {displayValue}
          </p>
          <p 
            className={`${typographyClasses.label1} w-full`}
            style={{ opacity: designTokens.spacing.graph.tvlChart.labelOpacity }}
          >
            {displayDate}
          </p>
        </div>
      </div>
    </UnifiedChartContainer>
  )
}
