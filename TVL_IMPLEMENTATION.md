# TVL Charts Implementation - Technical Documentation

## Overview

This document explains the professional implementation of TVL (Total Value Locked) charts integration with the old database APIs. The implementation follows the proposed tech stack guidelines and prepares the codebase for easy migration to new APIs when the MongoDB migration is complete.

## Architecture

### 1. API Service Layer (`src/lib/services/`)

#### `api-client.ts`
- **Purpose**: Base HTTP client using native `fetch` (as per tech stack requirements)
- **Features**:
  - Centralized error handling with custom `ApiClientError` class
  - Network error detection and user-friendly messages
  - Query parameter builder utility
  - Type-safe request/response handling
- **Key Functions**:
  - `get<T>()`: GET request helper
  - `post<T>()`: POST request helper
  - `buildQueryString()`: URL query parameter builder

#### `vault-service.ts`
- **Purpose**: Vault-specific API calls
- **Functions**:
  - `fetchVaultTVL(vaultName)`: Fetches TVL for a single vault
  - `fetchMultipleVaultTVL(vaultNames)`: Fetches TVL for multiple vaults in parallel
- **API Endpoint**: `https://api.lucidly.finance/services/aum_data?vaultName={vaultName}`
- **Response Format**: `{ result: number }`

#### `types.ts`
- **Purpose**: TypeScript type definitions for API responses
- **Types**:
  - `TVLResponse`: API response structure
  - `VaultName`: Type-safe vault identifiers ('syUSD' | 'syETH' | 'syBTC')
  - `TVLData`: Formatted data structure for UI consumption

### 2. React Hooks (`src/lib/hooks/`)

#### `use-vault-tvl.ts`
- **Purpose**: TanStack Query hooks for TVL data fetching
- **Hooks**:
  - `useVaultTVL(vaultName, options)`: Single vault TVL hook
  - `useMultipleVaultTVL(vaultNames, options)`: Multiple vaults TVL hook
- **Features**:
  - Automatic caching (30 second stale time)
  - Retry logic with exponential backoff
  - Loading and error states
  - Automatic value formatting (K/M suffixes)
  - Refetch capabilities

### 3. UI Components

#### `tvl-chart-skeleton.tsx`
- **Purpose**: Loading skeleton component matching the design system
- **Features**:
  - Animated pulse effect
  - Matches exact chart layout
  - Supports both "home" and "yields" variants

#### `tvl-chart.tsx` (Updated)
- **Changes**:
  - Integrated `useVaultTVL` hook
  - Added `vaultName` prop for vault selection
  - Added `useApi` prop to enable/disable API fetching
  - Shows loading skeleton during fetch
  - Scales chart data based on actual TVL values
  - Falls back to props if API is disabled or fails

#### `tvl-tab.tsx` (Updated)
- **Changes**:
  - Accepts `vaultName` prop
  - Passes props to `TVLChart` component

#### `yields-dashboard.tsx` (Updated)
- **Changes**:
  - Integrated `useVaultTVL` hook
  - Accepts `vaultName` prop
  - Automatically fetches and displays TVL data

## Data Flow

```
User visits page
    ↓
Component renders with useVaultTVL hook
    ↓
TanStack Query checks cache
    ↓
If stale/missing → Fetches from API
    ↓
API Service Layer (vault-service.ts)
    ↓
API Client (api-client.ts) - native fetch
    ↓
Old Database API (https://api.lucidly.finance/services/aum_data)
    ↓
Response: { result: 222860.72511899113 }
    ↓
Hook formats value: "$222.86K"
    ↓
Component receives formatted value
    ↓
TVLChart displays with real data
```

## Implementation Details

### Loading States
- **Skeleton Component**: Shows animated placeholder during initial load
- **TanStack Query**: Manages loading state automatically
- **Smooth Transitions**: Chart data scales smoothly when API data loads

### Error Handling
- **Network Errors**: Detected and shown with user-friendly messages
- **API Errors**: HTTP status codes handled appropriately
- **Retry Logic**: Automatic retry with exponential backoff (max 2 retries)
- **Fallback**: Falls back to default values if API fails

