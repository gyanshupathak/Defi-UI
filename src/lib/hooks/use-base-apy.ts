/**
 * React Hook for fetching Base APY historical data
 * Uses TanStack Query for caching and state management
 */

import { useQuery } from '@tanstack/react-query'
import { fetchBaseAPY } from '@/lib/services/vault-service'
import type { Period, BaseAPYDataPoint } from '@/lib/services/types'

/**
 * Map time range from UI to API period
 */
export type TimeRange = '1M' | '3M' | '6M' | '1Y'

function mapTimeRangeToPeriod(timeRange: TimeRange): Period {
  switch (timeRange) {
    case '1M':
      return 'daily'
    case '3M':
      return 'weekly'
    case '6M':
    case '1Y':
      return 'monthly'
    default:
      return 'daily'
  }
}

/**
 * Hook to fetch Base APY historical data
 * 
 * @param timeRange - The time range (1M, 3M, 6M, 1Y)
 * @param options - Query options (enabled, refetchInterval, etc.)
 */
export function useBaseAPY(
  timeRange: TimeRange = '1M',
  options?: {
    enabled?: boolean
    refetchInterval?: number
    staleTime?: number
  }
) {
  const period = mapTimeRangeToPeriod(timeRange)
  
  const {
    data: baseAPYData,
    isLoading,
    isError,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['base-apy', period, timeRange],
    queryFn: () => fetchBaseAPY(period),
    enabled: options?.enabled !== false,
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime ?? 60_000, // 60 seconds default
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Extract data array from response
  const rawData = baseAPYData?.data || []
  
  // Transform data points for chart consumption
  const chartData = rawData.map((point: any) => {
    // Use annualizedAPY from API response
    const annualizedAPY = point.annualizedAPY ?? 0
    const dateStr = point.date || new Date().toISOString()
    
    return {
      date: dateStr,
      annualizedAPY: typeof annualizedAPY === 'string' ? parseFloat(annualizedAPY) : annualizedAPY,
      value: typeof annualizedAPY === 'string' ? parseFloat(annualizedAPY) : annualizedAPY, // For backward compatibility
    }
  })
  
  // Use summary data if available, otherwise calculate from data
  const latestValue = baseAPYData?.summary?.latestAnnualizedAPY ?? 
    (chartData.length > 0 ? chartData[chartData.length - 1]?.annualizedAPY || 0 : 0)

  // Format data for chart display (x index and value)
  const formattedChartData = chartData.map((point: any, index: number) => {
    return {
      x: index,
      value: point.annualizedAPY ?? point.value ?? 0,
      date: point.date,
    }
  })

  // Format dates for display
  const formattedData = chartData.map((point: any) => {
    try {
      const date = new Date(point.date)
      const day = date.getDate()
      const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
      const apyValue = point.annualizedAPY ?? point.value ?? 0
      
      return {
        ...point,
        formattedDate: `${day} ${month}`,
        formattedValue: `${apyValue.toFixed(2)}%`,
      }
    } catch (error) {
      // Fallback if date parsing fails
      const apyValue = point.annualizedAPY ?? point.value ?? 0
      return {
        ...point,
        formattedDate: point.date,
        formattedValue: `${apyValue.toFixed(2)}%`,
      }
    }
  })

  // Format latest value - handle negative values properly
  const formattedLatestValue = latestValue !== undefined && latestValue !== null
    ? `${latestValue.toFixed(2)}%`
    : '0.00%'

  return {
    data: chartData,
    formattedData,
    chartData: formattedChartData,
    latestValue,
    formattedLatestValue,
    summary: baseAPYData?.summary,
    isLoading,
    isError,
    error,
    refetch,
    lastUpdated: dataUpdatedAt,
  }
}

