/**
 * React Hook for fetching Portfolio Activity data
 * Uses TanStack Query for caching and state management
 */

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchPortfolioActivity } from '@/lib/services/portfolio-service'
import type { PortfolioActivityItem } from '@/lib/services/types'

/**
 * Hook to fetch portfolio activity for a user
 * 
 * @param userAddress - The user's wallet address
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of items per page (default: 10)
 * @param options - Query options (enabled, refetchInterval, etc.)
 */
export function usePortfolioActivity(
  userAddress: string | undefined,
  page: number = 1,
  limit: number = 10,
  options?: {
    enabled?: boolean
    refetchInterval?: number
    staleTime?: number
  }
) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['portfolio-activity', userAddress, page, limit],
    queryFn: () => fetchPortfolioActivity(userAddress!, page, limit),
    enabled: options?.enabled !== false && !!userAddress,
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime ?? 30_000, // 30 seconds default
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Helper function for ordinal suffixes (1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = React.useCallback((day: number): string => {
    if (day > 3 && day < 21) return 'th'
    switch (day % 10) {
      case 1: return 'st'
      case 2: return 'nd'
      case 3: return 'rd'
      default: return 'th'
    }
  }, [])

  // Transform data to match component's Transaction interface
  const transformedData = React.useMemo(() => {
    if (!data?.success || !data?.data?.transactions) return []
    
    return data.data.transactions.map((item) => {
      // Format date from timestamp
      const dateObj = new Date(item.timestamp)
      const day = dateObj.getDate()
      const month = dateObj.toLocaleDateString('en-US', { month: 'short' })
      const year = dateObj.getFullYear()
      const formattedDate = `${day}${getOrdinalSuffix(day)} ${month}'${year.toString().slice(-2)}`
      
      // Capitalize network name
      const networkName = item.network.charAt(0).toUpperCase() + item.network.slice(1)
      
      // Map type to status (deposit, withdraw, bridge)
      const status = item.type === 'deposit' || item.type === 'withdraw' || item.type === 'bridge'
        ? item.type
        : 'deposit' // Default fallback
      
      // Format amounts
      const formatAmount = (amount: string) => {
        const num = parseFloat(amount)
        if (isNaN(num)) return amount
        // Format with commas for thousands
        return num.toLocaleString('en-US', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })
      }
      
      return {
        id: String(item.id),
        date: formattedDate,
        status: status as 'deposit' | 'withdraw' | 'bridge',
        from: {
          amount: formatAmount(item.fromAmount),
          token: item.fromAsset.symbol,
          chain: networkName,
        },
        to: {
          amount: formatAmount(item.toAmount),
          token: item.toAsset.symbol,
          chain: networkName,
        },
        txHash: item.transactionHash,
      }
    })
  }, [data, getOrdinalSuffix])

  return {
    data: transformedData,
    rawData: data?.data?.transactions || [],
    pagination: data?.data?.pagination,
    summary: data?.data?.summary,
    isLoading,
    isError,
    error,
    refetch,
    lastUpdated: dataUpdatedAt,
  }
}

