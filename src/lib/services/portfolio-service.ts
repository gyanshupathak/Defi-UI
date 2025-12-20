/**
 * Portfolio Service - API calls for portfolio-related data
 * Uses endpoints from vault config (static configs now, database in future)
 */

import { get, buildQueryString } from './api-client'
import type { PortfolioActivityResponse, WithdrawalRequestsResponse } from './types'
import { fetchVaultConfig } from '../config/vault-config'

const PORTFOLIO_API_BASE_URL = 'https://j3zbikckse.execute-api.ap-south-1.amazonaws.com/prod'

/**
 * Fetch portfolio activity for a user
 * 
 * @param userAddress - The user's wallet address
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of items per page (default: 10)
 * @returns Promise with portfolio activity data
 * 
 * Note: Portfolio activity endpoint is not vault-specific, using pattern-based URL
 * TODO: Add portfolio activity endpoint to vault config when available
 */
export async function fetchPortfolioActivity(
  userAddress: string,
  page: number = 1,
  limit: number = 10
): Promise<PortfolioActivityResponse> {
  // Portfolio activity is user-specific, not vault-specific
  // Using pattern-based endpoint for now
  // TODO: Add to vault config or create separate user config
  const fullUrl = `${PORTFOLIO_API_BASE_URL}/api/user-activity/${userAddress}${buildQueryString({ page, limit })}`
  const response = await get<PortfolioActivityResponse>(fullUrl)
  return response
}

/**
 * Fetch withdrawal requests for a user and vault
 * 
 * @param vaultAddress - The vault contract address
 * @param userAddress - The user's wallet address
 * @param vaultSymbol - Optional vault symbol to get endpoint from config
 * @returns Promise with withdrawal requests data
 * 
 * Uses endpoint from vault config: config.vault_endpoints.withdraw_request
 */
export async function fetchWithdrawalRequests(
  vaultAddress: string,
  userAddress: string,
  vaultSymbol?: 'syUSD' | 'syETH' | 'syBTC'
): Promise<WithdrawalRequestsResponse> {
  // Try to determine vault symbol from address if not provided
  let symbol = vaultSymbol
  if (!symbol) {
    // Try to match vault address to known vaults
    const configs = await Promise.all([
      fetchVaultConfig('syUSD'),
      fetchVaultConfig('syETH'),
      fetchVaultConfig('syBTC'),
    ])
    
    const matchedConfig = configs.find(
      config => config.vault_constants.address.toLowerCase() === vaultAddress.toLowerCase()
    )
    
    if (matchedConfig) {
      symbol = matchedConfig.vault_constants.symbol
    }
  }
  
  // If we have a symbol, use endpoint from config
  if (symbol) {
    const config = await fetchVaultConfig(symbol)
    const withdrawEndpoint = config.vault_endpoints.withdraw_request
    
    // The endpoint template has placeholders, replace them
    // Format: ...queueData?vaultAddress={vaultAddress}&userAddress=
    let endpoint = withdrawEndpoint
      .replace('{vaultAddress}', vaultAddress)
      .replace('{userAddress}', userAddress)
    
    // If endpoint doesn't have userAddress param, add it
    if (!endpoint.includes('userAddress=')) {
      endpoint = `${endpoint}${endpoint.includes('?') ? '&' : '?'}userAddress=${userAddress}`
    }
    
    // Handle both relative and absolute URLs
    const response = await get<WithdrawalRequestsResponse>(endpoint)
    return response
  }
  
  // Fallback to pattern-based endpoint if vault symbol not found
  const endpoint = `/services/queueData${buildQueryString({ vaultAddress, userAddress })}`
  const response = await get<WithdrawalRequestsResponse>(endpoint)
  return response
}

