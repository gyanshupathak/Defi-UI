"use client"

import * as React from "react"
import { NeumorphicNav } from "@/components/layout/neumorphic-nav"
import { TVLChart } from "@/components/charts/tvl-chart"
import { YieldStrategyCard } from "@/components/features/yields/yield-strategy-card"
import { PageContainer } from "@/components/ui/page-container"
import { DashboardTabs } from "@/components/ui/dashboard-tabs"
import { designTokens } from "@/lib/design-system"
import { Flame, Loader2 } from "lucide-react"
import { useAnalytics } from "@/lib/hooks/use-analytics"
import { useTimeTracker } from "@/lib/hooks/use-time-tracker"
import { useScrollDepth } from "@/lib/hooks/use-scroll-depth"
import { usePagePerformance } from "@/lib/hooks/use-page-performance"
import { useAllVaultSymbols } from "@/lib/hooks/use-vault-config"
import { useCombinedVaultTVL, useVaultAPY, useCombinedVaultTVLByTime } from "@/lib/hooks/use-vault"
import { getVariantFromVaultSymbol, fetchVaultConfig, type VaultSymbol, type VaultConfig } from "@/lib/config/vault-config"
import { useQueries } from "@tanstack/react-query"
import { getVaultLogo, getCategoryIconWithFallback } from "@/lib/utils/vault-images"

type LoadedVaultConfig = NonNullable<VaultConfig>

