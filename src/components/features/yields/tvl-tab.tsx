"use client"

import * as React from "react"
import { TVLChart } from "@/components/charts/tvl-chart"
import { useVaultTVL, useVaultTVLByTime } from "@/lib/hooks/use-vault"
import { useVaultConfig } from "@/lib/hooks/use-vault-config"
import type { VaultSymbol } from "@/lib/config/vault-config"

interface TVLTabProps {
  currentValue?: string
  currentDate?: string
  isEmpty?: boolean
  vaultName?: "syUSD" | "syETH" | "syBTC"
}

interface ChartDataPointWithDate {
  scaledValue: number
  originalValue: number
  date: string
  periodIndex?: number
}

export function TVLTab({ 
  currentValue,
  currentDate,
  isEmpty = false,
  vaultName = "syUSD",
}: TVLTabProps) {
  // Fetch TVL value for the vault
  const { formattedValue: tvlFormattedValue, isLoading: isTvlLoading } = useVaultTVL(vaultName, {
    staleTime: 30_000,
  })

  // Fetch vault config to check if tvl_by_time endpoint exists
  const { data: vaultConfig } = useVaultConfig(vaultName, {
    enabled: !!vaultName,
  })

  // Check if tvl_by_time endpoint exists
  const hasTvlByTimeEndpoint = !!vaultConfig?.vault_endpoints.tvl_by_time

  // Fetch TVL by time data for the chart (always use daily period, no dropdown)
  const {
    data: tvlByTimeData,
    isLoading: isTvlByTimeLoading,
  } = useVaultTVLByTime(vaultName as VaultSymbol, 'daily', {
    enabled: hasTvlByTimeEndpoint,
    staleTime: 60_000,
  })

  // Process chart data - use ALL data points from API
  // Calculate 7 period boundaries for x-axis labels, but show bars for all dates
  const { tvlChartValues, periodDates, tvlChartDataWithDates } = React.useMemo(() => {
    if (!tvlByTimeData || tvlByTimeData.length === 0) {
      return { tvlChartValues: undefined, periodDates: [], tvlChartDataWithDates: undefined }
    }
    
    // Get the max value for scaling
    const maxValue = Math.max(...tvlByTimeData.map(p => p.value))
    const maxBarHeight = 400 // Maximum bar height for yields variant
    
    // Scale all values to bar heights and keep original data
    const chartDataWithDates = tvlByTimeData.map((point) => {
      const scaledValue = maxValue > 0 ? (point.value / maxValue) * maxBarHeight : 0
      return {
        scaledValue,
        originalValue: point.value,
        date: point.date,
      }
    })
    
    const scaledValues = chartDataWithDates.map(d => d.scaledValue)
    
    // Calculate 7 evenly spaced period boundaries for x-axis labels
    // Ensure dates are unique to avoid duplicates
    const numPeriods = 7
    const periodDates: string[] = []
    const periodIndices: number[] = []
    const usedDateStrings = new Set<string>() // Track dates to avoid duplicates
    
    // Helper function to get date string from data point
    const getDateString = (dateValue: string): string | null => {
      if (!dateValue) return null
      try {
        const date = new Date(dateValue)
        if (isNaN(date.getTime())) return null
        const day = date.getDate()
        const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
        return `${day} ${month}`
      } catch {
        return null
      }
    }
    
    // Helper function to find next unique date near an index
    const findUniqueDateNearIndex = (startIndex: number): string | null => {
      // Search forward first
      for (let offset = 0; offset < tvlByTimeData.length; offset++) {
        const nextIndex = Math.min(startIndex + offset, tvlByTimeData.length - 1)
        const dateString = getDateString(tvlByTimeData[nextIndex].date)
        if (dateString && !usedDateStrings.has(dateString)) {
          return dateString
        }
        
        const prevIndex = Math.max(startIndex - offset, 0)
        if (prevIndex !== nextIndex) {
          const dateString2 = getDateString(tvlByTimeData[prevIndex].date)
          if (dateString2 && !usedDateStrings.has(dateString2)) {
            return dateString2
          }
        }
      }
      return null
    }
    
    // Calculate evenly spaced indices
    for (let i = 0; i < numPeriods; i++) {
      // Calculate index for this period: evenly distribute across all data points
      const periodIndex = i === numPeriods - 1
        ? tvlByTimeData.length - 1 // Last period uses the last data point
        : Math.round((i * (tvlByTimeData.length - 1)) / (numPeriods - 1))
      
      periodIndices.push(periodIndex)
      const periodDate = tvlByTimeData[periodIndex].date
      
      // Format date: "DD MMM" (e.g., "20 MAY")
      let dateString = getDateString(periodDate)
      
      // If date is duplicate, find a unique one nearby
      if (dateString && usedDateStrings.has(dateString)) {
        dateString = findUniqueDateNearIndex(periodIndex)
      }
      
      // Add date if we found a unique one
      if (dateString && !usedDateStrings.has(dateString)) {
        usedDateStrings.add(dateString)
        periodDates.push(dateString)
      }
    }
    
    // Map each data point to its closest period for alignment
    const chartDataWithPeriods = chartDataWithDates.map((point, index) => {
      // Find the closest period index for this data point
      let closestPeriodIndex = 0
      let minDistance = Math.abs(index - periodIndices[0])
      
      for (let i = 1; i < periodIndices.length; i++) {
        const distance = Math.abs(index - periodIndices[i])
        if (distance < minDistance) {
          minDistance = distance
          closestPeriodIndex = i
        }
      }
      
      return {
        ...point,
        periodIndex: closestPeriodIndex,
      }
    })
    
    // Only return dates if we have exactly 7 unique dates
    const finalPeriodDates = periodDates.length === numPeriods ? periodDates : []
    
    return { tvlChartValues: scaledValues, periodDates: finalPeriodDates, tvlChartDataWithDates: chartDataWithPeriods }
  }, [tvlByTimeData])

  // Always use today's date for display
  const latestDate = React.useMemo(() => {
    return new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }, [])

  // Use API TVL value if available, otherwise use prop
  const effectiveValue = tvlFormattedValue || currentValue || "$0"

  // Determine if chart should be empty (no data or endpoint not present)
  // Show empty if we're not loading and there's no data or endpoint doesn't exist
  const isTvlChartEmpty = !isTvlByTimeLoading && (!hasTvlByTimeEndpoint || !tvlByTimeData || tvlByTimeData.length === 0 || !tvlChartValues)

  return (
    <TVLChart
      variant="yields"
      isEmpty={isTvlChartEmpty}
      totalValue={effectiveValue}
      date={latestDate}
      vaultName={vaultName}
      useApi={true}
      isLoading={isTvlLoading}
      data={tvlChartValues}
      periodDates={periodDates}
      chartDataWithDates={tvlChartDataWithDates}
    />
  )
}
