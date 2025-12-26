"use client"

import { useQuery } from '@tanstack/react-query'
import { formatUnits } from 'viem'
import { fetchPortfolioActivity, fetchWithdrawalRequests } from '../services/portfolio-service'
import type { 
  PortfolioActivityItem, 
  WithdrawalRequestItem,
  WithdrawalRequestStatus 
} from '../services/types'
import type { Transaction } from '@/components/features/portfolio/portfolio-activity'
import type { WithdrawalRequest } from '@/components/features/portfolio/portfolio-requests'
import { formatNumberWithCommas } from '../utils'

/**
 * Transform PortfolioActivityItem to Transaction interface
 */
function transformActivityItem(item: PortfolioActivityItem): Transaction {
  // Format amounts - handle both string and number types
  const formatAmount = (value: string | number | undefined): string => {
    if (!value) return '0.00'
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return '0.00'
    return formatNumberWithCommas(numValue.toFixed(2))
  }

  return {
    id: item.id.toString(),
    date: new Date(item.timestamp).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    status: item.type as TransactionStatus,
    from: {
      amount: formatAmount(item.fromAmount || item.amount),
      token: item.fromAsset?.symbol || item.asset,
      chain: item.fromAsset?.name || item.network,
    },
    to: {
      amount: formatAmount(item.toAmount || item.amount),
      token: item.toAsset?.symbol || item.asset,
      chain: item.toAsset?.name || item.network,
    },
    txHash: item.transactionHash,
  }
}

type TransactionStatus = "deposit" | "withdraw" | "bridge"

/**
 * Transform WithdrawalRequestItem to WithdrawalRequest interface
 */
function transformWithdrawalRequest(
  item: WithdrawalRequestItem,
  status: WithdrawalRequestStatus
): WithdrawalRequest {
  // Format date from Unix timestamp
  const date = new Date(parseInt(item.creation_time) * 1000).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  // Format amounts - API returns values in smallest unit (wei-like)
  // syUSD typically uses 18 decimals, USDC uses 6 decimals
  const formatAmount = (value: string | number, decimals: number): string => {
    try {
      // Convert to BigInt if it's a string, or convert number to string first
      const valueStr = typeof value === 'string' ? value : value.toString()
      // Remove any decimal point if present (shouldn't be, but handle it)
      const cleanValue = valueStr.includes('.') ? valueStr.split('.')[0] : valueStr
      const bigIntValue = BigInt(cleanValue)
      // Use formatUnits to convert from smallest unit to human-readable
      const formatted = formatUnits(bigIntValue, decimals)
      // Format with commas and 2 decimal places
      return formatNumberWithCommas(parseFloat(formatted).toFixed(2))
    } catch (error) {
      console.error('[transformWithdrawalRequest] Error formatting amount:', value, decimals, error)
      return '0.00'
    }
  }

  // syUSD uses 18 decimals (standard ERC20)
  const syAmount = formatAmount(item.amount_of_shares, 18)
  // USDC uses 6 decimals
  const usdcAmount = formatAmount(item.amount_of_assets, 6)

  // Determine token symbol from vault address or network
  // This is a simplified version - you may need to map vault addresses to symbols
  const syToken = 'syUSD' // Default, should be determined from vault address

  return {
    id: item.request_id,
    date,
    syAmount,
    syToken,
    usdcAmount,
    _status: status, // Preserve status for cancel button logic
  }
}

export interface UsePortfolioActivityOptions {
  enabled?: boolean
  staleTime?: number
  cacheTime?: number
}

/**
 * Hook to fetch portfolio activity for a user
 * 
 * @param userAddress - The user's wallet address
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of items per page (default: 10)
 * @param options - Query options
 * @returns Portfolio activity transactions
 */
export function usePortfolioActivity(
  userAddress: string | undefined,
  page: number = 1,
  limit: number = 10,
  options?: UsePortfolioActivityOptions
) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['portfolio-activity', userAddress, page, limit],
    queryFn: async () => {
      if (!userAddress) {
        throw new Error('User address is required')
      }
      const response = await fetchPortfolioActivity(userAddress, page, limit)
      return response.data.transactions.map(transformActivityItem)
    },
    enabled: options?.enabled !== false && !!userAddress,
    staleTime: options?.staleTime ?? 30_000,
    gcTime: options?.cacheTime ?? 10 * 60 * 1000,
    retry: 2,
  })

  return {
    data: data || [],
    isLoading,
    isError,
    error,
    refetch,
  }
}

