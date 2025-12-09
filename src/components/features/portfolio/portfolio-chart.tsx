"use client"

import * as React from "react"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"
import { UnifiedChartContainer } from "@/components/charts/unified-chart-container"
import { DropdownSelector, type DropdownOption } from "@/components/ui/dropdown-selector"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface StackedBarChartDataPoint {
  [key: string]: number | string | undefined
  segment1?: number
  segment2?: number
  segment3?: number
  total?: number
  date?: string
  formattedDate?: string
  index?: number
}
import { cn } from "@/lib/utils"

interface PortfolioChartProps {
  className?: string
}

const filterTabs = [
  { id: "total", label: "Total Portfolio Value" },
  { id: "syusd", label: "syUSD" },
  { id: "syeth", label: "syETH" },
  { id: "sybtc", label: "syBTC" },
]

const chartData = [
  { segment1: 56, segment2: 142, segment3: 81 },
  { segment1: 151, segment2: 40, segment3: 133 },
  { segment1: 106, segment2: 166, segment3: 70 },
  { segment1: 100, segment2: 226, segment3: 40 },
  { segment1: 170, segment2: 38, segment3: 133 },
  { segment1: 93, segment2: 120, segment3: 93 },
  { segment1: 55, segment2: 102, segment3: 102 },
  { segment1: 64, segment2: 206, segment3: 50 },
  { segment1: 64, segment2: 206, segment3: 50 },
  { segment1: 64, segment2: 206, segment3: 50 },
  { segment1: 111, segment2: 50, segment3: 128 },
  { segment1: 179, segment2: 38, segment3: 133 },
  { segment1: 140, segment2: 58, segment3: 124 },
  { segment1: 52, segment2: 200, segment3: 52 },
  { segment1: 52, segment2: 200, segment3: 52 },
  { segment1: 52, segment2: 200, segment3: 52 },
  { segment1: 135, segment2: 50, segment3: 128 },
  { segment1: 92, segment2: 176, segment3: 65 },
  { segment1: 169, segment2: 42, segment3: 132 },
  { segment1: 81, segment2: 142, segment3: 81 },
  { segment1: 81, segment2: 142, segment3: 81 },
  { segment1: 81, segment2: 142, segment3: 81 },
  { segment1: 73, segment2: 230, segment3: 38 },
  { segment1: 127, segment2: 166, segment3: 70 },
  { segment1: 178, segment2: 120, segment3: 93 },
  { segment1: 126, segment2: 52, segment3: 126 },
  { segment1: 144, segment2: 64, segment3: 121 },
  { segment1: 146, segment2: 102, segment3: 102 },
  { segment1: 86, segment2: 86, segment3: 134 },
  { segment1: 91, segment2: 107, segment3: 107 },
  { segment1: 91, segment2: 107, segment3: 107 },
  { segment1: 94, segment2: 164, segment3: 70 },
  { segment1: 177, segment2: 58, segment3: 124 },
  { segment1: 121, segment2: 62, segment3: 121 },
  { segment1: 183, segment2: 34, segment3: 136 },
  { segment1: 189, segment2: 40, segment3: 132 },
  { segment1: 78, segment2: 150, segment3: 78 },
  { segment1: 146, segment2: 102, segment3: 102 },
  { segment1: 86, segment2: 86, segment3: 134 },
  { segment1: 93, segment2: 166, segment3: 69 },
  { segment1: 183, segment2: 66, segment3: 120 },
  { segment1: 128, segment2: 80, segment3: 113 },
  { segment1: 128, segment2: 80, segment3: 113 },
  { segment1: 86, segment2: 86, segment3: 134 },
  { segment1: 137, segment2: 62, segment3: 121 },
  { segment1: 125, segment2: 142, segment3: 82 },
  { segment1: 117, segment2: 70, segment3: 117 },
  { segment1: 86, segment2: 86, segment3: 134 },
  { segment1: 110, segment2: 160, segment3: 72 },
  { segment1: 110, segment2: 160, segment3: 72 },
  { segment1: 81, segment2: 142, segment3: 81 },
  { segment1: 91, segment2: 170, segment3: 68 },
  { segment1: 111, segment2: 138, segment3: 83 },
  { segment1: 111, segment2: 138, segment3: 83 },
].map(item => ({
  ...item,
  total: item.segment1 + item.segment2 + item.segment3
}))

