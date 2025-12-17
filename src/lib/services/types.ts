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
 * Formatted TVL data for UI consumption
 */
export interface TVLData {
  value: number
  formattedValue: string
  timestamp: number
  vaultName: VaultName
}

