/**
 * Vault Configuration
 * Centralized configuration for all vaults
 * 
 * Fetches vault configurations from API: GET /services/vault_config?vaultSymbol={symbol}
 * Or uses local configs from vault-configs.local.json when NEXT_PUBLIC_USE_LOCAL_VAULT_CONFIGS=true
 */

import { get } from '../services/api-client'
import localConfigs from './vault-configs.local.json'

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
  currency_price?: string
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
  enabled: boolean | null
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
  hyperEVM?: VaultNetwork
  [key: string]: VaultNetwork | undefined
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
 * Fetch vault configuration from API or local configs
 * 
 * @param vaultSymbol - The vault symbol (e.g., 'syUSD', 'syETH', 'syBTC')
 * @returns Promise with vault configuration (null if config doesn't exist)
 */
export async function fetchVaultConfig(vaultSymbol: VaultSymbol): Promise<VaultConfig | null> {
  // Check if local configs should be used
  const useLocalConfigs = process.env.NEXT_PUBLIC_USE_LOCAL_VAULT_CONFIGS === 'true'
  
  if (useLocalConfigs) {
    console.log(`[fetchVaultConfig] Using local config for ${vaultSymbol}`)
    const localConfig = (localConfigs as unknown as Record<string, VaultConfig>)[vaultSymbol]
    return localConfig || null
  }
  
  // Use API
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
 * Fetch all available vault symbols from API or local configs
 * 
 * @returns Promise with array of vault symbols
 */
export async function fetchAllVaultSymbols(): Promise<VaultSymbol[]> {
  // Check if local configs should be used
  const useLocalConfigs = process.env.NEXT_PUBLIC_USE_LOCAL_VAULT_CONFIGS === 'true'
  
  if (useLocalConfigs) {
    console.log('[fetchAllVaultSymbols] Using local configs')
    const configs = localConfigs as unknown as Record<string, VaultConfig>
    // Filter out empty config and return symbols
    const symbols = Object.keys(configs).filter(key => key !== 'empty' && configs[key].vault_constants.symbol)
    console.log('[fetchAllVaultSymbols] Local config symbols:', symbols)
    return symbols
  }
  
  // Use API
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
export function getVaultSymbolFromVariant(variant: 'usd' | 'eth' | 'btc' | 'hlp'): VaultSymbol {
  switch (variant) {
    case 'usd':
      return 'syUSD'
    case 'eth':
      return 'syETH'
    case 'btc':
      return 'syBTC'
    case 'hlp':
      return 'syHLP'
    default:
      return 'syUSD'
  }
}

/**
 * Get variant from vault symbol
 * Maps vault symbols to UI variants
 * IMPORTANT: Check HLP before ETH to avoid conflicts (syHLP should not match ETH)
 */
export function getVariantFromVaultSymbol(symbol: VaultSymbol): 'usd' | 'eth' | 'btc' | 'hlp' {
  const lowerSymbol = symbol.toLowerCase().trim()
  
  // Check for exact matches first (most specific)
  if (lowerSymbol === 'syhlp' || lowerSymbol === 'hlp') {
    return 'hlp'
  }
  if (lowerSymbol === 'syeth' || lowerSymbol === 'eth') {
    return 'eth'
  }
  if (lowerSymbol === 'sybtc' || lowerSymbol === 'btc') {
    return 'btc'
  }
  if (lowerSymbol === 'syusd' || lowerSymbol === 'usd') {
    return 'usd'
  }
  
  // Check for BTC first (most specific, before ETH to avoid conflicts)
  if (lowerSymbol.includes('btc')) {
    return 'btc'
  }
  // Check for HLP before ETH (to avoid syHLP matching ETH)
  if (lowerSymbol.includes('hlp')) {
    return 'hlp'
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


