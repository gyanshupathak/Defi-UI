/**
 * Vault Service - API calls for vault-related data
 * Uses the old database APIs (will be swapped when new DB is ready)
 */

import { get, buildQueryString } from './api-client'
import type { TVLResponse, VaultName, DepositsResponse, Period, BaseAPYResponse } from './types'

const DEPOSITS_API_BASE_URL = 'https://j3zbikckse.execute-api.ap-south-1.amazonaws.com/prod'

/**
 * Fetch TVL (Total Value Locked) for a specific vault
 * 
 * @param vaultName - The vault identifier (syUSD, syETH, syBTC)
 * @returns Promise with TVL value
 * 
 * API: https://api.lucidly.finance/services/aum_data?vaultName={vaultName}
 */
export async function fetchVaultTVL(vaultName: VaultName): Promise<number> {
  const endpoint = `/services/aum_data${buildQueryString({ vaultName })}`
  const response = await get<TVLResponse>(endpoint)
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
 * API: https://j3zbikckse.execute-api.ap-south-1.amazonaws.com/prod/api/{vaultName}/deposits?period={period}
 */
export async function fetchVaultDeposits(
  vaultName: VaultName,
  period: Period = 'daily'
): Promise<DepositsResponse> {
  // Use full URL since it's a different base URL
  const fullUrl = `${DEPOSITS_API_BASE_URL}/api/${vaultName}/deposits${buildQueryString({ period })}`
  const response = await get<DepositsResponse>(fullUrl)
  return response
}

/**
 * Fetch Base APY historical data
 * 
 * @param period - The time period (daily, weekly, monthly)
 * @returns Promise with array of base APY data points
 * 
 * API: https://j3zbikckse.execute-api.ap-south-1.amazonaws.com/prod/api/base-apy?period={period}
 */
export async function fetchBaseAPY(
  period: Period = 'daily'
): Promise<BaseAPYResponse> {
  // Use full URL since it's a different base URL
  const fullUrl = `${DEPOSITS_API_BASE_URL}/api/base-apy${buildQueryString({ period })}`
  const response = await get<BaseAPYResponse>(fullUrl)
  return response
}

