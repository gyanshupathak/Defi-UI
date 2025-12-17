"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"
import { Button } from "@/components/ui/button"
import { AnimatedNumber } from "@/components/animations"
import { useAnalytics } from "@/lib/hooks/use-analytics"

export interface YieldStrategyCardProps {
  name: string
  symbol: string
  apy: number
  variant: "usd" | "eth" | "btc"
  tokenIcon?: string
  className?: string
}

const strategyConfig = {
  usd: {
    color: designTokens.colors.strategy.usd,
    name: "Stable Yield USD",
    icon: "/images/icons/USD-stable.svg",
  },
  eth: {
    color: designTokens.colors.strategy.eth,
    name: "Stable Yield ETH",
    icon: "/images/icons/ETH-stable.svg",
  },
  btc: {
    color: designTokens.colors.strategy.btc,
    name: "Stable Yield BTC",
    icon: "/images/icons/BTC Stable (1).svg",
  },
}

export function YieldStrategyCard({
  name,
  symbol,
  apy,
  variant,
  tokenIcon,
  className,
}: YieldStrategyCardProps) {
  const router = useRouter()
  const { analytics } = useAnalytics()
  const config = strategyConfig[variant]
  const icon = tokenIcon || config.icon
  const [isHovered, setIsHovered] = React.useState(false)

  const handleCardClick = () => {
    analytics.strategyCardClicked(symbol)
    router.push(`/yields?strategy=${variant}`)
  }

  const handleDepositClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    analytics.buttonClicked("deposit", `strategy_${variant}`)
    analytics.depositInitiated(symbol)
    router.push(`/deposit?strategy=${variant}`)
  }

  return (
    <div 
      className={cn("relative h-[244px] w-[318px] cursor-pointer", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div 
        className="absolute inset-0 rounded-[16px] transition-all duration-200"
        style={{ 
          backgroundColor: designTokens.colors.background.main,
          boxShadow: isHovered 
            ? designTokens.shadows.yieldCardOuterHover
            : designTokens.shadows.yieldCardOuter
        }}
      >
        <div 
          className="absolute inset-0 pointer-events-none rounded-[16px] transition-all duration-200"
          style={{ boxShadow: isHovered ? designTokens.shadows.popInHover : designTokens.shadows.popIn }}
        />
      </div>

      <div className="absolute inset-0 overflow-clip rounded-[16px]">
        <div className="absolute flex items-end justify-end left-[-22px] top-[-22px]">
          <div className="relative w-[120px] h-[120px] shrink-0">
            <Image
              src={icon}
              alt={name}
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div 
          className="absolute left-[24px] top-[118px] flex flex-col items-start"
          style={{ gap: '2px' }}
        >
          <p 
            className={typographyClasses.heading2}
            style={{ color: config.color }}
          >
            {name}
          </p>
          <p 
            className={`${typographyClasses.label1} text-black opacity-50`}
          >
            {symbol}
          </p>
        </div>

        <div 
          className="absolute right-[24px] top-[20px] flex flex-col items-end"
          style={{ gap: '2px' }}
        >
          <div 
            className="font-normal text-[40px] leading-[normal] text-black"
          >
            <AnimatedNumber 
              value={apy} 
              decimals={2} 
              suffix="%" 
              delay={0.1}
              duration={1.2}
            />
          </div>
          <p 
            className="font-normal text-[12px] leading-[normal] text-black opacity-50"
          >
            APY
          </p>
        </div>
      </div>

      <div className="absolute left-[24px] top-[184px] w-[270px]">
        <Button
          variant={variant}
          size="sm"
          showDepositIcon
          className="w-full"
          onClick={handleDepositClick}
        >
          Deposit
        </Button>
      </div>
    </div>
  )
}
