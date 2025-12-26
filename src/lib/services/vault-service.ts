/**
 * Vault Service - API calls for vault-related data
 * Uses endpoints from vault config (static configs now, database in future)
 */

import { get } from './api-client'
import type { TVLResponse, VaultName, DepositsResponse, Period, BaseAPYResponse, TVLByTimeDataPoint, AllocationsByTimeResponse, AllocationDataPoint } from './types'
import { fetchVaultConfig, type VaultSymbol } from '../config/vault-config'

/**
 * Fetch combined TVL for all vaults with currency conversion
 * Converts non-USD vaults (like syBTC, syETH) to USD using currency_rates API
 * 
 * API: https://api.lucidly.finance/services/currency_rates?assetName={assetName}
 * Response: { result: string, updated_at: number }
 * Note: Only supports 'BTC' and 'ETH' as asset names
 * 
 * @param vaultNames - Array of vault identifiers
 * @returns Promise with combined TVL value in USD
 */
export async function fetchCombinedVaultTVL(
  vaultNames: VaultName[]
): Promise<number> {
  console.log(`[fetchCombinedVaultTVL] Starting calculation for vaults:`, vaultNames)
  
  if (vaultNames.length === 0) {
    console.log(`[fetchCombinedVaultTVL] No vaults provided, returning 0`)
    return 0
  }
  
  // Fetch TVL for all vaults in parallel
  // Note: fetchMultipleVaultTVL calls fetchVaultTVL which already converts BTC/ETH to USD
  // So the values returned are already in USD - we just need to sum them
  const tvlMap = await fetchMultipleVaultTVL(vaultNames)
  console.log(`[fetchCombinedVaultTVL] TVL map received (already in USD):`, tvlMap)
  
  // Sum all TVL values (they're already in USD)
  let totalTVL = 0
  
  for (const vaultName of vaultNames) {
    const tvl = tvlMap[vaultName] || 0
    console.log(`[fetchCombinedVaultTVL] ${vaultName}: ${tvl} USD`)
    totalTVL += tvl
  }
  
  console.log(`[fetchCombinedVaultTVL] Total combined TVL: ${totalTVL} USD`)
  return totalTVL
}

/**
 * Fetch TVL (Total Value Locked) for a specific vault
 * Converts BTC/ETH TVL to USD using currency rates
 * 
 * @param vaultName - The vault identifier (syUSD, syETH, syBTC, syHLP)
 * @returns Promise with TVL value in USD
 * 
 * Uses endpoint from vault config: config.vault_endpoints.tvl
 */
