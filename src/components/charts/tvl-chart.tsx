"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { UnifiedChartContainer } from "./unified-chart-container"
import { ChartContainerWrapper } from "@/components/features/yields/chart-container-wrapper"
import { EmptyChart } from "./empty-chart"
import { TVLChartSkeleton } from "./tvl-chart-skeleton"
import { AnimatedNumber } from "@/components/animations"
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
  variant: "home" | "yields"
): ChartDataPoint[] => {
  // Generate dates for last 7 days
  const chartDates = generateDatesForLast7Days()
  
  const barsPerDay = [8, 8, 8, 8, 8, 8, 6]
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
}: TVLChartProps) {
  // Use the totalValue prop (combined TVL from syUSD + syBTC converted to USD)
  const effectiveFormattedValue = React.useMemo(() => {
    if (isEmpty) return "$0"
    // Always use totalValue if provided, otherwise use default
    return totalValue || (variant === "home" ? "$585,937" : "$185,053")
  }, [isEmpty, totalValue, variant])

  const defaultTotalValue = variant === "home" ? "$585,937" : "$185,053"
  const [displayValue, setDisplayValue] = React.useState(() => {
    if (isEmpty) return "$0"
    return effectiveFormattedValue
  })
  const todayDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
  const [displayDate, setDisplayDate] = React.useState(date || todayDate)
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const [hasAnimated, setHasAnimated] = React.useState(false)
  const [initialValue] = React.useState(() => effectiveFormattedValue)

  // Use dummy chart data (no deposits API)
  const chartDataArray = React.useMemo(() => {
    if (isEmpty) return emptyStateData
    return data || (variant === "home" ? defaultHomeData : defaultYieldsData)
  }, [isEmpty, data, variant])

  const chartData = formatDataForChart(
    chartDataArray, 
    effectiveFormattedValue, 
    displayDate, 
    variant
  ).map((item, index) => ({
    ...item,
    index,
  }))
  
  // Update display value when effective value changes (only if not hovering)
  React.useEffect(() => {
    if (!isEmpty && effectiveFormattedValue && hoveredIndex === null) {
      setDisplayValue(effectiveFormattedValue)
      // Mark as animated if this is a new value (not the initial one)
      if (effectiveFormattedValue !== initialValue) {
        setHasAnimated(true)
      }
    }
  }, [effectiveFormattedValue, isEmpty, hoveredIndex, initialValue])
  
  // Mark as animated after initial render
  React.useEffect(() => {
    if (!isEmpty && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true)
      }, 1500) // After animation duration (1.2s + buffer)
      return () => clearTimeout(timer)
    }
  }, [isEmpty, hasAnimated])
  
  // Update display value when effective value changes (for non-hovered state)
  React.useEffect(() => {
    if (!isEmpty && hoveredIndex === null) {
      const valueToUse = effectiveFormattedValue || defaultTotalValue
      if (displayValue !== valueToUse) {
        setDisplayValue(valueToUse)
      }
      setDisplayDate(date || todayDate)
    }
  }, [effectiveFormattedValue, isEmpty, hoveredIndex, defaultTotalValue, displayValue, date, todayDate])
  
  // Show loading skeleton while fetching
  if (isLoading && !isEmpty) {
    return <TVLChartSkeleton variant={variant} className={className} />
  }

  const CustomBarShape = (props: any) => {
    const { payload, x, y, width, height } = props
    const barIndex = payload?.index ?? chartData.findIndex(d => d.value === payload?.value && d.label === payload?.label)
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
            {hoveredIndex === null && !hasAnimated ? (
              displayValue.startsWith('$') ? (
                <>
                  $<AnimatedNumber key="initial" value={parseFloat(displayValue.replace(/[^0-9.]/g, '')) || 0} decimals={0} delay={0.1} duration={1.2} />
                </>
              ) : (
                <AnimatedNumber key="initial" value={parseFloat(displayValue.replace(/[^0-9.]/g, '')) || 0} decimals={0} delay={0.1} duration={1.2} />
              )
            ) : (
              displayValue
            )}
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
            {hoveredIndex === null && !hasAnimated ? (
              displayValue.startsWith('$') ? (
                <>
                  $<AnimatedNumber key="initial" value={parseFloat(displayValue.replace(/[^0-9.]/g, '')) || 0} decimals={0} delay={0.1} duration={1.2} />
                </>
              ) : (
                <AnimatedNumber key="initial" value={parseFloat(displayValue.replace(/[^0-9.]/g, '')) || 0} decimals={0} delay={0.1} duration={1.2} />
              )
            ) : (
              displayValue
            )}
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

      <div 
        className="absolute flex items-center justify-between text-center"
        style={{ 
          left: designTokens.spacing.graph.tvlChart.contentPaddingX,
          top: designTokens.spacing.graph.tvlChart.datesTop,
          width: designTokens.spacing.graph.tvlChart.contentWidth,
          opacity: designTokens.spacing.graph.tvlChart.datesOpacity,
        }}
      >
        {generateDatesForLast7Days().map((date: string, index: number) => (
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
            {hoveredIndex === null && !hasAnimated ? (
              displayValue.startsWith('$') ? (
                <>
                  $<AnimatedNumber key="initial" value={parseFloat(displayValue.replace(/[^0-9.]/g, '')) || 0} decimals={0} delay={0.1} duration={1.2} />
                </>
              ) : (
                <AnimatedNumber key="initial" value={parseFloat(displayValue.replace(/[^0-9.]/g, '')) || 0} decimals={0} delay={0.1} duration={1.2} />
              )
            ) : (
              displayValue
            )}
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
          {hoveredIndex === null && !hasAnimated ? (
            (() => {
              const valueToParse = totalValue || displayValue || defaultTotalValue
              let numericValue = parseFloat(valueToParse.replace(/[^0-9.]/g, ''))
              
              if (!numericValue || isNaN(numericValue) || numericValue === 0) {
                numericValue = 185053 // Default for yields variant
              }
                
              return displayValue.startsWith('$') || valueToParse.startsWith('$') ? (
                <>
                  $<AnimatedNumber key="initial" value={numericValue} decimals={0} delay={0.1} duration={1.2} />
                </>
              ) : (
                <AnimatedNumber key="initial" value={numericValue} decimals={0} delay={0.1} duration={1.2} />
              )
            })()
          ) : (
            displayValue
          )}
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
    </>
  )
}
