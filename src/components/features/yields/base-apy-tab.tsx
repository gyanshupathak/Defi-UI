"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { ChartContainerWrapper } from "./chart-container-wrapper"
// Dropdown removed - imports commented out
// import { DropdownSelector, type DropdownOption } from "@/components/ui/dropdown-selector"
import { AnimatedNumber } from "@/components/animations"
import { useAnalytics } from "@/lib/hooks/use-analytics"
import { useTimeTracker } from "@/lib/hooks/use-time-tracker"
import { useBaseAPY, useVaultAPY } from "@/lib/hooks/use-vault"
import type { Period } from "@/lib/services/types"
import { useVaultConfig } from "@/lib/hooks/use-vault-config"
import type { VaultSymbol } from "@/lib/config/vault-config"
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
  vaultName?: VaultSymbol
}

export function BaseAPYTab({ 
  currentDate = "Current Date",
  isEmpty = false,
  vaultName = "syUSD",
}: BaseAPYTabProps) {
  // Dropdown removed - always use daily period
  const period: Period = "daily"
  // const [period, setPeriod] = React.useState<Period>("daily")
  const { analytics } = useAnalytics()
  const hoverTimeTracker = React.useRef<{ startTime: number | null }>({ startTime: null })
  // const previousPeriodRef = React.useRef<Period>("daily")

  // Fetch vault config to check if apy_by_time endpoint exists
  const { data: vaultConfig } = useVaultConfig(vaultName, {
    enabled: !!vaultName,
  })

  // Check if apy_by_time endpoint exists
  const hasApyByTimeEndpoint = !!vaultConfig?.vault_endpoints.apy_by_time

  // Fetch APY value from apy_endpoint
  const { 
    apy: currentAPY, 
    formattedAPY, 
    isLoading: isApyLoading,
    isError: isApyError 
  } = useVaultAPY(vaultName, {
    enabled: !!vaultConfig?.vault_endpoints.apy_endpoint,
    staleTime: 60_000,
  })

  // Fetch Base APY historical data from apy_by_time endpoint
  const {
    data: rawChartData,
    chartData: apiChartData,
    formattedLatestValue,
    latestValue,
    formattedData,
    isLoading: isChartLoading,
    isError: isChartError,
  } = useBaseAPY(vaultName, period, {
    enabled: hasApyByTimeEndpoint,
    staleTime: 60_000,
  })

  // Calculate 7 evenly spaced dates for x-axis labels from the actual API data
  // Updates when period changes to reflect the correct dates
  const periodDates = React.useMemo(() => {
    // Only calculate dates if we have real API data and chart is not empty
    if (!hasApyByTimeEndpoint || isChartLoading || isChartError) {
      return []
    }
    
    // Try to use rawChartData first, fallback to formattedData if needed
    let dataToUse: any[] = []
    if (rawChartData?.data && rawChartData.data.length > 0) {
      dataToUse = rawChartData.data
    } else if (formattedData && formattedData.length > 0) {
      dataToUse = formattedData
    } else if (apiChartData && apiChartData.length > 0) {
      // Fallback to apiChartData and extract dates from formattedData
      dataToUse = formattedData || []
    }
    
    if (!dataToUse || dataToUse.length === 0) {
      return []
    }
    
    // Need at least 2 data points to show dates (we'll show up to 7)
    if (dataToUse.length < 2) {
      return []
    }
    
    const numPeriods = 7
    const dates: string[] = []
    const usedDateStrings = new Set<string>() // Track dates to avoid duplicates
    
    // Helper function to format date based on period
    const formatDateForPeriod = (dateValue: string, periodType: Period): string | null => {
      if (!dateValue) return null
      try {
        const date = new Date(dateValue)
        if (isNaN(date.getTime())) return null
        
        const day = date.getDate()
        const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
        const year = date.getFullYear()
        
        // Format based on period type
        switch (periodType) {
          case 'daily':
            // Daily: "DD MMM" (e.g., "20 MAY")
            return `${day} ${month}`
          case 'weekly':
            // Weekly: "DD MMM" (e.g., "20 MAY") - same format as daily
            return `${day} ${month}`
          case 'monthly':
            // Monthly: "MMM YYYY" (e.g., "MAY 2024")
            return `${month} ${year}`
          default:
            return `${day} ${month}`
        }
      } catch {
        return null
      }
    }
    
    // Helper function to get date string from data point
    const getDateString = (point: any): string | null => {
      // Try different date fields
      const dateValue = point?.date || point?.formattedDate
      if (!dateValue) return null
      
      // If it's already formatted (from formattedData), use it directly for daily/weekly
      // For monthly, we need to parse and reformat
      if (point?.formattedDate && period === 'daily') {
        return point.formattedDate
      }
      
      // Format based on current period
      return formatDateForPeriod(dateValue, period)
    }
    
    // Helper function to find next unique date near an index
    const findUniqueDateNearIndex = (startIndex: number): string | null => {
      // Search forward first
      for (let offset = 0; offset < dataToUse.length; offset++) {
        const nextIndex = Math.min(startIndex + offset, dataToUse.length - 1)
        const dateString = getDateString(dataToUse[nextIndex])
        if (dateString && !usedDateStrings.has(dateString)) {
          return dateString
        }
        
        const prevIndex = Math.max(startIndex - offset, 0)
        if (prevIndex !== nextIndex) {
          const dateString2 = getDateString(dataToUse[prevIndex])
          if (dateString2 && !usedDateStrings.has(dateString2)) {
            return dateString2
          }
        }
      }
      return null
    }
    
    // Calculate evenly spaced indices based on actual data length
    const actualNumPeriods = Math.min(numPeriods, dataToUse.length)
    for (let i = 0; i < actualNumPeriods; i++) {
      const dataIndex = i === actualNumPeriods - 1
        ? dataToUse.length - 1 // Last period uses the last data point
        : Math.round((i * (dataToUse.length - 1)) / (actualNumPeriods - 1))
      
      const dataPoint = dataToUse[dataIndex]
      let dateString = getDateString(dataPoint)
      
      // If date is duplicate, find a unique one nearby
      if (dateString && usedDateStrings.has(dateString)) {
        dateString = findUniqueDateNearIndex(dataIndex)
      }
      
      // Add date if we found a unique one
      if (dateString && !usedDateStrings.has(dateString)) {
        usedDateStrings.add(dateString)
        dates.push(dateString)
      }
    }
    
    // Return dates even if we have fewer than 7 (but at least 1)
    return dates.length > 0 ? dates : []
  }, [rawChartData, formattedData, apiChartData, period, hasApyByTimeEndpoint, isChartLoading, isChartError])

  // Get the latest date from API data (only if data exists)
  const latestDate = React.useMemo(() => {
    if (formattedData && formattedData.length > 0) {
      const lastPoint = formattedData[formattedData.length - 1]
      if (lastPoint?.date) {
        const date = new Date(lastPoint.date)
        return date.toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        })
      }
    }
    return undefined
  }, [formattedData])

  // Determine if chart should be empty (no data or endpoint not present)
  const isChartEmpty = !isChartLoading && (!hasApyByTimeEndpoint || !apiChartData || apiChartData.length === 0)

  // Determine APY value to display
  const displayAPY = React.useMemo(() => {
    // Show "--" if apy_endpoint not present or not loaded
    if (!vaultConfig?.vault_endpoints.apy_endpoint || isApyError) {
      return "--"
    }
    if (isApyLoading) {
      return "0.00%"
    }
    return formattedAPY || "0.00%"
  }, [vaultConfig?.vault_endpoints.apy_endpoint, isApyLoading, isApyError, formattedAPY])

  const [displayValue, setDisplayValue] = React.useState(displayAPY)
  const [displayDate, setDisplayDate] = React.useState<string | undefined>(latestDate)
  
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const [isInitialLoad, setIsInitialLoad] = React.useState(true)

  // Dropdown options commented out - dropdown removed
  // const periodOptions: DropdownOption<Period>[] = [
  //   { id: "daily", label: "Daily" },
  //   { id: "weekly", label: "Weekly" },
  //   { id: "monthly", label: "Monthly" },
  // ]

  // Update display value when APY data changes
  React.useEffect(() => {
    setDisplayValue(displayAPY)
    setDisplayDate(latestDate)
  }, [displayAPY, latestDate])

  // Generate empty chart data for empty state
  const emptyValue = 200
  const emptyAreaChartData = Array.from({ length: 54 }, (_, i) => ({
    x: i,
    value: emptyValue,
  }))

  // Use API data if available, otherwise use empty data
  const chartData = isChartEmpty 
    ? emptyAreaChartData 
    : (apiChartData && apiChartData.length > 0 ? apiChartData : emptyAreaChartData)
  
  const yAxisDomain = isChartEmpty ? [0, 400] : ["auto", "auto"]
  const gradientId = isChartEmpty ? "colorBaseAPYEmpty" : "colorBaseAPY"

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false)
    }, 1500) // Match animation duration
    return () => clearTimeout(timer)
  }, [])

  const CustomTooltip = ({ active, payload }: any) => {
    React.useEffect(() => {
      if (active && payload && payload.length > 0 && !isChartEmpty) {
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
        const hoverDate = dataPoint?.date
          ? new Date(dataPoint.date).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })
          : latestDate
        setDisplayDate(hoverDate)
        
        // Start time tracking for hover duration
        hoverTimeTracker.current.startTime = Date.now()
      } else if (!active && !isChartEmpty) {
        // Track hover duration
        if (hoverTimeTracker.current.startTime !== null) {
          const duration = Date.now() - hoverTimeTracker.current.startTime
          analytics.chartHoverEnded('base_apy', duration, 'yields_page')
          hoverTimeTracker.current.startTime = null
        }
        setHoveredIndex(null)
        setDisplayValue(displayAPY)
        setDisplayDate(latestDate)
      }
    }, [active, payload, isChartEmpty, latestDate, displayAPY, analytics, formattedData])

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
          {isInitialLoad && hoveredIndex === null && displayValue === displayAPY && displayValue !== "--" ? (
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
          {displayDate || "--"}
        </p>
      </div>

      {/* Dropdown removed - always use daily period */}
      {/* {hasApyByTimeEndpoint && (
        <div 
          className="absolute"
          style={{
            left: '587px',
            top: '20px',
          }}
        >
          <DropdownSelector
            selectedValue={period}
            onValueChange={(newPeriod) => {
              // Track period selector click
              analytics.timeRangeSelectorClicked('base_apy')
              // Track period change
              if (previousPeriodRef.current !== newPeriod) {
                analytics.timeRangeChanged('base_apy', previousPeriodRef.current, newPeriod)
                previousPeriodRef.current = newPeriod as Period
              }
              setPeriod(newPeriod as Period)
            }}
            options={periodOptions}
            minWidth="120px"
          />
        </div>
      )} */}

      <ChartContainerWrapper className="relative" opacity={isChartEmpty ? 1 : 0.5}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="0%" 
                  stopColor={isChartEmpty ? "rgba(0, 0, 0, 0.15)" : designTokens.colors.primary} 
                  stopOpacity={isChartEmpty ? 0.35 : 0.5} 
                />
                <stop 
                  offset="100%" 
                  stopColor={isChartEmpty ? "rgba(0, 0, 0, 0.05)" : designTokens.colors.primary} 
                  stopOpacity={isChartEmpty ? 0.15 : 0.2} 
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
              isAnimationActive={!isChartEmpty}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainerWrapper>

      {/* Date labels on x-axis - only show when not empty and periodDates are available */}
      {!isChartEmpty && periodDates && periodDates.length > 0 && (
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
