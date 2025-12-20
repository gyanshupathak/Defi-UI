/**
 * Vault Configuration
 * Centralized configuration for all vaults (syUSD, syETH, syBTC)
 * 
 * CURRENT: Uses static config file (vault-configs.ts) - acts as mock database
 * FUTURE: Will fetch from database via backend API: GET /api/vaults/:symbol/config
 */

import { getVaultConfig as getStaticVaultConfig } from './vault-configs'

export type VaultSymbol = 'syUSD' | 'syETH' | 'syBTC'

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
 * Fetch vault configuration
 * 
 * CURRENT: Returns static config from vault-configs.ts (mock database)
 * FUTURE: Will call backend API to fetch from database:
 *   const endpoint = `/api/vaults/${vaultSymbol}/config`
 *   const response = await get<VaultConfigResponse>(endpoint)
 *   return response.result
 */
export async function fetchVaultConfig(vaultSymbol: VaultSymbol): Promise<VaultConfig> {
  // TODO: Replace with database API call
  // For now, use static configs (acts as mock database)
  return Promise.resolve(getStaticVaultConfig(vaultSymbol))
  
  // Future implementation:
  // const endpoint = `/api/vaults/${vaultSymbol}/config`
  // const response = await get<VaultConfigResponse>(endpoint)
  // return response.result
}

/**
 * Get vault symbol from strategy variant
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
 */
export function getVariantFromVaultSymbol(symbol: VaultSymbol): 'usd' | 'eth' | 'btc' {
  switch (symbol) {
    case 'syUSD':
      return 'usd'
    case 'syETH':
      return 'eth'
    case 'syBTC':
      return 'btc'
    default:
      return 'usd'
  }
}

/**
 * Re-export static configs for direct access if needed
 * Main usage should be through fetchVaultConfig() function
 */
export { VAULT_CONFIGS } from './vault-configs'

