"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { UnifiedChartContainer } from "./unified-chart-container"
import { ChartContainerWrapper } from "@/components/features/yields/chart-container-wrapper"
import { EmptyChart } from "./empty-chart"
import { TVLChartSkeleton } from "./tvl-chart-skeleton"
import { AnimatedNumber } from "@/components/animations"
import { useVaultTVL, useVaultDeposits } from "@/lib/hooks/use-vault"
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
  vaultName?: "syUSD" | "syETH" | "syBTC"
  useApi?: boolean // Whether to fetch from API (default: true)
  period?: "daily" | "weekly" | "monthly" // Period for historical data
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
  depositsData?: Array<{ formattedDate: string; value: number; formattedValue: string }>
): ChartDataPoint[] => {
  // Use dates from deposits data if available, otherwise generate last 7 days
  const dates = depositsData && depositsData.length > 0
    ? depositsData.map(d => d.formattedDate)
    : generateDatesForLast7Days()
  
  // Ensure we have at least 7 dates for the chart
  const chartDates = dates.length >= 7 ? dates.slice(0, 7) : [...dates, ...generateDatesForLast7Days().slice(dates.length)]
  
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
    
    // Use actual value from deposits data if available, otherwise calculate from bar height
    let calculatedValue: number
    let formattedValue: string
    
    if (depositsData && depositsData.length > 0) {
      // Map bar index to deposits data index
      const depositsIndex = Math.min(
        Math.floor((dateIndex / barsPerDay.length) * depositsData.length),
        depositsData.length - 1
      )
      calculatedValue = depositsData[depositsIndex].value
      formattedValue = depositsData[depositsIndex].formattedValue
    } else {
      // Scale the bar value based on actual TVL
      const scaleFactor = parseFloat(defaultTotalValue.replace(/[^0-9.]/g, '')) / maxBarHeight
      calculatedValue = value * scaleFactor
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
}: TVLChartProps) {
  // Fetch TVL from API if enabled
  const { 
    tvl: apiTvl, 
    formattedValue: apiFormattedValue, 
    isLoading: isTvlLoading,
    isError: isTvlError 
  } = useVaultTVL(vaultName, {
    enabled: useApi && !isEmpty,
    staleTime: 30_000, // 30 seconds
  })

  // Fetch historical deposits data for chart
  const {
    formattedData: depositsData,
    latestValue: depositsLatestValue,
    isLoading: isDepositsLoading,
    isError: isDepositsError,
  } = useVaultDeposits(vaultName, period, {
    enabled: useApi && !isEmpty,
    staleTime: 60_000, // 60 seconds
  })

  // Determine which value to use (API or prop)
  // Prefer deposits latest value if available, otherwise use TVL
  const effectiveTvl = useApi && !isEmpty && !isTvlLoading && !isTvlError 
    ? apiTvl 
    : undefined
  
  // Use deposits latest value if available, otherwise use TVL formatted value
  const effectiveFormattedValue = React.useMemo(() => {
    if (useApi && !isEmpty && depositsLatestValue > 0 && !isDepositsError) {
      // Format deposits latest value
      if (depositsLatestValue >= 1_000_000) {
        return `$${(depositsLatestValue / 1_000_000).toFixed(2)}M`
      }
      if (depositsLatestValue >= 1_000) {
        return `$${(depositsLatestValue / 1_000).toFixed(2)}K`
      }
      return `$${depositsLatestValue.toFixed(2)}`
    }
    if (useApi && !isEmpty && !isTvlLoading && !isTvlError) {
      return apiFormattedValue
    }
    return totalValue || (variant === "home" ? "$585,937" : "$185,053")
  }, [useApi, isEmpty, depositsLatestValue, isDepositsError, isTvlLoading, isTvlError, apiFormattedValue, totalValue, variant])

  const defaultTotalValue = variant === "home" ? "$585,937" : "$185,053"
  const initialValue = isEmpty ? "$0" : effectiveFormattedValue
  const [displayValue, setDisplayValue] = React.useState(() => {
    if (isEmpty) return "$0"
    return effectiveFormattedValue
  })
  const [displayDate, setDisplayDate] = React.useState(date || new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }))
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const [isInitialLoad, setIsInitialLoad] = React.useState(true)

  // Update display value when API data loads
  React.useEffect(() => {
    if (!isEmpty && !isTvlLoading && effectiveFormattedValue) {
      setDisplayValue(effectiveFormattedValue)
    }
  }, [effectiveFormattedValue, isEmpty, isTvlLoading])
  
  // Show loading skeleton while fetching
  if (useApi && !isEmpty && (isTvlLoading || isDepositsLoading)) {
    return <TVLChartSkeleton variant={variant} className={className} />
  }

  // Use real deposits data if available, otherwise fall back to mock data
  const chartDataArray = React.useMemo(() => {
    if (isEmpty) return emptyStateData
    
    // If we have real deposits data, use it
    if (useApi && depositsData && depositsData.length > 0 && !isDepositsError) {
      // Extract values from deposits data and scale to chart bar heights
      const maxBarHeight = variant === "home" ? 500 : 400
      const maxValue = Math.max(...depositsData.map(d => d.value), 1)
      const scaleFactor = maxBarHeight / maxValue
      
      // Generate bars per day based on data points
      // For daily period, we want multiple bars per day to match the design
      const barsPerDataPoint = Math.ceil(54 / depositsData.length)
      const chartValues: number[] = []
      
      depositsData.forEach((point) => {
        const scaledValue = point.value * scaleFactor
        for (let i = 0; i < barsPerDataPoint; i++) {
          // Add slight variation to bars within the same day
          const variation = (Math.random() - 0.5) * 0.1 * scaledValue
          chartValues.push(Math.max(0, scaledValue + variation))
        }
      })
      
      // Ensure we have exactly 54 bars
      while (chartValues.length < 54) {
        chartValues.push(chartValues[chartValues.length - 1] || 0)
      }
      return chartValues.slice(0, 54)
    }
    
    // Fall back to provided data or defaults
    return data || (variant === "home" ? defaultHomeData : defaultYieldsData)
  }, [isEmpty, depositsData, isDepositsError, useApi, variant, data])

  const chartData = formatDataForChart(
    chartDataArray, 
    effectiveFormattedValue, 
    displayDate, 
    variant,
    depositsData
  ).map((item, index) => ({
    ...item,
    index,
  }))
  
  // Update display value when effective value changes (for non-hovered state)
  React.useEffect(() => {
    if (!isEmpty && hoveredIndex === null) {
      const valueToUse = effectiveFormattedValue || defaultTotalValue
      if (displayValue !== valueToUse) {
        setDisplayValue(valueToUse)
      }
    }
  }, [effectiveFormattedValue, isEmpty, hoveredIndex, defaultTotalValue, displayValue])

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
    
    // Update display value when effective value changes
    React.useEffect(() => {
      if (!isEmpty && hoveredIndex === null) {
        const valueToUse = effectiveFormattedValue || defaultTotalValue
        if (displayValue !== valueToUse) {
          setDisplayValue(valueToUse)
        }
      }
    }, [effectiveFormattedValue, isEmpty, hoveredIndex, defaultTotalValue, displayValue])

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
            {isInitialLoad && displayValue === initialValue ? (
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
              {displayValue.startsWith('$') ? (
                <>
                  $<AnimatedNumber key={displayValue} value={parseFloat(displayValue.replace(/[^0-9.]/g, '')) || 0} decimals={0} delay={0.1} duration={1.2} />
                </>
              ) : (
                <AnimatedNumber key={displayValue} value={parseFloat(displayValue.replace(/[^0-9.]/g, '')) || 0} decimals={0} delay={0.1} duration={1.2} />
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
            {isInitialLoad && displayValue === initialValue ? (
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
          {isInitialLoad && displayValue === initialValue ? (
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
            (() => {
              const valueToShow = displayValue && displayValue !== "$0" ? displayValue : (totalValue || defaultTotalValue)
              return valueToShow
            })()
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
