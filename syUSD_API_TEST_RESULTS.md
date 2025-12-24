# syUSD API Test Results

**Vault Address:** `0x279CAD277447965AF3d24a78197aad1B02a2c589`  
**Vault Name:** `syUSD`  
**Test Date:** December 23, 2025

## ✅ Working APIs (4/14)

### 1. `apy_endpoint`
- **URL:** `https://j3zbikckse.execute-api.ap-south-1.amazonaws.com/prod/api/base-apy/today-7d-ma`
- **Status:** ✓ WORKING (HTTP 200)
- **Note:** Returns trailing 7-day average APY (does not require vault address)
- **Response:** Valid JSON with `trailing_total_APY` value

### 2. `share_price`
- **URL:** `https://api.lucidly.finance/services/exchange_rates?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589`
- **Status:** ✓ WORKING (HTTP 200)
- **Response:** Returns share price (e.g., `1.0407`)

### 3. `tvl`
- **URL:** `https://api.lucidly.finance/services/aum_data?vaultName=syUSD`
- **Status:** ✓ WORKING (HTTP 200)
- **Response:** Returns TVL value (e.g., `222847.15645465866`)
- **Note:** Uses `vaultName` parameter, not `vaultAddress`

### 4. `withdraw_request`
- **URL:** `https://api.lucidly.finance/services/queueData?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589&userAddress={userAddress}`
- **Status:** ✓ WORKING (HTTP 200)
- **Response:** Returns queue data (empty object for test address)

---

## ❌ Failed APIs (10/14)

### 1. `allocations_by_time`
- **URL:** `https://api.lucidly.finance/services/allocations_data?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589&timestamp={timestamp}`
- **Status:** ✗ FAILED (HTTP 404)
- **Error:** `{"error":"Resource not found"}`

### 2. `apy_by_time`
- **URL:** `https://api.lucidly.finance/services/apy_data?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589&timestamp={timestamp}`
- **Status:** ✗ FAILED (HTTP 404)
- **Error:** `{"error":"Resource not found"}`

### 3. `asset_exposure`
- **URL:** `https://api.lucidly.finance/services/asset_exposure?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589`
- **Status:** ✗ FAILED (HTTP 404)
- **Error:** `{"error":"Resource not found"}`

### 4. `available_liquidity`
- **URL:** `https://api.lucidly.finance/services/available_liquidity?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589`
- **Status:** ✗ FAILED (HTTP 404)
- **Error:** `{"error":"Resource not found"}`

### 5. `base_asset_price`
- **URL:** `https://api.lucidly.finance/services/asset_price?asset=USDC`
- **Status:** ✗ FAILED (HTTP 404)
- **Error:** `{"error":"Resource not found"}`

### 6. `last_updated_deposit`
- **URL:** `https://api.lucidly.finance/services/last_updated_deposit?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589`
- **Status:** ✗ FAILED (HTTP 404)
- **Error:** `{"error":"Resource not found"}`

### 7. `last_updated_withdrawal`
- **URL:** `https://api.lucidly.finance/services/last_updated_withdrawal?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589`
- **Status:** ✗ FAILED (HTTP 404)
- **Error:** `{"error":"Resource not found"}`

### 8. `lifetime_returns`
- **URL:** `https://api.lucidly.finance/services/lifetime_returns?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589`
- **Status:** ✗ FAILED (HTTP 404)
- **Error:** `{"error":"Resource not found"}`

### 9. `strategy_exposure`
- **URL:** `https://api.lucidly.finance/services/strategy_exposure?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589`
- **Status:** ✗ FAILED (HTTP 404)
- **Error:** `{"error":"Resource not found"}`

### 10. `tvl_by_time`
- **URL:** `https://api.lucidly.finance/services/tvl_data?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589&timestamp={timestamp}`
- **Status:** ✗ FAILED (HTTP 404)
- **Error:** `{"error":"Resource not found"}`

### 11. `currency_price`
- **URL:** `https://api.lucidly.finance/services/currency_rates?assetName=syUSD`
- **Status:** ✗ FAILED (HTTP 400)
- **Error:** `{"error":"asset name should be either ETH or BTC"}`
- **Note:** This endpoint only supports ETH and BTC, not syUSD

---

## Summary

- **Working:** 4 APIs (28.6%)
- **Failed:** 10 APIs (71.4%)
  - 9 APIs return 404 (Resource not found)
  - 1 API returns 400 (currency_price - only supports ETH/BTC)

## Recommendations

1. Most endpoints return 404, suggesting they may not be implemented for syUSD yet
2. The `currency_price` endpoint explicitly only supports ETH and BTC assets
3. Consider checking if these endpoints need to be enabled/configured for syUSD in the backend
4. The working endpoints (`apy_endpoint`, `share_price`, `tvl`, `withdraw_request`) provide basic functionality but many time-series and exposure endpoints are unavailable

