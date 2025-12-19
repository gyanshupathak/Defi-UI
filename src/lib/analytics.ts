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

  navMenuChanged: (menuItem: string, path: string) => {
    trackEvent({
      action: 'nav_menu_changed',
      category: 'navigation',
      label: menuItem,
      menu_item: menuItem,
      path: path,
    })
  },

  logoClicked: () => {
    trackEvent({
      action: 'logo_clicked',
      category: 'navigation',
      label: 'home',
      destination: '/',
    })
  },

  settingsClicked: () => {
    trackEvent({
      action: 'settings_clicked',
      category: 'navigation',
      label: 'settings_icon',
    })
  },

  networkClicked: (networkName: string, chainId: number) => {
    trackEvent({
      action: 'network_clicked',
      category: 'wallet',
      label: networkName,
      network_name: networkName,
      chain_id: chainId,
    })
  },

  networkChanged: (fromNetwork: string, toNetwork: string, fromChainId: number, toChainId: number) => {
    trackEvent({
      action: 'network_changed',
      category: 'wallet',
      label: `${fromNetwork} → ${toNetwork}`,
      from_network: fromNetwork,
      to_network: toNetwork,
      from_chain_id: fromChainId,
      to_chain_id: toChainId,
    })
  },

  walletConnectClicked: () => {
    trackEvent({
      action: 'wallet_connect_clicked',
      category: 'wallet',
      label: 'connect_button',
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

  // Chart interactions - tracks hover duration (how long users hover on charts)
  chartHoverEnded: (chartType: string, durationMs: number, location?: string) => {
    trackEvent({
      action: 'chart_hover_ended',
      category: 'interaction',
      label: chartType,
      chart_type: chartType,
      duration_ms: durationMs,
      duration_seconds: Math.round(durationMs / 1000 * 100) / 100, // Round to 2 decimals
      location: location,
    })
  },

  // Yields page specific events
  yieldsTabChanged: (fromTab: string, toTab: string) => {
    trackEvent({
      action: 'yields_tab_changed',
      category: 'navigation',
      label: `${fromTab} → ${toTab}`,
      from_tab: fromTab,
      to_tab: toTab,
    })
  },

  timeRangeChanged: (chartType: string, fromRange: string, toRange: string) => {
    trackEvent({
      action: 'time_range_changed',
      category: 'interaction',
      label: `${fromRange} → ${toRange}`,
      chart_type: chartType,
      from_range: fromRange,
      to_range: toRange,
    })
  },

  timeRangeSelectorClicked: (chartType: string) => {
    trackEvent({
      action: 'time_range_selector_clicked',
      category: 'interaction',
      label: chartType,
      chart_type: chartType,
    })
  },

  allocationsViewChanged: (fromView: string, toView: string) => {
    trackEvent({
      action: 'allocations_view_changed',
      category: 'interaction',
      label: `${fromView} → ${toView}`,
      from_view: fromView,
      to_view: toView,
    })
  },

  allocationsChartHovered: (durationMs: number) => {
    trackEvent({
      action: 'allocations_chart_hovered',
      category: 'interaction',
      duration_ms: durationMs,
      duration_seconds: Math.round(durationMs / 1000 * 100) / 100,
    })
  },

  tabTimeSpent: (tabName: string, durationMs: number) => {
    trackEvent({
      action: 'tab_time_spent',
      category: 'engagement',
      label: tabName,
      tab_name: tabName,
      duration_ms: durationMs,
      duration_seconds: Math.round(durationMs / 1000 * 100) / 100,
    })
  },

  incentiveCardClicked: (title: string, multiplier: string) => {
    trackEvent({
      action: 'incentive_card_clicked',
      category: 'interaction',
      label: title,
      incentive_title: title,
      multiplier: multiplier,
    })
  },

  faqOpened: (question: string, index: number) => {
    trackEvent({
      action: 'faq_opened',
      category: 'interaction',
      label: question,
      faq_question: question,
      faq_index: index,
    })
  },

  faqClosed: (question: string, index: number, durationMs: number) => {
    trackEvent({
      action: 'faq_closed',
      category: 'interaction',
      label: question,
      faq_question: question,
      faq_index: index,
      duration_ms: durationMs,
      duration_seconds: Math.round(durationMs / 1000 * 100) / 100,
    })
  },

  addressCopied: (addressType: string, address: string) => {
    trackEvent({
      action: 'address_copied',
      category: 'interaction',
      label: addressType,
      address_type: addressType,
      address: address.substring(0, 10) + '...', // Partial address for privacy
    })
  },

  tokenSelectorChanged: (fromToken: string, toToken: string) => {
    trackEvent({
      action: 'token_selector_changed',
      category: 'interaction',
      label: `${fromToken} → ${toToken}`,
      from_token: fromToken,
      to_token: toToken,
    })
  },

  initiateDepositClicked: (token: string) => {
    trackEvent({
      action: 'initiate_deposit_clicked',
      category: 'deposit',
      label: token,
      token: token,
      location: 'yields_circle',
    })
  },

  // Unified selector events (used across deposit/withdraw/bridge pages)
  selectorClicked: (selectorType: 'network' | 'token', location: string) => {
    trackEvent({
      action: 'selector_clicked',
      category: 'interaction',
      label: selectorType,
      selector_type: selectorType,
      location: location,
    })
  },

  selectorChanged: (selectorType: 'network' | 'token', fromValue: string, toValue: string, location: string) => {
    trackEvent({
      action: 'selector_changed',
      category: 'interaction',
      label: `${fromValue} → ${toValue}`,
      selector_type: selectorType,
      from_value: fromValue,
      to_value: toValue,
      location: location,
    })
  },

  // Deposit page events
  depositButtonClicked: (strategy: string, amount?: string, depositNetwork?: string, vaultNetwork?: string) => {
    trackEvent({
      action: 'deposit_button_clicked',
      category: 'deposit',
      label: strategy,
      strategy: strategy,
      amount: amount,
      deposit_network: depositNetwork,
      vault_network: vaultNetwork,
      location: 'deposit_page',
    })
  },

  // Withdraw page events
  withdrawButtonClicked: (strategy: string, amount?: string, network?: string) => {
    trackEvent({
      action: 'withdraw_button_clicked',
      category: 'withdrawal',
      label: strategy,
      strategy: strategy,
      amount: amount,
      network: network,
      location: 'withdraw_page',
    })
  },

  // Bridge page events
  bridgeButtonClicked: (token: string, amount?: string, fromNetwork?: string, toNetwork?: string) => {
    trackEvent({
      action: 'bridge_button_clicked',
      category: 'bridge',
      label: `${fromNetwork} → ${toNetwork}`,
      token: token,
      amount: amount,
      from_network: fromNetwork,
      to_network: toNetwork,
      location: 'bridge_page',
    })
  },

  // Portfolio page events
  portfolioTabChanged: (fromTab: string, toTab: string) => {
    trackEvent({
      action: 'portfolio_tab_changed',
      category: 'navigation',
      label: `${fromTab} → ${toTab}`,
      from_tab: fromTab,
      to_tab: toTab,
    })
  },

  portfolioChartHovered: (durationMs: number) => {
    trackEvent({
      action: 'portfolio_chart_hovered',
      category: 'interaction',
      duration_ms: durationMs,
      duration_seconds: Math.round(durationMs / 1000 * 100) / 100,
    })
  },

  portfolioFilterChanged: (fromFilter: string, toFilter: string) => {
    trackEvent({
      action: 'portfolio_filter_changed',
      category: 'interaction',
      label: `${fromFilter} → ${toFilter}`,
      from_filter: fromFilter,
      to_filter: toFilter,
    })
  },

  portfolioTimePeriodChanged: (fromPeriod: string, toPeriod: string) => {
    trackEvent({
      action: 'portfolio_time_period_changed',
      category: 'interaction',
      label: `${fromPeriod} → ${toPeriod}`,
      from_period: fromPeriod,
      to_period: toPeriod,
    })
  },

  portfolioTimePeriodSelectorClicked: () => {
    trackEvent({
      action: 'portfolio_time_period_selector_clicked',
      category: 'interaction',
    })
  },

  portfolioStrategyCardClicked: (strategy: string) => {
    trackEvent({
      action: 'portfolio_strategy_card_clicked',
      category: 'interaction',
      label: strategy,
      strategy: strategy,
    })
  },

  portfolioWithdrawButtonClicked: (strategy: string, location: string) => {
    trackEvent({
      action: 'portfolio_withdraw_button_clicked',
      category: 'withdrawal',
      label: strategy,
      strategy: strategy,
      location: location,
    })
  },

  withdrawalRequestCancelled: (requestId: string, syToken: string, amount: string) => {
    trackEvent({
      action: 'withdrawal_request_cancelled',
      category: 'withdrawal',
      label: requestId,
      request_id: requestId,
      token: syToken,
      amount: amount,
    })
  },

  activityFilterChanged: (fromFilter: string, toFilter: string) => {
    trackEvent({
      action: 'activity_filter_changed',
      category: 'interaction',
      label: `${fromFilter} → ${toFilter}`,
      from_filter: fromFilter,
      to_filter: toFilter,
    })
  },

  filtersButtonClicked: () => {
    trackEvent({
      action: 'filters_button_clicked',
      category: 'interaction',
      location: 'portfolio_activity',
    })
  },

  assetTagClicked: (token: string, isSelected: boolean) => {
    trackEvent({
      action: 'asset_tag_clicked',
      category: 'interaction',
      label: token,
      token: token,
      is_selected: isSelected,
      location: 'portfolio_activity',
    })
  },

  filterResetAllClicked: () => {
    trackEvent({
      action: 'filter_reset_all_clicked',
      category: 'interaction',
      location: 'portfolio_activity',
    })
  },

  filterApplyClicked: () => {
    trackEvent({
      action: 'filter_apply_clicked',
      category: 'interaction',
      location: 'portfolio_activity',
    })
  },

  tableColumnSorted: (column: string, direction: 'asc' | 'desc') => {
    trackEvent({
      action: 'table_column_sorted',
      category: 'interaction',
      label: column,
      column: column,
      direction: direction,
      location: 'portfolio_activity',
    })
  },

  transactionRowClicked: (transactionId: string, status: string) => {
    trackEvent({
      action: 'transaction_row_clicked',
      category: 'interaction',
      label: transactionId,
      transaction_id: transactionId,
      status: status,
      location: 'portfolio_activity',
    })
  },

  emptyStateButtonClicked: (buttonText: string, location: string) => {
    trackEvent({
      action: 'empty_state_button_clicked',
      category: 'interaction',
      label: buttonText,
      button_text: buttonText,
      location: location,
    })
  },

  // Page-level time tracking
  pageTimeSpent: (pageName: string, durationMs: number) => {
    trackEvent({
      action: 'page_time_spent',
      category: 'engagement',
      label: pageName,
      page_name: pageName,
      duration_ms: durationMs,
      duration_seconds: Math.round(durationMs / 1000 * 100) / 100,
    })
  },

  // Error tracking
  errorOccurred: (errorType: string, errorMessage: string, errorLocation?: string, errorStack?: string) => {
    trackEvent({
      action: 'error_occurred',
      category: 'error',
      label: errorType,
      error_type: errorType,
      error_message: errorMessage.substring(0, 100), // Limit message length
      error_location: errorLocation,
      error_stack: errorStack ? errorStack.substring(0, 200) : undefined, // Limit stack length
    })
  },

  // Performance metrics
  pageLoadTime: (pageName: string, loadTimeMs: number) => {
    trackEvent({
      action: 'page_load_time',
      category: 'performance',
      label: pageName,
      page_name: pageName,
      load_time_ms: loadTimeMs,
      load_time_seconds: Math.round(loadTimeMs / 1000 * 100) / 100,
    })
  },

  apiResponseTime: (endpoint: string, responseTimeMs: number, statusCode?: number) => {
    trackEvent({
      action: 'api_response_time',
      category: 'performance',
      label: endpoint,
      endpoint: endpoint,
      response_time_ms: responseTimeMs,
      response_time_seconds: Math.round(responseTimeMs / 1000 * 100) / 100,
      status_code: statusCode,
    })
  },

  // External link tracking
  externalLinkClicked: (url: string, linkText?: string, location?: string) => {
    trackEvent({
      action: 'external_link_clicked',
      category: 'navigation',
      label: url,
      url: url,
      link_text: linkText,
      location: location,
    })
  },

  // Scroll depth tracking
  scrollDepthReached: (pageName: string, depth: number, depthPercent: number) => {
    trackEvent({
      action: 'scroll_depth_reached',
      category: 'engagement',
      label: `${pageName} - ${depthPercent}%`,
      page_name: pageName,
      depth_pixels: depth,
      depth_percent: depthPercent,
    })
  },

  // Form analytics
  formFieldFocused: (formName: string, fieldName: string) => {
    trackEvent({
      action: 'form_field_focused',
      category: 'form',
      label: `${formName} - ${fieldName}`,
      form_name: formName,
      field_name: fieldName,
    })
  },

  formFieldBlurred: (formName: string, fieldName: string, hasValue: boolean) => {
    trackEvent({
      action: 'form_field_blurred',
      category: 'form',
      label: `${formName} - ${fieldName}`,
      form_name: formName,
      field_name: fieldName,
      has_value: hasValue,
    })
  },

  formValidationError: (formName: string, fieldName: string, errorMessage: string) => {
    trackEvent({
      action: 'form_validation_error',
      category: 'form',
      label: `${formName} - ${fieldName}`,
      form_name: formName,
      field_name: fieldName,
      error_message: errorMessage,
    })
  },

  formAbandoned: (formName: string, fieldsCompleted: number, totalFields: number) => {
    trackEvent({
      action: 'form_abandoned',
      category: 'form',
      label: formName,
      form_name: formName,
      fields_completed: fieldsCompleted,
      total_fields: totalFields,
      completion_percent: Math.round((fieldsCompleted / totalFields) * 100),
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
