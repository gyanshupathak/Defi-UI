"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { ChartContainerWrapper } from "./chart-container-wrapper"
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

interface TVLTabProps {
  currentValue?: string
  currentDate?: string
}

const dates = ["11 AUG", "12 AUG", "13 AUG", "14 AUG", "15 AUG", "16 AUG", "17 AUG"]

// Format bar data with dates and values
const formatBarData = (defaultValue: string): ChartDataPoint[] => {
  const barHeights = [
    73, 73, 73, 73, 73, 73, 73, 73,
    274, 232, 232, 304, 232, 232, 242, 242,
    158, 281, 274, 308, 308, 300, 177, 177,
    232, 123, 304, 304, 272, 257, 257, 304,
    274, 186, 266, 400, 163, 163, 183, 183,
    155, 189, 189, 120, 120, 268, 268, 274,
    232, 232, 304, 304, 272, 257,
  ]

  // Group bars by date (8 bars per day for first 6 days, 6 bars for last day)
  const barsPerDay = [8, 8, 8, 8, 8, 8, 6]
  let barIndex = 0
  
  // Calculate scale factor based on max bar height
  const maxBarHeight = 400
  const baseValue = parseFloat(defaultValue.replace(/[^0-9.]/g, ''))
  const scaleFactor = baseValue / maxBarHeight

  return barHeights.map((height, index) => {
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
    
    // Calculate value based on bar height
    const calculatedValue = height * scaleFactor
    
    return {
      value: height,
      label: `bar-${index}`,
      date: dates[dateIndex] || dates[dates.length - 1],
      formattedValue: `$${Math.round(calculatedValue).toLocaleString()}`,
      formattedDate: dates[dateIndex] || dates[dates.length - 1],
    }
  })
}

export function TVLTab({ 
  currentValue = "$185,053",
  currentDate = "Current Date"
}: TVLTabProps) {
  const [displayValue, setDisplayValue] = React.useState(currentValue)
  const [displayDate, setDisplayDate] = React.useState(currentDate)
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  // Format data with index
  const barData = formatBarData(currentValue).map((item, index) => ({
    ...item,
    index,
  }))

  // Custom bar shape that handles hover directly
  const CustomBarShape = (props: any) => {
    const { payload, x, y, width, height } = props
    const barIndex = payload?.index ?? barData.findIndex(d => d.value === payload?.value && d.label === payload?.label)
    const isHovered = hoveredIndex === barIndex
    const hasHover = hoveredIndex !== null
    
    // All bars start light (opacity 0.25)
    // On hover: hovered bar becomes dark (opacity 1), others stay light (opacity 0.25)
    const opacity = isHovered ? 1 : 0.25

    const handleMouseEnter = () => {
      if (barIndex >= 0 && barIndex < barData.length) {
        setHoveredIndex(barIndex)
        const dataPoint = barData[barIndex]
        if (dataPoint.formattedValue && dataPoint.formattedDate) {
          setDisplayValue(dataPoint.formattedValue)
          setDisplayDate(dataPoint.formattedDate)
        }
      }
    }

    const handleMouseLeave = () => {
      setHoveredIndex(null)
      setDisplayValue(currentValue)
      setDisplayDate(currentDate)
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
    <>
      <div 
        className="absolute flex flex-col items-start"
        style={{
          left: designTokens.spacing.card.paddingX,
          top: designTokens.spacing.card.paddingY,
          gap: designTokens.spacing.text.headingTickerGap,
        }}
      >
        <p 
          className={typographyClasses.display1}
          style={{ 
            color: designTokens.colors.text.primary,
          }}
        >
          {displayValue}
        </p>
        <p 
          className={typographyClasses.label1}
          style={{ 
            color: designTokens.colors.text.primary,
            opacity: 0.5,
          }}
        >
          {displayDate}
        </p>
      </div>

      <ChartContainerWrapper>
        <div
          onMouseLeave={() => {
            setHoveredIndex(null)
            setDisplayValue(currentValue)
            setDisplayDate(currentDate)
          }}
          style={{ width: "100%", height: "100%" }}
        >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            barCategoryGap="4px"
          >
            <CartesianGrid strokeDasharray="none" stroke="transparent" />
            <XAxis hide />
            <YAxis hide domain={[0, 400]} />
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
      </ChartContainerWrapper>
    </>
  )
}

