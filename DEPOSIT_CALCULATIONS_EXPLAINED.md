# Deposit Page Calculations Explained

## Overview

The deposit page converts USDC amounts to vault tokens (syUSD, syBTC, syETH, etc.) using a combination of:
1. **Share Price** - from the vault contract (via exchange_rates API)
2. **Currency Rates** - for BTC/ETH vaults (via currency_rates API)

---

## Calculation Formulas

### For USD Vaults (syUSD, syHLP)

**Simple Division:**
```
vaultTokenAmount = USDC / sharePrice
```

**Example:**
- Input: 1000 USDC
- Share Price: 1.0407 (1 syUSD = 1.0407 USDC)
- Result: 1000 / 1.0407 = **960.891708 syUSD**

**Conversion Rate (1 USDC = ? syUSD):**
```
rate = 1 / sharePrice = 1 / 1.0407 = 0.960892 syUSD per USDC
```

---

### For BTC Vaults (syBTC)

**Two-Step Process:**

**Step 1: Convert USDC → BTC**
```
assetAmount = USDC / BTC_price
```

**Step 2: Convert BTC → syBTC**
```
vaultTokenAmount = assetAmount / sharePrice
```

**Combined Formula:**
```
vaultTokenAmount = (USDC / BTC_price) / sharePrice
OR
vaultTokenAmount = USDC / (BTC_price × sharePrice)
```

**Example:**
- Input: 1000 USDC
- BTC Price: $95,000
- Share Price: 1.05 (1 syBTC = 1.05 BTC)
- Step 1: 1000 / 95000 = 0.01052632 BTC
- Step 2: 0.01052632 / 1.05 = **0.010025 syBTC**

**Conversion Rate (1 USDC = ? syBTC):**
```
rate = 1 / (BTC_price × sharePrice) = 1 / (95000 × 1.05) = 0.000010 syBTC per USDC
```

---

### For ETH Vaults (syETH)

**Two-Step Process:**

**Step 1: Convert USDC → ETH**
```
assetAmount = USDC / ETH_price
```

**Step 2: Convert ETH → syETH**
```
vaultTokenAmount = assetAmount / sharePrice
```

**Combined Formula:**
```
vaultTokenAmount = (USDC / ETH_price) / sharePrice
OR
vaultTokenAmount = USDC / (ETH_price × sharePrice)
```

**Example:**
- Input: 1000 USDC
- ETH Price: $3,200
- Share Price: 1.08 (1 syETH = 1.08 ETH)
- Step 1: 1000 / 3200 = 0.31250000 ETH
- Step 2: 0.31250000 / 1.08 = **0.289352 syETH**

**Conversion Rate (1 USDC = ? syETH):**
```
rate = 1 / (ETH_price × sharePrice) = 1 / (3200 × 1.08) = 0.000289 syETH per USDC
```

---

## Code Implementation

### 1. Core Conversion Function

**File:** `src/lib/services/vault-service.ts`

```typescript
export async function convertUSDCToVaultToken(
  usdcAmount: number,
  vaultSymbol: VaultSymbol
): Promise<number> {
  // Get vault config to access vault address
  const config = await fetchVaultConfig(vaultSymbol)
  const vaultAddress = config.vault_constants.address
  
  // Fetch share price (always needed)
  const sharePrice = await fetchVaultSharePrice(vaultAddress)
  
  // For USD-based vaults, conversion is simple
  if (!lowerSymbol.includes('btc') && !lowerSymbol.includes('eth')) {
    // USD vaults: USDC / share_price
    return usdcAmount / sharePrice
  }
  
  // For BTC/ETH vaults, need currency rate
  let assetPriceInUSD = 1
  
  if (lowerSymbol.includes('btc')) {
    const btcPriceData = await fetchCurrencyRate('BTC')
    assetPriceInUSD = btcPriceData.rate
  } else if (lowerSymbol.includes('eth')) {
    const ethPriceData = await fetchCurrencyRate('ETH')
    assetPriceInUSD = ethPriceData.rate
  }
  
  // Convert: USDC → Asset → Vault Token
  // Step 1: USDC to underlying asset
  const assetAmount = usdcAmount / assetPriceInUSD
  
  // Step 2: Asset to vault token
  const vaultTokenAmount = assetAmount / sharePrice
  
  return vaultTokenAmount
}
```

