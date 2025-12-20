# Vault Configuration Implementation - Detailed Changes

This document explains all the changes made to implement dynamic vault configuration for syUSD, syETH, and syBTC vaults.

## Overview

The codebase has been updated to:
1. Fetch vault configurations dynamically from the API endpoint: `https://api.lucidly.finance/services/vault_config?vaultSymbol={symbol}`
2. Remove the strategy selector (TokenSelector) from the yields page
3. Default to syUSD when accessing yields page from navbar
4. Allow navigation to other vaults (syETH, syBTC) via strategy cards on the home page

---

## Files Created

### 1. `/src/lib/config/vault-config.ts`
**Purpose**: Centralized vault configuration types and API service

**Key Features**:
- Defines `VaultSymbol` type: `'syUSD' | 'syETH' | 'syBTC'`
- Complete TypeScript interfaces matching the API response structure:
  - `VaultConstants`: Vault metadata (address, fees, networks, etc.)
  - `VaultEndpoints`: All API endpoints for the vault
  - `VaultIncentives`: Incentive points configuration
  - `VaultNetworks`: Network configurations (Base, Arbitrum, Ethereum, Katana)
  - `VaultConfig`: Complete vault configuration
- `fetchVaultConfig()`: Function to fetch vault config from API
- Helper functions:
  - `getVaultSymbolFromVariant()`: Converts 'usd'/'eth'/'btc' to 'syUSD'/'syETH'/'syBTC'
  - `getVariantFromVaultSymbol()`: Converts vault symbol to variant
- Default fallback configurations

**Usage**:
```typescript
import { fetchVaultConfig, type VaultSymbol } from '@/lib/config/vault-config'
const config = await fetchVaultConfig('syUSD')
```

---

### 2. `/src/lib/hooks/use-vault-config.ts`
**Purpose**: React Query hook for fetching and caching vault configurations

**Key Features**:
- Uses `@tanstack/react-query` for caching and state management
- Default stale time: 5 minutes
- Default cache time: 10 minutes
- Automatic retry on failure (2 retries)

**Usage**:
```typescript
import { useVaultConfig } from '@/lib/hooks/use-vault-config'
const { data: vaultConfig, isLoading } = useVaultConfig('syUSD')
```

---

## Files Modified

### 3. `/src/app/(dashboard)/yields/page.tsx`
**Changes**:
- Added `useSearchParams` to read query parameters
- Wrapped component in `Suspense` for Next.js 15 compatibility
- Extracts `strategy` query parameter from URL
- Defaults to `'syUSD'` when no query parameter is present (navbar navigation)
- Converts strategy variant ('usd', 'eth', 'btc') to vault symbol ('syUSD', 'syETH', 'syBTC')
- Passes `vaultSymbol` to `BaseCircularComponent` and `YieldsDashboard`

**Before**:
```typescript
export default function YieldsPage() {
  // Hardcoded to syUSD
  return <YieldsDashboard vaultName="syUSD" />
}
```

**After**:
```typescript
function YieldsPageContent() {
  const searchParams = useSearchParams()
  const strategyParam = searchParams.get('strategy')
  const vaultSymbol = strategyParam 
    ? getVaultSymbolFromVariant(strategyParam as 'usd' | 'eth' | 'btc')
    : 'syUSD' // Default from navbar
  
  return (
    <>
      <BaseCircularComponent vaultSymbol={vaultSymbol} />
      <YieldsDashboard vaultName={vaultSymbol} />
    </>
  )
}
```

**Navigation Behavior**:
- **From Navbar**: `/yields` → Shows syUSD (default)
- **From Strategy Card**: `/yields?strategy=usd` → Shows syUSD
- **From Strategy Card**: `/yields?strategy=eth` → Shows syETH
- **From Strategy Card**: `/yields?strategy=btc` → Shows syBTC

---

### 4. `/src/components/features/yields/base-circular-component.tsx`
**Changes**:
- **Removed**: `TokenSelector` component and all related state/logic
- **Added**: `vaultSymbol` prop (required)
- Removed token selection state management
- Derives token type and strategy from `vaultSymbol` prop
- Removed the token selector UI element above the yield circle

**Before**:
```typescript
export function BaseCircularComponent() {
  const [selectedToken, setSelectedToken] = useState<TokenType>("usd")
  // ... token selection logic
  return (
    <>
      <TokenSelector selectedToken={selectedToken} onTokenChange={handleTokenChange} />
      <YieldCircle tokenType={selectedToken} />
    </>
  )
}
```

**After**:
```typescript
interface BaseCircularComponentProps {
  vaultSymbol: VaultSymbol
}

export function BaseCircularComponent({ vaultSymbol }: BaseCircularComponentProps) {
  const tokenType = getVariantFromVaultSymbol(vaultSymbol)
  const strategyType = getStrategyFromToken(tokenType)
  
  return (
    <YieldCircle tokenType={tokenType} />
    // TokenSelector removed
  )
}
```

