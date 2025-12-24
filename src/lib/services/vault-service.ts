/**
 * Vault Service - API calls for vault-related data
 * Uses endpoints from vault config (static configs now, database in future)
 */

import { get } from './api-client'
import type { TVLResponse, VaultName, DepositsResponse, Period, BaseAPYResponse, TVLByTimeDataPoint } from './types'
import { fetchVaultConfig, type VaultSymbol } from '../config/vault-config'

/**
 * Fetch combined TVL for all vaults with currency conversion
 * Converts non-USD vaults (like syBTC) to USD using currency exchange API
 * 
 * @param vaultNames - Array of vault identifiers
 * @returns Promise with combined TVL value in USD
 */
export async function fetchCombinedVaultTVL(
  vaultNames: VaultName[]
): Promise<number> {
  // Fetch TVL for all vaults in parallel
  const tvlMap = await fetchMultipleVaultTVL(vaultNames)
  
  // Fetch currency rates for assets that need conversion
  const currencyRates: Record<string, number> = {}
  
  // Check which vaults need currency conversion
  const conversionNeeded: Array<{ vaultName: VaultName; assetName: string }> = []
  
  for (const vaultName of vaultNames) {
    const lowerName = vaultName.toLowerCase()
    if (lowerName.includes('btc')) {
      conversionNeeded.push({ vaultName, assetName: 'BTC' })
    } else if (lowerName.includes('eth')) {
      conversionNeeded.push({ vaultName, assetName: 'ETH' })
    }
    // syUSD and other USD-based vaults don't need conversion
  }
  
  // Fetch currency rates in parallel
  if (conversionNeeded.length > 0) {
    const ratePromises = conversionNeeded.map(async ({ assetName }) => {
      try {
        const rateData = await fetchCurrencyRate(assetName)
        return { assetName, rate: rateData.rate }
      } catch (error) {
        console.error(`Failed to fetch currency rate for ${assetName}:`, error)
        return { assetName, rate: 1 } // Fallback to 1 if rate fetch fails
      }
    })
    
    const rates = await Promise.all(ratePromises)
    rates.forEach(({ assetName, rate }) => {
      currencyRates[assetName] = rate
    })
  }
  
  // Convert all TVLs to USD and sum them
  let totalTVL = 0
  
  for (const vaultName of vaultNames) {
    const tvl = tvlMap[vaultName] || 0
    const lowerName = vaultName.toLowerCase()
    
    if (lowerName.includes('btc')) {
      // Convert BTC to USD
      const btcRate = currencyRates['BTC'] || 1
      totalTVL += tvl * btcRate
    } else if (lowerName.includes('eth')) {
      // Convert ETH to USD
      const ethRate = currencyRates['ETH'] || 1
      totalTVL += tvl * ethRate
    } else {
      // Already in USD (syUSD, etc.)
      totalTVL += tvl
    }
  }
  
  return totalTVL
}

/**
 * Fetch TVL (Total Value Locked) for a specific vault
 * 
 * @param vaultName - The vault identifier (syUSD, syETH, syBTC)
 * @returns Promise with TVL value
 * 
 * Uses endpoint from vault config: config.vault_endpoints.tvl
 */
export async function fetchVaultTVL(vaultName: VaultName): Promise<number> {
  // Get vault config to access endpoints
  const config = await fetchVaultConfig(vaultName as VaultSymbol)
  
  if (!config) {
    throw new Error(`Vault config not found for ${vaultName}`)
  }
  
  // Use TVL endpoint from config
  const tvlEndpoint = config.vault_endpoints.tvl
  
  // Make API call using endpoint from config
  const response = await get<TVLResponse>(tvlEndpoint)
  return response.result
}

/**
 * Fetch TVL for multiple vaults in parallel
 * 
 * @param vaultNames - Array of vault identifiers
 * @returns Promise with map of vault names to TVL values
 */
export async function fetchMultipleVaultTVL(
  vaultNames: VaultName[]
): Promise<Record<VaultName, number>> {
  const promises = vaultNames.map(async (vaultName) => {
    try {
      const tvl = await fetchVaultTVL(vaultName)
      return { vaultName, tvl }
    } catch (error) {
      console.error(`Failed to fetch TVL for ${vaultName}:`, error)
      return { vaultName, tvl: 0 }
    }
  })

  const results = await Promise.all(promises)
  
  return results.reduce((acc, { vaultName, tvl }) => {
    acc[vaultName] = tvl
    return acc
  }, {} as Record<VaultName, number>)
}

