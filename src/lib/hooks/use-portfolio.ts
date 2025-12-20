/**
 * Portfolio-related hooks
 * All portfolio hooks consolidated in one file for better organization
 */

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchPortfolioActivity, fetchWithdrawalRequests } from '@/lib/services/portfolio-service'
import type { 
  PortfolioActivityItem, 
  WithdrawalRequestItem, 
  WithdrawalRequestStatus 
} from '@/lib/services/types'

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

/**
 * Hook to fetch withdrawal requests for a user and vault
 * 
 * @param vaultAddress - The vault contract address
 * @param userAddress - The user's wallet address
 * @param status - Filter by status (default: 'PENDING')
 * @param options - Query options (enabled, refetchInterval, etc.)
 */
export function useWithdrawalRequests(
  vaultAddress: string | undefined,
  userAddress: string | undefined,
  status: WithdrawalRequestStatus = 'PENDING',
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
    queryKey: ['withdrawal-requests', vaultAddress, userAddress, status],
    queryFn: () => fetchWithdrawalRequests(vaultAddress!, userAddress!),
    enabled: options?.enabled !== false && !!vaultAddress && !!userAddress,
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime ?? 30_000, // 30 seconds default
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Transform data to match component's WithdrawalRequest interface
  const transformedData = React.useMemo(() => {
    if (!data?.result) return []
    
    // Get requests for the specified status (default: PENDING)
    // If the requested status has no requests, try to get any available status
    const statusKey = status.toUpperCase() as WithdrawalRequestStatus
    let requests = data.result[statusKey] || []
    
    // If no requests for the specified status, get the first available status
    if (requests.length === 0 && Object.keys(data.result).length > 0) {
      const firstAvailableStatus = Object.keys(data.result)[0] as WithdrawalRequestStatus
      requests = data.result[firstAvailableStatus] || []
    }
    
    return requests.map((item: WithdrawalRequestItem) => {
      // Format date from Unix timestamp
      const timestamp = parseInt(item.creation_time, 10) * 1000 // Convert to milliseconds
      const dateObj = new Date(timestamp)
      const day = dateObj.getDate().toString().padStart(2, '0')
      const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
      const year = dateObj.getFullYear()
      const formattedDate = `${day} ${month} ${year}`
      
      // Format amounts
      const formatAmount = (amount: number | string) => {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount
        if (isNaN(num)) return '0'
        // Format with commas for thousands, 2 decimal places
        return num.toLocaleString('en-US', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })
      }
      
      // Determine token symbol from vault address or asset address
      // For now, we'll use a mapping or default to syUSD
      // You may need to adjust this based on your vault addresses
      const getTokenSymbol = (assetAddress: string, vaultAddr: string): string => {
        // Add your vault address to token mapping here
        // For now, defaulting based on common patterns
        if (vaultAddr.toLowerCase().includes('usd') || assetAddress.toLowerCase().includes('usdc')) {
          return 'syUSD'
        }
        if (vaultAddr.toLowerCase().includes('eth')) {
          return 'syETH'
        }
        if (vaultAddr.toLowerCase().includes('btc')) {
          return 'syBTC'
        }
        return 'syUSD' // Default
      }
      
      const tokenSymbol = getTokenSymbol(item.withdraw_asset_address, vaultAddress || '')
      
      // amount_of_shares is the syToken amount
      // amount_of_assets is the USDC/equivalent amount
      return {
        id: item.request_id,
        date: formattedDate,
        syAmount: formatAmount(item.amount_of_shares),
        syToken: tokenSymbol,
        usdcAmount: formatAmount(item.amount_of_assets),
        tokenIcon: undefined, // Can be added if needed
        rawData: item, // Keep raw data for reference
      }
    })
  }, [data, status, vaultAddress])

  // Get all statuses available
  const availableStatuses = React.useMemo(() => {
    if (!data?.result) return []
    return Object.keys(data.result) as WithdrawalRequestStatus[]
  }, [data])

  return {
    data: transformedData,
    rawData: data?.result || {},
    availableStatuses,
    isLoading,
    isError,
    error,
    refetch,
    lastUpdated: dataUpdatedAt,
  }
}
