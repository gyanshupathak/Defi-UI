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
import { useCombinedVaultTVL, useVaultAPY } from "@/lib/hooks/use-vault"
import { getVariantFromVaultSymbol, fetchVaultConfig, type VaultSymbol, type VaultConfig } from "@/lib/config/vault-config"
import { useQueries } from "@tanstack/react-query"

type LoadedVaultConfig = NonNullable<VaultConfig>

function VaultCard({ symbol, config }: { symbol: VaultSymbol; config: LoadedVaultConfig }) {
  // Use symbol from config if available, otherwise use the prop symbol
  // This ensures we're using the correct symbol from the API
  const actualSymbol = config.vault_constants.symbol || symbol
  
  // Fetch APY for this vault using the actual symbol from config
  // This ensures we use the correct symbol for APY fetching
  const { apy } = useVaultAPY(actualSymbol, {
    enabled: !!config, // Only fetch when config is loaded
  })
  
  const variant = getVariantFromVaultSymbol(actualSymbol)
  const vaultName = config.vault_constants.name
  const vaultLogo = config.vault_constants.logo // Get logo from API
  
  return (
    <YieldStrategyCard
      name={vaultName}
      symbol={actualSymbol}
      apy={apy}
      variant={variant}
      tokenIcon={vaultLogo || undefined} // Pass logo if available, undefined will trigger fallback
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
    isLoading: isCombinedTvlLoading 
  } = useCombinedVaultTVL(allVaultSymbols, {
    enabled: allVaultSymbols.length > 0 && !isLoadingVaults,
    staleTime: 30_000, // 30 seconds
  })

  const handleTabChange = (tabId: string) => {
    // Track tab change
    if (previousTabRef.current !== tabId) {
      analytics.tabSwitched(previousTabRef.current)
      previousTabRef.current = tabId
    }
    setActiveTab(tabId)
  }

  const tabs = [
    { id: "top-yields", label: "Top Yields" },
    { id: "flagship", label: "Flagship", icon: "/images/icons/flagship-icon.svg" },
    { id: "delta-neutral", label: "Delta neutral", icon: "/images/icons/delta-neutral-icon.svg" },
    { id: "leverage-looping", label: "Leverage Looping", icon: "/images/icons/leverage-looping-icon.svg" },
  ]

  return (
    <div 
      className="relative w-full h-screen flex flex-col"
      style={{ 
        backgroundColor: designTokens.colors.background.main,
        overflowX: 'hidden',
        overflowY: 'auto',
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
            isEmpty={allVaultSymbols.length === 0}
            totalValue={formattedTotalTvl}
            date={new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
            vaultName="Combined"
            useApi={false}
            isLoading={isCombinedTvlLoading}
          />
        </div>

        <div 
          className="flex-1 flex flex-col"
        >
          <DashboardTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <div 
            className="relative rounded-[12px] mt-[24px]"
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
            className="flex-1 flex flex-col justify-start mt-[32px]"
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
                <div 
                  className="flex flex-wrap"
                  style={{ gap: designTokens.spacing.card.gap }}
                >
                  {(() => {
                    const isLoadingState = isLoadingVaults || isConfigsLoading || isFetching
                    if (isLoadingState) {
                      return (
                        <div className="flex justify-center w-full" style={{ paddingTop: '140px', paddingBottom: '64px' }}>
                          <Loader2 className="animate-spin" size={32} style={{ color: designTokens.colors.text.primary, opacity: 0.6 }} />
                        </div>
                      )
                    }

                    const categoryToTabMap: Record<string, string> = {
                      'Flagship': 'flagship',
                      'Delta neutral': 'delta-neutral',
                      'Leverage Looping': 'leverage-looping',
                    }

                    const filteredSymbols = allVaultSymbols.filter((symbol) => {
                      const config = configsBySymbol[symbol]
                      if (!config) return false // skip null configs
                      if (activeTab === 'top-yields') return true
                      const targetCategory = Object.keys(categoryToTabMap).find(
                        (cat) => categoryToTabMap[cat] === activeTab
                      )
                      return targetCategory ? config.vault_constants.category === targetCategory : true
                    })

                    if (filteredSymbols.length === 0) {
                      return (
                        <div className="flex justify-center w-full" style={{ paddingTop: '140px', paddingBottom: '64px' }}>
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
                      if (!config) return null
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
