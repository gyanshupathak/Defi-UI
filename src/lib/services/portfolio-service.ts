/**
 * Portfolio Service - API calls for portfolio-related data
 * Uses the old database APIs (will be swapped when new DB is ready)
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
 * API: https://j3zbikckse.execute-api.ap-south-1.amazonaws.com/prod/api/user-activity/{userAddress}?page={page}&limit={limit}
 */
export async function fetchPortfolioActivity(
  userAddress: string,
  page: number = 1,
  limit: number = 10
): Promise<PortfolioActivityResponse> {
  // Use full URL since it's a different base URL
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
 * API: https://api.lucidly.finance/services/queueData?vaultAddress={vaultAddress}&userAddress={userAddress}
 */
export async function fetchWithdrawalRequests(
  vaultAddress: string,
  userAddress: string
): Promise<WithdrawalRequestsResponse> {
  const endpoint = `/services/queueData${buildQueryString({ vaultAddress, userAddress })}`
  const response = await get<WithdrawalRequestsResponse>(endpoint)
  return response
}

