/**
 * React Hook for fetching Vault Historical Deposits data
 * Uses TanStack Query for caching and state management
 */

import { useQuery } from '@tanstack/react-query'
import { fetchVaultDeposits } from '@/lib/services/vault-service'
import type { VaultName, Period, DepositDataPoint } from '@/lib/services/types'

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

