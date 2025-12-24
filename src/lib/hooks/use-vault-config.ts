/**
 * Hook to fetch and cache vault configuration
 */

import { useQuery } from '@tanstack/react-query'
import { fetchVaultConfig, fetchAllVaultSymbols, type VaultSymbol, type VaultConfig } from '../config/vault-config'

export interface UseVaultConfigOptions {
  enabled?: boolean
  staleTime?: number
  cacheTime?: number
}

/**
 * Hook to fetch vault configuration
 * 
 * @param vaultSymbol - The vault symbol (e.g., syUSD, syETH, syBTC)
 * @param options - Query options
 * @returns Vault configuration data
 */
export function useVaultConfig(
  vaultSymbol: VaultSymbol,
  options?: UseVaultConfigOptions
) {
  return useQuery<VaultConfig | null>({
    queryKey: ['vault-config', vaultSymbol],
    queryFn: () => fetchVaultConfig(vaultSymbol),
    enabled: options?.enabled !== false && !!vaultSymbol,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes default
    gcTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes default
    retry: 2,
  })
}

/**
 * Hook to fetch all available vault symbols
 * 
 * @param options - Query options
 * @returns Array of vault symbols
 */
export function useAllVaultSymbols(
  options?: UseVaultConfigOptions
) {
  const isEnabled = options?.enabled !== false
  
  return useQuery<VaultSymbol[]>({
    queryKey: ['all-vault-symbols'],
    queryFn: async () => {
      console.log('[useAllVaultSymbols] Executing query function...')
      const result = await fetchAllVaultSymbols()
      console.log('[useAllVaultSymbols] Query result:', result)
      return result
    },
    enabled: isEnabled,
    staleTime: 0, // Always consider stale to force refetch
    gcTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes default
    retry: 2,
    refetchOnMount: 'always', // Always refetch on mount
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })
}

