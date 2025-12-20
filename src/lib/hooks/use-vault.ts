/**
 * Vault-related hooks
 * All vault hooks consolidated in one file for better organization
 */

import { useQuery } from '@tanstack/react-query'
import { fetchVaultTVL, fetchMultipleVaultTVL, fetchVaultDeposits, fetchBaseAPY } from '@/lib/services/vault-service'
import type { VaultName, Period, DepositDataPoint, BaseAPYDataPoint } from '@/lib/services/types'

/**
 * Format TVL value for display
 */
function formatTVL(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`
  }
  return `$${value.toFixed(2)}`
}

/**
 * Hook to fetch TVL for a single vault
 * 
 * @param vaultName - The vault identifier
 * @param options - Query options (enabled, refetchInterval, etc.)
 */
export function useVaultTVL(
  vaultName: VaultName,
  options?: {
    enabled?: boolean
    refetchInterval?: number
    staleTime?: number
  }
) {
  const {
    data: tvl,
    isLoading,
    isError,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['vault-tvl', vaultName],
    queryFn: () => fetchVaultTVL(vaultName),
    enabled: options?.enabled !== false,
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime ?? 30_000, // 30 seconds default
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  const formattedValue = tvl !== undefined ? formatTVL(tvl) : undefined

  return {
    tvl: tvl ?? 0,
    formattedValue: formattedValue ?? '$0',
    isLoading,
    isError,
    error,
    refetch,
    lastUpdated: dataUpdatedAt,
  }
}

/**
 * Hook to fetch TVL for multiple vaults
 * 
 * @param vaultNames - Array of vault identifiers
 * @param options - Query options
 */
export function useMultipleVaultTVL(
  vaultNames: VaultName[],
  options?: {
    enabled?: boolean
    refetchInterval?: number
    staleTime?: number
  }
) {
  const {
    data: tvlMap,
    isLoading,
    isError,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['vault-tvl', 'multiple', ...vaultNames.sort()],
    queryFn: () => fetchMultipleVaultTVL(vaultNames),
    enabled: options?.enabled !== false && vaultNames.length > 0,
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime ?? 30_000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  const formattedMap = tvlMap
    ? Object.entries(tvlMap).reduce(
        (acc, [vaultName, tvl]) => {
          acc[vaultName as VaultName] = formatTVL(tvl)
          return acc
        },
        {} as Record<VaultName, string>
      )
    : undefined

  return {
    tvlMap: tvlMap ?? ({} as Record<VaultName, number>),
    formattedMap: formattedMap ?? ({} as Record<VaultName, string>),
    isLoading,
    isError,
    error,
    refetch,
    lastUpdated: dataUpdatedAt,
  }
}

/**
 * Hook to fetch historical deposits data for a vault
 * 
 * @param vaultName - The vault identifier
 * @param period - The time period (daily, weekly, monthly)
 * @param options - Query options (enabled, refetchInterval, etc.)
 */
export function useVaultDeposits(
  vaultName: VaultName,
  period: Period = 'daily',
  options?: {
    enabled?: boolean
    refetchInterval?: number
    staleTime?: number
  }
) {
  const {
    data: depositsData,
    isLoading,
    isError,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['vault-deposits', vaultName, period],
    queryFn: () => fetchVaultDeposits(vaultName, period),
    enabled: options?.enabled !== false,
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime ?? 60_000, // 60 seconds default
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Handle different response formats - could be array directly or nested in data property
  const rawData = Array.isArray(depositsData) 
    ? depositsData 
    : depositsData?.data || []
  
  // Transform data points for chart consumption
  const chartData = rawData.map((point: any) => {
    // Handle different possible field names
    const value = point.value || point.deposit || point.amount || point.total || 0
    const dateStr = point.date || point.timestamp || point.time || new Date().toISOString()
    
    return {
      date: dateStr,
      value: typeof value === 'string' ? parseFloat(value) : value,
      timestamp: point.timestamp,
    } as DepositDataPoint
  })
  
  // Calculate current/latest value
  const latestValue = chartData.length > 0 
    ? chartData[chartData.length - 1]?.value || 0
    : 0

  // Format dates for display
  const formattedData = chartData.map((point: DepositDataPoint) => {
    try {
      const date = new Date(point.date)
      const day = date.getDate()
      const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
      
      // Format value
      let formattedValue: string
      if (point.value >= 1_000_000) {
        formattedValue = `$${(point.value / 1_000_000).toFixed(2)}M`
      } else if (point.value >= 1_000) {
        formattedValue = `$${(point.value / 1_000).toFixed(2)}K`
      } else {
        formattedValue = `$${point.value.toFixed(2)}`
      }
      
      return {
        ...point,
        formattedDate: `${day} ${month}`,
        formattedValue,
      }
    } catch (error) {
      // Fallback if date parsing fails
      return {
        ...point,
        formattedDate: point.date,
        formattedValue: `$${point.value.toLocaleString()}`,
      }
    }
  })

  return {
    data: chartData,
    formattedData,
    latestValue,
    isLoading,
    isError,
    error,
    refetch,
    lastUpdated: dataUpdatedAt,
  }
}

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
