"use client"

import * as React from "react"
import { Suspense } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { NeumorphicNav } from "@/components/layout/neumorphic-nav"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/ui/page-container"
import { UnifiedSelector, type Network } from "@/components/ui/unified-selector"
import { CircularPercentageSelector } from "@/components/ui/circular-percentage-selector"
import { NeumorphicInfoCard } from "@/components/ui/neumorphic-info-card"
import { NeumorphicInputCard } from "@/components/ui/neumorphic-input-card"
import { NoteCard } from "@/components/ui/note-card"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"
import { cn, formatNumberWithCommas, formatAddress } from "@/lib/utils"
import { AnimatedNumberPartial } from "@/components/animations"
import { useAnalytics } from "@/lib/hooks/use-analytics"
import { useTimeTracker } from "@/lib/hooks/use-time-tracker"
import { useScrollDepth } from "@/lib/hooks/use-scroll-depth"
import { usePagePerformance } from "@/lib/hooks/use-page-performance"
import { useVaultConfig } from "@/lib/hooks/use-vault-config"
import { useVaultTVL, useVaultAPY, useUSDCToVaultTokenConversion } from "@/lib/hooks/use-vault"
import { useWalletBalance } from "@/lib/hooks/use-wallet-balance"
import { getVariantFromVaultSymbol, getVaultSymbolFromVariant } from "@/lib/config/vault-config"
import { getVaultLogo, getNetworkImage, getTokenImage, NETWORK_IMAGE_FALLBACKS, TOKEN_IMAGE_FALLBACKS } from "@/lib/utils/vault-images"
const USD_TOKEN_IMAGE = "/images/icons/USD-stable.svg"
const WALLET_ICON = "/images/icons/wallet-logo.svg"

function DepositPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { analytics } = useAnalytics()
  const pageTimeTracker = useTimeTracker()

  // Track page-level time
  React.useEffect(() => {
    pageTimeTracker.start()
    return () => {
      const duration = pageTimeTracker.stop()
      if (duration && duration > 0) {
        analytics.pageTimeSpent("deposit_page", duration)
      }
    }
  }, [analytics, pageTimeTracker])

  // Track scroll depth
  useScrollDepth("deposit_page", analytics)

  // Track page performance
  usePagePerformance("deposit_page", analytics)
  const [strategy, setStrategy] = React.useState<"usd" | "eth" | "btc" | "hlp">(
    (searchParams.get('strategy') as "usd" | "eth" | "btc" | "hlp") || "usd"
  )
  
  const [amount, setAmount] = React.useState("0.00")
  
  // Get vault symbol from strategy
  const vaultSymbol = getVaultSymbolFromVariant(strategy)
  
  // Fetch vault config
  const { data: vaultConfig, isLoading: isConfigLoading } = useVaultConfig(vaultSymbol, {
    enabled: !!vaultSymbol,
  })

  // Helper function to map config network names to Network type
  const mapConfigNetworkToNetwork = React.useCallback((configNetwork: string): Network => {
    const normalized = configNetwork.toLowerCase()
    // Check for HyperEVM first (before checking for 'eth' which might match)
    if (normalized.includes('hyperevm') || normalized === 'hyperevm') return 'HyperEVM'
    if (normalized.includes('base')) return 'Base'
    if (normalized.includes('ethereum') || (normalized.includes('eth') && !normalized.includes('hyper'))) return 'Ethereum'
    if (normalized.includes('arbitrum')) return 'Arbitrum'
    if (normalized.includes('katana')) return 'Katana'
    // Default to Base if unknown
    return 'Base'
  }, [])

  const [depositNetwork, setDepositNetwork] = React.useState<Network>("Base")
  const [vaultNetwork, setVaultNetwork] = React.useState<Network>("Base")

  // Get allowed deposit networks from vault config
  const allowedDepositNetworks = React.useMemo(() => {
    if (!vaultConfig?.vault_constants?.deposit_assets) {
      return undefined // Show all networks if no config
    }
    const networks = new Set<Network>()
    vaultConfig.vault_constants.deposit_assets.forEach(asset => {
      const network = mapConfigNetworkToNetwork(asset.network)
      networks.add(network)
    })
    return Array.from(networks)
  }, [vaultConfig, mapConfigNetworkToNetwork])

  // Get allowed destination networks from vault config (should be just one)
  // Network comes from vault_constants.dest_network
  // The UnifiedSelector will get the network image from vault_networks[network].image (CDN URL)
  // with fallback to local images folder if not present or invalid URL
  const allowedDestinationNetworks = React.useMemo(() => {
    if (!vaultConfig?.vault_constants?.dest_network) {
      return undefined // Show all networks if no config
    }
    const network = mapConfigNetworkToNetwork(vaultConfig.vault_constants.dest_network)
    return [network]
  }, [vaultConfig, mapConfigNetworkToNetwork])

  // Get deposit network from first deposit asset (no selector, just use from config)
  // Network comes from vault_constants.deposit_assets[].network
  const depositAssetNetwork = React.useMemo(() => {
    if (!vaultConfig?.vault_constants?.deposit_assets || vaultConfig.vault_constants.deposit_assets.length === 0) {
      return "Base" as Network // Default fallback
    }
    const network = mapConfigNetworkToNetwork(vaultConfig.vault_constants.deposit_assets[0].network)
    return network
  }, [vaultConfig, mapConfigNetworkToNetwork])

  // Get deposit asset symbol from vault config
  const depositAssetSymbol = React.useMemo(() => {
    if (!vaultConfig?.vault_constants?.deposit_assets || vaultConfig.vault_constants.deposit_assets.length === 0) {
      return 'USDC' // Default fallback
    }
    // Get the first asset from the first deposit asset entry
    const firstDepositAsset = vaultConfig.vault_constants.deposit_assets[0]
    if (firstDepositAsset.assets && firstDepositAsset.assets.length > 0) {
      return firstDepositAsset.assets[0]
    }
    return 'USDC' // Default fallback
  }, [vaultConfig])

  // Fetch wallet balance for the deposit asset
  const { balance: walletBalance, isLoading: isBalanceLoading } = useWalletBalance(
    vaultConfig,
    depositAssetNetwork,
    depositAssetSymbol
  )

  // Use wallet balance or default to 0 if not connected or loading
  const balance = React.useMemo(() => {
    if (isBalanceLoading) return 0
    return walletBalance || 0
  }, [walletBalance, isBalanceLoading])

  // Update networks when vault config loads or allowed networks change
  React.useEffect(() => {
    if (vaultConfig?.vault_constants) {
      // Set deposit network from first deposit asset network (read-only, from config)
      // This will override any user selection since it's determined by config
      setDepositNetwork(depositAssetNetwork)
      
      // Set vault network from destination network
      if (allowedDestinationNetworks && allowedDestinationNetworks.length > 0) {
        setVaultNetwork(allowedDestinationNetworks[0])
      }
    }
  }, [vaultConfig, mapConfigNetworkToNetwork, depositAssetNetwork, allowedDestinationNetworks])

  // Check if TVL endpoint exists
  const hasTvlEndpoint = !!vaultConfig?.vault_endpoints?.tvl

  // Fetch TVL for this vault
  const { 
    tvl,
    formattedValue: formattedTvl, 
    isLoading: isTvlLoading,
    isError: isTvlError
  } = useVaultTVL(vaultSymbol, {
    enabled: !!vaultSymbol && !!vaultConfig && hasTvlEndpoint,
  })

  // Check if APY endpoint exists
  const hasApyEndpoint = !!vaultConfig?.vault_endpoints?.apy_endpoint

  // Fetch APY for this vault
  const { 
    apy, 
    formattedAPY, 
    isLoading: isApyLoading,
    isError: isApyError 
  } = useVaultAPY(vaultSymbol, {
    enabled: !!vaultSymbol && !!vaultConfig && hasApyEndpoint,
  })

  // Calculate USDC amount for conversion
  const usdcAmount = React.useMemo(() => {
    const amountNum = parseFloat(amount.replace(/,/g, '')) || 0
    return amountNum
  }, [amount])

  // Always fetch conversion rate for 1 USDC to show base rate
  const { 
    vaultTokenAmount: baseVaultTokenAmount, 
    isLoading: isBaseConversionLoading,
    isError: isBaseConversionError,
    error: baseConversionError,
  } = useUSDCToVaultTokenConversion(1, vaultSymbol, {
    enabled: !!vaultSymbol && !!vaultConfig,
    staleTime: 10_000, // 10 seconds - ensure fresh data for display
  })

  // Debug logging
  React.useEffect(() => {
    console.log('[DepositPage] Base conversion:', {
      vaultSymbol,
      hasConfig: !!vaultConfig,
      baseVaultTokenAmount,
      isBaseConversionLoading,
      isBaseConversionError,
      baseConversionError,
    })
  }, [vaultSymbol, vaultConfig, baseVaultTokenAmount, isBaseConversionLoading, isBaseConversionError, baseConversionError])

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
    console.log('[DepositPage] Calculating conversion rate:', {
      usdcAmount,
      vaultTokenAmount,
      baseVaultTokenAmount,
    })
    
    if (usdcAmount > 0 && vaultTokenAmount > 0) {
      const rate = vaultTokenAmount / usdcAmount
      console.log('[DepositPage] Using actual rate:', rate)
      return rate
    }
    // Use base rate for 1 USDC
    const baseRate = baseVaultTokenAmount > 0 ? baseVaultTokenAmount : 0
    console.log('[DepositPage] Using base rate:', baseRate)
    return baseRate
  }, [usdcAmount, vaultTokenAmount, baseVaultTokenAmount])

  // Debug logging for conversion rate
  React.useEffect(() => {
    console.log('[DepositPage] Conversion rate:', conversionRate)
  }, [conversionRate])

  // Get vault details from config or fallback
  const vaultName = vaultConfig?.vault_constants.name || (
    strategy === 'usd' ? 'Stable Yield USD' : 
    strategy === 'eth' ? 'Stable Yield ETH' : 
    strategy === 'btc' ? 'Stable Yield BTC' : 
    'Stable Yield HLP'
  )
  const fallbackIcon = strategy === 'usd' ? USD_TOKEN_IMAGE : 
    strategy === 'eth' ? '/images/icons/ETH-stable.svg' : 
    strategy === 'btc' ? '/images/icons/BTC Stable (1).svg' : 
    '/images/icons/syHLP.svg'
  
  // Get vault token icon from config: try vault_networks tokens first, then vault_constants.logo, then fallback
  const vaultTokenIcon = React.useMemo(() => {
    // First try to get token image from vault_networks tokens (using vault symbol like syUSD, syETH, syBTC)
    const tokenFallback = TOKEN_IMAGE_FALLBACKS[vaultSymbol] || fallbackIcon
    const tokenImage = getTokenImage(vaultConfig, vaultSymbol, undefined, tokenFallback)
    
    // If token image is different from fallback, use it
    if (tokenImage !== tokenFallback) {
      return tokenImage
    }
    
    // Otherwise try vault logo from config
    const vaultLogo = getVaultLogo(vaultConfig, fallbackIcon)
    if (vaultLogo !== fallbackIcon) {
      return vaultLogo
    }
    
    // Finally use fallback
    return fallbackIcon
  }, [vaultConfig, vaultSymbol, fallbackIcon])
  
  const vaultType = vaultConfig?.vault_constants.type || 'Liquid' // Show type from config, default to 'Liquid'

  const strategyConfig = {
    usd: {
      color: designTokens.colors.strategy.usd,
      name: vaultName,
      symbol: vaultSymbol,
      icon: vaultTokenIcon,
    },
    eth: {
      color: designTokens.colors.strategy.eth,
      name: vaultName,
      symbol: vaultSymbol,
      icon: vaultTokenIcon,
    },
    btc: {
      color: designTokens.colors.strategy.btc,
      name: vaultName,
      symbol: vaultSymbol,
      icon: vaultTokenIcon,
    },
    hlp: {
      color: designTokens.colors.strategy.hlp,
      name: vaultName,
      symbol: vaultSymbol,
      icon: vaultTokenIcon,
    },
  }

  const config = strategyConfig[strategy]

  const percentage = React.useMemo(() => {
    const amountNum = parseFloat(amount.replace(/,/g, '')) || 0
    if (amountNum === 0 || balance <= 0) return 0
    const pct = (amountNum / balance) * 100
    return Math.min(100, Math.max(0, pct))
  }, [amount, balance])

  // Vault shares are now calculated via the conversion hook
  const vaultShares = React.useMemo(() => {
    if (isConversionLoading || usdcAmount === 0) {
      return '0.00'
    }
    return vaultTokenFormatted
  }, [vaultTokenFormatted, isConversionLoading, usdcAmount])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9.]/g, '')
    if (value === '') {
      setAmount('')
      return
    }
    
    const parts = value.split('.')
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('')
    }
    
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      const limitedValue = Math.min(numValue, balance)
      
      if (value.includes('.')) {
        const decimalPlaces = value.split('.')[1]?.length || 0
        const formatted = decimalPlaces > 0 
          ? formatNumberWithCommas(limitedValue.toFixed(Math.min(decimalPlaces, 2)))
          : formatNumberWithCommas(limitedValue.toFixed(2))
        setAmount(formatted)
      } else {
        setAmount(formatNumberWithCommas(limitedValue.toFixed(2)))
      }
    }
  }

  const handleAmountFocus = () => {
    analytics.formFieldFocused("deposit_form", "amount")
  }

  const handleAmountBlur = () => {
    const hasValue = amount !== "0.00" && amount !== ""
    analytics.formFieldBlurred("deposit_form", "amount", hasValue)
  }

  const handlePercentageChange = (newPercentage: number) => {
    const newAmount = (balance * newPercentage) / 100
    setAmount(formatNumberWithCommas(newAmount.toFixed(2)))
  }

  const formattedBalance = React.useMemo(() => {
    if (isBalanceLoading) {
      return '0.00'
    }
    return balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }, [balance, isBalanceLoading])

  // Format deployment date
  const formatDeploymentDate = (dateString?: string): string => {
    if (!dateString) return '--'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
      return dateString
    }
  }

  // Handle copy to clipboard
  const handleCopy = (text: string, addressType: string) => {
    analytics.addressCopied(addressType, text)
    navigator.clipboard.writeText(text).catch(() => {
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    })
  }

  // Helper component for detail row
  const DetailRow = ({ label, value, showCopyIcon = false, onCopy }: { label: string; value: string; showCopyIcon?: boolean; onCopy?: () => void }) => {
    const DottedLine = () => (
      <div 
        className="flex-1 h-px relative" 
        style={{ 
          minWidth: '0',
          backgroundImage: 'repeating-linear-gradient(to right, rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 1px, transparent 1px, transparent 3px)',
          backgroundSize: '4px 1px',
          backgroundRepeat: 'repeat-x',
        }}
      />
    )

    const ShareIcon = () => (
      <div className="relative shrink-0" style={{ width: '14px', height: '14px' }}>
        <Image
          src="/images/icons/redirect.svg"
          alt="Copy"
          width={14}
          height={14}
          className="object-contain"
        />
      </div>
    )

    return (
      <div className="flex items-end gap-[8px] py-[8px] w-full">
        <p
          className={cn(typographyClasses.label1, "shrink-0")}
          style={{ color: designTokens.colors.text.primary, opacity: 0.5 }}
        >
          {label}
        </p>
        <DottedLine />
        <div className="flex items-center gap-[8px] shrink-0">
          <p
            className={cn(typographyClasses.button, "leading-[24px]")}
            style={{ color: designTokens.colors.text.primary }}
          >
            {value}
          </p>
          {showCopyIcon && (
            <button
              type="button"
              onClick={onCopy}
              className="flex items-center justify-center p-[5px] rounded-[99px] cursor-pointer bg-transparent border-0 hover:opacity-70 transition-opacity"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
              aria-label="Copy address"
            >
              <ShareIcon />
            </button>
          )}
        </div>
      </div>
    )
  }

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

      <PageContainer useAbsolutePositioning>
        <div 
          className="absolute flex flex-col gap-[32px]"
          style={{ 
            left: '214px',
            top: '106px',
            width: '356px',
          }}
        >
          <NeumorphicInfoCard
            height={325}
            width={356}
            showInnerBorder={true}
            useGradientBorder={true}
          >
            <div 
              className="absolute left-1/2 top-[calc(50%-65px)] -translate-x-1/2 -translate-y-1/2 flex gap-[10px] items-center px-[24px] py-[20px] rounded-[16px] overflow-hidden"
              style={{ 
                width: '284px',
                height: '131px',
                backgroundColor: designTokens.colors.background.gradient, 
                boxShadow: shadows.cardDefault,      
              }}
            >
              <div className="flex flex-col items-start justify-center">
                <div className="flex items-center gap-[8px] text-[24px] leading-normal">
                  <div 
                    className="flex gap-[4px] items-end p-[4px] rounded-[99px]"
                    style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                  >
                    <p 
                      className={typographyClasses.heading1}
                      style={{ color: designTokens.colors.text.primary }}
                    >
                      1
                    </p>
                    <p 
                      className={cn(typographyClasses.heading1, "opacity-50")}
                      style={{ color: designTokens.colors.text.primary }}
                    >
                      USDC
                    </p>
                  </div>
                  <p 
                    className={typographyClasses.heading1}
                    style={{ color: designTokens.colors.text.secondary }}
                  >
                    =
                  </p>
                </div>
                <div 
                  className="flex gap-[4px] items-end rounded-[99px] p-[4px]"
                  style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                >
                  <p 
                    className={typographyClasses.display1}
                    style={{ color: designTokens.colors.text.primary }}
                  >
                    {isBaseConversionLoading || conversionRate === 0 ? (
                      '0.00'
                    ) : (
                      <AnimatedNumberPartial 
                        value={conversionRate} 
                        decimals={2} 
                        animateLastDigits={2} 
                        delay={0.1} 
                        duration={1.2} 
                      />
                    )}
                  </p>
                  <p 
                    className={cn(typographyClasses.display1, "opacity-50")}
                    style={{ color: designTokens.colors.text.primary }}
                  >
                    {config.symbol}
                  </p>
                </div>
              </div>
            </div>

            <div 
              className="absolute top-[180px] left-[60px] flex items-center gap-[8px]"
            >
              <div 
                className="relative shrink-0 flex items-center justify-center"
                style={{ 
                  width: '40px', 
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#F4F0FF',
                  boxShadow: shadows.tokenIcon,
                }}
              >
                <Image
                  src={config.icon}
                  alt={config.symbol}
                  width={36}
                  height={36}
                  className="object-contain"
                  style={{ 
                    display: 'block',
                    width: '36px',
                    height: '36px'
                  }}
                  onError={(e) => {
                    // Fallback to local image if CDN image fails
                    const target = e.target as HTMLImageElement
                    const fallback = TOKEN_IMAGE_FALLBACKS[vaultSymbol] || fallbackIcon
                    if (target.src !== fallback) {
                      target.src = fallback
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-[2px]">
                <p 
                  className={cn(typographyClasses.heading2)}
                  style={{ color: config.color }}
                >
                  {config.name}
                </p>
                <div className="flex gap-[8px] items-center">
                  <p 
                    className={cn(typographyClasses.label1, "opacity-50")}
                    style={{ color: designTokens.colors.text.primary }}
                  >
                    {config.symbol}
                  </p>
                  <div 
                    className="rounded-full shrink-0 w-[4px] h-[4px]"
                    style={{ backgroundColor: designTokens.colors.border.separator }}
                  />
                  <p 
                    className={cn(typographyClasses.label1, "opacity-50")}
                    style={{ color: designTokens.colors.text.primary }}
                  >
                    {vaultType}
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute left-[60px] top-[247px] flex flex-col gap-[4px] items-start w-[119px]">
              <p 
                className={cn(typographyClasses.heading2, "leading-[26px] tracking-[0.55px]")}
                style={{ color: designTokens.colors.text.primary }}
              >
                {!hasTvlEndpoint || isTvlLoading || isTvlError || tvl === undefined || tvl === null ? (
                  '--'
                ) : (
                  formattedTvl
                )}
              </p>
              <p 
                className={cn(typographyClasses.label1, "min-w-full whitespace-pre-wrap opacity-60")}
                style={{ color: designTokens.colors.text.primary }}
              >
                Total Value Locked
              </p>
            </div>

            <div className="absolute left-[239px] top-[249px] flex flex-col gap-[2px] items-end justify-center">
              <p 
                className={cn(typographyClasses.heading2, "text-right")}
                style={{ color: designTokens.colors.text.primary }}
              >
                {!hasApyEndpoint || isApyLoading || isApyError || apy === undefined || apy === null ? (
                  '--'
                ) : (
                  `${apy.toFixed(2)}%`
                )}
              </p>
              <p 
                className={cn(typographyClasses.label1, "opacity-50")}
                style={{ color: designTokens.colors.text.primary }}
              >
                APY
              </p>
            </div>
          </NeumorphicInfoCard>

          <NoteCard
            height={94}
            width={356}
            text="In the Portfolio section, deposits from non-Base networks may take 5–60 minutes to appear. Delay is due to bridge processing and network congestion."
          />
        </div>

        <div 
          className="absolute"
          style={{ 
            left: '620px',
            top: '0px',
            width: '756px',
            height: '828px',
          }}
        >
          <div 
            className="absolute flex flex-col gap-[32px]"
            style={{ 
              left: '86px',
              top: '106px',
              width: '400px',
            }}
          >
            <NeumorphicInputCard
              height={189}
              width={400}
              label="Deposit assets from"
              rightElement={
                <UnifiedSelector 
                  type="network"
                  selectedValue={depositAssetNetwork}
                  onValueChange={(value) => {
                    // Note: Selection is allowed for UI purposes, but will be overridden by config
                    // The deposit network is determined by vault_constants.deposit_assets[].network
                    // This allows the dropdown to open and show available networks
                    if (value) {
                      setDepositNetwork(value as Network)
                    }
                  }}
                  vaultConfig={vaultConfig}
                  location="deposit_page"
                  allowedNetworks={allowedDepositNetworks}
                />
              }
              insetContainers={{ top: 52, height: 125, width: 376 }}
            >
              <div className="absolute left-[36px] top-[82px] z-10">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  onFocus={handleAmountFocus}
                  onBlur={handleAmountBlur}
                  placeholder="0.00"
                  className={cn(
                    typographyClasses.display3,
                    "bg-transparent border-none outline-none w-[180px]"
                  )}
                  style={{ 
                    color: designTokens.colors.text.primary,
                    caretColor: designTokens.colors.primary,
                  }}
                />
              </div>

              <div className="absolute left-[36px] top-[137px] flex gap-[4px] items-center z-10">
                <div className="relative w-[16px] h-[16px] shrink-0 overflow-hidden">
                  <Image
                    src={WALLET_ICON}
                    alt="Wallet"
                    width={16}
                    height={16}
                    className="object-contain w-full h-full"
                    onError={(e) => {
                      console.error('[DepositPage] Failed to load wallet icon:', WALLET_ICON)
                    }}
                  />
                </div>
                <p 
                  className={typographyClasses.label1}
                  style={{ color: designTokens.colors.text.primary }}
                >
                  {formattedBalance}
                </p>
              </div>

              <div className="absolute left-[288px] top-[72px]">
                <CircularPercentageSelector 
                  value={percentage}
                  onValueChange={handlePercentageChange}
                  tokenIcon={config.icon}
                  fallbackIcon={fallbackIcon}
                />
              </div>
            </NeumorphicInputCard>

            <NeumorphicInputCard
              height={135}
              width={400}
              label="Vault shares receive"
              rightElement={
                <UnifiedSelector 
                  type="network"
                  selectedValue={vaultNetwork}
                  onValueChange={(value) => setVaultNetwork(value as Network)}
                  vaultConfig={vaultConfig}
                  location="deposit_page"
                  allowedNetworks={allowedDestinationNetworks}
                />
              }
              insetContainers={{ top: 52, height: 71, width: 376 }}
            >
              <div className="absolute left-[36px] top-[72px] flex items-end justify-between w-[328px] z-10">
                <p 
                  className={cn(typographyClasses.display3)}
                  style={{ color: designTokens.colors.text.primary }}
                >
                  {vaultShares}
                </p>
                <p 
                  className={cn(typographyClasses.label1)}
                  style={{ color: designTokens.colors.text.secondary }}
                >
                  {config.symbol}
                </p>
              </div>
            </NeumorphicInputCard>

            <div className="relative h-[56px] w-full">
              <Button
                className="w-full h-full"
                variant={amount === "0.00" || parseFloat(amount.replace(/,/g, '')) === 0 ? "inactive" : "default"}
                disabled={amount === "0.00" || parseFloat(amount.replace(/,/g, '')) === 0}
                loading={false}
                size="default"
                showDepositIcon={true}
                onClick={() => {
                  const amountValue = amount.replace(/,/g, '')
                  analytics.depositButtonClicked(
                    config.symbol,
                    amountValue !== "0.00" ? amountValue : undefined,
                    depositAssetNetwork,
                    vaultNetwork
                  )
                }}
              >
                Deposit
              </Button>
            </div>


          </div>
        </div>
      </PageContainer>
    </div>
  )
}

export default function DepositPage() {
  return (
    <Suspense fallback={
      <div 
        className="relative w-full h-screen overflow-hidden flex flex-col"
        style={{ backgroundColor: designTokens.colors.background.main }}
      >
        <NeumorphicNav activeMenuItem="none" />
        <PageContainer>
          <div className="flex items-center justify-center h-full">
            <p className={typographyClasses.subtext}>Loading...</p>
          </div>
        </PageContainer>
      </div>
    }>
      <DepositPageContent />
    </Suspense>
  )
}
