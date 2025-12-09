"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { designTokens, typographyClasses, shadows, getPnlColor } from "@/lib/design-system"

const { popIn, popInHover } = shadows
import { PrimaryButton } from "@/components/ui/primary-button"

export interface PortfolioStrategyCardProps {
  name: string
  symbol: string
  pnl: number 
  totalBalance: string
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

export function PortfolioStrategyCard({
  name,
  symbol,
  pnl,
  totalBalance,
  variant,
  tokenIcon,
  className,
}: PortfolioStrategyCardProps) {
  const router = useRouter()
  const config = strategyConfig[variant]
  const icon = tokenIcon || config.icon
  const isPositive = pnl >= 0
  const pnlColor = getPnlColor(pnl)
  const pnlSign = pnl >= 0 ? '+' : ''
  const [isHovered, setIsHovered] = React.useState(false)

  const handleWithdraw = () => {
    router.push(`/withdraw?variant=${variant}`)
  }

  return (
    <div 
      className={cn("relative w-[318px] cursor-pointer", className)}
      style={{ height: '267px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="absolute inset-0 rounded-[16px] transition-all duration-200"
        style={{ 
          backgroundColor: designTokens.colors.background.main,
          boxShadow: shadows.popOut
        }}
      >
        <div 
          className="absolute inset-0 pointer-events-none rounded-[16px] transition-all duration-200"
          style={{ boxShadow: isHovered ? popInHover : popIn }}
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
          className="absolute right-[24px] top-[19px] flex flex-col items-end"
          style={{ gap: '4px' }}
        >
          <div className="flex items-baseline gap-[4px]">
            <p 
              className={typographyClasses.display2}
              style={{ 
                color: pnlColor,
                fontSize: '36px',
                lineHeight: '40px',
              }}
            >
              {isPositive ? '+' : '-'}
            </p>
            <p 
              className={typographyClasses.display1}
              style={{ color: pnlColor }}
            >
              {Math.abs(pnl).toFixed(2)}%
            </p>
          </div>
          <p 
            className={`${typographyClasses.label1} opacity-50`}
            style={{ color: designTokens.colors.text.primary }}
          >
            PNL
          </p>
        </div>

        <div 
          className="absolute left-[24px] top-[118px] flex flex-col items-center"
        >
          <p 
            className={typographyClasses.heading2}
            style={{ color: config.color }}
          >
            {name}
          </p>
        </div>

        <div 
          className="absolute left-[24px] top-[162px] flex items-center justify-between w-[270px]"
        >
          <p 
            className={`${typographyClasses.label1} opacity-50`}
            style={{ color: designTokens.colors.text.primary }}
          >
            Total Balance
          </p>
          <p 
            className={typographyClasses.button}
            style={{ 
              color: designTokens.colors.text.primary,
              textAlign: 'right',
            }}
          >
            {totalBalance}
          </p>
        </div>

        <div className="absolute left-[24px] top-[207px] w-[270px]">
          <PrimaryButton
            variant="withdraw"
            size="sm"
            showDepositIcon
            className="w-full"
            onClick={(e) => {
              e.stopPropagation()
              handleWithdraw()
            }}
          >
            Withdraw
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

