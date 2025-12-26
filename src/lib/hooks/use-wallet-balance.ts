"use client"

import * as React from 'react'
import { useBalance, useAccount } from 'wagmi'
import { formatUnits } from 'viem'
import type { Network } from '@/components/ui/unified-selector'
import type { VaultConfig } from '@/lib/config/vault-config'
import { mainnet, base, arbitrum } from 'wagmi/chains'
import { defineChain } from 'viem'

// Map Network type to wagmi chain
const networkToChain: Record<Network, typeof base> = {
  'Base': base,
  'Ethereum': mainnet,
  'Arbitrum': arbitrum,
  'Katana': defineChain({
    id: 747474,
    name: 'Katana',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.katana.network'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Katana Explorer',
        url: 'https://explorer.katana.network',
      },
    },
    testnet: false,
  }),
  'HyperEVM': defineChain({
    id: 999,
    name: 'HyperEVM',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.hyperevm.org'],
      },
    },
    blockExplorers: {
      default: {
        name: 'HyperEVM Explorer',
        url: 'https://explorer.hyperevm.org',
      },
    },
    testnet: false,
  }),
}

/**
 * Get token address from vault config for a given network and asset symbol
 */
function getTokenAddress(
  vaultConfig: VaultConfig | null | undefined,
  network: Network,
  assetSymbol: string
): `0x${string}` | undefined {
  if (!vaultConfig?.vault_networks) return undefined

  // Map network name to config key
  const networkKeyMap: Record<Network, string> = {
    'Base': 'base',
    'Ethereum': 'ethereum',
    'Arbitrum': 'arbitrum',
    'Katana': 'katana',
    'HyperEVM': 'hyperEVM',
  }

  const configKey = networkKeyMap[network]
  const networkConfig = vaultConfig.vault_networks[configKey as keyof typeof vaultConfig.vault_networks]

  if (!networkConfig?.tokens) return undefined

  // Try exact match first
  const token = networkConfig.tokens[assetSymbol]
  if (token?.address) {
    return token.address as `0x${string}`
  }

  // Try case-insensitive match
  const tokenKey = Object.keys(networkConfig.tokens).find(
    key => key.toLowerCase() === assetSymbol.toLowerCase()
  )
  if (tokenKey) {
    const matchedToken = networkConfig.tokens[tokenKey]
    if (matchedToken?.address) {
      return matchedToken.address as `0x${string}`
    }
  }

  return undefined
}

/**
 * Hook to fetch wallet balance for a deposit asset
 * Can work with either vault config (for deposit page) or direct token address (for bridge page)
 */
export function useWalletBalance(
  vaultConfig: VaultConfig | null | undefined,
  network: Network,
  assetSymbol: string | undefined,
  tokenAddressOverride?: `0x${string}` | undefined,
  decimalsOverride?: number | undefined
) {
  const { address, isConnected } = useAccount()
  
  // Get token address from vault config or use override
  const tokenAddress = React.useMemo(() => {
    if (tokenAddressOverride) return tokenAddressOverride
    if (!assetSymbol || !vaultConfig) return undefined
    return getTokenAddress(vaultConfig, network, assetSymbol)
  }, [vaultConfig, network, assetSymbol, tokenAddressOverride])

  // Get chain for the network
  const chain = React.useMemo(() => {
    return networkToChain[network]
  }, [network])

  // Fetch balance
  const { data: balanceData, isLoading, error } = useBalance({
    address: address,
    token: tokenAddress,
    chainId: chain.id,
    query: {
      enabled: isConnected && !!address && !!tokenAddress,
    },
  })

  // Format balance
  const balance = React.useMemo(() => {
    if (!balanceData) return 0
    // Get decimals from override, vault config, or default to 18
    const decimals = decimalsOverride || vaultConfig?.vault_constants?.decimals || 18
    return parseFloat(formatUnits(balanceData.value, decimals))
  }, [balanceData, vaultConfig, decimalsOverride])

  return {
    balance,
    isLoading,
    error,
    isConnected,
    address,
  }
}

