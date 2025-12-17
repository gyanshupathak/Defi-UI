# Analytics Tracking Guide

## ✅ What's Currently Being Tracked

### Automatic Tracking (No Code Needed)

1. **Page Views** - Automatically tracked on:
   - Initial page load (handled by `GoogleAnalytics` component)
   - Route changes (handled by `AnalyticsProvider`)
   - All pages: `/`, `/yields`, `/deposit`, `/withdraw`, `/portfolio`, `/bridge`

### Custom Event Tracking (Already Implemented)

1. **Tab Switches** (`/` - Home page)
   - Tracks when users switch between: "Top Yields", "Flagship", "Delta neutral", "Leverage Looping"
   - Event: `tab_switched`

2. **Strategy Card Clicks** (Home page)
   - Tracks when users click on strategy cards (syUSD, syETH, syBTC)
   - Event: `strategy_card_clicked`

3. **Deposit Button Clicks** (Strategy cards)
   - Tracks when users click "Deposit" button on strategy cards
   - Events: `button_clicked` + `deposit_initiated`

4. **Wallet Connections** (Wallet button)
   - Tracks when users connect their wallet
   - Event: `wallet_connected` (includes chain ID)

---

## 📊 How to View Your Analytics

1. **Go to Google Analytics**: https://analytics.google.com/
2. **Realtime Reports**: Reports → Realtime
   - See live user activity
   - View events as they happen
3. **Events Report**: Reports → Engagement → Events
   - See all custom events
   - View event counts and parameters

---

## 🎯 Available Tracking Functions

All tracking functions are available through the `useAnalytics` hook:

```tsx
import { useAnalytics } from "@/lib/hooks/use-analytics"

const { analytics } = useAnalytics()
```

### Wallet Events
```tsx
analytics.walletConnected(address, chainId)
analytics.walletDisconnected()
```

### Deposit Events
```tsx
analytics.depositInitiated(strategy, amount)
analytics.depositCompleted(strategy, amount)
```

### Withdrawal Events
```tsx
analytics.withdrawalInitiated(strategy, amount)
analytics.withdrawalCompleted(strategy, amount)
```

### Bridge Events
```tsx
analytics.bridgeInitiated(fromChain, toChain, amount)
```

### Strategy Events
```tsx
analytics.strategyViewed(strategy)
analytics.strategyCardClicked(strategy)
```

### Navigation Events
```tsx
analytics.tabSwitched(tabName)
```

### Button Clicks
```tsx
analytics.buttonClicked(buttonName, location)
```

### Custom Events
```tsx
analytics.custom(action, category, { customData: "value" })
```

---

## 🔧 How to Add More Tracking

### Example 1: Track Withdrawal Button

```tsx
// In your withdrawal component
import { useAnalytics } from "@/lib/hooks/use-analytics"

export function WithdrawButton() {
  const { analytics } = useAnalytics()
  
  const handleWithdraw = () => {
    analytics.withdrawalInitiated("syUSD", "1000")
    // ... your withdrawal logic
  }
  
  return <button onClick={handleWithdraw}>Withdraw</button>
}
```

### Example 2: Track Bridge Transaction

```tsx
// In your bridge component
import { useAnalytics } from "@/lib/hooks/use-analytics"

export function BridgeComponent() {
  const { analytics } = useAnalytics()
  
  const handleBridge = () => {
    analytics.bridgeInitiated("Ethereum", "Arbitrum", "500")
    // ... your bridge logic
  }
  
  return <button onClick={handleBridge}>Bridge</button>
}
```

### Example 3: Track Custom Event

```tsx
import { useAnalytics } from "@/lib/hooks/use-analytics"

export function MyComponent() {
  const { analytics } = useAnalytics()
  
  const handleCustomAction = () => {
    analytics.custom("custom_action", "feature", {
      custom_param: "value",
      user_type: "premium"
    })
  }
  
  return <button onClick={handleCustomAction}>Custom Action</button>
}
```

---

## 📍 Pages to Add Tracking To

### High Priority

1. **Deposit Page** (`/deposit`)
   - Track when deposit form is submitted
   - Track when deposit transaction succeeds/fails
   - Track amount and strategy

2. **Withdrawal Page** (`/withdraw`)
   - Track withdrawal initiation
   - Track withdrawal completion
   - Track amount and strategy

3. **Bridge Page** (`/bridge`)
   - Track bridge initiation
   - Track source and destination chains
   - Track bridge amount

4. **Portfolio Page** (`/portfolio`)
   - Track when users view their portfolio
   - Track portfolio interactions

### Medium Priority

5. **Yields Page** (`/yields`)
   - Track strategy detail views
   - Track filter changes
   - Track sorting changes

---

## 🧪 Testing Your Tracking

1. **Open Browser DevTools** (F12)
2. **Go to Network Tab**
3. **Filter by "collect" or "google-analytics"**
4. **Perform actions** (click buttons, navigate pages)
5. **Check requests** - Should see POST requests to `google-analytics.com/g/collect`
6. **Check GA4 Realtime** - Should see events appear within 30 seconds

---

## 📈 What Data You'll See

### In Google Analytics:

- **Page Views**: Which pages users visit most
- **Events**: All custom events with parameters
- **User Flow**: How users navigate through your app
- **Conversion Funnels**: Track user journeys (e.g., view → connect → deposit)
- **Engagement**: Time on page, bounce rates, etc.

### Example Event Data:

```
Event: deposit_initiated
Category: deposit
Label: syUSD
Parameters:
  - strategy_name: syUSD
  - amount: 1000
  - wallet_address: 0x1234...
  - chain_id: 1
```

---

## 🔒 Privacy Notes

- **Wallet Addresses**: Only partial addresses (first 10 chars) are tracked
- **No PII**: No personally identifiable information is collected
- **GDPR**: Consider adding cookie consent banner for EU users

---

## 🚀 Next Steps

1. ✅ Page views - **DONE** (automatic)
2. ✅ Tab switches - **DONE**
3. ✅ Strategy card clicks - **DONE**
4. ✅ Deposit button clicks - **DONE**
5. ✅ Wallet connections - **DONE**
6. ⏳ Add tracking to deposit page
7. ⏳ Add tracking to withdrawal page
8. ⏳ Add tracking to bridge page
9. ⏳ Add tracking to portfolio page

---

## 📚 Resources

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Next.js Analytics Guide](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [@next/third-parties Documentation](https://nextjs.org/docs/app/api-reference/next-third-parties)