### Caching Strategy
- **Stale Time**: 30 seconds (configurable)
- **Cache Key**: `['vault-tvl', vaultName]` for single vault
- **Cache Key**: `['vault-tvl', 'multiple', ...vaultNames]` for multiple vaults
- **Automatic Refetch**: On window focus (disabled by default in QueryClient config)

### Value Formatting
- **Format Logic**:
  - `>= 1,000,000`: Displays as `$X.XXM`
  - `>= 1,000`: Displays as `$X.XXK`
  - `< 1,000`: Displays as `$X.XX`
- **Implementation**: In `use-vault-tvl.ts` hook

### Chart Data Scaling
- **Dynamic Scaling**: Chart bars scale proportionally to actual TVL
- **Calculation**: `scaleFactor = actualTVL / defaultTVL`
- **Preserves Shape**: Maintains relative bar heights while scaling to real values

## Usage Examples

### Single Vault TVL (Yields Page)
```tsx
<TVLTab 
  vaultName="syUSD"
  isEmpty={false}
/>
```

### Multiple Vaults TVL (Home Page)
```tsx
const { tvlMap, formattedMap } = useMultipleVaultTVL(
  ["syUSD", "syETH", "syBTC"],
  { staleTime: 30_000 }
)
```

### Custom Configuration
```tsx
const { tvl, formattedValue, isLoading } = useVaultTVL("syUSD", {
  enabled: true,
  refetchInterval: 60_000, // Refetch every minute
  staleTime: 30_000,
})
```

## Migration Path (When New DB is Ready)

### Step 1: Update API Base URL
```typescript
// In api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://new-api.lucidly.finance'
```

### Step 2: Update Service Functions (if endpoint changes)
```typescript
// In vault-service.ts
export async function fetchVaultTVL(vaultName: VaultName): Promise<number> {
  const endpoint = `/api/v2/vaults/${vaultName}/tvl` // New endpoint
  const response = await get<TVLResponse>(endpoint)
  return response.result
}
```

### Step 3: Update Types (if response structure changes)
```typescript
// In types.ts
export interface TVLResponse {
  tvl: number // Changed from 'result' to 'tvl'
  timestamp: number // New field
}
```

**No component changes needed!** The abstraction layer ensures components remain unchanged.

## Benefits of This Implementation

1. **Separation of Concerns**: API logic separated from UI components
2. **Type Safety**: Full TypeScript coverage prevents runtime errors
3. **Reusability**: Hooks can be used across multiple components
4. **Performance**: TanStack Query caching reduces unnecessary API calls
5. **User Experience**: Loading states and error handling provide smooth UX
6. **Maintainability**: Easy to update when new APIs are ready
7. **Testability**: Service layer can be easily mocked for testing
8. **Consistency**: Follows tech stack guidelines (native fetch, TanStack Query)

## Files Created/Modified

### Created:
- `src/lib/services/api-client.ts`
- `src/lib/services/vault-service.ts`
- `src/lib/services/types.ts`
- `src/lib/services/index.ts`
- `src/lib/hooks/use-vault-tvl.ts`
- `src/components/charts/tvl-chart-skeleton.tsx`

### Modified:
- `src/components/charts/tvl-chart.tsx`
- `src/components/features/yields/tvl-tab.tsx`
- `src/components/features/yields/yields-dashboard.tsx`
- `src/app/page.tsx`
- `src/app/(dashboard)/yields/page.tsx`

## Testing Recommendations

1. **Unit Tests**: Test service functions with mocked fetch
2. **Integration Tests**: Test hooks with TanStack Query test utilities
3. **E2E Tests**: Test full flow from page load to data display
4. **Error Scenarios**: Test network failures, API errors, invalid responses

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live TVL updates
2. **Historical Data**: Fetch and display TVL over time
3. **Optimistic Updates**: Update UI immediately, confirm with API
4. **Offline Support**: Cache data for offline viewing
5. **Analytics**: Track API call performance and errors

