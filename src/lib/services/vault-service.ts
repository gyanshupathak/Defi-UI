/**
 * Vault Service - API calls for vault-related data
 * Uses endpoints from vault config (static configs now, database in future)
 */

import { get } from './api-client'
import type { TVLResponse, VaultName, DepositsResponse, Period, BaseAPYResponse } from './types'
import { fetchVaultConfig, type VaultSymbol } from '../config/vault-config'

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

