/**
 * Analytics utility for tracking custom events
 * Works with @next/third-parties GoogleAnalytics component
 */

// Google Analytics gtag type
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
    dataLayer?: any[]
  }
}

export type AnalyticsEvent = {
  action: string
  category: string
  label?: string
  value?: number
  [key: string]: any
}

/**
 * Track custom events
 */
export const trackEvent = (event: AnalyticsEvent) => {
  if (typeof window === 'undefined' || !window.gtag) return

  const { action, category, label, value, ...rest } = event

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...rest,
  })
}

/**
 * Track page views (for route changes)
 */
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  if (!measurementId) return

  window.gtag('config', measurementId, {
    page_path: url,
  })
}

/**
 * DeFi-specific event tracking helpers
 */
export const analytics = {
  // Wallet events
  walletConnected: (address: string, chainId?: number) => {
    trackEvent({
      action: 'wallet_connected',
      category: 'wallet',
      label: `Chain: ${chainId || 'unknown'}`,
      wallet_address: address.substring(0, 10) + '...', // Partial address for privacy
      chain_id: chainId,
    })
  },

  walletDisconnected: () => {
    trackEvent({
      action: 'wallet_disconnected',
      category: 'wallet',
    })
  },

  // Deposit events
  depositInitiated: (strategy: string, amount?: string) => {
    trackEvent({
      action: 'deposit_initiated',
      category: 'deposit',
      label: strategy,
      strategy_name: strategy,
      amount: amount,
    })
  },

  depositCompleted: (strategy: string, amount?: string) => {
    trackEvent({
      action: 'deposit_completed',
      category: 'deposit',
      label: strategy,
      strategy_name: strategy,
      amount: amount,
    })
  },

  // Withdrawal events
  withdrawalInitiated: (strategy: string, amount?: string) => {
    trackEvent({
      action: 'withdrawal_initiated',
      category: 'withdrawal',
      label: strategy,
      strategy_name: strategy,
      amount: amount,
    })
  },

  withdrawalCompleted: (strategy: string, amount?: string) => {
    trackEvent({
      action: 'withdrawal_completed',
      category: 'withdrawal',
      label: strategy,
      strategy_name: strategy,
      amount: amount,
    })
  },

  // Bridge events
  bridgeInitiated: (fromChain: string, toChain: string, amount?: string) => {
    trackEvent({
      action: 'bridge_initiated',
      category: 'bridge',
      label: `${fromChain} → ${toChain}`,
      from_chain: fromChain,
      to_chain: toChain,
      amount: amount,
    })
  },

  // Strategy interactions
  strategyViewed: (strategy: string) => {
    trackEvent({
      action: 'strategy_viewed',
      category: 'strategy',
      label: strategy,
      strategy_name: strategy,
    })
  },

  strategyCardClicked: (strategy: string) => {
    trackEvent({
      action: 'strategy_card_clicked',
      category: 'strategy',
      label: strategy,
      strategy_name: strategy,
    })
  },

  // Navigation events
  tabSwitched: (tabName: string) => {
    trackEvent({
      action: 'tab_switched',
      category: 'navigation',
      label: tabName,
      tab_name: tabName,
    })
  },

  // Button clicks
  buttonClicked: (buttonName: string, location?: string) => {
    trackEvent({
      action: 'button_clicked',
      category: 'interaction',
      label: buttonName,
      button_name: buttonName,
      location: location,
    })
  },

  // Generic event tracker
  custom: (action: string, category: string, data?: Record<string, any>) => {
    trackEvent({
      action,
      category,
      ...data,
    })
  },
}
