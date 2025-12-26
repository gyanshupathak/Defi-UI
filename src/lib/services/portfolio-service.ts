/**
 * Portfolio Service - API calls for portfolio-related data
 * Uses endpoints from vault config (static configs now, database in future)
 */

import { get, buildQueryString } from './api-client'
import type { PortfolioActivityResponse, WithdrawalRequestsResponse } from './types'

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
 * @returns Promise with withdrawal requests data
 * 
 * Uses the queueData endpoint: https://api.lucidly.finance/services/queueData?vaultAddress={vaultAddress}&userAddress={userAddress}
 */
export async function fetchWithdrawalRequests(
  vaultAddress: string,
  userAddress: string
): Promise<WithdrawalRequestsResponse> {
  // Use the queueData endpoint directly
  const endpoint = `/services/queueData${buildQueryString({ vaultAddress, userAddress })}`
  const response = await get<WithdrawalRequestsResponse>(endpoint)
  return response
}

