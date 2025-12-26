"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { UnifiedChartContainer } from "./unified-chart-container"
import { ChartContainerWrapper } from "@/components/features/yields/chart-container-wrapper"
import { EmptyChart } from "./empty-chart"
import { TVLChartSkeleton } from "./tvl-chart-skeleton"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface ChartDataPoint {
  value: number
  label?: string
  date?: string
  formattedValue?: string
  formattedDate?: string
  index?: number
}

interface ChartDataPointWithDate {
  scaledValue: number
  originalValue: number
  date: string
  periodIndex?: number // Index of the period this data point belongs to (0-6)
}

interface TVLChartProps {
  data?: number[]
  totalValue?: string
  date?: string
  className?: string
  variant?: "home" | "yields"
  isEmpty?: boolean
  vaultName?: string // Dynamic vault name from API
  useApi?: boolean // Whether to fetch from API (default: true)
  period?: "daily" | "weekly" | "monthly" // Period for historical data
  isLoading?: boolean // Loading state for combined TVL
  periodDates?: string[] // Array of 7 date labels for x-axis
  chartDataWithDates?: ChartDataPointWithDate[] // Data with dates and original values for hover
}
const defaultHomeData = [
  100, 100, 100, 100, 100, 100, 100, 100, 
  378, 319, 319, 419, 319, 319, 334, 334, 219, 387, 378, 
  425, 425, 413, 244, 244, 319, 169, 419, 419, 375, 354, 
  354, 419, 378, 257, 366, 500, 225, 225, 253, 253, 213, 
  260, 260, 249, 249, 369, 369, 433, 449, 470, 481, 487, 492, 492 
]
const defaultYieldsData = [
  73, 73, 73, 73, 73, 73, 73, 73,
  274, 232, 232, 304, 232, 232, 242, 242,
  158, 281, 274, 308, 308, 300, 177, 177,
  232, 123, 304, 304, 272, 257, 257, 304,
  274, 186, 266, 400, 163, 163, 183, 183,
  155, 189, 189, 120, 120, 268, 268, 274,
  232, 232, 304, 304, 272, 257,
]
const emptyStateData = Array(54).fill(200)

/**
 * Generate dates for the last 7 days
 * Returns array of formatted dates like ["11 AUG", "12 AUG", ...]
 */
function generateDatesForLast7Days(): string[] {
  const dates: string[] = []
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    dates.push(`${day} ${month}`)
  }
  
  return dates
}

const formatDataForChart = (
  data: number[],
  defaultTotalValue: string,
  defaultDate: string,
  variant: "home" | "yields",
  periodDates?: string[] // Optional period dates for x-axis labels
): ChartDataPoint[] => {
  // Only use provided period dates from API (real data), don't generate dummy dates
  const chartDates = periodDates && periodDates.length === 7 ? periodDates : []
  
  // Calculate bars per period based on total data length
  // Distribute all bars across 7 periods
  const totalBars = data.length
  const numPeriods = 7
  const barsPerPeriod = Math.floor(totalBars / numPeriods)
  const remainder = totalBars % numPeriods
  const barsPerDay: number[] = Array(numPeriods).fill(barsPerPeriod)
  // Add remainder to last period
  barsPerDay[numPeriods - 1] += remainder
  
  const maxBarHeight = variant === "home" ? 500 : 400
  
  return data.map((value, index) => {
    // Determine which day this bar belongs to
    let dateIndex = 0
    let cumulativeBars = 0
    for (let i = 0; i < barsPerDay.length; i++) {
      cumulativeBars += barsPerDay[i]
      if (index < cumulativeBars) {
        dateIndex = i
        break
      }
    }
    
    // Calculate value from bar height (dummy data)
    // Parse the totalValue properly - handle "K" and "M" suffixes
    let numericValue = parseFloat(defaultTotalValue.replace(/[^0-9.]/g, ''))
    if (defaultTotalValue.includes('K')) {
      numericValue = numericValue * 1000
    } else if (defaultTotalValue.includes('M')) {
      numericValue = numericValue * 1000000
    }
    const scaleFactor = numericValue / maxBarHeight
    const calculatedValue = value * scaleFactor
    // Format the value properly with K/M suffixes
    let formattedValue: string
    if (calculatedValue >= 1_000_000) {
      formattedValue = `$${(calculatedValue / 1_000_000).toFixed(2)}M`
    } else if (calculatedValue >= 1_000) {
      formattedValue = `$${(calculatedValue / 1_000).toFixed(2)}K`
    } else {
      formattedValue = `$${Math.round(calculatedValue).toLocaleString()}`
    }
    
    return {
      value,
      label: `bar-${index}`,
      date: chartDates[dateIndex] || defaultDate,
      formattedValue,
      formattedDate: chartDates[dateIndex] || defaultDate,
    }
  })
}

