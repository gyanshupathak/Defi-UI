/**
 * Vault-related hooks
 * All vault hooks consolidated in one file for better organization
 */

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchVaultTVL, fetchMultipleVaultTVL, fetchVaultDeposits, fetchBaseAPY, fetchVaultAPY, fetchCurrencyRate, fetchCombinedVaultTVL, fetchCombinedVaultTVLByTime, fetchVaultSharePrice, convertUSDCToVaultToken, fetchVaultTVLByTime, fetchAllocationsByTime } from '@/lib/services/vault-service'
import type { VaultName, Period, DepositDataPoint, BaseAPYDataPoint, TVLByTimeDataPoint, AllocationDataPoint } from '@/lib/services/types'
import type { VaultSymbol } from '@/lib/config/vault-config'
import { fetchVaultConfig } from '@/lib/config/vault-config'

/**
 * Format TVL value for display
 * Shows full value with commas, no K/M suffixes
 */
function formatTVL(value: number): string {
  // Round to nearest integer and format with commas
  const roundedValue = Math.round(value)
  return `$${roundedValue.toLocaleString('en-US', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  })}`
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
 * Hook to fetch TVL by time data for a single vault
 * 
 * @param vaultSymbol - The vault symbol (e.g., 'syUSD', 'syETH', 'syBTC')
 * @param period - The time period (daily, weekly, monthly)
 * @param options - Query options (enabled, refetchInterval, etc.)
 */
export function useVaultTVLByTime(
  vaultSymbol: VaultSymbol,
  period: Period = 'daily',
  options?: {
    enabled?: boolean
    refetchInterval?: number
    staleTime?: number
  }
) {
  const {
    data: tvlByTimeData,
    isLoading,
    isError,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['vault-tvl-by-time', vaultSymbol, period],
    queryFn: () => fetchVaultTVLByTime(vaultSymbol, period),
    enabled: options?.enabled !== false && !!vaultSymbol,
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime ?? 60_000, // 60 seconds default
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  return {
    data: tvlByTimeData ?? null,
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
 * Map time range from UI to API period (kept for backward compatibility)
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
 * Hook to fetch current APY for a vault
 * 
 * @param vaultSymbol - Vault symbol to get endpoint from config
 * @param options - Query options (enabled, refetchInterval, etc.)
 */
export function useVaultAPY(
  vaultSymbol: string,
  options?: {
    enabled?: boolean
    refetchInterval?: number
    staleTime?: number
  }
) {
  const {
    data: apy,
    isLoading,
    isError,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['vault-apy', vaultSymbol],
    queryFn: () => fetchVaultAPY(vaultSymbol),
    enabled: options?.enabled !== false && !!vaultSymbol,
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime ?? 60_000, // 60 seconds default
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  return {
    apy: apy ?? 0,
    formattedAPY: apy !== undefined && apy !== null ? `${apy.toFixed(2)}%` : '0.00%',
    isLoading,
    isError,
    error,
    refetch,
    lastUpdated: dataUpdatedAt,
  }
}

/**
 * Hook to fetch Base APY historical data for a specific vault
 * 
 * @param vaultSymbol - The vault symbol (e.g., 'syUSD', 'syETH', 'syBTC')
 * @param period - The period (daily, weekly, monthly)
 * @param options - Query options (enabled, refetchInterval, etc.)
 */
export function useBaseAPY(
  vaultSymbol: VaultSymbol,
  period: Period = 'daily',
  options?: {
    enabled?: boolean
    refetchInterval?: number
    staleTime?: number
  }
) {
  
  const {
    data: baseAPYData,
    isLoading,
    isError,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['base-apy', vaultSymbol, period],
    queryFn: () => fetchBaseAPY(vaultSymbol, period),
    enabled: options?.enabled !== false && !!vaultSymbol,
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

/**
 * Hook to fetch currency rate for an asset
 * Currently hardcoded for BTC (syBTC), will be moved to config later
 * 
 * @param assetName - The asset name (default: 'BTC')
 * @param options - Query options (enabled, refetchInterval, etc.)
 */
export function useCurrencyRate(
  assetName: string = 'BTC',
  options?: {
    enabled?: boolean
    refetchInterval?: number
    staleTime?: number
  }
) {
  const {
    data: currencyRate,
    isLoading,
    isError,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['currency-rate', assetName],
    queryFn: () => fetchCurrencyRate(assetName),
    enabled: options?.enabled !== false && !!assetName,
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime ?? 60_000, // 60 seconds default
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  return {
    rate: currencyRate?.rate ?? 0,
    updatedAt: currencyRate?.updatedAt ?? 0,
    formattedRate: currencyRate?.rate ? `$${currencyRate.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
    isLoading,
    isError,
    error,
    refetch,
    lastUpdated: dataUpdatedAt,
  }
}

/**
 * Hook to fetch combined TVL for all vaults with currency conversion
 * Converts non-USD vaults (like syBTC) to USD
 * 
 * @param vaultNames - Array of vault identifiers
 * @param options - Query options (enabled, refetchInterval, etc.)
 */
export function useCombinedVaultTVL(
  vaultNames: VaultName[],
  options?: {
    enabled?: boolean
    refetchInterval?: number
    staleTime?: number
  }
) {
  const {
    data: combinedTVL,
    isLoading,
    isError,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['combined-vault-tvl', ...vaultNames.sort()],
    queryFn: async () => {
      console.log(`[useCombinedVaultTVL] Fetching combined TVL for vaults:`, vaultNames)
      const result = await fetchCombinedVaultTVL(vaultNames)
      console.log(`[useCombinedVaultTVL] Combined TVL result:`, result)
      return result
    },
    enabled: options?.enabled !== false && vaultNames.length > 0,
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime ?? 30_000, // 30 seconds default
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Log errors
  React.useEffect(() => {
    if (isError && error) {
      console.error(`[useCombinedVaultTVL] Error fetching combined TVL:`, error)
    }
  }, [isError, error])

  // Log the combined TVL value
  React.useEffect(() => {
    if (combinedTVL !== undefined) {
      console.log(`[useCombinedVaultTVL] Combined TVL value:`, combinedTVL)
    }
  }, [combinedTVL])

  // Format as exact value with commas (no K/M suffixes)
  const formattedValue = React.useMemo(() => {
    if (combinedTVL === undefined) {
      console.log(`[useCombinedVaultTVL] combinedTVL is undefined, returning undefined`)
      return undefined
    }
    const formatted = `$${Math.round(combinedTVL).toLocaleString()}`
    console.log(`[useCombinedVaultTVL] Formatted value:`, formatted)
    return formatted
  }, [combinedTVL])

  return {
    tvl: combinedTVL ?? 0,
    formattedValue: formattedValue ?? '$0',
    isLoading,
    isError,
    error,
    refetch,
    lastUpdated: dataUpdatedAt,
  }
}

/**
 * Hook to convert USDC to vault token amount
 * 
 * @param usdcAmount - Amount in USDC
 * @param vaultSymbol - Vault symbol (e.g., 'syUSD', 'syBTC', 'syETH')
 * @param options - Query options (enabled, refetchInterval, etc.)
 */
export function useUSDCToVaultTokenConversion(
  usdcAmount: number,
  vaultSymbol: string,
  options?: {
    enabled?: boolean
    refetchInterval?: number
    staleTime?: number
  }
) {
  // Allow usdcAmount to be 0 or greater, but only enable query if vaultSymbol exists
  // For base rate calculation, we pass 1 USDC, so usdcAmount will be > 0
  const isEnabled = (options?.enabled !== false) && !!vaultSymbol && usdcAmount > 0
  
  console.log(`[useUSDCToVaultTokenConversion] Hook called:`, {
    usdcAmount,
    vaultSymbol,
    enabled: isEnabled,
    optionsEnabled: options?.enabled,
  })
  
  const {
    data: vaultTokenAmount,
    isLoading,
    isError,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['usdc-to-vault-token', usdcAmount, vaultSymbol],
    queryFn: async () => {
      console.log(`[useUSDCToVaultTokenConversion] Executing query function: ${usdcAmount} USDC → ${vaultSymbol}`)
      const result = await convertUSDCToVaultToken(usdcAmount, vaultSymbol as VaultSymbol)
      console.log(`[useUSDCToVaultTokenConversion] Query result: ${result}`)
      return result
    },
    enabled: isEnabled,
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime ?? 30_000, // 30 seconds default
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Log errors
  React.useEffect(() => {
    if (isError && error) {
      console.error(`[useUSDCToVaultTokenConversion] Error:`, error)
    }
  }, [isError, error])

  // Log the result
  React.useEffect(() => {
    if (vaultTokenAmount !== undefined) {
      console.log(`[useUSDCToVaultTokenConversion] Vault token amount: ${vaultTokenAmount}`)
    }
  }, [vaultTokenAmount])

  return {
    vaultTokenAmount: vaultTokenAmount ?? 0,
    formattedAmount: vaultTokenAmount !== undefined && vaultTokenAmount !== null 
      ? vaultTokenAmount.toFixed(6) 
      : '0.000000',
    isLoading,
    isError,
    error,
    refetch,
    lastUpdated: dataUpdatedAt,
  }
}

/**
 * Hook to fetch combined TVL by time data for all vaults
 * Combines TVL historical data from all vaults and converts non-USD vaults to USD
 * 
 * @param vaultSymbols - Array of vault symbols
 * @param period - The time period (daily, weekly, monthly)
 * @param options - Query options (enabled, refetchInterval, etc.)
 */
export function useCombinedVaultTVLByTime(
  vaultSymbols: VaultSymbol[],
  period: Period = 'daily',
  options?: {
    enabled?: boolean
    refetchInterval?: number
    staleTime?: number
  }
) {
  const {
    data: tvlByTimeData,
    isLoading,
    isError,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['combined-vault-tvl-by-time', ...vaultSymbols.sort(), period],
    queryFn: () => fetchCombinedVaultTVLByTime(vaultSymbols, period),
    enabled: options?.enabled !== false && vaultSymbols.length > 0,
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime ?? 60_000, // 60 seconds default
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Transform data for chart consumption
  const chartData = React.useMemo(() => {
    if (!tvlByTimeData || tvlByTimeData.length === 0) {
      return []
    }

    // Format dates for display
    return tvlByTimeData.map((point: TVLByTimeDataPoint, index: number) => {
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
          index,
          formattedDate: `${day} ${month}`,
          formattedValue,
        }
      } catch (error) {
        // Fallback if date parsing fails
        return {
          ...point,
          index,
          formattedDate: point.date,
          formattedValue: `$${point.value.toLocaleString()}`,
        }
      }
    })
  }, [tvlByTimeData])

  // Calculate latest value
  const latestValue = React.useMemo(() => {
    if (!tvlByTimeData || tvlByTimeData.length === 0) {
      return 0
    }
    return tvlByTimeData[tvlByTimeData.length - 1]?.value || 0
  }, [tvlByTimeData])

  return {
    data: tvlByTimeData ?? null,
    chartData,
    latestValue,
    isLoading,
    isError,
    error,
    refetch,
    lastUpdated: dataUpdatedAt,
  }
}

/**
 * Hook to fetch allocations by time data for a specific vault
 * 
 * @param vaultSymbol - The vault symbol (e.g., 'syUSD', 'syETH', 'syBTC')
 * @param options - Query options (enabled, refetchInterval, etc.)
 */
export function useAllocationsByTime(
  vaultSymbol: VaultSymbol,
  options?: {
    enabled?: boolean
    refetchInterval?: number
    staleTime?: number
  }
) {
  const {
    data: allocationsData,
    isLoading,
    isError,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['allocations-by-time', vaultSymbol],
    queryFn: () => fetchAllocationsByTime(vaultSymbol),
    enabled: options?.enabled !== false && !!vaultSymbol,
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime ?? 60_000, // 60 seconds default
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  return {
    data: allocationsData ?? null,
    isLoading,
    isError,
    error,
    refetch,
    lastUpdated: dataUpdatedAt,
  }
}

