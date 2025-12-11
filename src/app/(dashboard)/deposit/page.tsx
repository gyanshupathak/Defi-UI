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
import { cn } from "@/lib/utils"
import { AnimatedNumberPartial } from "@/components/animations"
const USD_TOKEN_IMAGE = "/images/icons/USD-stable.svg"
const WALLET_ICON = "/images/icons/wallet-logo.svg"

function DepositPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [strategy, setStrategy] = React.useState<"usd" | "eth" | "btc">(
    (searchParams.get('strategy') as "usd" | "eth" | "btc") || "usd"
  )
  
  const [amount, setAmount] = React.useState("0.00")
  const [vaultShares, setVaultShares] = React.useState("0.00")
  const [depositNetwork, setDepositNetwork] = React.useState<Network>("Base")
  const [vaultNetwork, setVaultNetwork] = React.useState<Network>("Base")
  const balance = 115447.00

  const strategyConfig = {
    usd: {
      color: designTokens.colors.strategy.usd,
      name: "Stable Yield USD",
      symbol: "syUSD",
      icon: USD_TOKEN_IMAGE,
      conversionRate: 0.12,
      apy: 18.18,
      tvl: 185000,
    },
    eth: {
      color: designTokens.colors.strategy.eth,
      name: "Stable Yield ETH",
      symbol: "syETH",
      icon: "/images/icons/ETH-stable.svg",
      conversionRate: 0.10,
      apy: 10.37,
      tvl: 150000,
    },
    btc: {
      color: designTokens.colors.strategy.btc,
      name: "Stable Yield BTC",
      symbol: "syBTC",
      icon: "/images/icons/BTC Stable (1).svg",
      conversionRate: 0.08,
      apy: 12.06,
      tvl: 200000,
    },
  }

  const config = strategyConfig[strategy]

  const percentage = React.useMemo(() => {
    const amountNum = parseFloat(amount.replace(/,/g, '')) || 0
    if (amountNum === 0 || balance <= 0) return 0
    const pct = (amountNum / balance) * 100
    return Math.min(100, Math.max(0, pct))
  }, [amount, balance])

  React.useEffect(() => {
    const amountNum = parseFloat(amount.replace(/,/g, '')) || 0
    const shares = amountNum * config.conversionRate
    setVaultShares(shares.toFixed(2))
  }, [amount, config.conversionRate])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '')
    if (value === '') {
      setAmount('')
      return
    }
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      const limitedValue = Math.min(numValue, balance)
      setAmount(limitedValue.toFixed(2))
    }
  }

  const handlePercentageChange = (newPercentage: number) => {
    const newAmount = (balance * newPercentage) / 100
    setAmount(newAmount.toFixed(2))
  }

  const formattedBalance = balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const formattedTvl = (config.tvl / 1000).toFixed(0) + 'K'

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
        <NeumorphicNav activeMenuItem="yields" />
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
          {}
          <NeumorphicInfoCard
            height={325}
            width={356}
            showInnerBorder={true}
            useGradientBorder={true}
          >
            {}
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
                    <AnimatedNumberPartial value={config.conversionRate} decimals={2} animateLastDigits={2} delay={0.1} duration={1.2} />
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

            {}
            <div 
              className="absolute top-[180px] flex gap-[16px] items-center"
              style={{ 
                left: '58%',
                transform: 'translateX(-50%)'
              }}
            >
              <div 
                className="flex items-center justify-center rounded-full w-[48px] h-[48px]"
                style={{ boxShadow: shadows.tokenIcon }}
              >
                <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden flex items-center justify-center">
                  <Image
                    src={config.icon}
                    alt={config.name}
                    width={40}
                    height={40}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-[2px] h-[44px] items-start justify-center w-[240px]">
                <p 
                  className={cn(typographyClasses.heading2, "min-w-full whitespace-pre-wrap")}
                  style={{ color: config.color }}
                >
                  {config.name}
                </p>
                <div className="flex gap-[8px] items-center justify-center">
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
                    Liquid
                  </p>
                </div>
              </div>
            </div>

            {}
            <div className="absolute left-[60px] top-[247px] flex flex-col gap-[4px] items-start w-[119px]">
              <p 
                className={cn(typographyClasses.heading2, "leading-[26px] tracking-[0.55px]")}
                style={{ color: designTokens.colors.text.primary }}
              >
                ${config.tvl.toLocaleString('en-US')}
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
                {config.apy.toFixed(2)}%
              </p>
              <p 
                className={cn(typographyClasses.label1, "opacity-50")}
                style={{ color: designTokens.colors.text.primary }}
              >
                APY
              </p>
            </div>
          </NeumorphicInfoCard>

          {}
          <NoteCard
            height={94}
            width={356}
            text="In the Portfolio section, deposits from non-Base networks may take 5–60 minutes to appear. Delay is due to bridge processing and network congestion."
          />
        </div>

          {}
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
            {}
            <NeumorphicInputCard
              height={189}
              width={400}
              label="Deposit assets from"
              rightElement={
                <UnifiedSelector 
                  type="network"
                  selectedValue={depositNetwork}
                  onValueChange={(value) => setDepositNetwork(value as Network)}
                />
              }
              insetContainers={{ top: 52, height: 125, width: 376 }}
            >
              {}
              <div className="absolute left-[36px] top-[82px] z-10">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className={cn(
                    typographyClasses.display3,
                    "bg-transparent border-none outline-none w-[101px]"
                  )}
                  style={{ 
                    color: designTokens.colors.text.primary,
                    caretColor: designTokens.colors.primary,
                  }}
                />
              </div>

              {}
              <div className="absolute left-[36px] top-[137px] flex gap-[4px] items-center z-10">
                <div className="relative w-[16px] h-[16px] shrink-0 overflow-hidden">
                  <Image
                    src={WALLET_ICON}
                    alt="Wallet"
                    width={16}
                    height={16}
                    className="object-contain w-full h-full"
                  />
                </div>
                <p 
                  className={typographyClasses.label1}
                  style={{ color: designTokens.colors.text.primary }}
                >
                  {formattedBalance}
                </p>
              </div>

              {}
              <div className="absolute left-[288px] top-[72px]">
                <CircularPercentageSelector 
                  value={percentage}
                  onValueChange={handlePercentageChange}
                  tokenIcon={config.icon}
                />
              </div>
            </NeumorphicInputCard>

            {}
            <NeumorphicInputCard
              height={135}
              width={400}
              label="Vault shares receive"
              rightElement={
                <UnifiedSelector 
                  type="network"
                  selectedValue={vaultNetwork}
                  onValueChange={(value) => setVaultNetwork(value as Network)}
                />
              }
              insetContainers={{ top: 52, height: 71, width: 376 }}
            >
              {}
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

            {}
            <div className="relative h-[56px] w-full">
              <Button
                className="w-full h-full"
                variant={amount === "0.00" || parseFloat(amount.replace(/,/g, '')) === 0 ? "inactive" : "blue"}
                disabled={amount === "0.00" || parseFloat(amount.replace(/,/g, '')) === 0}
                loading={false}
                size="default"
                showDepositIcon={true}
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