### 2. Share Price Fetching

**File:** `src/lib/services/vault-service.ts`

```typescript
export async function fetchVaultSharePrice(vaultAddress: string): Promise<number> {
  const EXCHANGE_RATES_API_BASE_URL = 'https://api.lucidly.finance/services/exchange_rates'
  const fullUrl = `${EXCHANGE_RATES_API_BASE_URL}?vaultAddress=${encodeURIComponent(vaultAddress)}`
  
  const response = await get<number | { result?: number }>(fullUrl)
  
  // Handle different response formats
  if (typeof response === 'number') {
    return response
  } else if (response && typeof response === 'object' && 'result' in response) {
    return response.result
  }
  
  return parseFloat(String(response))
}
```

**API Endpoint:**
```
GET https://api.lucidly.finance/services/exchange_rates?vaultAddress={vaultAddress}
```

### 3. Currency Rate Fetching

**File:** `src/lib/services/vault-service.ts`

```typescript
export async function fetchCurrencyRate(assetName: string = 'BTC'): Promise<{ rate: number; updatedAt: number }> {
  const CURRENCY_RATES_API_BASE_URL = 'https://api.lucidly.finance/services/currency_rates'
  const fullUrl = `${CURRENCY_RATES_API_BASE_URL}?assetName=${encodeURIComponent(assetName)}`
  
  const response = await get<{ result: string; updated_at: number }>(fullUrl)
  
  return {
    rate: parseFloat(response.result),
    updatedAt: response.updated_at,
  }
}
```

**API Endpoint:**
```
GET https://api.lucidly.finance/services/currency_rates?assetName={assetName}
```

### 4. React Hook for Conversion

**File:** `src/lib/hooks/use-vault.ts`

```typescript
export function useUSDCToVaultTokenConversion(
  usdcAmount: number,
  vaultSymbol: string,
  options?: {
    enabled?: boolean
    refetchInterval?: number
    staleTime?: number
  }
) {
  const isEnabled = (options?.enabled !== false) && !!vaultSymbol && usdcAmount > 0
  
  const {
    data: vaultTokenAmount,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['usdc-to-vault-token', usdcAmount, vaultSymbol],
    queryFn: async () => {
      return await convertUSDCToVaultToken(usdcAmount, vaultSymbol as VaultSymbol)
    },
    enabled: isEnabled,
    staleTime: options?.staleTime ?? 30_000, // 30 seconds default
  })

  return {
    vaultTokenAmount: vaultTokenAmount ?? 0,
    formattedAmount: vaultTokenAmount !== undefined && vaultTokenAmount !== null 
      ? vaultTokenAmount.toFixed(6) 
      : '0.000000',
    isLoading,
    isError,
    error,
  }
}
```

### 5. Deposit Page Usage

**File:** `src/app/(dashboard)/deposit/page.tsx`

