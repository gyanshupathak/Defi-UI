"use client"

import * as React from "react"
import Image from "next/image"
import { NeumorphicNav } from "@/components/layout/neumorphic-nav"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/ui/page-container"
import { CircularPercentageSelector } from "@/components/ui/circular-percentage-selector"
import { UnifiedSelector, type Network, type BridgeToken } from "@/components/ui/unified-selector"
import { NeumorphicInputCard } from "@/components/ui/neumorphic-input-card"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { cn, formatNumberWithCommas } from "@/lib/utils"
const TOKEN_ICONS: Record<BridgeToken, string> = {
  syUSD: "/images/icons/USD-stable.svg",
  syETH: "/images/icons/ETH-stable.svg",
  syBTC: "/images/icons/BTC Stable (1).svg",
  USDC: "/images/icons/USD-stable.svg",
  USDS: "/images/icons/USD-stable.svg",
  SUSD: "/images/icons/USD-stable.svg",
}

export default function BridgePage() {
  const [amount, setAmount] = React.useState("0.00")
  const [sourceNetwork, setSourceNetwork] = React.useState<Network>("Base")
  const [destNetwork, setDestNetwork] = React.useState<Network>("Katana")
  const [selectedToken, setSelectedToken] = React.useState<BridgeToken>("syUSD")
  const balance = 115447.00 

  
  const percentage = React.useMemo(() => {
    const amountNum = parseFloat(amount.replace(/,/g, '')) || 0
    if (amountNum === 0 || balance <= 0) return 0
    const pct = (amountNum / balance) * 100
    return Math.min(100, Math.max(0, pct))
  }, [amount, balance])

  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9.]/g, '')

    if (value === '') {
      setAmount('')
      return
    }
    
    // Prevent multiple decimal points
    const parts = value.split('.')
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('')
    }
    
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      const limitedValue = Math.min(numValue, balance)
      
      // Preserve decimal places if user is typing, otherwise format to 2 decimals
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

  
  const handlePercentageChange = (newPercentage: number) => {
    const newAmount = (balance * newPercentage) / 100
    setAmount(formatNumberWithCommas(newAmount.toFixed(2)))
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
      {}
      <div style={{ overflow: 'visible', position: 'relative', zIndex: 10 }}>
        <NeumorphicNav activeMenuItem="bridge" />
      </div>

      {}
      <PageContainer>
        <div 
          className="flex w-full justify-center"
          style={{ paddingTop: '80px' }}
        >
          <div className="flex flex-col items-start" style={{ width: '426px' }}>
        {}
        <NeumorphicInputCard
          height={325}
          width={426}
          label="Bridge"
          rightElement={
            <UnifiedSelector 
              type="token"
              selectedValue={selectedToken}
              onValueChange={(value) => setSelectedToken(value as BridgeToken)}
              tokenFilter="yields-only"
            />
          }
          insetContainers={[
            { top: 52, height: 96, width: 402 },  
            { top: 160, height: 125, width: 402 }  
          ]}
        >
          {}
          <div className="absolute left-[36px] top-[72px] flex flex-col gap-[8px] items-start">
            <div className="flex gap-[8px] items-center">
              <p 
                className={typographyClasses.label1}
                style={{ 
                  color: designTokens.colors.text.primary,
                  opacity: 0.5,
                  textAlign: 'right' as const
                }}
              >
                Source Network
              </p>
              {}
              <div className="relative w-[12px] h-[12px] shrink-0 overflow-hidden">
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle 
                    cx="6" 
                    cy="6" 
                    r="5.5" 
                    stroke="rgba(0, 0, 0, 1)" 
                    strokeWidth="1"
                    fill="none"
                  />
                  <path 
                    d="M6 4V6M6 8H6.01" 
                    stroke="rgba(0, 0, 0, 1)" 
                    strokeWidth="1" 
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <UnifiedSelector
              type="network"
              selectedValue={sourceNetwork}
              onValueChange={(value) => setSourceNetwork(value as Network)}
            />
          </div>

          {}
          <div className="absolute left-[230px] top-[72px] flex flex-col gap-[8px] items-start">
            <div className="flex gap-[8px] items-center">
              <p 
                className={typographyClasses.label1}
                style={{ 
                  color: designTokens.colors.text.primary,
                  opacity: 0.5,
                  textAlign: 'right' as const
                }}
              >
                Destination Network
              </p>
              {}
              <div className="relative w-[12px] h-[12px] shrink-0 overflow-hidden">
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle 
                    cx="6" 
                    cy="6" 
                    r="5.5" 
                    stroke="rgba(0, 0, 0, 1)" 
                    strokeWidth="1"
                    fill="none"
                  />
                  <path 
                    d="M6 4V6M6 8H6.01" 
                    stroke="rgba(0, 0, 0, 1)" 
                    strokeWidth="1" 
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <UnifiedSelector
              type="network"
              selectedValue={destNetwork}
              onValueChange={(value) => setDestNetwork(value as Network)}
            />
          </div>

          {}
          <div className="absolute left-[36px] top-[190px] z-10">
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className="font-['Hanken_Grotesk',sans-serif] font-bold leading-normal text-[24px] bg-transparent border-none outline-none w-[180px]"
              style={{ 
                color: designTokens.colors.text.primary,
                caretColor: designTokens.colors.primary
              }}
            />
          </div>

          {}
          <div className="absolute left-[36px] top-[245px] flex gap-[4px] items-center z-10">
            {}
            <div className="relative w-[16px] h-[16px] shrink-0 overflow-hidden">
              <Image
                src="/images/icons/wallet-logo.svg"
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
          <div className="absolute left-[314px] top-[180px]">
          <CircularPercentageSelector 
            value={percentage}
            onValueChange={handlePercentageChange}
              tokenIcon={TOKEN_ICONS[selectedToken]}
          />
          </div>

          {}
          <p 
            className={cn("absolute left-[24px] top-[297px] h-[16px] opacity-50", typographyClasses.label1)}
            style={{ 
              color: designTokens.colors.text.primary
            }}
          >
            Bridge Fee: --
          </p>
        </NeumorphicInputCard>

        {}
        <div className="relative h-[56px] w-[426px] mt-[32px]">
          <Button
            className="w-full h-full"
            variant={amount === "0.00" || parseFloat(amount.replace(/,/g, '')) === 0 ? "inactive" : "default"}
            disabled={amount === "0.00" || parseFloat(amount.replace(/,/g, '')) === 0}
            loading={false}
            size="default"
          >
            Bridge
          </Button>
        </div>
        </div>
      </div>
      </PageContainer>
    </div>
  )
}
