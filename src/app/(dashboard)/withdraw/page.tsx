"use client"

import * as React from "react"
import { Suspense } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { NeumorphicNav } from "@/components/layout/neumorphic-nav"
import { PrimaryButton } from "@/components/ui/primary-button"
import { PageContainer } from "@/components/ui/page-container"
import { NetworkSelector, type Network } from "@/components/ui/network-selector"
import { CircularPercentageSelector } from "@/components/ui/circular-percentage-selector"
import { NeumorphicInfoCard } from "@/components/ui/neumorphic-info-card"
import { NeumorphicInputCard } from "@/components/ui/neumorphic-input-card"
import { NoteCard } from "@/components/ui/note-card"
import { designTokens, typographyClasses, getPnlColor, shadows } from "@/lib/design-system"
import { cn } from "@/lib/utils"

// Local image paths
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
  const exchangeRate = 1.03 // 1 syUSD = 1.03 USDC

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

  // Calculate percentage based on amount
  const percentage = React.useMemo(() => {
    const amountNum = parseFloat(amount.replace(/,/g, '')) || 0
    if (amountNum === 0 || balance <= 0) return 0
    const pct = (amountNum / balance) * 100
    return Math.min(100, Math.max(0, pct))
  }, [amount, balance])

  // Calculate received amount
  const receivedAmount = React.useMemo(() => {
    const amountNum = parseFloat(amount.replace(/,/g, '')) || 0
    return (amountNum * exchangeRate).toFixed(2)
  }, [amount, exchangeRate])

  // Handle amount input change
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

  // Handle percentage change from circular selector
  const handlePercentageChange = (newPercentage: number) => {
    const newAmount = (balance * newPercentage) / 100
    setAmount(newAmount.toFixed(2))
  }

  // Format balance for display
  const formattedBalance = balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div 
      className="relative w-full h-screen overflow-hidden flex flex-col"
      style={{ backgroundColor: designTokens.colors.background.main }}
    >
      {/* Navigation */}
      <NeumorphicNav activeMenuItem="portfolio" />

      {/* Main Content*/}
      <PageContainer useAbsolutePositioning>

        <div 
          className="absolute flex flex-col gap-[32px]"
          style={{ 
            left: '214px', 
            top: '106px', 
            width: '356px',
          }}
        >
          {/* Strategy Info Card*/}
          <NeumorphicInfoCard
            height={228}
            width={356}
            showInnerBorder={true}
            useGradientBorder={false}
          >
            {/* Token Info */}
            <div 
              className="absolute top-[40px] flex gap-[16px] items-center"
              style={{ 
                left: '58%',
                transform: 'translateX(-50%)'
              }}
            >
              {/* Token Icon with neumorphic shadow */}
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

            {/* PNL $ Display*/}
            <div 
              className="absolute left-[60px] top-[123px] flex flex-col gap-[2px] items-start"
            >
              <p 
                className={cn(typographyClasses.display1, "text-right")}
                style={{ color: getPnlColor(config.pnl) }}
              >
                ${Math.abs(config.pnlAmount).toLocaleString()}
              </p>
              <p 
                className={cn(typographyClasses.label1, "opacity-50")}
                style={{ color: designTokens.colors.text.primary }}
              >
                PNL $
              </p>
            </div>

            {/* PNL % and syUSD Balance */}
            <div 
              className="absolute left-[197px] top-[108px] flex flex-col gap-[12px] items-end justify-center w-[107px]"
            >
              {/* PNL % */}
              <div className="flex flex-col gap-[2px] items-end text-right">
                <p 
                  className={cn(typographyClasses.label1, "leading-[20px]")}
                  style={{ color: getPnlColor(config.pnl) }}
                >
                  {config.pnl >= 0 ? '+' : ''}{config.pnl.toFixed(2)}%
                </p>
                <p 
                  className={cn(typographyClasses.label1, "opacity-50")}
                  style={{ color: designTokens.colors.text.primary }}
                >
                  PNL %
                </p>
              </div>
              {/* syUSD Balance */}
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

          {/* Note Card */}
          <NoteCard
            height={112}
            width={356}
            text={`By initiating a withdrawal, your vault shares (${config.symbol}) will be converted into the underlying asset based on the latest market rates, which may fluctuate slightly; once the request is submitted, please allow up.`}
          />
        </div>

        {/* Withdrawal Form */}
        <div 
          className="absolute flex flex-col gap-[32px]"
          style={{ 
            left: '786px', 
            top: '106px', 
            width: '400px',
          }}
        >
          {/* Withdraw Assets Card */}
          <NeumorphicInputCard
            height={189}
            width={400}
            label="Withdraw assets from"
            rightElement={
              <NetworkSelector 
                selectedNetwork={selectedNetwork}
                onNetworkChange={setSelectedNetwork}
              />
            }
            insetContainers={{ top: 52, height: 125, width: 376 }}
          >
            {/* Amount Input */}
            <div className="absolute left-[36px] top-[82px] z-10">
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className={cn(
                  typographyClasses.heading1,
                  "font-bold bg-transparent border-none outline-none w-[101px]"
                )}
                style={{ 
                  color: designTokens.colors.text.primary,
                  caretColor: designTokens.colors.primary,
                }}
              />
            </div>

            {/* Balance Display */}
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

            {/* Circular Percentage Selector */}
            <div className="absolute left-[288px] top-[72px]">
              <CircularPercentageSelector 
                value={percentage}
                onValueChange={handlePercentageChange}
                tokenIcon={config.icon}
              />
            </div>
          </NeumorphicInputCard>

          {/* You Will Receive Card */}
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
            {/* Received Amount Display */}
            <div className="absolute left-[36px] top-[72px] w-[340px] z-10">
              <p 
                className={cn(typographyClasses.heading1, "whitespace-pre-wrap")}
                style={{ color: designTokens.colors.text.primary }}
              >
                {receivedAmount}
              </p>
            </div>
          </NeumorphicInputCard>

          {/* Request Withdrawal Button */}
          <div className="relative h-[56px] w-full">
              <PrimaryButton
                className="w-full h-full"
                variant={amount === "0.00" || parseFloat(amount.replace(/,/g, '')) === 0 ? "inactive" : "withdraw"}
                disabled={amount === "0.00" || parseFloat(amount.replace(/,/g, '')) === 0}
                loading={false}
                size="default"
                showDepositIcon={true}
              >
                Request Withdrawal
              </PrimaryButton>
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
