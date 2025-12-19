/**
 * API Response Types
 * Types for API responses from the old database
 */

/**
 * TVL (Total Value Locked) API Response
 * Endpoint: /services/aum_data?vaultName={vaultName}
 */
export interface TVLResponse {
  result: number
}

/**
 * Historical Deposits Data Point
 */
export interface DepositDataPoint {
  date: string
  value: number
  timestamp?: number
}

/**
 * Historical Deposits API Response
 * Endpoint: /api/{vaultName}/deposits?period={period}
 */
export interface DepositsResponse {
  data: DepositDataPoint[]
  period?: string
}

/**
 * Vault identifier type
 */
export type VaultName = 'syUSD' | 'syETH' | 'syBTC'

/**
 * Period type for historical data
 */
export type Period = 'daily' | 'weekly' | 'monthly'

/**
 * Base APY Data Point
 */
export interface BaseAPYDataPoint {
  date: string
  annualizedAPY: number // APY percentage value
  value?: number // Computed from annualizedAPY for backward compatibility
}

/**
 * Base APY Summary
 */
export interface BaseAPYSummary {
  totalDataPoints: number
  latestAnnualizedAPY: number
  avgDailyAPY: number
  annualizedAPY: number
}

/**
 * Base APY API Response
 * Endpoint: /api/base-apy?period={period}
 */
export interface BaseAPYResponse {
  success: boolean
  vaultAddress: string
  period: string
  movingAvgWindow: number
  data: BaseAPYDataPoint[]
  summary: BaseAPYSummary
}

/**
 * Formatted TVL data for UI consumption
 */
export interface TVLData {
  value: number
  formattedValue: string
  timestamp: number
  vaultName: VaultName
}

/**
 * Portfolio Activity API Response
 * Endpoint: /api/user-activity/{userAddress}?page={page}&limit={limit}
 */
export interface AssetInfo {
  address: string
  name: string
  symbol: string
  icon: string
}

export interface PortfolioActivityItem {
  id: number
  type: 'deposit' | 'withdraw' | 'bridge'
  transactionHash: string
  timestamp: string // ISO date string
  vaultAddress: string
  amount: string
  asset: string
  assetName: string
  network: string
  fromAmount: string
  toAmount: string
  fromAsset: AssetInfo
  toAsset: AssetInfo
}

export interface PortfolioActivityPagination {
  currentPage: number
  totalPages: number
  totalTransactions: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PortfolioActivitySummary {
  totalDeposits: number
  totalWithdrawals: number
  totalBridges: number
  totalTransactions: number
}

export interface PortfolioActivityData {
  transactions: PortfolioActivityItem[]
  pagination: PortfolioActivityPagination
  summary: PortfolioActivitySummary
}

export interface PortfolioActivityResponse {
  success: boolean
  data: PortfolioActivityData
}

/**
 * Withdrawal Request API Response
 * Endpoint: /services/queueData?vaultAddress={vaultAddress}&userAddress={userAddress}
 */
export interface WithdrawalRequestItem {
  amount_of_assets: number | string
  amount_of_shares: number | string
  creation_time: string // Unix timestamp
  network: string
  nonce: string
  request_id: string
  seconds_to_deadline: string
  seconds_to_maturity: string
  transaction_hash: string
  withdraw_asset_address: string
}

export type WithdrawalRequestStatus = 'PENDING' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED'

export interface WithdrawalRequestsResult {
  [key: string]: WithdrawalRequestItem[] // Key is status like "PENDING", "FULFILLED", etc.
}

export interface WithdrawalRequestsResponse {
  result: WithdrawalRequestsResult
}