function VaultCard({ symbol, config }: { symbol: VaultSymbol; config: LoadedVaultConfig }) {
  // Use symbol from config if available, otherwise use the prop symbol
  // This ensures we're using the correct symbol from the API
  const actualSymbol = config.vault_constants.symbol || symbol
  
  // Check if APY endpoint exists in config
  const hasApyEndpoint = !!config.vault_endpoints.apy_endpoint
  
  // Fetch APY for this vault using the actual symbol from config
  // Only fetch if endpoint exists in config
  const { apy, isLoading: isApyLoading, isError: isApyError } = useVaultAPY(actualSymbol, {
    enabled: !!config && hasApyEndpoint, // Only fetch when config is loaded and endpoint exists
  })
  
  const variant = getVariantFromVaultSymbol(actualSymbol)
  const vaultName = config.vault_constants.name
  // Get logo from config with proper fallback handling
  const fallbackIcon = variant === 'usd' ? '/images/icons/USD-stable.svg' 
    : variant === 'eth' ? '/images/icons/ETH-stable.svg'
    : variant === 'btc' ? '/images/icons/BTC Stable (1).svg'
    : '/images/icons/syHLP.svg' // HLP fallback
  const vaultLogo = getVaultLogo(config, fallbackIcon)
  
  // Show APY value if endpoint exists and data is loaded, otherwise show "--"
  const displayApy = hasApyEndpoint && !isApyLoading && !isApyError && apy !== undefined ? apy : null
  
  return (
    <YieldStrategyCard
      name={vaultName}
      symbol={actualSymbol}
      apy={displayApy}
      variant={variant}
      tokenIcon={vaultLogo}
    />
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = React.useState("top-yields")
  const { analytics } = useAnalytics()
  const pageTimeTracker = useTimeTracker()
  const tabTimeTracker = useTimeTracker()
  const previousTabRef = React.useRef<string>("top-yields")

  // Track page-level time
  React.useEffect(() => {
    pageTimeTracker.start()
    return () => {
      const duration = pageTimeTracker.stop()
      if (duration && duration > 0) {
        analytics.pageTimeSpent("home_page", duration)
      }
    }
  }, [analytics, pageTimeTracker])

  // Track tab time spent
  React.useEffect(() => {
    tabTimeTracker.start()
    return () => {
      const duration = tabTimeTracker.stop()
      if (duration && duration > 0) {
        analytics.tabTimeSpent(`home_${previousTabRef.current}`, duration)
      }
    }
  }, [activeTab, analytics, tabTimeTracker])

  // Track scroll depth
  useScrollDepth("home_page", analytics)

  // Track page performance
  usePagePerformance("home_page", analytics)

  // Fetch all available vaults from API - explicitly enable the query
  const { data: allVaultSymbols = [], isLoading: isLoadingVaults, error: vaultSymbolsError, isFetching } = useAllVaultSymbols({
    enabled: true, // Explicitly enable
  })
  
  // Create stable string key for memoization
  const symbolsKey = React.useMemo(() => {
    return allVaultSymbols.length > 0 ? allVaultSymbols.join(',') : ''
  }, [allVaultSymbols])
  
  // Memoize queries array to prevent infinite loops
  const configQueriesArray = React.useMemo(() => {
    if (!allVaultSymbols || allVaultSymbols.length === 0) {
      return []
    }
    return allVaultSymbols.map((symbol) => ({
      queryKey: ['vault-config', symbol] as const,
      queryFn: () => fetchVaultConfig(symbol),
      enabled: !!symbol,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
    }))
  }, [symbolsKey])
  
  // Fetch configs for all symbols using useQueries - this prevents infinite loops
  const configQueries = useQueries({
    queries: configQueriesArray,
  })

  // Build configs map from queries - filter out null configs
  // Use a ref to track previous data and only update when data actually changes
  const prevDataRef = React.useRef<string>('')
  const prevMapRef = React.useRef<Record<string, VaultConfig>>({})
  const configsBySymbol = React.useMemo(() => {
    // Create a stable key from actual query data
    const dataKey = configQueries.map((q, i) => {
      const symbol = allVaultSymbols[i]
      const dataId = q.data ? `${symbol}:${q.data.vault_constants.symbol}` : `${symbol}:null`
      const status = q.status
      return `${dataId}:${status}`
    }).join('|')
    
    // Only rebuild if data actually changed
    if (dataKey === prevDataRef.current && prevDataRef.current !== '') {
      return prevMapRef.current
    }
    
    prevDataRef.current = dataKey
    const map: Record<string, VaultConfig> = {}
    configQueries.forEach((query, index) => {
      const symbol = allVaultSymbols[index]
      // Only include non-null configs
      if (symbol && query.data && query.data !== null) {
        map[symbol] = query.data
      }
    })
    prevMapRef.current = map
    return map
  }, [configQueries, allVaultSymbols])

  const isConfigsLoading = configQueries.some(query => query.isLoading)
  const configError = configQueries.find(query => query.error)?.error as Error | null
  
  // Note: We don't pre-fetch configs here to avoid useQueries hook order issues
  // Instead, each VaultCard component fetches its own config and filters null configs
  // VaultCard will handle category filtering internally

  // Fetch combined TVL for all vaults with currency conversion (syUSD + syBTC converted to USD)
  const { 
    formattedValue: formattedTotalTvl,
    isLoading: isCombinedTvlLoading,
    tvl: combinedTvlValue,
    isError: isCombinedTvlError,
    error: combinedTvlError,
  } = useCombinedVaultTVL(allVaultSymbols, {
    enabled: allVaultSymbols.length > 0 && !isLoadingVaults,
    staleTime: 30_000, // 30 seconds
  })

  // Debug logging
  React.useEffect(() => {
    console.log('[Home] formattedTotalTvl:', formattedTotalTvl)
    console.log('[Home] combinedTvlValue:', combinedTvlValue)
    console.log('[Home] isCombinedTvlLoading:', isCombinedTvlLoading)
    console.log('[Home] isCombinedTvlError:', isCombinedTvlError)
    if (combinedTvlError) {
      console.error('[Home] Combined TVL error:', combinedTvlError)
    }
  }, [formattedTotalTvl, combinedTvlValue, isCombinedTvlLoading, isCombinedTvlError, combinedTvlError])

  // Fetch combined TVL by time data for chart
  const {
    data: tvlByTimeData,
    chartData: tvlChartData,
    isLoading: isTvlByTimeLoading,
  } = useCombinedVaultTVLByTime(allVaultSymbols, 'daily', {
    enabled: allVaultSymbols.length > 0 && !isLoadingVaults,
    staleTime: 60_000, // 60 seconds
  })

  // Process chart data - use ALL data points from API
  // Calculate 7 period boundaries for x-axis labels, but show bars for all dates
  const { tvlChartValues, periodDates, tvlChartDataWithDates } = React.useMemo(() => {
    if (!tvlByTimeData || tvlByTimeData.length === 0) {
      console.log('[Home] No TVL by time data available for chart')
      return { tvlChartValues: undefined, periodDates: [], tvlChartDataWithDates: undefined }
    }
    
    console.log('[Home] Processing chart data:', {
      totalDataPoints: tvlByTimeData.length,
      firstDate: tvlByTimeData[0]?.date,
      lastDate: tvlByTimeData[tvlByTimeData.length - 1]?.date
    })
    
    // Get the max value for scaling
    const maxValue = Math.max(...tvlByTimeData.map(p => p.value))
    const maxBarHeight = 500 // Maximum bar height for home variant
    
    console.log('[Home] Chart scaling:', {
      maxValue,
      maxBarHeight,
      dataPoints: tvlByTimeData.length
    })
    
    // Scale all values to bar heights and keep original data
    const chartDataWithDates = tvlByTimeData.map((point) => {
      const scaledValue = maxValue > 0 ? (point.value / maxValue) * maxBarHeight : 0
      return {
        scaledValue,
        originalValue: point.value,
        date: point.date,
      }
    })
    
    const scaledValues = chartDataWithDates.map(d => d.scaledValue)
    
    // Calculate 7 evenly spaced period boundaries for x-axis labels
    // Ensure dates are unique to avoid duplicates
    const numPeriods = 7
    const periodDates: string[] = []
    const periodIndices: number[] = [] // Store indices for each period boundary
    const usedDateStrings = new Set<string>() // Track dates to avoid duplicates
    
    // Helper function to get date string from data point
    const getDateString = (dateValue: string): string | null => {
      if (!dateValue) return null
      try {
        const date = new Date(dateValue)
        if (isNaN(date.getTime())) return null
        const day = date.getDate()
        const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
        return `${day} ${month}`
      } catch {
        return null
      }
    }
    
    // Helper function to find next unique date near an index
    const findUniqueDateNearIndex = (startIndex: number): string | null => {
      // Search forward first
      for (let offset = 0; offset < tvlByTimeData.length; offset++) {
        const nextIndex = Math.min(startIndex + offset, tvlByTimeData.length - 1)
        const dateString = getDateString(tvlByTimeData[nextIndex].date)
        if (dateString && !usedDateStrings.has(dateString)) {
          return dateString
        }
        
        const prevIndex = Math.max(startIndex - offset, 0)
        if (prevIndex !== nextIndex) {
          const dateString2 = getDateString(tvlByTimeData[prevIndex].date)
          if (dateString2 && !usedDateStrings.has(dateString2)) {
            return dateString2
          }
        }
      }
      return null
    }
    
    // Calculate evenly spaced indices
    for (let i = 0; i < numPeriods; i++) {
      // Calculate index for this period: evenly distribute across all data points
      // Use i * (length - 1) / (numPeriods - 1) to get evenly spaced indices
      const periodIndex = i === numPeriods - 1
        ? tvlByTimeData.length - 1 // Last period uses the last data point
        : Math.round((i * (tvlByTimeData.length - 1)) / (numPeriods - 1))
      
      periodIndices.push(periodIndex)
      const periodDate = tvlByTimeData[periodIndex].date
      
      // Format date: "DD MMM" (e.g., "20 MAY")
      let dateString = getDateString(periodDate)
      
      // If date is duplicate, find a unique one nearby
      if (dateString && usedDateStrings.has(dateString)) {
        dateString = findUniqueDateNearIndex(periodIndex)
      }
      
      // Add date if we found a unique one
      if (dateString && !usedDateStrings.has(dateString)) {
        usedDateStrings.add(dateString)
        periodDates.push(dateString)
      }
      
      console.log(`[Home] Period ${i + 1}/${numPeriods}:`, {
        index: periodIndex,
        date: periodDate,
        formattedDate: dateString,
        value: tvlByTimeData[periodIndex].value
      })
    }
    
    // Map each data point to its closest period for alignment
    // This helps with visual alignment of bars to x-axis labels
    const chartDataWithPeriods = chartDataWithDates.map((point, index) => {
      // Find the closest period index for this data point
      let closestPeriodIndex = 0
      let minDistance = Math.abs(index - periodIndices[0])
      
      for (let i = 1; i < periodIndices.length; i++) {
        const distance = Math.abs(index - periodIndices[i])
        if (distance < minDistance) {
          minDistance = distance
          closestPeriodIndex = i
        }
      }
      
      return {
        ...point,
        periodIndex: closestPeriodIndex, // Add period index for reference
      }
    })
    
    console.log('[Home] Final chart values:', {
      totalBars: scaledValues.length,
      periodDates,
      firstFewValues: scaledValues.slice(0, 5),
      lastFewValues: scaledValues.slice(-5)
    })
    
    // Only return dates if we have exactly 7 unique dates
    const finalPeriodDates = periodDates.length === numPeriods ? periodDates : []
    
    return { tvlChartValues: scaledValues, periodDates: finalPeriodDates, tvlChartDataWithDates: chartDataWithPeriods }
  }, [tvlByTimeData])
  
  // Always use today's date for display
  const latestDate = React.useMemo(() => {
    return new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }, [])

  // Determine if chart should be empty (no data or null response)
  // Only show empty if we're not loading and there's no data
  // Note: isEmpty should be based on TVL by time data, NOT the total TVL value
  const isTvlChartEmpty = !isTvlByTimeLoading && (!tvlByTimeData || tvlByTimeData.length === 0 || !tvlChartValues)

  // Debug logging
  React.useEffect(() => {
    console.log('[Home] isTvlChartEmpty:', isTvlChartEmpty)
    console.log('[Home] tvlByTimeData:', tvlByTimeData)
    console.log('[Home] isTvlByTimeLoading:', isTvlByTimeLoading)
  }, [isTvlChartEmpty, tvlByTimeData, isTvlByTimeLoading])

  const handleTabChange = (tabId: string) => {
    // Track tab change
    if (previousTabRef.current !== tabId) {
      analytics.tabSwitched(previousTabRef.current)
      previousTabRef.current = tabId
    }
    setActiveTab(tabId)
  }

  const tabs = React.useMemo(() => {
    const flagshipIcon = getCategoryIconWithFallback("flagship")
    const deltaNeutralIcon = getCategoryIconWithFallback("delta-neutral")
    const leverageLoopingIcon = getCategoryIconWithFallback("leverage-looping")
    
    return [
      { id: "top-yields", label: "Top Yields" },
      { id: "flagship", label: "Flagship", icon: flagshipIcon.url, iconFallback: flagshipIcon.fallback },
      { id: "delta-neutral", label: "Delta neutral", icon: deltaNeutralIcon.url, iconFallback: deltaNeutralIcon.fallback },
      { id: "leverage-looping", label: "Leverage Looping", icon: leverageLoopingIcon.url, iconFallback: leverageLoopingIcon.fallback },
    ]
  }, [])

  return (
    <div 
      className="relative w-full h-screen flex flex-col"
      style={{ 
        backgroundColor: designTokens.colors.background.main,
        overflowX: 'hidden',
        overflowY: 'hidden',
      }}
    >
      <div style={{ overflow: 'visible', position: 'relative', zIndex: 10 }}>
        <NeumorphicNav activeMenuItem="none" />
      </div>

      <PageContainer>
        <div 
          className="flex-1 flex w-full"
          style={{ 
            gap: designTokens.spacing.card.gap 
          }}
        >
        <div className="flex-1 flex items-start">
          <TVLChart 
            isEmpty={isTvlChartEmpty}
            totalValue={formattedTotalTvl}
            date={latestDate}
            vaultName="Combined"
            useApi={true}
            isLoading={false}
            data={tvlChartValues}
            periodDates={periodDates}
            chartDataWithDates={tvlChartDataWithDates}
          />
        </div>

        <div 
          className="flex-1 flex flex-col overflow-hidden px-[8px]"
        >
          <DashboardTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <div 
            className="relative rounded-[12px] mt-[24px] shrink-0"
            style={{
              width: designTokens.spacing.layout.yieldsMaxWidth,
              height: '42px',
              backgroundColor: designTokens.colors.background.main,
              boxShadow: '4px 4px 4px 0px rgba(127,86,217,0.15), -4px -4px 4px 0px white',
            }}
          >
            <div className="absolute inset-0 flex items-center px-[24px]">
              <p 
                className="flex-1 text-[12px] leading-[18px] tracking-[0.15px] whitespace-pre-wrap"
                style={{ 
                  color: designTokens.colors.text.primary,
                  fontFamily: "'Hanken Grotesk', sans-serif",
                }}
              >
                <span className="font-semibold">Note: </span>
                <span className="font-normal">By initiating a withdrawal, your vault shares (syUSD) will be converted into the underlying asset</span>
              </p>
              <Flame 
                size={24}
                className="shrink-0 ml-[24px]"
                style={{ color: designTokens.colors.strategy.btc }}
              />
            </div>
          </div>

          <div 
            className="flex-1 flex flex-col justify-start mt-[32px] overflow-y-auto hide-scrollbar"
            style={{ gap: designTokens.spacing.card.gapInternal }}
          >
            {(vaultSymbolsError || configError) && (
              <div className="flex items-center justify-center p-8">
                <p style={{ color: 'red' }}>
                  Error loading vaults: {vaultSymbolsError instanceof Error ? vaultSymbolsError.message : configError?.message ?? 'Unknown error'}
                </p>
              </div>
            )}
            {!vaultSymbolsError && !configError && (
              <>
                {/* Always render the container, even if empty, to maintain stable structure */}
                {/* Grid layout: 2 cards per row */}
                <div 
                  className="grid"
                  style={{ 
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: designTokens.spacing.card.gap,
                    width: '100%',
                    maxWidth: designTokens.spacing.layout.yieldsMaxWidth,
                    paddingBottom: '16px',
                  }}
                >
                  {(() => {
                    const isLoadingState = isLoadingVaults || isConfigsLoading || isFetching
                    if (isLoadingState) {
                      return (
                        <div className="flex justify-center col-span-2" style={{ paddingTop: '140px', paddingBottom: '64px' }}>
                          <Loader2 className="animate-spin" size={32} style={{ color: designTokens.colors.text.primary, opacity: 0.6 }} />
                        </div>
                      )
                    }

                    const categoryToTabMap: Record<string, string> = {
                      'Flagship': 'flagship',
                      'Delta Neutral': 'delta-neutral', // Note: Config uses "Delta Neutral" (capital N)
                      'Leverage Looping': 'leverage-looping',
                    }

                    // Show all vaults from fetchAllVaultSymbols, no filtering based on config response
                    // Only filter by category for tabs (not top-yields)
                    // Use category field from config to determine strategy type
                    const filteredSymbols = allVaultSymbols.filter((symbol) => {
                      if (activeTab === 'top-yields') return true
                      const config = configsBySymbol[symbol]
                      if (!config) return true // Show even if config is null
                      const category = config.vault_constants.category
                      const targetCategory = Object.keys(categoryToTabMap).find(
                        (cat) => categoryToTabMap[cat] === activeTab
                      )
                      // Match category from config (case-sensitive match)
                      return targetCategory ? category === targetCategory : true
                    })

                    if (filteredSymbols.length === 0) {
                      return (
                        <div className="flex justify-center col-span-2" style={{ paddingTop: '140px', paddingBottom: '64px' }}>
                          <p style={{ color: designTokens.colors.text.primary }}>
                            {allVaultSymbols.length === 0
                              ? 'No vaults available'
                              : activeTab === 'top-yields'
                                ? 'No vaults available'
                                : 'No vaults available in this category'}
                          </p>
                        </div>
                      )
                    }

                    return filteredSymbols.map((symbol) => {
                      const config = configsBySymbol[symbol]
                      // Show vault card even if config is null - use symbol as fallback
                      if (!config) {
                        return (
                          <VaultCard 
                            key={symbol} 
                            symbol={symbol} 
                            config={{
                              last_updated: '',
                              vault_constants: {
                                address: '',
                                audited_by: '',
                                base_asset: { asset: '', network: '' },
                                category: '',
                                decimals: 18,
                                deployment_date: '',
                                deposit_assets: [],
                                description: '',
                                dest_network: '',
                                faqs: [],
                                fee_payout: '',
                                logo: '',
                                management_fee: '',
                                name: symbol,
                                owner: '',
                                performance_fee: '',
                                queue_address: '',
                                rate_provider: '',
                                solver_address: '',
                                symbol: symbol,
                                teller_address: '',
                                type: '',
                                withdraw_assets: [],
                              },
                              vault_endpoints: {
                                allocations_by_time: '',
                                apy_by_time: '',
                                apy_endpoint: '',
                                asset_exposure: '',
                                available_liquidity: '',
                                base_asset_price: '',
                                last_updated_deposit: '',
                                last_updated_withdrawal: '',
                                lifetime_returns: '',
                                share_price: '',
                                strategy_exposure: '',
                                tvl: '',
                                tvl_by_time: '',
                                withdraw_request: '',
                              },
                              vault_incentives: {
                                enabled: false,
                                points: [],
                              },
                              vault_networks: {},
                            }}
                          />
                        )
                      }
                      return (
                        <VaultCard 
                          key={symbol} 
                          symbol={symbol} 
                          config={config}
                        />
                      )
                    })
                  })()}
                </div>
              </>
            )}
          </div>
        </div>
        </div>
      </PageContainer>
    </div>
  )
}