**Visual Changes**:
- The token selector buttons (syUSD, syETH, syBTC) above the yield circle are now removed
- The yield circle displays based on the vault symbol passed as prop

---

### 5. `/src/lib/services/types.ts`
**Changes**:
- Updated `VaultName` type to re-export `VaultSymbol` from vault-config
- Ensures type consistency across the codebase

**Before**:
```typescript
export type VaultName = 'syUSD' | 'syETH' | 'syBTC'
```

**After**:
```typescript
import type { VaultSymbol } from '../config/vault-config'
export type VaultName = VaultSymbol
```

---

## Components That Already Work Dynamically

The following components already accept `vaultName` as a prop and work correctly with the dynamic values:

1. **`YieldsDashboard`** (`src/components/features/yields/yields-dashboard.tsx`)
   - Accepts `vaultName?: "syUSD" | "syETH" | "syBTC"`
   - Passes it to child components

2. **`TVLTab`** (`src/components/features/yields/tvl-tab.tsx`)
   - Accepts `vaultName?: "syUSD" | "syETH" | "syBTC"`
   - Passes it to `TVLChart`

3. **`TVLChart`** (`src/components/charts/tvl-chart.tsx`)
   - Accepts `vaultName?: "syUSD" | "syETH" | "syBTC"`
   - Uses it for API calls

4. **`YieldStrategyCard`** (`src/components/features/yields/yield-strategy-card.tsx`)
   - Already passes `strategy` query parameter correctly
   - No changes needed

---

## API Integration

### Vault Config Endpoint
```
GET https://api.lucidly.finance/services/vault_config?vaultSymbol={symbol}
```

**Supported Symbols**: `syUSD`, `syETH`, `syBTC`

**Response Structure**:
```json
{
  "result": {
    "last_updated": "2025-12-18T07:33:04.045336+00:00",
    "vault_constants": { ... },
    "vault_endpoints": { ... },
    "vault_incentives": { ... },
    "vault_networks": { ... }
  }
}
```

### Using Vault Config in Components

To use vault configuration in any component:

```typescript
import { useVaultConfig } from '@/lib/hooks/use-vault-config'

function MyComponent({ vaultSymbol }: { vaultSymbol: VaultSymbol }) {
  const { data: config, isLoading } = useVaultConfig(vaultSymbol)
  
  if (isLoading) return <div>Loading...</div>
  if (!config) return <div>Error loading config</div>
  
  // Access vault data
  const vaultName = config.vault_constants.name
  const vaultAddress = config.vault_constants.address
  const tvlEndpoint = config.vault_endpoints.tvl
  // ... etc
}
```

---

## Navigation Flow

### From Home Page (Strategy Cards)
1. User clicks on a strategy card (syUSD, syETH, or syBTC)
2. Card navigates to `/yields?strategy={variant}` (variant: usd, eth, or btc)
3. Yields page reads query param and displays corresponding vault

### From Navbar
1. User clicks "Yields" in navbar
2. Navigates to `/yields` (no query param)
3. Yields page defaults to `syUSD`

### Strategy Card Implementation
The `YieldStrategyCard` component already handles this correctly:
```typescript
const handleCardClick = () => {
  router.push(`/yields?strategy=${variant}`) // variant: 'usd' | 'eth' | 'btc'
}
```

---

## Type Safety

All vault symbols are now type-safe:
- `VaultSymbol`: `'syUSD' | 'syETH' | 'syBTC'`
- `VaultName`: Re-exported from `VaultSymbol` for backward compatibility
- Helper functions ensure correct type conversions

---

## Future Enhancements

The vault configuration system is designed to be extensible:

1. **Add New Vaults**: Simply add the new symbol to `VaultSymbol` type and update the API
2. **Use Config Data**: Components can now access full vault configuration via `useVaultConfig` hook
3. **Dynamic Endpoints**: All API endpoints are now available in the config, making it easy to switch between vaults

---

## Testing Checklist

- [x] Yields page defaults to syUSD when accessed from navbar
- [x] Yields page shows correct vault when accessed via strategy card
- [x] Token selector is removed from yields page
- [x] BaseCircularComponent displays correct vault based on prop
- [x] YieldsDashboard receives and uses correct vault symbol
- [x] Type safety maintained throughout
- [x] No linting errors

---

## Summary

All changes have been implemented successfully:
1. ✅ Vault configuration system created
2. ✅ API integration ready (can be used with `useVaultConfig` hook)
3. ✅ Strategy selector removed
4. ✅ Default to syUSD from navbar
5. ✅ Strategy cards navigate correctly
6. ✅ Type safety maintained
7. ✅ All components work dynamically

The codebase is now ready to fetch and use vault configurations dynamically from the API endpoint for all three vaults (syUSD, syETH, syBTC).

