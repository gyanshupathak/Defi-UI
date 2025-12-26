"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { StrategyFilterCard } from "./strategy-filter-card"
import { ChartContainerWrapper } from "./chart-container-wrapper"
import { AllocationsTable } from "./allocations-table"
import { YieldsDateLabels } from "./yields-date-labels"
import { YieldsNoteCard } from "./yields-note-card"
import { FilterTabSelector } from "@/components/ui/filter-tab-selector"
import { EmptyChart } from "@/components/charts/empty-chart"
import { useAnalytics } from "@/lib/hooks/use-analytics"
import { useTimeTracker } from "@/lib/hooks/use-time-tracker"
import { useAllocationsByTime } from "@/lib/hooks/use-vault"
import type { VaultSymbol } from "@/lib/config/vault-config"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

interface StackedBarChartDataPoint {
  [key: string]: number | string | undefined
  orange?: number
  purple?: number
  blue?: number
  date?: string
  formattedDate?: string
  index?: number
}

type ViewType = "chart" | "table"

interface AllocationsTabProps {
  isEmpty?: boolean
  periodDates?: string[] // Optional period dates from API (real data)
  vaultSymbol?: VaultSymbol // Vault symbol to fetch allocations data
}

export function AllocationsTab({ isEmpty = false, periodDates, vaultSymbol = "syUSD" }: AllocationsTabProps) {
  const [viewType, setViewType] = React.useState<ViewType>("chart")
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const { analytics } = useAnalytics()
  const hoverTimeTracker = React.useRef<{ startTime: number | null }>({ startTime: null })
  const previousViewRef = React.useRef<ViewType>("chart")
  const viewTimeTracker = useTimeTracker()
  
  // Fetch allocations data from API
  const { data: allocationsData, isLoading: isLoadingAllocations, isError: isAllocationsError } = useAllocationsByTime(vaultSymbol, {
    enabled: !!vaultSymbol && !isEmpty,
  })
  
  // Debug logging
  React.useEffect(() => {
    console.log('[AllocationsTab] State:', {
      vaultSymbol,
      isEmpty,
      isLoadingAllocations,
      isAllocationsError,
      hasData: !!allocationsData,
      dataLength: allocationsData?.length || 0,
      allocationsData: allocationsData ? allocationsData.slice(0, 2) : null, // Log first 2 items
    })
  }, [vaultSymbol, isEmpty, isLoadingAllocations, isAllocationsError, allocationsData])
  
  const viewOptions = [
    { id: "chart" as ViewType, label: "Chart" },
    { id: "table" as ViewType, label: "Table" },
  ]

  // Track view time spent
  React.useEffect(() => {
    viewTimeTracker.start()
    return () => {
      const duration = viewTimeTracker.stop()
      if (duration && duration > 0) {
        analytics.tabTimeSpent(`allocations_${previousViewRef.current}`, duration)
      }
    }
  }, [viewType, analytics, viewTimeTracker])
  
  const handleViewChange = (newView: ViewType) => {
    if (previousViewRef.current !== newView) {
      analytics.allocationsViewChanged(previousViewRef.current, newView)
      previousViewRef.current = newView
    }
    setViewType(newView)
  }

  const viewTabs = (
    <div className="absolute" style={{ right: '24px', top: '16px' }}>
      <FilterTabSelector
        options={viewOptions}
        activeValue={viewType}
        onValueChange={handleViewChange}
      />
    </div>
  )
  
  // Format allocations data from API for the chart
  const formatAllocationsData = React.useMemo(() => {
    if (!allocationsData || allocationsData.length === 0) {
      console.log('[AllocationsTab] No allocations data to format')
      return []
    }

    console.log('[AllocationsTab] Formatting allocations data, count:', allocationsData.length)
    console.log('[AllocationsTab] Sample data point:', allocationsData[0])

    // Extract unique dates and sort them
    const dates = Array.from(new Set(allocationsData.map(item => item.date))).sort()
    console.log('[AllocationsTab] Extracted dates:', dates.slice(0, 7))
    
    // Extract strategy names (all keys except 'date')
    const strategyNames = new Set<string>()
    allocationsData.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'date') {
          strategyNames.add(key)
        }
      })
    })
    
    // Map strategy names to colors (you may need to adjust this based on your data)
    // For now, we'll use a simple mapping - you can enhance this based on actual strategy names
    const strategyColorMap: Record<string, { color: string; dataKey: string }> = {}
    const strategyArray = Array.from(strategyNames)
    
    // Map strategies to colors (blue, purple, orange)
    strategyArray.forEach((strategy, index) => {
      if (index === 0) {
        strategyColorMap[strategy] = { color: '#2b66ff', dataKey: 'blue' }
      } else if (index === 1) {
        strategyColorMap[strategy] = { color: '#8198ee', dataKey: 'purple' }
      } else {
        strategyColorMap[strategy] = { color: '#f9b666', dataKey: 'orange' }
      }
    })
    
    // Group data by date and calculate totals
    const dataByDate = new Map<string, Record<string, number>>()
    
    allocationsData.forEach(item => {
      const date = item.date
      if (!dataByDate.has(date)) {
        dataByDate.set(date, {})
      }
      
      const dateData = dataByDate.get(date)!
      Object.keys(item).forEach(key => {
        if (key !== 'date') {
          const value = typeof item[key] === 'string' ? parseFloat(item[key] as string) : (item[key] as number) || 0
          dateData[key] = (dateData[key] || 0) + value
        }
      })
    })
    
    // Convert to chart data format
    const chartData: StackedBarChartDataPoint[] = []
    dates.forEach(date => {
      const dateData = dataByDate.get(date) || {}
      const chartPoint: StackedBarChartDataPoint = {
        date,
        formattedDate: date,
      }
      
      // Map strategy values to color keys
      strategyArray.forEach(strategy => {
        const value = dateData[strategy] || 0
        const colorMapping = strategyColorMap[strategy]
        if (colorMapping) {
          chartPoint[colorMapping.dataKey] = value
        }
      })
      
      chartData.push(chartPoint)
    })
    
    // Distribute data points across bars (similar to original logic)
    // Calculate bars per period
    const totalBars = 54 // Keep the same number of bars
    const periods = 7
    const barsPerPeriod = Math.floor(totalBars / periods)
    const remainder = totalBars % periods
    
    const barsPerDay = Array(periods).fill(barsPerPeriod)
    for (let i = 0; i < remainder; i++) {
      barsPerDay[i]++
    }
    
    // Expand chart data to match total bars
    const expandedData: StackedBarChartDataPoint[] = []
    chartData.forEach((point, pointIndex) => {
      const barsForThisPeriod = barsPerDay[pointIndex % periods] || barsPerDay[0]
      for (let i = 0; i < barsForThisPeriod; i++) {
        expandedData.push({ ...point })
      }
    })
    
    // Fill remaining bars with last data point if needed
    while (expandedData.length < totalBars) {
      const lastPoint = expandedData[expandedData.length - 1] || chartData[chartData.length - 1]
      if (lastPoint) {
        expandedData.push({ ...lastPoint })
      } else {
        break
      }
    }
    
    const result = expandedData.slice(0, totalBars)
    console.log('[AllocationsTab] Formatted chart data length:', result.length)
    if (result.length > 0) {
      console.log('[AllocationsTab] Sample formatted data point:', result[0])
    }
    return result
  }, [allocationsData])

  // Extract period dates from allocations data
  const extractedPeriodDates = React.useMemo(() => {
    if (!allocationsData || allocationsData.length === 0) {
      return periodDates || []
    }
    
    // Get unique dates and sort them
    const dates = Array.from(new Set(allocationsData.map(item => item.date))).sort()
    
    // Format dates for display (last 7 dates)
    const last7Dates = dates.slice(-7)
    return last7Dates.map(dateStr => {
      try {
        const date = new Date(dateStr)
        const day = date.getDate()
        const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
        return `${day} ${month}`
      } catch {
        return dateStr
      }
    })
  }, [allocationsData, periodDates])

  const barData = formatAllocationsData.map((item, index) => ({
    ...item,
    index,
  }))
  
  // Check if we should show empty state
  // Show empty if: isEmpty prop is true, or no data after loading completes, or data is empty array
  const shouldShowEmpty = isEmpty || (!isLoadingAllocations && (!allocationsData || allocationsData.length === 0))

  const createCustomBarShape = (fill: string, radius: [number, number, number, number]) => {
    const CustomBarShape = (props: any) => {
      const { payload, x, y, width, height } = props
      const barIndex = payload?.index ?? barData.findIndex(d => 
        d.orange === payload?.orange && 
        d.purple === payload?.purple && 
        d.blue === payload?.blue
      )
      const isHovered = hoveredIndex === barIndex
      
      const opacity = isHovered ? 1 : 0.25

      const handleMouseEnter = () => {
        if (barIndex >= 0 && barIndex < barData.length) {
          setHoveredIndex(barIndex)
          // Start time tracking for hover
          hoverTimeTracker.current.startTime = Date.now()
        }
      }

      const handleMouseLeave = () => {
        // Track hover end with duration
        if (hoverTimeTracker.current.startTime !== null) {
          const duration = Date.now() - hoverTimeTracker.current.startTime
          analytics.allocationsChartHovered(duration)
          hoverTimeTracker.current.startTime = null
        }
        setHoveredIndex(null)
      }

      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          opacity={opacity}
          rx={radius[0]}
          ry={radius[1]}
          style={{
            transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "pointer",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )
    }
    CustomBarShape.displayName = 'CustomBarShape'
    return CustomBarShape
  }

  if (shouldShowEmpty) {
    return (
      <>
        <p 
          className={`absolute ${typographyClasses.label1} opacity-50`}
          style={{
            left: '24px',
            top: '24px',
            color: designTokens.colors.text.primary,
          }}
        >
          {viewType === "chart" ? "Current Date" : "Last Date Allocation"}
        </p>

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
            // Don't pass dates - show empty chart with no dates on x-axis
          />
        </ChartContainerWrapper>

        {viewTabs}
        {/* Don't show date labels when empty */}
        <YieldsNoteCard 
          content="By initiating a withdrawal, your vault shares (syUSD) will be converted into the underlying asset based on the latest market rates, which may fluctuate slightly; once the request is submitted."
        />
      </>
    )
  }

  return (
    <>
      <p 
        className={`absolute ${typographyClasses.label1} opacity-50`}
        style={{
          left: '24px',
          top: '24px',
          color: designTokens.colors.text.primary,
        }}
      >
        {viewType === "chart" ? "Current Date" : "Last Date Allocation"}
      </p>

      {viewType === "chart" ? (
        <>
          <div className="absolute" style={{ left: '24px', top: '56px' }}>
            <StrategyFilterCard
              label="Unallocated Cash"
              value="30%"
              borderColor="#2b66ff"
              hasInnerShadow={false}
            />
          </div>

          <div className="absolute" style={{ left: '177px', top: '56px' }}>
            <StrategyFilterCard
              label="RLP/USDC Morpho (4x)"
              value="30.1%"
              borderColor="#8198ee"
              hasInnerShadow={true}
            />
          </div>

          <div className="absolute" style={{ left: '366px', top: '56px' }}>
            <StrategyFilterCard
              label="siUSD/USDC Morpho (10x)"
              value="30%"
              borderColor="#f9b666"
              hasInnerShadow={true}
            />
          </div>

          <ChartContainerWrapper className="overflow-clip">
            <div
              onMouseLeave={() => {
                setHoveredIndex(null)
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
                <YAxis hide />
                <Bar
                  dataKey="blue"
                  stackId="a"
                  fill="#2b66ff"
                  shape={createCustomBarShape("#2b66ff", [0, 0, 2, 2])}
                  barSize={10}
                  activeBar={false}
                />
                <Bar
                  dataKey="purple"
                  stackId="a"
                  fill="#8198ee"
                  shape={createCustomBarShape("#8198ee", [0, 0, 0, 0])}
                  activeBar={false}
                />
                <Bar
                  dataKey="orange"
                  stackId="a"
                  fill="#f9b666"
                  shape={createCustomBarShape("#f9b666", [2, 2, 0, 0])}
                  activeBar={false}
                />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </ChartContainerWrapper>

          {viewTabs}
          {extractedPeriodDates && extractedPeriodDates.length === 7 && <YieldsDateLabels dates={extractedPeriodDates} />}
          <YieldsNoteCard 
            content="By initiating a withdrawal, your vault shares (syUSD) will be converted into the underlying asset based on the latest market rates, which may fluctuate slightly; once the request is submitted."
          />
        </>
      ) : (
        <>
          <AllocationsTable />
          {viewTabs}
          <YieldsNoteCard 
            content="By initiating a withdrawal, your vault shares (syUSD) will be converted into the underlying asset based on the latest market rates, which may fluctuate slightly; once the request is submitted."
          />
        </>
      )}
    </>
  )
}