const barColor = designTokens.colors.primary
const dates = ["11 AUG", "12 AUG", "13 AUG", "14 AUG", "15 AUG", "16 AUG", "17 AUG"]

// Format chart data with dates
const formatPortfolioData = (): StackedBarChartDataPoint[] => {
  const rawData = [
    { segment1: 56, segment2: 142, segment3: 81 },
    { segment1: 151, segment2: 40, segment3: 133 },
    { segment1: 106, segment2: 166, segment3: 70 },
    { segment1: 100, segment2: 226, segment3: 40 },
    { segment1: 170, segment2: 38, segment3: 133 },
    { segment1: 93, segment2: 120, segment3: 93 },
    { segment1: 55, segment2: 102, segment3: 102 },
    { segment1: 64, segment2: 206, segment3: 50 },
    { segment1: 64, segment2: 206, segment3: 50 },
    { segment1: 64, segment2: 206, segment3: 50 },
    { segment1: 111, segment2: 50, segment3: 128 },
    { segment1: 179, segment2: 38, segment3: 133 },
    { segment1: 140, segment2: 58, segment3: 124 },
    { segment1: 52, segment2: 200, segment3: 52 },
    { segment1: 52, segment2: 200, segment3: 52 },
    { segment1: 52, segment2: 200, segment3: 52 },
    { segment1: 135, segment2: 50, segment3: 128 },
    { segment1: 92, segment2: 176, segment3: 65 },
    { segment1: 169, segment2: 42, segment3: 132 },
    { segment1: 81, segment2: 142, segment3: 81 },
    { segment1: 81, segment2: 142, segment3: 81 },
    { segment1: 81, segment2: 142, segment3: 81 },
    { segment1: 73, segment2: 230, segment3: 38 },
    { segment1: 127, segment2: 166, segment3: 70 },
    { segment1: 178, segment2: 120, segment3: 93 },
    { segment1: 126, segment2: 52, segment3: 126 },
    { segment1: 144, segment2: 64, segment3: 121 },
    { segment1: 146, segment2: 102, segment3: 102 },
    { segment1: 86, segment2: 86, segment3: 134 },
    { segment1: 91, segment2: 107, segment3: 107 },
    { segment1: 91, segment2: 107, segment3: 107 },
    { segment1: 94, segment2: 164, segment3: 70 },
    { segment1: 177, segment2: 58, segment3: 124 },
    { segment1: 121, segment2: 62, segment3: 121 },
    { segment1: 183, segment2: 34, segment3: 136 },
    { segment1: 189, segment2: 40, segment3: 132 },
    { segment1: 78, segment2: 150, segment3: 78 },
    { segment1: 146, segment2: 102, segment3: 102 },
    { segment1: 86, segment2: 86, segment3: 134 },
    { segment1: 93, segment2: 166, segment3: 69 },
    { segment1: 183, segment2: 66, segment3: 120 },
    { segment1: 128, segment2: 80, segment3: 113 },
    { segment1: 128, segment2: 80, segment3: 113 },
    { segment1: 86, segment2: 86, segment3: 134 },
    { segment1: 137, segment2: 62, segment3: 121 },
    { segment1: 125, segment2: 142, segment3: 82 },
    { segment1: 117, segment2: 70, segment3: 117 },
    { segment1: 86, segment2: 86, segment3: 134 },
    { segment1: 110, segment2: 160, segment3: 72 },
    { segment1: 110, segment2: 160, segment3: 72 },
    { segment1: 81, segment2: 142, segment3: 81 },
    { segment1: 91, segment2: 170, segment3: 68 },
    { segment1: 111, segment2: 138, segment3: 83 },
    { segment1: 111, segment2: 138, segment3: 83 },
  ]

  // Group bars by date (8 bars per day for first 6 days, 6 bars for last day)
  const barsPerDay = [8, 8, 8, 8, 8, 8, 6]
  
  return rawData.map((item, index) => {
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
    
    const total = item.segment1 + item.segment2 + item.segment3
    
    return {
      ...item,
      total,
      date: dates[dateIndex] || dates[dates.length - 1],
      formattedDate: dates[dateIndex] || dates[dates.length - 1],
    }
  })
}