```typescript
// Calculate USDC amount from user input
const usdcAmount = React.useMemo(() => {
  const amountNum = parseFloat(amount.replace(/,/g, '')) || 0
  return amountNum
}, [amount])

// Always fetch conversion rate for 1 USDC to show base rate
const { 
  vaultTokenAmount: baseVaultTokenAmount, 
  isLoading: isBaseConversionLoading,
} = useUSDCToVaultTokenConversion(1, vaultSymbol, {
  enabled: !!vaultSymbol && !!vaultConfig,
})

// Convert USDC to vault token using real API (for actual amount entered)
const { 
  vaultTokenAmount, 
  formattedAmount: vaultTokenFormatted,
  isLoading: isConversionLoading 
} = useUSDCToVaultTokenConversion(usdcAmount, vaultSymbol, {
  enabled: !!vaultSymbol && usdcAmount > 0 && !!vaultConfig,
})

// Calculate conversion rate: use base rate (1 USDC) when no amount entered, otherwise use actual rate
const conversionRate = React.useMemo(() => {
  if (usdcAmount > 0 && vaultTokenAmount > 0) {
    return vaultTokenAmount / usdcAmount
  }
  // Use base rate for 1 USDC
  return baseVaultTokenAmount > 0 ? baseVaultTokenAmount : 0
}, [usdcAmount, vaultTokenAmount, baseVaultTokenAmount])

// Vault shares displayed to user
const vaultShares = React.useMemo(() => {
  if (isConversionLoading || usdcAmount === 0) {
    return '0.00'
  }
  return vaultTokenFormatted
}, [vaultTokenFormatted, isConversionLoading, usdcAmount])
```

---

## API Endpoints Used

### 1. Exchange Rates API
**Purpose:** Get vault share price
```
GET https://api.lucidly.finance/services/exchange_rates?vaultAddress={vaultAddress}
```

**Response:**
- Number (e.g., `1.0407`)
- Or `{ result: number }`

**Example:**
```json
1.0407
```

### 2. Currency Rates API
**Purpose:** Get BTC/ETH prices in USD
```
GET https://api.lucidly.finance/services/currency_rates?assetName={assetName}
```

**Response:**
```json
{
  "result": "95000",
  "updated_at": 1234567890
}
```

---

## Key Concepts

### Share Price
- Represents how many underlying assets are needed for 1 vault token
- For USD vaults: `1 syUSD = sharePrice USDC`
- For BTC vaults: `1 syBTC = sharePrice BTC`
- For ETH vaults: `1 syETH = sharePrice ETH`
- Changes over time as the vault earns yield

### Currency Rate
- Current market price of BTC/ETH in USD
- Used only for BTC/ETH vaults
- Fetched from external API

### Conversion Rate
- Shows how many vault tokens you get per 1 USDC
- Displayed in the UI: "1 USDC = X.XXXXXX syUSD"
- Calculated as: `rate = vaultTokenAmount / USDC`

---

## Flow Diagram

```
User Input (USDC)
    ↓
Parse Amount
    ↓
Check Vault Type
    ├─→ USD Vault (syUSD, syHLP)
    │       ↓
    │   Fetch Share Price
    │       ↓
    │   Calculate: USDC / sharePrice
    │       ↓
    │   Return vaultTokenAmount
    │
    └─→ BTC/ETH Vault (syBTC, syETH)
            ↓
        Fetch Share Price
            ↓
        Fetch Currency Rate (BTC/ETH price)
            ↓
        Step 1: USDC / assetPrice = assetAmount
            ↓
        Step 2: assetAmount / sharePrice = vaultTokenAmount
            ↓
        Return vaultTokenAmount
```

---

## Example Calculations Summary

| Vault | USDC Input | Share Price | Asset Price | Result |
|-------|-----------|-------------|-------------|--------|
| syUSD | 1000 | 1.0407 | N/A | 960.891708 syUSD |
| syUSD | 1 | 1.0407 | N/A | 0.960892 syUSD |
| syBTC | 1000 | 1.05 | $95,000 | 0.010025 syBTC |
| syBTC | 1 | 1.05 | $95,000 | 0.000010 syBTC |
| syETH | 1000 | 1.08 | $3,200 | 0.289352 syETH |
| syETH | 1 | 1.08 | $3,200 | 0.000289 syETH |

---

## Notes

1. **Caching:** Conversion results are cached for 30 seconds (staleTime) to reduce API calls
2. **Base Rate:** Always fetches conversion for 1 USDC to show the base rate in UI
3. **Real-time Updates:** Share prices and currency rates are fetched fresh on each conversion
4. **Error Handling:** Falls back gracefully if APIs fail
5. **Precision:** Results are formatted to 6 decimal places for display

