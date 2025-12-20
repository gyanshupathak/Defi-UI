/**
 * Hook to fetch and cache vault configuration
 */

import { useQuery } from '@tanstack/react-query'
import { fetchVaultConfig, type VaultSymbol, type VaultConfig } from '../config/vault-config'

export interface UseVaultConfigOptions {
  enabled?: boolean
  staleTime?: number
  cacheTime?: number
}

/**
 * Hook to fetch vault configuration
 * 
 * @param vaultSymbol - The vault symbol (syUSD, syETH, syBTC)
 * @param options - Query options
 * @returns Vault configuration data
 */
export function useVaultConfig(
  vaultSymbol: VaultSymbol,
  options?: UseVaultConfigOptions
) {
  return useQuery<VaultConfig>({
    queryKey: ['vault-config', vaultSymbol],
    queryFn: () => fetchVaultConfig(vaultSymbol),
    enabled: options?.enabled !== false,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes default
    gcTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes default
    retry: 2,
  })
}