export interface UseWithdrawalRequestsOptions {
  enabled?: boolean
  staleTime?: number
  cacheTime?: number
}

/**
 * Hook to fetch withdrawal requests for a user and vault
 * 
 * @param vaultAddress - The vault contract address
 * @param userAddress - The user's wallet address
 * @param status - The status of requests to fetch (default: 'PENDING')
 * @param options - Query options
 * @returns Withdrawal requests
 */
export function useWithdrawalRequests(
  vaultAddress: string | undefined,
  userAddress: string | undefined,
  status: WithdrawalRequestStatus = 'PENDING',
  options?: UseWithdrawalRequestsOptions
) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['withdrawal-requests', vaultAddress, userAddress, status],
    queryFn: async () => {
      if (!vaultAddress || !userAddress) {
        throw new Error('Vault address and user address are required')
      }
      
      console.log('[useWithdrawalRequests] Fetching requests:', {
        vaultAddress,
        userAddress,
        status,
      })
      
      const response = await fetchWithdrawalRequests(vaultAddress, userAddress)
      
      console.log('[useWithdrawalRequests] Raw API response:', response)
      console.log('[useWithdrawalRequests] Response result keys:', Object.keys(response.result || {}))
      
      // Handle different possible response structures
      if (!response || !response.result) {
        console.warn('[useWithdrawalRequests] Invalid response structure:', response)
        return []
      }
      
      // Collect requests from multiple statuses: FULFILLED and PENDING
      // This allows showing completed withdrawals with pending ones (which have cancel button)
      const requestsWithStatus: Array<{ item: WithdrawalRequestItem; status: WithdrawalRequestStatus }> = []
      
      // Try to get FULFILLED requests
      const fulfilledKey = Object.keys(response.result).find(
        key => key.toUpperCase() === 'FULFILLED'
      )
      if (fulfilledKey && Array.isArray(response.result[fulfilledKey])) {
        const fulfilledRequests = response.result[fulfilledKey] as WithdrawalRequestItem[]
        fulfilledRequests.forEach(item => {
          requestsWithStatus.push({ item, status: 'FULFILLED' })
        })
        console.log('[useWithdrawalRequests] Found FULFILLED requests:', fulfilledRequests.length)
      }
      
      // Try to get PENDING requests
      const pendingKey = Object.keys(response.result).find(
        key => key.toUpperCase() === 'PENDING'
      )
      if (pendingKey && Array.isArray(response.result[pendingKey])) {
        const pendingRequests = response.result[pendingKey] as WithdrawalRequestItem[]
        pendingRequests.forEach(item => {
          requestsWithStatus.push({ item, status: 'PENDING' })
        })
        console.log('[useWithdrawalRequests] Found PENDING requests:', pendingRequests.length)
      }
      
      // If no requests found, log available statuses
      if (requestsWithStatus.length === 0) {
        console.warn('[useWithdrawalRequests] No requests found')
        console.log('[useWithdrawalRequests] Available statuses:', Object.keys(response.result))
        return []
      }
      
      console.log('[useWithdrawalRequests] Total requests found:', requestsWithStatus.length)
      
      // Transform and return (preserve status for cancel button logic)
      try {
        const transformed = requestsWithStatus.map(({ item, status: requestStatus }) => {
          return transformWithdrawalRequest(item, requestStatus)
        })
        console.log('[useWithdrawalRequests] Transformed requests:', transformed)
        return transformed
      } catch (transformError) {
        console.error('[useWithdrawalRequests] Error transforming requests:', transformError)
        console.error('[useWithdrawalRequests] Item that failed:', requestsWithStatus)
        throw transformError
      }
    },
    enabled: options?.enabled !== false && !!vaultAddress && !!userAddress,
    staleTime: options?.staleTime ?? 30_000,
    gcTime: options?.cacheTime ?? 10 * 60 * 1000,
    retry: 2,
  })

  // Also return raw data for debugging
  const { data: rawData } = useQuery({
    queryKey: ['withdrawal-requests-raw', vaultAddress, userAddress],
    queryFn: async () => {
      if (!vaultAddress || !userAddress) {
        return null
      }
      return await fetchWithdrawalRequests(vaultAddress, userAddress)
    },
    enabled: options?.enabled !== false && !!vaultAddress && !!userAddress,
    staleTime: options?.staleTime ?? 30_000,
    gcTime: options?.cacheTime ?? 10 * 60 * 1000,
    retry: 2,
  })

  return {
    data: data || [],
    isLoading,
    isError,
    error,
    refetch,
    rawData,
  }
}
