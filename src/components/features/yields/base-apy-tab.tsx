"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { ChartContainerWrapper } from "./chart-container-wrapper"
import { DropdownSelector, type DropdownOption } from "@/components/ui/dropdown-selector"
import { AnimatedNumber } from "@/components/animations"
import { useAnalytics } from "@/lib/hooks/use-analytics"
import { useTimeTracker } from "@/lib/hooks/use-time-tracker"
import { useBaseAPY, type TimeRange } from "@/lib/hooks/use-base-apy"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface BaseAPYTabProps {
  currentDate?: string
  isEmpty?: boolean
}

export function BaseAPYTab({ 
  currentDate = "Current Date",
  isEmpty = false,
}: BaseAPYTabProps) {
  const [timeRange, setTimeRange] = React.useState<TimeRange>("1M")
  const { analytics } = useAnalytics()
  const hoverTimeTracker = React.useRef<{ startTime: number | null }>({ startTime: null })
  const previousTimeRangeRef = React.useRef<TimeRange>("1M")

  // Fetch Base APY data from API
  // Always fetch data - isEmpty only affects UI display
  const {
    chartData: apiChartData,
    formattedLatestValue,
    latestValue,
    formattedData,
    isLoading,
    isError,
  } = useBaseAPY(timeRange, {
    enabled: true,
    staleTime: 60_000, // 60 seconds
  })

  // Get the latest date from API data or use currentDate prop
  const latestDate = React.useMemo(() => {
    if (formattedData && formattedData.length > 0) {
      return formattedData[formattedData.length - 1]?.formattedDate || currentDate
    }
    return currentDate
  }, [formattedData, currentDate])

  // Determine initial value based on API data or empty state
  const initialValue = isEmpty ? "0.00%" : (formattedLatestValue || "0.00%")
  const [displayValue, setDisplayValue] = React.useState(initialValue)
  const [displayDate, setDisplayDate] = React.useState(latestDate)
  
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const [isInitialLoad, setIsInitialLoad] = React.useState(true)

  const timeRangeOptions: DropdownOption<TimeRange>[] = [
    { id: "1M", label: "1M" },
    { id: "3M", label: "3M" },
    { id: "6M", label: "6M" },
    { id: "1Y", label: "1Y" },
  ]

  // Update initial value when API data loads
  React.useEffect(() => {
    if (!isEmpty && formattedLatestValue && !isLoading) {
      setDisplayValue(formattedLatestValue)
      setDisplayDate(latestDate)
    }
  }, [formattedLatestValue, latestDate, isEmpty, isLoading])

  // Generate empty chart data for empty state
  const emptyValue = 200
  const emptyAreaChartData = Array.from({ length: 54 }, (_, i) => ({
    x: i,
    value: emptyValue,
  }))

  // Use API data if available, otherwise use empty data
  const chartData = isEmpty 
    ? emptyAreaChartData 
    : (apiChartData && apiChartData.length > 0 ? apiChartData : emptyAreaChartData)
  
  const yAxisDomain = isEmpty ? [0, 400] : ["auto", "auto"]
  const gradientId = isEmpty ? "colorBaseAPYEmpty" : "colorBaseAPY"

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false)
    }, 1500) // Match animation duration
    return () => clearTimeout(timer)
  }, [])

  const CustomTooltip = ({ active, payload }: any) => {
    React.useEffect(() => {
      if (active && payload && payload.length > 0 && !isEmpty) {
        const dataIndex = payload[0].payload.x
        const value = payload[0].value
        setHoveredIndex(dataIndex)
        // Format value with proper sign handling
        const formattedValue = value !== undefined && value !== null
          ? `${value.toFixed(2)}%`
          : '0.00%'
        setDisplayValue(formattedValue)
        
        // Get the date from the formatted data if available
        const dataPoint = formattedData && formattedData[dataIndex]
        const hoverDate = dataPoint?.formattedDate || latestDate
        setDisplayDate(hoverDate)
        
        // Start time tracking for hover duration
        hoverTimeTracker.current.startTime = Date.now()
      } else if (!active && !isEmpty) {
        // Track hover duration
        if (hoverTimeTracker.current.startTime !== null) {
          const duration = Date.now() - hoverTimeTracker.current.startTime
          analytics.chartHoverEnded('base_apy', duration, 'yields_page')
          hoverTimeTracker.current.startTime = null
        }
        setHoveredIndex(null)
        setDisplayValue(initialValue)
        setDisplayDate(latestDate)
      }
    }, [active, payload, isEmpty, latestDate, initialValue, analytics, formattedData])

    return null
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
          {isInitialLoad && hoveredIndex === null && displayValue === initialValue ? (
            <AnimatedNumber value={displayValue.replace('%', '')} decimals={2} suffix="%" delay={0.1} duration={1.2} />
          ) : (
            displayValue
          )}
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

      <div 
        className="absolute"
        style={{
          left: '587px',
          top: '20px',
        }}
      >
        <DropdownSelector
          selectedValue={timeRange}
          onValueChange={(newRange) => {
            // Track time range selector click
            analytics.timeRangeSelectorClicked('base_apy')
            // Track time range change
            if (previousTimeRangeRef.current !== newRange) {
              analytics.timeRangeChanged('base_apy', previousTimeRangeRef.current, newRange)
              previousTimeRangeRef.current = newRange as TimeRange
            }
            setTimeRange(newRange as TimeRange)
          }}
          options={timeRangeOptions}
          minWidth="120px"
        />
        </div>

      <ChartContainerWrapper className="relative" opacity={isEmpty ? 1 : 0.5}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="0%" 
                  stopColor={isEmpty ? "rgba(0, 0, 0, 0.15)" : designTokens.colors.primary} 
                  stopOpacity={isEmpty ? 0.35 : 0.5} 
                />
                <stop 
                  offset="100%" 
                  stopColor={isEmpty ? "rgba(0, 0, 0, 0.05)" : designTokens.colors.primary} 
                  stopOpacity={isEmpty ? 0.15 : 0.2} 
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="none" stroke="transparent" />
            <XAxis hide />
            <YAxis hide domain={yAxisDomain as [number | "auto", number | "auto"]} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="transparent"
              strokeWidth={0}
              fill={`url(#${gradientId})`}
              fillOpacity={1}
              isAnimationActive={!isEmpty}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainerWrapper>
    </>
  )
}
