"use client"

import * as React from 'react'
import { useWalletBalance } from './use-wallet-balance'
import { useVaultConfig } from './use-vault-config'
import { useAllVaultSymbols } from './use-vault-config'
import { fetchVaultConfig } from '@/lib/config/vault-config'
import { useQueries } from '@tanstack/react-query'
import type { Network, BridgeToken } from '@/components/ui/unified-selector'
import type { VaultConfig } from '@/lib/config/vault-config'

/**
 * Map bridge tokens to vault symbols
 */
const BRIDGE_TOKEN_TO_VAULT_SYMBOL: Record<BridgeToken, string | null> = {
  'syUSD': 'syUSD',
  'syETH': 'syETH',
  'syBTC': 'syBTC',
  'syHLP': 'syHLP',
  'USDC': null, // Stablecoins - will search in vault configs
  'USDS': null,
  'SUSD': null,
}

/**
 * Find token address in vault configs for stablecoins
 */
function findStablecoinAddress(
  token: BridgeToken,
  network: Network,
  vaultConfigs: (VaultConfig | null | undefined)[]
): { address: `0x${string}`; decimals: number } | null {
  if (token === 'syUSD' || token === 'syETH' || token === 'syBTC' || token === 'syHLP') {
    return null // These are handled via vault symbol
  }

  // Map network to config key
  const networkKeyMap: Record<Network, string> = {
    'Base': 'base',
    'Ethereum': 'ethereum',
    'Arbitrum': 'arbitrum',
    'Katana': 'katana',
    'HyperEVM': 'hyperEVM',
  }

  const configKey = networkKeyMap[network]

  // Search through all vault configs for the token
  for (const config of vaultConfigs) {
    if (!config?.vault_networks) continue

    const networkConfig = config.vault_networks[configKey as keyof typeof config.vault_networks]
    if (!networkConfig?.tokens) continue

    // Try exact match
    const tokenData = networkConfig.tokens[token]
    if (tokenData?.address) {
      return {
        address: tokenData.address as `0x${string}`,
        decimals: tokenData.decimal || 18,
      }
    }

    // Try case-insensitive match
    const tokenKey = Object.keys(networkConfig.tokens).find(
      key => key.toLowerCase() === token.toLowerCase()
    )
    if (tokenKey) {
      const matchedToken = networkConfig.tokens[tokenKey]
      if (matchedToken?.address) {
        return {
          address: matchedToken.address as `0x${string}`,
          decimals: matchedToken.decimal || 18,
        }
      }
    }
  }

  return null
}

/**
 * Hook to fetch wallet balance for bridge tokens
 */
export function useBridgeTokenBalance(
  token: BridgeToken,
  network: Network
) {
  // Get vault symbol for yield tokens
  const vaultSymbol = React.useMemo(() => {
    return BRIDGE_TOKEN_TO_VAULT_SYMBOL[token]
  }, [token])

  // Fetch vault config for yield tokens
  const { data: vaultConfig } = useVaultConfig(vaultSymbol || undefined, {
    enabled: !!vaultSymbol,
  })

  // For stablecoins, fetch all vault configs to search for token addresses
  const { data: allVaultSymbols = [] } = useAllVaultSymbols({
    enabled: !vaultSymbol, // Only fetch if it's a stablecoin
  })

  const vaultConfigQueries = useQueries({
    queries: allVaultSymbols.map((symbol) => ({
      queryKey: ['vault-config', symbol] as const,
      queryFn: () => fetchVaultConfig(symbol),
      enabled: !vaultSymbol && allVaultSymbols.length > 0,
      staleTime: 5 * 60 * 1000,
    })),
  })

  const allVaultConfigs = React.useMemo(() => {
    return vaultConfigQueries.map(query => query.data)
  }, [vaultConfigQueries])

  // Find stablecoin address if needed
  const stablecoinInfo = React.useMemo(() => {
    if (vaultSymbol) return null // Yield tokens use vault config
    return findStablecoinAddress(token, network, allVaultConfigs)
  }, [token, network, allVaultConfigs, vaultSymbol])

  // Use wallet balance hook
  const { balance, isLoading, error, isConnected, address } = useWalletBalance(
    vaultConfig || null,
    network,
    token,
    stablecoinInfo?.address, // tokenAddressOverride for stablecoins
    stablecoinInfo?.decimals // decimalsOverride for stablecoins
  )

  return {
    balance,
    isLoading,
    error,
    isConnected,
    address,
  }
}