/**
 * Fetch historical deposits data for a specific vault
 * 
 * @param vaultName - The vault identifier (syUSD, syETH, syBTC)
 * @param period - The time period (daily, weekly, monthly)
 * @returns Promise with array of deposit data points
 * 
 * Uses endpoint from vault config. Note: Currently uses deposits API endpoint pattern.
 * TODO: Add deposits endpoint to vault config when available
 */
export async function fetchVaultDeposits(
  vaultName: VaultName,
  period: Period = 'daily'
): Promise<DepositsResponse> {
  // Get vault config
  const config = await fetchVaultConfig(vaultName as VaultSymbol)
  
  // For deposits, we still use the pattern-based endpoint since it's not in config yet
  // TODO: Add deposits_by_time endpoint to vault config
  // For now, construct endpoint using the pattern from the API
  const DEPOSITS_API_BASE_URL = 'https://j3zbikckse.execute-api.ap-south-1.amazonaws.com/prod'
  const fullUrl = `${DEPOSITS_API_BASE_URL}/api/${vaultName}/deposits?period=${period}`
  
  const response = await get<DepositsResponse>(fullUrl)
  return response
}

/**
 * Fetch current APY for a vault
 * 
 * @param vaultSymbol - Vault symbol to get endpoint from config
 * @returns Promise with current APY value
 * 
 * Uses endpoint from vault config: config.vault_endpoints.apy_endpoint
 * This endpoint returns a simple structure with trailing_total_APY
 */
export async function fetchVaultAPY(vaultSymbol: string): Promise<number> {
  // Get vault config to access the APY endpoint
  const config = await fetchVaultConfig(vaultSymbol)
  
  if (!config) {
    throw new Error(`Vault config not found for ${vaultSymbol}`)
  }
  
  // Use APY endpoint from config
  const apyEndpoint = config.vault_endpoints.apy_endpoint
  
  console.log('[fetchVaultAPY] Using endpoint:', apyEndpoint)
  
  // The endpoint returns: { result: { trailing_total_APY: number, description: string } }
  const response = await get<{ result: { trailing_total_APY: number; description: string } }>(apyEndpoint)
  
  return response.result.trailing_total_APY
}

/**
 * Fetch Base APY historical data
 * 
 * @param period - The time period (daily, weekly, monthly)
 * @returns Promise with array of base APY data points
 * 
 * Uses endpoint from vault config: config.vault_endpoints.apy_endpoint
 * Note: APY endpoint is shared across vaults, uses syUSD config as default
 */
export async function fetchBaseAPY(
  period: Period = 'daily'
): Promise<BaseAPYResponse> {
  // Get vault config (using syUSD as default since APY is shared)
  const config = await fetchVaultConfig('syUSD')
  
  if (!config) {
    throw new Error(`Vault config not found for syUSD`)
  }
  
  // Use APY endpoint from config
  // Note: The endpoint might need period parameter appended
  const baseApyEndpoint = config.vault_endpoints.apy_endpoint
  
  // Construct full URL with period parameter
  const DEPOSITS_API_BASE_URL = 'https://j3zbikckse.execute-api.ap-south-1.amazonaws.com/prod'
  const fullUrl = `${DEPOSITS_API_BASE_URL}/api/base-apy?period=${period}`
  
  // TODO: Update config to include period parameter in endpoint
  // For now, use the pattern-based endpoint
  const response = await get<BaseAPYResponse>(fullUrl)
  return response
}

/**
 * Fetch currency rate for an asset
 * Currently hardcoded for BTC, will be moved to config later
 * 
 * @param assetName - The asset name (e.g., 'BTC', 'ETH', 'USD')
 * @returns Promise with currency rate and updated timestamp
 * 
 * API: https://api.lucidly.finance/services/currency_rates?assetName={assetName}
 * Response: { result: string, updated_at: number }
 */
export async function fetchCurrencyRate(assetName: string = 'BTC'): Promise<{ rate: number; updatedAt: number }> {
  const CURRENCY_RATES_API_BASE_URL = 'https://api.lucidly.finance/services/currency_rates'
  const fullUrl = `${CURRENCY_RATES_API_BASE_URL}?assetName=${encodeURIComponent(assetName)}`
  
  const response = await get<{ result: string; updated_at: number }>(fullUrl)
  
  return {
    rate: parseFloat(response.result),
    updatedAt: response.updated_at,
  }
}

