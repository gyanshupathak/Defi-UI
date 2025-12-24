/**
 * Vault Configuration
 * Centralized configuration for all vaults
 * 
 * Fetches vault configurations from API: GET /services/vault_config?vaultSymbol={symbol}
 */

import { get } from '../services/api-client'

export type VaultSymbol = string // Dynamic type - can be any vault symbol from API

export interface VaultConstants {
  address: string
  audited_by: string
  base_asset: {
    asset: string
    network: string
  }
  category: string
  decimals: number
  deployment_date: string
  deposit_assets: Array<{
    assets: string[]
    network: string
  }>
  description: string
  dest_network: string
  faqs: Array<{
    question: string
    answer: string
  }>
  fee_payout: string
  logo: string
  management_fee: string
  name: string
  owner: string
  performance_fee: string
  queue_address: string
  rate_provider: string
  solver_address: string
  symbol: VaultSymbol
  teller_address: string
  type: string
  withdraw_assets: Array<{
    assets: string[]
    network: string
  }>
}

export interface VaultEndpoints {
  allocations_by_time: string
  apy_by_time: string
  apy_endpoint: string
  asset_exposure: string
  available_liquidity: string
  base_asset_price: string
  last_updated_deposit: string
  last_updated_withdrawal: string
  lifetime_returns: string
  share_price: string
  strategy_exposure: string
  tvl: string
  tvl_by_time: string
  withdraw_request: string
}

export interface VaultIncentivePoint {
  description: string
  image: string
  link?: string
  multiplier: number
  name: string
}

export interface VaultIncentives {
  enabled: boolean
  points: VaultIncentivePoint[]
}

export interface VaultNetworkToken {
  contract: string
  decimal: number
  image: string
  isWithdrawable: boolean
}

export interface VaultNetwork {
  chainId: number
  chainObject: {
    id: number
    name: string
    nativeCurrency: {
      decimals: number
      name: string
      symbol: string
    }
    network: string
    rpcUrls: {
      default: {
        http: string[]
      }
      public: {
        http: string[]
      }
    }
  }
  image: string
  rpc: string
  tokens: Record<string, VaultNetworkToken>
}

export interface VaultNetworks {
  arbitrum?: VaultNetwork
  base?: VaultNetwork
  ethereum?: VaultNetwork
  katana?: VaultNetwork
}

export interface VaultConfig {
  last_updated: string
  vault_constants: VaultConstants
  vault_endpoints: VaultEndpoints
  vault_incentives: VaultIncentives
  vault_networks: VaultNetworks
}

export interface VaultConfigResponse {
  result: VaultConfig
}

/**
 * Fetch vault configuration from API
 * 
 * @param vaultSymbol - The vault symbol (e.g., 'syUSD', 'syETH', 'syBTC')
 * @returns Promise with vault configuration (null if config doesn't exist)
 */
export async function fetchVaultConfig(vaultSymbol: VaultSymbol): Promise<VaultConfig | null> {
  const endpoint = `https://api.lucidly.finance/services/vault_config?vaultSymbol=${encodeURIComponent(vaultSymbol)}`
  try {
    const response = await get<{ result: VaultConfig | null }>(endpoint)
    // API returns null for vaults without configs
    return response.result || null
  } catch (error) {
    console.error(`[fetchVaultConfig] Error fetching config for ${vaultSymbol}:`, error)
    return null
  }
}

/**
 * Fetch all available vault symbols from API
 * 
 * @returns Promise with array of vault symbols
 */
export async function fetchAllVaultSymbols(): Promise<VaultSymbol[]> {
  const endpoint = 'https://api.lucidly.finance/services/vault_data'
  console.log('[fetchAllVaultSymbols] Making API call to:', endpoint)
  try {
    const response = await get<{ result: VaultSymbol[] }>(endpoint)
    console.log('[fetchAllVaultSymbols] API response:', response)
    return response.result
  } catch (error) {
    console.error('[fetchAllVaultSymbols] API error:', error)
    throw error
  }
}

/**
 * Get vault symbol from strategy variant
 * Maps common variants to known vault symbols
 */
export function getVaultSymbolFromVariant(variant: 'usd' | 'eth' | 'btc'): VaultSymbol {
  switch (variant) {
    case 'usd':
      return 'syUSD'
    case 'eth':
      return 'syETH'
    case 'btc':
      return 'syBTC'
    default:
      return 'syUSD'
  }
}

/**
 * Get variant from vault symbol
 * Maps vault symbols to UI variants
 * IMPORTANT: Check BTC before ETH to avoid conflicts (e.g., if symbol contains both)
 */
export function getVariantFromVaultSymbol(symbol: VaultSymbol): 'usd' | 'eth' | 'btc' {
  const lowerSymbol = symbol.toLowerCase().trim()
  
  // Check for BTC first (most specific, before ETH to avoid conflicts)
  if (lowerSymbol.includes('btc')) {
    return 'btc'
  }
  // Check for ETH second
  if (lowerSymbol.includes('eth')) {
    return 'eth'
  }
  // Check for USD or stable last (most general)
  if (lowerSymbol.includes('usd') || lowerSymbol.includes('stable')) {
    return 'usd'
  }
  // Default to USD for unknown symbols
  return 'usd'
}


