"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { designTokens, typographyClasses, shadows, getPnlColor } from "@/lib/design-system"
import { AnimatedNumber } from "@/components/animations"
import { useAnalytics } from "@/lib/hooks/use-analytics"

const { popIn, popInHover } = shadows
import { Button } from "@/components/ui/button"

export interface PortfolioStrategyCardProps {
  name: string
  symbol: string
  pnl: number 
  totalBalance: string
  variant: "usd" | "eth" | "btc" | "hlp"
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
  hlp: {
    color: designTokens.colors.strategy.hlp,
    name: "Stable Yield HLP",
    icon: "/images/icons/syHLP.svg",
  },
}

// Helper function to check if a string is a valid URL
function isValidUrl(url: string): boolean {
  if (!url || url.trim() === '') return false
  // Check for placeholder values
  if (url.toUpperCase() === 'CDN_URL' || url === 'CDN_URL') return false
  // Check if it's a valid URL (starts with http:// or https://) or relative path (starts with /)
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      new URL(url)
      return true
    }
    if (url.startsWith('/')) {
      return true
    }
    return false
  } catch {
    return false
  }
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
  const { analytics } = useAnalytics()
  const config = strategyConfig[variant]
  // Use tokenIcon from API if it's a valid URL, otherwise fall back to variant-based icon
  const initialIcon = (tokenIcon && isValidUrl(tokenIcon)) ? tokenIcon : config.icon
  const [icon, setIcon] = React.useState(initialIcon)
  const isPositive = pnl >= 0
  const pnlColor = getPnlColor(pnl)
  const pnlSign = pnl >= 0 ? '+' : ''
  const [isHovered, setIsHovered] = React.useState(false)
  
  // Reset icon if tokenIcon changes and is valid
  React.useEffect(() => {
    if (tokenIcon && isValidUrl(tokenIcon)) {
      setIcon(tokenIcon)
    } else {
      setIcon(config.icon)
    }
  }, [tokenIcon, config.icon])
  
  // Handle image loading error - fallback to config icon
  const handleImageError = () => {
    setIcon(config.icon)
  }

  const handleCardClick = () => {
    analytics.portfolioStrategyCardClicked(symbol)
  }

  const handleWithdraw = (e: React.MouseEvent) => {
    e.stopPropagation()
    analytics.portfolioWithdrawButtonClicked(symbol, 'portfolio_strategy_card')
    router.push(`/withdraw?variant=${variant}`)
  }

  return (
    <div 
      className={cn("relative w-[318px] cursor-pointer", className)}
      style={{ height: '267px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
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
              onError={handleImageError}
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
              <AnimatedNumber value={Math.abs(pnl)} decimals={2} suffix="%" delay={0.1} duration={1.2} />
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
          <Button
            variant={variant === "usd" ? "withdraw" : "default"}
            size="sm"
            showWithdrawIcon
            className="w-full"
            bgColor={
              variant === "eth" 
                ? "rgba(98, 126, 234, 0.15)" 
                : variant === "btc" 
                ? "rgba(247, 147, 26, 0.15)"
                : variant === "hlp"
                ? "rgba(37, 153, 82, 0.15)"
                : undefined
            }
            textColor={
              variant === "eth" 
                ? "rgba(98, 126, 234, 1)" 
                : variant === "btc" 
                ? "rgba(247, 147, 26, 1)"
                : variant === "hlp"
                ? "rgba(37, 153, 82, 1)"
                : undefined
            }
            onClick={handleWithdraw}
          >
            Withdraw
          </Button>
        </div>
      </div>
    </div>
  )
}