export function TVLChart({ 
  variant = "home",
  isEmpty = false,
  data,
  totalValue,
  date,
  className,
  vaultName = "syUSD",
  useApi = true,
  period = "daily",
  isLoading = false,
  periodDates,
  chartDataWithDates,
}: TVLChartProps) {
  // Use the totalValue prop (combined TVL from syUSD + syBTC converted to USD)
  // Note: totalValue should be shown even if chart bars are empty (isEmpty=true)
  const effectiveFormattedValue = React.useMemo(() => {
    console.log('[TVLChart] isEmpty:', isEmpty)
    console.log('[TVLChart] totalValue:', totalValue)
    console.log('[TVLChart] variant:', variant)
    
    // Always use totalValue if provided, regardless of isEmpty
    // isEmpty only affects chart bars, not the total value display
    if (totalValue) {
      console.log('[TVLChart] Using provided totalValue:', totalValue)
      return totalValue
    }
    
    // Only use default if totalValue is not provided
    const defaultValue = variant === "home" ? "$585,937" : "$185,053"
    console.log('[TVLChart] Using default value:', defaultValue)
    return defaultValue
  }, [totalValue, variant])

  const defaultTotalValue = variant === "home" ? "$585,937" : "$185,053"
  const [displayValue, setDisplayValue] = React.useState(() => {
    // Always use effectiveFormattedValue, even if chart is empty
    // isEmpty only affects chart bars, not the total value display
    return effectiveFormattedValue
  })
  const todayDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
  const [displayDate, setDisplayDate] = React.useState(date || todayDate)
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  // Use dummy chart data (no deposits API)
  const chartDataArray = React.useMemo(() => {
    if (isEmpty) return emptyStateData
    return data || (variant === "home" ? defaultHomeData : defaultYieldsData)
  }, [isEmpty, data, variant])

  // Format chart data with actual dates and values from API
  const chartData = React.useMemo(() => {
    if (chartDataWithDates && chartDataWithDates.length > 0) {
      // Use actual data from API
      return chartDataWithDates.map((point, index) => {
        // Format date: "Month Day, Year" (e.g., "May 20, 2025")
        const dateObj = new Date(point.date)
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        })
        
        // Format value: Full number with commas, no K/M suffixes
        // Show full number with commas (e.g., 208,040)
        const formattedValue = `$${Math.round(point.originalValue).toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}`
        
        return {
          value: point.scaledValue,
          originalValue: point.originalValue,
          label: `bar-${index}`,
          date: formattedDate,
          formattedValue,
          formattedDate,
          index,
        }
      })
    }
    
    // Fallback to original formatDataForChart if no chartDataWithDates
    return formatDataForChart(
      chartDataArray, 
      effectiveFormattedValue, 
      displayDate, 
      variant,
      periodDates
    ).map((item, index) => ({
      ...item,
      index,
    }))
  }, [chartDataWithDates, chartDataArray, effectiveFormattedValue, displayDate, variant, periodDates])
  
  // Update display value and date when not hovering
  React.useEffect(() => {
    if (hoveredIndex === null) {
      const valueToUse = effectiveFormattedValue || defaultTotalValue
      setDisplayValue(valueToUse)
      setDisplayDate(date || todayDate)
    }
  }, [effectiveFormattedValue, hoveredIndex, defaultTotalValue, date, todayDate])
  
  // Don't show loading skeleton - show chart directly

  const CustomBarShape = (props: any) => {
    const { payload, x, y, width, height } = props
    const barIndex = payload?.index ?? chartData.findIndex((d: any) => d.value === payload?.value && d.label === payload?.label)
    const isHovered = hoveredIndex === barIndex
    
    const getBarFill = () => {
      if (isEmpty) {
        return "rgba(0, 0, 0, 1)"
      }
      return designTokens.colors.primary
    }
    
    const getBarOpacity = () => {
      if (isEmpty) {
        return 1 
      }
      return isHovered ? 1 : 0.25
    }

    const handleMouseEnter = () => {
      if (!isEmpty && barIndex >= 0 && barIndex < chartData.length) {
        setHoveredIndex(barIndex)
        const dataPoint = chartData[barIndex]
        if (dataPoint) {
          if (dataPoint.formattedValue) {
            setDisplayValue(dataPoint.formattedValue)
          }
          if (dataPoint.formattedDate) {
            setDisplayDate(dataPoint.formattedDate)
          }
        }
      }
    }

    const handleMouseLeave = () => {
      if (!isEmpty) {
        setHoveredIndex(null)
        const valueToUse = effectiveFormattedValue || defaultTotalValue
        setDisplayValue(valueToUse)
        setDisplayDate(date || new Date().toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        }))
      }
    }

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={isEmpty ? "#000000" : getBarFill()}
        fillOpacity={isEmpty ? 1 : undefined}
        opacity={isEmpty ? 1 : getBarOpacity()}
        rx={2}
        ry={2}
        style={{
          fill: isEmpty ? "#000000" : undefined,
          fillOpacity: isEmpty ? 1 : undefined,
          transition: isEmpty ? "none" : "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: isEmpty ? "default" : "pointer",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    )
  }

  if (isEmpty && variant === "yields") {
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
          <div 
            className={typographyClasses.display1}
            style={{ 
              color: designTokens.colors.text.primary,
            }}
          >
            {displayValue}
          </div>
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
          <EmptyChart
            barCount={54}
            barHeight={200}
            maxDomain={400}
            barsLeft="0"
            barsTop="0"
            barsWidth="100%"
            barsHeight="100%"
            dateLabelsLeft="24px"
            dateLabelsTop="519.26px"
            dateLabelsWidth="620px"
          />
        </ChartContainerWrapper>
      </>
    )
  }

  
  if (isEmpty && variant === "home") {
    return (
      <UnifiedChartContainer className={className}>
        <EmptyChart
          barCount={54}
          barHeight={200}
          maxDomain={500}
        />

        {}
        <div 
          className="absolute flex flex-col"
          style={{ 
            left: designTokens.spacing.graph.tvlChart.contentPaddingX,
            top: designTokens.spacing.graph.tvlChart.contentTop,
            width: designTokens.spacing.graph.tvlChart.contentWidth,
            gap: designTokens.spacing.text.labelHeadingGap,
          }}
        >
          <div className="flex items-end w-full">
            <p 
              className={`flex-1 ${typographyClasses.label1}`}
              style={{ color: designTokens.colors.graph.labelMuted }}
            >
              Total Value Locked
            </p>
          </div>
          
          <div 
            className="flex flex-col items-start w-full leading-normal whitespace-pre-wrap"
            style={{ 
              gap: designTokens.spacing.graph.tvlChart.headerGap,
              color: designTokens.colors.graph.heading,
            }}
          >
            <div 
              className={`${typographyClasses.display1} w-full`}
              style={{ letterSpacing: designTokens.spacing.graph.tvlChart.valueTracking }}
            >
            {displayValue}
            </div>
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

  
  if (variant === "home") {
  return (
    <UnifiedChartContainer className={className}>
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
          setDisplayValue(effectiveFormattedValue)
          setDisplayDate(date || new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          }))
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
            <Bar
              dataKey="value"
              fill="transparent"
              shape={CustomBarShape}
              barSize={10}
              activeBar={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Only show dates when periodDates is provided from API (real data) */}
      {periodDates && periodDates.length === 7 && (
        <div 
          className="absolute flex items-center justify-between text-center"
          style={{ 
            left: designTokens.spacing.graph.tvlChart.contentPaddingX,
            top: designTokens.spacing.graph.tvlChart.datesTop,
            width: designTokens.spacing.graph.tvlChart.contentWidth,
            opacity: designTokens.spacing.graph.tvlChart.datesOpacity,
          }}
        >
          {periodDates.map((date: string, index: number) => (
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
      )}

      <div 
        className="absolute flex flex-col"
        style={{ 
          left: designTokens.spacing.graph.tvlChart.contentPaddingX,
          top: designTokens.spacing.graph.tvlChart.contentTop,
          width: designTokens.spacing.graph.tvlChart.contentWidth,
          gap: designTokens.spacing.text.labelHeadingGap,
        }}
      >
        <div className="flex items-end w-full">
          <p 
            className={`flex-1 ${typographyClasses.label1}`}
            style={{ color: designTokens.colors.graph.labelMuted }}
          >
            Total Value Locked
          </p>
        </div>
        
        <div 
          className="flex flex-col items-start w-full leading-normal whitespace-pre-wrap"
          style={{ 
            gap: designTokens.spacing.graph.tvlChart.headerGap,
            color: designTokens.colors.graph.heading,
          }}
        >
          <div 
            className={`${typographyClasses.display1} w-full`}
            style={{ letterSpacing: designTokens.spacing.graph.tvlChart.valueTracking }}
          >
            {displayValue}
          </div>
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
        <div 
          className={typographyClasses.display1}
          style={{ 
            color: designTokens.colors.text.primary,
          }}
        >
          {displayValue}
        </div>
        <p 
          className={typographyClasses.label1}
          style={{ 
            color: designTokens.colors.text.primary,
            opacity: parseFloat(designTokens.colors.text.muted.replace('rgba(0, 0, 0, ', '').replace(')', '')),
          }}
        >
          {displayDate}
        </p>
      </div>

      <ChartContainerWrapper>
        <div
          onMouseLeave={() => {
            setHoveredIndex(null)
            setDisplayValue(effectiveFormattedValue)
            setDisplayDate(date || new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            }))
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              barCategoryGap="4px"
            >
              <CartesianGrid strokeDasharray="none" stroke="transparent" />
              <XAxis hide />
              <YAxis hide domain={[0, 400]} />
              <Bar
                dataKey="value"
                fill={designTokens.colors.primary}
                shape={CustomBarShape}
                barSize={10}
                activeBar={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartContainerWrapper>

      {/* Date labels on x-axis - only show when not empty and we have periodDates from API */}
      {!isEmpty && periodDates && periodDates.length === 7 && (
        <div 
          className="absolute flex items-center justify-between text-center"
          style={{
            left: '24px',
            top: '519.26px',
            width: '620px',
            height: '16.743px',
          }}
        >
          {periodDates.map((dateLabel: string, index: number) => (
            <p 
              key={index}
              className={`${typographyClasses.label1} opacity-80 relative shrink-0`}
              style={{ 
                color: designTokens.colors.text.primary,
              }}
            >
              {dateLabel}
            </p>
          ))}
        </div>
      )}
    </>
  )
}
