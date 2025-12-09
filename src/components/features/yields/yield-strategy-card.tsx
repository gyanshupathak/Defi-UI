"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"
import { PrimaryButton } from "@/components/ui/primary-button"

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
  const config = strategyConfig[variant]
  const icon = tokenIcon || config.icon
  const [isHovered, setIsHovered] = React.useState(false)

  const handleDepositClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/deposit?strategy=${variant}`)
  }

  return (
    <div 
      className={cn("relative h-[244px] w-[318px] cursor-pointer", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="absolute inset-0 rounded-[16px] transition-all duration-200"
        style={{ 
          backgroundColor: designTokens.colors.background.main,
          boxShadow: isHovered 
            ? '-6px -6px 16px 0 #FFFFFF, 6px 6px 16px 0 rgba(0, 0, 0, 0.15)'
            : '-4px -4px 12px 0 #FFFFFF, 4px 4px 12px 0 rgba(0, 0, 0, 0.1)'
        }}
      >
        <div 
          className="absolute inset-0 pointer-events-none rounded-[16px] transition-all duration-200"
          style={{ boxShadow: isHovered ? shadows.popInHover : shadows.popIn }}
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
          <p 
            className="font-normal text-[40px] leading-[normal] text-black"
          >
            {apy.toFixed(2)}%
          </p>
          <p 
            className="font-normal text-[12px] leading-[normal] text-black opacity-50"
          >
            APY
          </p>
        </div>
      </div>

      <div className="absolute left-[24px] top-[184px] w-[270px]">
        <PrimaryButton
          variant={variant}
          size="sm"
          showDepositIcon
          className="w-full"
          onClick={handleDepositClick}
        >
          Deposit
        </PrimaryButton>
      </div>
    </div>
  )
}
