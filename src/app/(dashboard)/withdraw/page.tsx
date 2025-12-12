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
import { designTokens, typographyClasses, getPnlColor, shadows } from "@/lib/design-system"
import { cn } from "@/lib/utils"
import { AnimatedNumber } from "@/components/animations"

const USD_TOKEN_IMAGE = "/images/icons/USD-stable.svg"
const USDC_TOKEN_IMAGE = "/images/icons/USD-stable.svg"
const WALLET_ICON = "/images/icons/wallet-logo.svg"
const WITHDRAW_ICON = "/images/icons/withdraw-icon.svg"

function WithdrawPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const variant = searchParams.get('variant') as "usd" | "eth" | "btc" | null || "usd"
  
  const [amount, setAmount] = React.useState("120.00")
  const [selectedNetwork, setSelectedNetwork] = React.useState<Network>("Base")
  const balance = 115447.00
  const exchangeRate = 1.03

  const strategyConfig = {
    usd: {
      color: designTokens.colors.strategy.usd,
      name: "Stable Yield USD",
      symbol: "syUSD",
      icon: USD_TOKEN_IMAGE,
      pnl: 18.18,
      pnlAmount: 1909,
      value: 2909,
    },
    eth: {
      color: designTokens.colors.strategy.eth,
      name: "Stable Yield ETH",
      symbol: "syETH",
      icon: "/images/icons/ETH-stable.svg",
      pnl: -18.18,
      pnlAmount: -1909,
      value: 2909,
    },
    btc: {
      color: designTokens.colors.strategy.btc,
      name: "Stable Yield BTC",
      symbol: "syBTC",
      icon: "/images/icons/BTC Stable (1).svg",
      pnl: 12.06,
      pnlAmount: 1206,
      value: 2909,
    },
  }

  const config = strategyConfig[variant]

  const percentage = React.useMemo(() => {
    const amountNum = parseFloat(amount.replace(/,/g, '')) || 0
    if (amountNum === 0 || balance <= 0) return 0
    const pct = (amountNum / balance) * 100
    return Math.min(100, Math.max(0, pct))
  }, [amount, balance])

  const receivedAmount = React.useMemo(() => {
    const amountNum = parseFloat(amount.replace(/,/g, '')) || 0
    return (amountNum * exchangeRate).toFixed(2)
  }, [amount, exchangeRate])

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
        <NeumorphicNav activeMenuItem="portfolio" />
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
            height={228}
            width={356}
            showInnerBorder={true}
            useGradientBorder={false}
          >
            <div 
              className="absolute top-[40px] flex gap-[16px] items-center"
              style={{ 
                left: '58%',
                transform: 'translateX(-50%)'
              }}
            >
              <div 
                className="flex items-center justify-center rounded-full w-[48px] h-[48px]"
                style={{ 
                  boxShadow: shadows.tokenIcon
                }}
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

            <div 
              className="absolute left-[60px] top-[123px] flex flex-col gap-[2px] items-start"
            >
              <p 
                className={cn(typographyClasses.display1, "text-right")}
                style={{ color: getPnlColor(config.pnl) }}
              >
                $<AnimatedNumber value={Math.abs(config.pnlAmount)} decimals={0} delay={0.1} duration={1.2} />
              </p>
              <p 
                className={cn(typographyClasses.label1, "opacity-50")}
                style={{ color: designTokens.colors.text.primary }}
              >
                PNL $
              </p>
            </div>

            <div 
              className="absolute left-[197px] top-[108px] flex flex-col gap-[12px] items-end justify-center w-[107px]"
            >
              <div className="flex flex-col gap-[2px] items-end text-right">
                <p 
                  className={cn(typographyClasses.label1, "leading-[20px]")}
                  style={{ color: getPnlColor(config.pnl) }}
                >
                  {config.pnl >= 0 ? '+' : ''}
                  <AnimatedNumber value={Math.abs(config.pnl)} decimals={2} suffix="%" delay={0.1} duration={1.2} />
                </p>
                <p 
                  className={cn(typographyClasses.label1, "opacity-50")}
                  style={{ color: designTokens.colors.text.primary }}
                >
                  PNL %
                </p>
              </div>
              <div className="flex flex-col gap-[2px] items-end text-right">
                <p 
                  className={cn(typographyClasses.label1, "leading-[20px]")}
                  style={{ color: designTokens.colors.text.primary }}
                >
                  ${config.value.toLocaleString()}
                </p>
                <p 
                  className={cn(typographyClasses.label1, "opacity-50")}
                  style={{ color: designTokens.colors.text.primary }}
                >
                  {config.symbol} Balance
                </p>
              </div>
            </div>
          </NeumorphicInfoCard>

          {}
          <NoteCard
            height={112}
            width={356}
            text={`By initiating a withdrawal, your vault shares (${config.symbol}) will be converted into the underlying asset based on the latest market rates, which may fluctuate slightly; once the request is submitted, please allow up.`}
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
              label="Withdraw assets from"
              rightElement={
                <UnifiedSelector 
                  type="network"
                  selectedValue={selectedNetwork}
                  onValueChange={(value) => setSelectedNetwork(value as Network)}
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
              label="You will receive"
              rightElement={
                <div 
                  className="flex items-center px-[8px] py-[6px] rounded-[99px]"
                  style={{
                    backgroundColor: designTokens.colors.background.main,
                    boxShadow: shadows.tokenBadge
                  }}
                >
                  <div className="flex gap-[8px] items-center">
                    <div className="relative w-[16px] h-[16px]">
                      <Image
                        src={USDC_TOKEN_IMAGE}
                        alt="USDC"
                        width={16}
                        height={16}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <p className={cn(typographyClasses.label1)}>
                      USDC
                    </p>
                  </div>
                </div>
              }
              insetContainers={{ top: 52, height: 71, width: 376 }}
            >
              {}
              <div className="absolute left-[36px] top-[72px] w-[340px] z-10">
                <p 
                  className={cn(typographyClasses.display3, "whitespace-pre-wrap")}
                  style={{ color: designTokens.colors.text.primary }}
                >
                  {receivedAmount}
                </p>
              </div>
            </NeumorphicInputCard>

            {}
            <div className="relative h-[56px] w-full">
              <Button
                className="w-full h-full"
                variant={amount === "0.00" || parseFloat(amount.replace(/,/g, '')) === 0 ? "inactive" : "default"}
                disabled={amount === "0.00" || parseFloat(amount.replace(/,/g, '')) === 0}
                loading={false}
                size="default"
                showWithdrawIcon={true}
              >
                Request Withdrawal
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

export default function WithdrawPage() {
  return (
    <Suspense fallback={
      <div 
        className="relative w-full h-screen overflow-hidden flex flex-col"
        style={{ backgroundColor: designTokens.colors.background.main }}
      >
        <NeumorphicNav activeMenuItem="portfolio" />
        <PageContainer>
          <div className="flex items-center justify-center h-full">
            <p className={typographyClasses.subtext}>Loading...</p>
          </div>
        </PageContainer>
      </div>
    }>
      <WithdrawPageContent />
    </Suspense>
  )
}