export function PortfolioChart({ className }: PortfolioChartProps) {
  const [activeFilter, setActiveFilter] = React.useState("total")
  const [timePeriod, setTimePeriod] = React.useState("1M")
  const [displayValue, setDisplayValue] = React.useState("$15,289.28")
  const [displayDate, setDisplayDate] = React.useState("")
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  const chartData = formatPortfolioData().map((item, index) => ({
    ...item,
    index,
  }))

  // Custom bar shapes for each segment with hover handling and vertical gaps
  const createCustomBarShape = (fill: string, radius: [number, number, number, number], segmentKey: 'segment1' | 'segment2' | 'segment3') => {
    return (props: any) => {
      const { payload, x, y, width, height } = props
      const barIndex = payload?.index ?? chartData.findIndex(d => 
        d.segment1 === payload?.segment1 && 
        d.segment2 === payload?.segment2 && 
        d.segment3 === payload?.segment3
      )
      const isHovered = hoveredIndex === barIndex
      
      // All bars start light (opacity 0.25)
      // On hover: hovered bar becomes dark (opacity 1), others stay light (opacity 0.25)
      const opacity = isHovered ? 1 : 0.25

      // Calculate gap adjustments for 2px vertical gaps between segments
      // In Recharts, y is the top coordinate and segments stack from bottom to top
      // segment3 (bottom): reduce height by 1px to create gap above
      // segment2 (middle): move down 1px and reduce height by 2px (gaps above and below)
      // segment1 (top): move down 1px and reduce height by 1px (gap below)
      let adjustedY = y
      let adjustedHeight = height
      
      if (segmentKey === 'segment3') {
        // Bottom segment: reduce height by 1px to create gap above
        adjustedY = y + 1
        adjustedHeight = height - 1
      } else if (segmentKey === 'segment2') {
        // Middle segment: move down 1px (gap after segment3) and reduce height by 2px (gaps above and below)
        adjustedY = y + 1
        adjustedHeight = height - 2
      } else if (segmentKey === 'segment1') {
        // Top segment: move down 1px (gap after segment2) and reduce height by 1px
        adjustedY = y + 1
        adjustedHeight = height - 1
      }

      const handleMouseEnter = () => {
        if (barIndex >= 0 && barIndex < chartData.length) {
          setHoveredIndex(barIndex)
          const dataPoint = chartData[barIndex]
          if (dataPoint.formattedDate) {
            setDisplayDate(dataPoint.formattedDate)
          }
        }
      }

      const handleMouseLeave = () => {
        setHoveredIndex(null)
        setDisplayDate("")
      }

      return (
        <rect
          x={x}
          y={adjustedY}
          width={width}
          height={adjustedHeight}
          fill={fill}
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
      )
    }
  }

  const timeRangeOptions: DropdownOption<string>[] = [
    { id: "1M", label: "1M" },
    { id: "3M", label: "3M" },
    { id: "6M", label: "6M" },
    { id: "1Y", label: "1Y" },
  ]

  const filterOptions: DropdownOption<string>[] = [
    { id: "total", label: "Total Portfolio Value" },
    { id: "syusd", label: "syUSD" },
    { id: "syeth", label: "syETH" },
    { id: "sybtc", label: "syBTC" },
  ]

  return (
    <UnifiedChartContainer className={className}>

      <div 
        className="absolute overflow-hidden"
        style={{ 
          left: '36px',
          top: '156px',
          right: '36px',
          bottom: '60px',
        }}
        onMouseLeave={() => {
          setHoveredIndex(null)
          setDisplayDate("")
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
              dataKey="segment3"
              stackId="a"
              fill="transparent"
              shape={createCustomBarShape(barColor, [0, 0, 2, 2], 'segment3')}
              barSize={10}
            />
            <Bar
              dataKey="segment2"
              stackId="a"
              fill="transparent"
              shape={createCustomBarShape(barColor, [0, 0, 0, 0], 'segment2')}
            />
            <Bar
              dataKey="segment1"
              stackId="a"
              fill="transparent"
              shape={createCustomBarShape(barColor, [2, 2, 0, 0], 'segment1')}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Date Labels */}
      <div 
        className="absolute flex items-center justify-between text-center"
        style={{ 
          left: '36px',
          top: '668px',
          width: '596px',
          opacity: 0.9,
        }}
      >
        {dates.map((date, index) => (
          <p 
            key={index}
            className={`${typographyClasses.label1} opacity-80`}
            style={{ color: designTokens.colors.text.primary }}
          >
            {date}
          </p>
        ))}
      </div>

      {/* Header Section - Filter Tabs and Controls */}
      <div 
        className="absolute flex flex-col z-10"
        style={{ 
          left: '36px',
          top: '32px',
          width: '596px',
          gap: '12px',
        }}
      >
        <div className="flex items-center justify-between w-full">
          <div 
            className="flex items-center rounded-[99px] border border-solid h-[24px]"
            style={{ 
              borderColor: designTokens.colors.border.separator,
              backgroundColor: designTokens.colors.background.main,
              gap: '4px',
            }}
          >
            {filterOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setActiveFilter(option.id)}
                className={cn(
                  "flex items-center justify-center rounded-[99px] h-full px-[12px] py-[4px] transition-all cursor-pointer border border-solid bg-transparent",
                  activeFilter === option.id ? "" : "border-transparent"
                )}
                style={{
                  borderColor: activeFilter === option.id ? designTokens.colors.primary : 'transparent',
                }}
              >
                <p 
                  className={typographyClasses.label1}
                  style={{
                    color: activeFilter === option.id 
                      ? designTokens.colors.primary 
                      : designTokens.colors.text.muted,
                    fontWeight: activeFilter === option.id ? 500 : 400,
                  }}
                >
                  {option.label}
                </p>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-[8px]">
            <DropdownSelector
              selectedValue={timePeriod}
              onValueChange={setTimePeriod}
              options={timeRangeOptions}
              minWidth="80px"
            />

            <div 
              className="flex items-center justify-center rounded-[99px] px-[6px] py-[2px] border border-solid"
              style={{
                backgroundColor: `${designTokens.colors.status.success}1A`,
                borderColor: designTokens.colors.status.success,
              }}
            >
              <p 
                className={typographyClasses.label1}
                style={{ 
                  color: designTokens.colors.status.success,
                  fontWeight: 500,
                }}
              >
                +2.23%
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start w-full">
          <div className="flex items-center gap-[8px]">
            <p 
              className={typographyClasses.heading1}
              style={{ color: designTokens.colors.text.primary }}
            >
              <span style={{ opacity: 0.5 }}>$</span>{displayValue.replace('$', '')}
            </p>
            <div 
              className="flex items-center justify-center rounded-[99px] px-[6px] py-[2px] border border-solid"
              style={{
                backgroundColor: `${designTokens.colors.status.success}1A`,
                borderColor: designTokens.colors.status.success,
              }}
            >
              <p 
                className={typographyClasses.label1}
                style={{ 
                  color: designTokens.colors.status.success,
                  fontWeight: 500,
                }}
              >
                $289.28
              </p>
            </div>
          </div>
        </div>
      </div>
    </UnifiedChartContainer>
  )
}