export async function fetchVaultTVL(vaultName: VaultName): Promise<number> {
  // Get vault config to access endpoints
  const config = await fetchVaultConfig(vaultName as VaultSymbol)
  
  if (!config) {
    console.error(`[fetchVaultTVL] Vault config not found for ${vaultName}`)
    throw new Error(`Vault config not found for ${vaultName}`)
  }
  
  // Use TVL endpoint from config
  const tvlEndpoint = config.vault_endpoints.tvl
  
  if (!tvlEndpoint) {
    console.error(`[fetchVaultTVL] TVL endpoint not found in config for ${vaultName}`)
    throw new Error(`TVL endpoint not found in config for ${vaultName}`)
  }
  
  try {
    // Make API call using endpoint from config
    // API: https://api.lucidly.finance/services/aum_data?vaultName={vaultName}
    // Response can be: { result: number } or just number
    const response = await get<TVLResponse | number>(tvlEndpoint)
    
    // Handle both response formats
    let tvlValue: number
    if (typeof response === 'number') {
      tvlValue = response
    } else if (response && typeof response === 'object' && 'result' in response) {
      tvlValue = response.result
    } else {
      console.error(`[fetchVaultTVL] Unexpected response format for ${vaultName}:`, response)
      throw new Error(`Unexpected response format for ${vaultName}`)
    }
    
    console.log(`[fetchVaultTVL] ${vaultName}: Raw TVL = ${tvlValue}`)
    
    // Convert to USD if needed (BTC/ETH vaults need conversion)
    const lowerName = vaultName.toLowerCase()
    if (lowerName.includes('btc')) {
      // Convert BTC to USD using currency_rates API
      try {
        const btcRateData = await fetchCurrencyRate('BTC')
        const convertedTvl = tvlValue * btcRateData.rate
        console.log(`[fetchVaultTVL] ${vaultName}: ${tvlValue} BTC * ${btcRateData.rate} = ${convertedTvl} USD`)
        return convertedTvl
      } catch (error) {
        console.error(`[fetchVaultTVL] Failed to fetch BTC rate for ${vaultName}, using raw value:`, error)
        // Fallback to raw value if rate fetch fails
        return tvlValue
      }
    } else if (lowerName.includes('eth')) {
      // Convert ETH to USD using currency_rates API
      try {
        const ethRateData = await fetchCurrencyRate('ETH')
        const convertedTvl = tvlValue * ethRateData.rate
        console.log(`[fetchVaultTVL] ${vaultName}: ${tvlValue} ETH * ${ethRateData.rate} = ${convertedTvl} USD`)
        return convertedTvl
      } catch (error) {
        console.error(`[fetchVaultTVL] Failed to fetch ETH rate for ${vaultName}, using raw value:`, error)
        // Fallback to raw value if rate fetch fails
        return tvlValue
      }
    } else {
      // Already in USD (syUSD, syHLP, etc.)
      console.log(`[fetchVaultTVL] ${vaultName}: ${tvlValue} USD (no conversion needed)`)
      return tvlValue
    }
  } catch (error) {
    console.error(`[fetchVaultTVL] Error fetching TVL for ${vaultName} from ${tvlEndpoint}:`, error)
    throw error
  }
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
  console.log(`[fetchMultipleVaultTVL] Fetching TVL for vaults:`, vaultNames)
  
  const promises = vaultNames.map(async (vaultName) => {
    try {
      const tvl = await fetchVaultTVL(vaultName)
      console.log(`[fetchMultipleVaultTVL] Successfully fetched TVL for ${vaultName}: ${tvl}`)
      return { vaultName, tvl }
    } catch (error) {
      console.error(`[fetchMultipleVaultTVL] Failed to fetch TVL for ${vaultName}:`, error)
      // Return 0 instead of throwing to allow other vaults to succeed
      return { vaultName, tvl: 0 }
    }
  })

  const results = await Promise.all(promises)
  
  const tvlMap = results.reduce((acc, { vaultName, tvl }) => {
    acc[vaultName] = tvl
    return acc
  }, {} as Record<VaultName, number>)
  
  console.log(`[fetchMultipleVaultTVL] Final TVL map:`, tvlMap)
  return tvlMap
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
 * Fetch Base APY historical data for a specific vault
 * 
 * @param vaultSymbol - The vault symbol (e.g., 'syUSD', 'syETH', 'syBTC')
 * @param period - The time period (daily, weekly, monthly)
 * @returns Promise with BaseAPYResponse or null if endpoint doesn't exist
 * 
 * Uses endpoint from vault config: config.vault_endpoints.apy_by_time
 */
export async function fetchBaseAPY(
  vaultSymbol: VaultSymbol,
  period: Period = 'daily'
): Promise<BaseAPYResponse | null> {
  try {
    console.log(`[fetchBaseAPY] Starting fetch for ${vaultSymbol} with period ${period}`)
    
    // Get vault config to access endpoints
    const config = await fetchVaultConfig(vaultSymbol)
    
    if (!config) {
      console.log(`[fetchBaseAPY] No config found for ${vaultSymbol}`)
      return null
    }
    
    // Check if apy_by_time endpoint exists
    const apyByTimeEndpoint = config.vault_endpoints.apy_by_time
    if (!apyByTimeEndpoint) {
      console.log(`[fetchBaseAPY] No apy_by_time endpoint for ${vaultSymbol}`)
      return null
    }
    
    // Construct full URL with period parameter if needed
    const urlObj = new URL(apyByTimeEndpoint)
    // Remove existing period parameter if it exists
    urlObj.searchParams.delete('period')
    // Add the period parameter
    urlObj.searchParams.set('period', period)
    const fullUrl = urlObj.toString()
    
    console.log(`[fetchBaseAPY] Calling API: ${fullUrl}`)
    
    // Make API call
    const response = await get<BaseAPYResponse>(fullUrl)
    return response
  } catch (error) {
    console.error(`[fetchBaseAPY] Error fetching Base APY for ${vaultSymbol}:`, error)
    return null
  }
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
 * 
 * Note: This API only supports 'BTC' and 'ETH' as asset names
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

/**
 * Fetch vault share price
 * 
 * @param vaultAddress - The vault contract address
 * @returns Promise with share price (number representing vault token per underlying asset)
 * 
 * API: https://api.lucidly.finance/services/exchange_rates?vaultAddress={vaultAddress}
 * Response: Returns share price as a number (e.g., 1.0407)
 */
export async function fetchVaultSharePrice(vaultAddress: string): Promise<number> {
  const EXCHANGE_RATES_API_BASE_URL = 'https://api.lucidly.finance/services/exchange_rates'
  const fullUrl = `${EXCHANGE_RATES_API_BASE_URL}?vaultAddress=${encodeURIComponent(vaultAddress)}`
  
  console.log(`[fetchVaultSharePrice] Fetching share price from: ${fullUrl}`)
  
  try {
    const response = await get<number | { result?: number }>(fullUrl)
    console.log(`[fetchVaultSharePrice] Raw response:`, response)
    
    // Handle different response formats
    let sharePrice: number
    if (typeof response === 'number') {
      sharePrice = response
    } else if (response && typeof response === 'object' && 'result' in response && typeof response.result === 'number') {
      sharePrice = response.result
    } else {
      // Try to parse as string
      const stringValue = String(response)
      sharePrice = parseFloat(stringValue)
    }
    
    console.log(`[fetchVaultSharePrice] Parsed share price: ${sharePrice}`)
    return sharePrice
  } catch (error) {
    console.error(`[fetchVaultSharePrice] Error fetching share price:`, error)
    throw error
  }
}

/**
 * Convert USDC amount to vault token amount
 * 
 * Conversion process varies by vault type:
 * - USD vaults (syUSD): USDC / share_price
 * - BTC vaults (syBTC): (USDC / BTC_price) / share_price
 * - ETH vaults (syETH): (USDC / ETH_price) / share_price
 * 
 * @param usdcAmount - Amount in USDC (1 USDC = 1 USD)
 * @param vaultSymbol - Vault symbol (e.g., 'syBTC', 'syETH', 'syUSD')
 * @returns Promise with vault token amount
 * 
 * Example (syBTC):
 * - USDC amount: 1000
 * - BTC price: $95,000
 * - Share price: 1.05 (1 syBTC = 1.05 BTC)
 * - Result: (1000 / 95000) / 1.05 = 0.010025 syBTC
 */
export async function convertUSDCToVaultToken(
  usdcAmount: number,
  vaultSymbol: VaultSymbol
): Promise<number> {
  console.log(`[convertUSDCToVaultToken] Starting conversion: ${usdcAmount} USDC → ${vaultSymbol}`)
  
  // Get vault config to access vault address
  const config = await fetchVaultConfig(vaultSymbol)
  
  if (!config) {
    console.error(`[convertUSDCToVaultToken] Vault config not found for ${vaultSymbol}`)
    throw new Error(`Vault config not found for ${vaultSymbol}`)
  }
  
  const vaultAddress = config.vault_constants.address
  const lowerSymbol = vaultSymbol.toLowerCase()
  console.log(`[convertUSDCToVaultToken] Vault address: ${vaultAddress}`)
  
  // Fetch share price (always needed)
  const sharePrice = await fetchVaultSharePrice(vaultAddress)
  console.log(`[convertUSDCToVaultToken] Share price: ${sharePrice}`)
  
  // For USD-based vaults, conversion is simple
  if (!lowerSymbol.includes('btc') && !lowerSymbol.includes('eth')) {
    // USD vaults: USDC / share_price
    const result = usdcAmount / sharePrice
    console.log(`[convertUSDCToVaultToken] USD vault conversion: ${usdcAmount} / ${sharePrice} = ${result}`)
    return result
  }
  
  // For BTC/ETH vaults, need currency rate
  let assetPriceInUSD = 1
  
  if (lowerSymbol.includes('btc')) {
    const btcPriceData = await fetchCurrencyRate('BTC')
    assetPriceInUSD = btcPriceData.rate
    console.log(`[convertUSDCToVaultToken] BTC price: ${assetPriceInUSD}`)
  } else if (lowerSymbol.includes('eth')) {
    const ethPriceData = await fetchCurrencyRate('ETH')
    assetPriceInUSD = ethPriceData.rate
    console.log(`[convertUSDCToVaultToken] ETH price: ${assetPriceInUSD}`)
  }
  
  // Convert: USDC → Asset → Vault Token
  // Step 1: USDC to underlying asset (divide by asset price in USD)
  const assetAmount = usdcAmount / assetPriceInUSD
  console.log(`[convertUSDCToVaultToken] Step 1: ${usdcAmount} USDC / ${assetPriceInUSD} = ${assetAmount} ${lowerSymbol.includes('btc') ? 'BTC' : 'ETH'}`)
  
  // Step 2: Asset to vault token (divide by share price)
  // Share price represents how many underlying assets are needed for 1 vault token
  const vaultTokenAmount = assetAmount / sharePrice
  console.log(`[convertUSDCToVaultToken] Step 2: ${assetAmount} / ${sharePrice} = ${vaultTokenAmount} ${vaultSymbol}`)
  console.log(`[convertUSDCToVaultToken] Final result: ${vaultTokenAmount} ${vaultSymbol}`)
  
  return vaultTokenAmount
}

/**
 * Convert USDC amount to syBTC amount (legacy function, use convertUSDCToVaultToken instead)
 * 
 * @deprecated Use convertUSDCToVaultToken instead
 */
export async function convertUSDCToSyBTC(
  usdcAmount: number,
  vaultSymbol: VaultSymbol = 'syBTC'
): Promise<number> {
  return convertUSDCToVaultToken(usdcAmount, vaultSymbol)
}

/**
 * Fetch TVL by time data for a specific vault
 * 
 * @param vaultSymbol - The vault symbol (e.g., 'syUSD', 'syETH', 'syBTC')
 * @param period - The time period (daily, weekly, monthly)
 * @returns Promise with array of TVL data points (null if endpoint doesn't exist or fails)
 * 
 * Uses endpoint from vault config: config.vault_endpoints.tvl_by_time
 */
export async function fetchVaultTVLByTime(
  vaultSymbol: VaultSymbol,
  period: Period = 'daily'
): Promise<TVLByTimeDataPoint[] | null> {
  try {
    console.log(`[fetchVaultTVLByTime] Starting fetch for ${vaultSymbol} with period ${period}`)
    
    // Get vault config to access endpoints
    const config = await fetchVaultConfig(vaultSymbol)
    
    if (!config) {
      console.log(`[fetchVaultTVLByTime] No config found for ${vaultSymbol}`)
      return null
    }
    
    // Check if tvl_by_time endpoint exists
    const tvlByTimeEndpoint = config.vault_endpoints.tvl_by_time
    if (!tvlByTimeEndpoint) {
      console.log(`[fetchVaultTVLByTime] No tvl_by_time endpoint for ${vaultSymbol}`)
      return null
    }
    
    // Construct full URL with period parameter if needed
    // Check if period parameter already exists in the endpoint
    const urlObj = new URL(tvlByTimeEndpoint)
    // Remove existing period parameter if it exists
    urlObj.searchParams.delete('period')
    // Add the period parameter
    urlObj.searchParams.set('period', period)
    const fullUrl = urlObj.toString()
    
    console.log(`[fetchVaultTVLByTime] Calling API: ${fullUrl}`)
    
    // Make API call - response is a date-keyed object with token addresses and deposit amounts
    // Format: { "2025-05-20": { "0x...": 4.92, "0x...": 0.75 }, ... }
    const response = await get<any>(fullUrl)
    
    console.log(`[fetchVaultTVLByTime] API response for ${vaultSymbol}:`, response)
    console.log(`[fetchVaultTVLByTime] Response type:`, typeof response, Array.isArray(response) ? 'array' : 'object')
    console.log(`[fetchVaultTVLByTime] Response is null?:`, response === null)
    console.log(`[fetchVaultTVLByTime] Response keys:`, response ? Object.keys(response) : 'N/A')
    console.log(`[fetchVaultTVLByTime] Response keys count:`, response ? Object.keys(response).length : 0)
    // Handle the date-keyed object format
    // The response is an object where keys are dates and values are objects with token addresses
    let transformedData: TVLByTimeDataPoint[] = []
    
    // Check if response has nested data structure (like { data: {...} } or { result: {...} })
    let dataToProcess = response
    if (response && typeof response === 'object' && !Array.isArray(response)) {
      // Check for common wrapper formats
      if ('data' in response && typeof response.data === 'object' && response.data !== null) {
        console.log(`[fetchVaultTVLByTime] Found 'data' wrapper, using response.data`)
        dataToProcess = response.data
      } else if ('result' in response && typeof response.result === 'object' && response.result !== null) {
        console.log(`[fetchVaultTVLByTime] Found 'result' wrapper, using response.result`)
        dataToProcess = response.result
      }
    }
    
    console.log(`[fetchVaultTVLByTime] dataToProcess type:`, typeof dataToProcess, Array.isArray(dataToProcess) ? 'array' : 'object')
    console.log(`[fetchVaultTVLByTime] dataToProcess keys count:`, dataToProcess && typeof dataToProcess === 'object' ? Object.keys(dataToProcess).length : 0)
    
    // Try to stringify and parse again to ensure we have a plain object
    if (dataToProcess && typeof dataToProcess === 'object' && !Array.isArray(dataToProcess) && dataToProcess !== null) {
      try {
        // Convert to JSON string and back to ensure it's a plain object
        const jsonString = JSON.stringify(dataToProcess)
        dataToProcess = JSON.parse(jsonString)
        console.log(`[fetchVaultTVLByTime] After JSON roundtrip, keys count:`, Object.keys(dataToProcess).length)
      } catch (e) {
        console.error(`[fetchVaultTVLByTime] Error in JSON roundtrip:`, e)
      }
    }
    
    if (dataToProcess && typeof dataToProcess === 'object' && !Array.isArray(dataToProcess) && dataToProcess !== null) {
      // It's a date-keyed object format
      const dateKeys = Object.keys(dataToProcess).sort() // Sort dates chronologically
      console.log(`[fetchVaultTVLByTime] Found ${dateKeys.length} dates in response`)
      console.log(`[fetchVaultTVLByTime] First 5 date keys:`, dateKeys.slice(0, 5))
      
      // First, calculate daily deposit amounts (sum of all tokens per date)
      const dailyDeposits = dateKeys.map((dateStr) => {
        const dayData = dataToProcess[dateStr]
        // Sum up all deposit values for this date (dayData is an object with token addresses as keys)
        let dailyValue = 0
        if (typeof dayData === 'object' && dayData !== null) {
          const tokenValues = Object.values(dayData) as number[]
          dailyValue = tokenValues.reduce((sum, val) => {
            const numVal = typeof val === 'string' ? parseFloat(val) : (typeof val === 'number' ? val : 0)
            return sum + (isNaN(numVal) ? 0 : numVal)
          }, 0)
        }
        
        return {
          date: dateStr,
          dailyDeposit: dailyValue,
        }
      })
      
      console.log(`[fetchVaultTVLByTime] Daily deposits for ${vaultSymbol}:`, dailyDeposits.slice(0, 5), '...', dailyDeposits.slice(-5))
      
      // Calculate cumulative TVL from daily deposits
      let cumulativeTVL = 0
      transformedData = dailyDeposits.map(({ date, dailyDeposit }) => {
        cumulativeTVL += dailyDeposit
        return {
          date,
          value: cumulativeTVL, // Cumulative TVL value
        }
      })
      
      console.log(`[fetchVaultTVLByTime] Transformed ${transformedData.length} data points for ${vaultSymbol}`)
      console.log(`[fetchVaultTVLByTime] First 5 points:`, transformedData.slice(0, 5))
      console.log(`[fetchVaultTVLByTime] Last 5 points:`, transformedData.slice(-5))
      console.log(`[fetchVaultTVLByTime] Date range:`, {
        start: transformedData[0]?.date,
        end: transformedData[transformedData.length - 1]?.date,
        totalPoints: transformedData.length
      })
    } else if (Array.isArray(response)) {
      // Fallback: handle array format if API changes
      console.log(`[fetchVaultTVLByTime] Response is array format, converting...`)
      transformedData = response.map((point: any) => ({
        date: point.date || point.timestamp || new Date().toISOString(),
        value: typeof point.value === 'string' ? parseFloat(point.value) : (point.value || 0),
        timestamp: point.timestamp,
      }))
    } else if (response?.data && Array.isArray(response.data)) {
      // Handle wrapped array format
      console.log(`[fetchVaultTVLByTime] Response has data array, converting...`)
      transformedData = response.data.map((point: any) => ({
        date: point.date || point.timestamp || new Date().toISOString(),
        value: typeof point.value === 'string' ? parseFloat(point.value) : (point.value || 0),
        timestamp: point.timestamp,
      }))
    } else {
      console.warn(`[fetchVaultTVLByTime] Unknown response format for ${vaultSymbol}:`, response)
      return null
    }
    
    return transformedData.length > 0 ? transformedData : null
  } catch (error) {
    console.error(`[fetchVaultTVLByTime] Error fetching TVL by time for ${vaultSymbol}:`, error)
    return null
  }
}

/**
 * Fetch combined TVL by time data for all vaults
 * Combines TVL data from all vaults and converts non-USD vaults to USD
 * Splits the data into 7 equal periods from start to end
 * 
 * @param vaultSymbols - Array of vault symbols
 * @param period - The time period (daily, weekly, monthly)
 * @returns Promise with combined TVL by time data points split into 7 equal periods (null if no data available)
 */
export async function fetchCombinedVaultTVLByTime(
  vaultSymbols: VaultSymbol[],
  period: Period = 'daily'
): Promise<TVLByTimeDataPoint[] | null> {
  if (vaultSymbols.length === 0) {
    console.log('[fetchCombinedVaultTVLByTime] No vault symbols provided')
    return null
  }
  
  console.log('[fetchCombinedVaultTVLByTime] Starting fetch for vaults:', vaultSymbols)
  console.log('[fetchCombinedVaultTVLByTime] Period:', period)
  
  // Fetch configs first to check which vaults have tvl_by_time endpoints
  const configPromises = vaultSymbols.map(symbol => fetchVaultConfig(symbol))
  const configs = await Promise.all(configPromises)
  
  // Filter vaults that have tvl_by_time endpoints
  const vaultsWithEndpoints: Array<{ symbol: VaultSymbol; config: NonNullable<typeof configs[0]> }> = []
  configs.forEach((config, index) => {
    if (config && config.vault_endpoints.tvl_by_time) {
      vaultsWithEndpoints.push({ symbol: vaultSymbols[index], config })
      console.log(`[fetchCombinedVaultTVLByTime] Vault ${vaultSymbols[index]} has tvl_by_time endpoint:`, config.vault_endpoints.tvl_by_time)
    } else {
      console.log(`[fetchCombinedVaultTVLByTime] Vault ${vaultSymbols[index]} does NOT have tvl_by_time endpoint`)
    }
  })
  
  if (vaultsWithEndpoints.length === 0) {
    console.log('[fetchCombinedVaultTVLByTime] No vaults with tvl_by_time endpoints found')
    return null
  }
  
  // Fetch TVL by time for all vaults with endpoints in parallel
  const tvlDataPromises = vaultsWithEndpoints.map(async ({ symbol }) => {
    console.log(`[fetchCombinedVaultTVLByTime] Fetching TVL data for ${symbol}...`)
    const data = await fetchVaultTVLByTime(symbol, period)
    console.log(`[fetchCombinedVaultTVLByTime] ${symbol} returned ${data?.length || 0} data points`, data)
    return { symbol, data }
  })
  
  const tvlDataResults = await Promise.all(tvlDataPromises)
  
  // Filter out null results
  const validTvlData = tvlDataResults.filter(result => result.data !== null)
  
  if (validTvlData.length === 0) {
    console.log('[fetchCombinedVaultTVLByTime] No valid TVL data found')
    return null
  }
  
  console.log('[fetchCombinedVaultTVLByTime] Valid TVL data from vaults:', validTvlData.map(r => ({ symbol: r.symbol, count: r.data?.length || 0 })))
  
  // Fetch currency rates for assets that need conversion
  const currencyRates: Record<string, number> = {}
  
  // Check which vaults need currency conversion
  const conversionNeeded: Array<{ symbol: VaultSymbol; assetName: string }> = []
  
  for (const { symbol } of vaultsWithEndpoints) {
    const lowerSymbol = symbol.toLowerCase()
    if (lowerSymbol.includes('btc')) {
      conversionNeeded.push({ symbol, assetName: 'BTC' })
    } else if (lowerSymbol.includes('eth')) {
      conversionNeeded.push({ symbol, assetName: 'ETH' })
    }
  }
  
  // Fetch currency rates in parallel
  if (conversionNeeded.length > 0) {
    console.log('[fetchCombinedVaultTVLByTime] Fetching currency rates for:', conversionNeeded.map(c => c.assetName))
    const ratePromises = conversionNeeded.map(async ({ assetName }) => {
      try {
        const rateData = await fetchCurrencyRate(assetName)
        console.log(`[fetchCombinedVaultTVLByTime] Currency rate for ${assetName}:`, rateData.rate)
        return { assetName, rate: rateData.rate }
      } catch (error) {
        console.error(`[fetchCombinedVaultTVLByTime] Failed to fetch currency rate for ${assetName}:`, error)
        return { assetName, rate: 1 } // Fallback to 1 if rate fetch fails
      }
    })
    
    const rates = await Promise.all(ratePromises)
    rates.forEach(({ assetName, rate }) => {
      currencyRates[assetName] = rate
    })
  }
  
  // Since fetchVaultTVLByTime now returns cumulative TVL, we need to convert back to daily deposits
  // to combine correctly across vaults, then recalculate cumulative
  
  // Step 1: Convert cumulative TVL back to daily deposits for each vault
  const vaultDailyDeposits: Array<{ symbol: VaultSymbol; deposits: Map<string, number> }> = []
  
  validTvlData.forEach(({ symbol, data }) => {
    if (!data || data.length === 0) return
    
    const lowerSymbol = symbol.toLowerCase()
    let conversionRate = 1
    
    // Apply currency conversion if needed
    if (lowerSymbol.includes('btc')) {
      conversionRate = currencyRates['BTC'] || 1
      console.log(`[fetchCombinedVaultTVLByTime] Applying BTC conversion rate ${conversionRate} to ${symbol}`)
    } else if (lowerSymbol.includes('eth')) {
      conversionRate = currencyRates['ETH'] || 1
      console.log(`[fetchCombinedVaultTVLByTime] Applying ETH conversion rate ${conversionRate} to ${symbol}`)
    } else {
      console.log(`[fetchCombinedVaultTVLByTime] No conversion needed for ${symbol} (USD)`)
    }
    
    // Convert cumulative TVL back to daily deposits
    const deposits = new Map<string, number>()
    let prevValue = 0
    data.forEach((point) => {
      const dailyDeposit = (point.value - prevValue) * conversionRate
      deposits.set(point.date, dailyDeposit)
      prevValue = point.value
    })
    
    vaultDailyDeposits.push({ symbol, deposits })
    console.log(`[fetchCombinedVaultTVLByTime] ${symbol} daily deposits:`, Array.from(deposits.entries()).slice(0, 5))
  })
  
  // Step 2: Combine daily deposits across all vaults
  const allDates = new Set<string>()
  vaultDailyDeposits.forEach(({ deposits }) => {
    deposits.forEach((_, date) => allDates.add(date))
  })
  const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  
  console.log('[fetchCombinedVaultTVLByTime] Combining daily deposits from', vaultDailyDeposits.length, 'vaults across', sortedDates.length, 'dates')
  
  // Step 3: Sum daily deposits across vaults, then calculate cumulative TVL
  let cumulativeTVL = 0
  const combinedData: TVLByTimeDataPoint[] = sortedDates.map((date) => {
    // Sum daily deposits from all vaults for this date
    let dailyTotal = 0
    vaultDailyDeposits.forEach(({ deposits }) => {
      const deposit = deposits.get(date)
      if (deposit !== undefined) {
        dailyTotal += deposit
      }
    })
    
    // Add to cumulative
    cumulativeTVL += dailyTotal
    
    return {
      date,
      value: cumulativeTVL,
    }
  })
  
  console.log('[fetchCombinedVaultTVLByTime] Combined data:', combinedData.length, 'data points')
  console.log('[fetchCombinedVaultTVLByTime] Date range:', {
    start: combinedData[0]?.date,
    end: combinedData[combinedData.length - 1]?.date,
    firstValue: combinedData[0]?.value,
    lastValue: combinedData[combinedData.length - 1]?.value
  })
  
  // Return all data points (not aggregated to 7 periods)
  // The chart will handle showing bars for all dates with 7 x-axis labels
  return combinedData.length > 0 ? combinedData : null
}

/**
 * Fetch allocations by time data for a specific vault
 * 
 * @param vaultSymbol - The vault symbol (e.g., 'syUSD', 'syETH', 'syBTC')
 * @returns Promise with array of allocation data points (null if endpoint doesn't exist or fails)
 * 
 * Uses endpoint from vault config: config.vault_endpoints.allocations_by_time
 */
export async function fetchAllocationsByTime(
  vaultSymbol: VaultSymbol
): Promise<AllocationDataPoint[] | null> {
  try {
    console.log(`[fetchAllocationsByTime] Starting fetch for ${vaultSymbol}`)
    
    // Get vault config to access endpoints
    const config = await fetchVaultConfig(vaultSymbol)
    
    if (!config) {
      console.log(`[fetchAllocationsByTime] No config found for ${vaultSymbol}`)
      return null
    }
    
    // Check if allocations_by_time endpoint exists
    const allocationsEndpoint = config.vault_endpoints.allocations_by_time
    if (!allocationsEndpoint || allocationsEndpoint.trim() === '') {
      console.log(`[fetchAllocationsByTime] No allocations_by_time endpoint for ${vaultSymbol}`)
      return null
    }
    
    console.log(`[fetchAllocationsByTime] Calling API: ${allocationsEndpoint}`)
    
    // Make API call
    const response = await get<AllocationsByTimeResponse | AllocationDataPoint[]>(allocationsEndpoint)
    
    console.log(`[fetchAllocationsByTime] API response for ${vaultSymbol}:`, response)
    console.log(`[fetchAllocationsByTime] Response type:`, typeof response, Array.isArray(response) ? 'array' : 'object')
    
    // Handle different response formats
    let dataToProcess: AllocationDataPoint[] = []
    
    // Check for nested data structure first
    let dataToParse = response
    if (response && typeof response === 'object' && !Array.isArray(response)) {
      if ('data' in response && response.data !== null && response.data !== undefined) {
        console.log(`[fetchAllocationsByTime] Found 'data' wrapper, using response.data`)
        dataToParse = response.data
      } else if ('result' in response && response.result !== null && response.result !== undefined) {
        console.log(`[fetchAllocationsByTime] Found 'result' wrapper, using response.result`)
        dataToParse = response.result
      }
    }
    
    if (Array.isArray(dataToParse)) {
      // Direct array format
      console.log(`[fetchAllocationsByTime] Response is array format with ${dataToParse.length} items`)
      dataToProcess = dataToParse
    } else if (dataToParse && typeof dataToParse === 'object' && dataToParse !== null) {
      // Try to convert object to array if it's date-keyed (similar to TVL endpoint)
      const keys = Object.keys(dataToParse)
      console.log(`[fetchAllocationsByTime] Response is object with ${keys.length} keys`)
      console.log(`[fetchAllocationsByTime] First 5 keys:`, keys.slice(0, 5))
      
      if (keys.length > 0) {
        // Check if keys look like dates (YYYY-MM-DD format or similar)
        const firstKey = keys[0]
        const isDateKeyed = firstKey.match(/^\d{4}-\d{2}-\d{2}/) || 
                           firstKey.match(/^\d{2}\s[A-Z]{3}/) ||
                           firstKey.match(/^\d{2}\/\d{2}\/\d{4}/)
        
        if (isDateKeyed) {
          console.log(`[fetchAllocationsByTime] Detected date-keyed object format`)
          // Sort keys chronologically
          const sortedKeys = keys.sort()
          dataToProcess = sortedKeys.map(date => {
            const dateValue = dataToParse[date]
            // If the value is an object, spread it; otherwise wrap it
            if (dateValue && typeof dateValue === 'object' && !Array.isArray(dateValue)) {
              return {
                date,
                ...dateValue
              } as AllocationDataPoint
            } else {
              // If it's not an object, create a simple structure
              return {
                date,
                value: dateValue
              } as AllocationDataPoint
            }
          })
        } else {
          console.log(`[fetchAllocationsByTime] Keys don't look like dates, checking structure...`)
          // Check if it's a single object with date properties
          const sampleValue = dataToParse[keys[0]]
          console.log(`[fetchAllocationsByTime] Sample value type:`, typeof sampleValue)
          if (sampleValue && typeof sampleValue === 'object') {
            // Might be a different structure - log for debugging
            console.warn(`[fetchAllocationsByTime] Unexpected object structure, attempting to parse as-is`)
          }
        }
      }
    }
    
    console.log(`[fetchAllocationsByTime] Processed ${dataToProcess.length} data points for ${vaultSymbol}`)
    if (dataToProcess.length > 0) {
      console.log(`[fetchAllocationsByTime] First data point:`, dataToProcess[0])
      console.log(`[fetchAllocationsByTime] Last data point:`, dataToProcess[dataToProcess.length - 1])
    }
    
    return dataToProcess.length > 0 ? dataToProcess : null
  } catch (error) {
    console.error(`[fetchAllocationsByTime] Error fetching allocations for ${vaultSymbol}:`, error)
    return null
  }
}

