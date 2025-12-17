/**
 * React Hook for fetching Vault TVL data
 * Uses TanStack Query for caching and state management
 */

import { useQuery } from '@tanstack/react-query'
import { fetchVaultTVL, fetchMultipleVaultTVL } from '@/lib/services/vault-service'
import type { VaultName } from '@/lib/services/types'

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

