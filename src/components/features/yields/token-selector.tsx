"use client"

import * as React from "react"
import Image from "next/image"
import { designTokens } from "@/lib/design-system"
import clsx from "clsx"
import { useAnalytics } from "@/lib/hooks/use-analytics"

export type TokenType = "usd" | "eth" | "btc" | "hlp"

interface TokenSelectorProps {
  selectedToken: TokenType
  onTokenChange: (token: TokenType) => void
}

const tokens = [
  {
    id: "usd" as TokenType,
    symbol: "syUSD",
    name: "Stable Yield USD",
    icon: "/images/icons/USD-stable.svg",
    color: designTokens.colors.strategy.usd,
  },
  {
    id: "eth" as TokenType,
    symbol: "syETH",
    name: "Stable Yield ETH",
    icon: "/images/icons/ETH-stable.svg",
    color: designTokens.colors.strategy.eth,
  },
  {
    id: "btc" as TokenType,
    symbol: "syBTC",
    name: "Stable Yield BTC",
    icon: "/images/icons/BTC Stable (1).svg",
    color: designTokens.colors.strategy.btc,
  },
]

export function TokenSelector({ selectedToken, onTokenChange }: TokenSelectorProps) {
  const { analytics } = useAnalytics()
  
  const getTokenSymbol = (tokenId: TokenType): string => {
    const token = tokens.find(t => t.id === tokenId)
    return token?.symbol || tokenId
  }

  const handleClick = React.useCallback((tokenId: TokenType, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (tokenId !== selectedToken) {
      // Track token change
      const fromSymbol = getTokenSymbol(selectedToken)
      const toSymbol = getTokenSymbol(tokenId)
      analytics.tokenSelectorChanged(fromSymbol, toSymbol)
      onTokenChange(tokenId);
    }
  }, [onTokenChange, selectedToken, analytics]);

  return (
    <div className="flex items-center gap-2 relative z-50">
      {tokens.map((token) => (
        <button
          key={token.id}
          type="button"
          onClick={(e) => handleClick(token.id, e)}
          className={clsx(
            "relative flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer z-50",
            "border",
            selectedToken === token.id
              ? "border-opacity-100"
              : "border-opacity-30 hover:border-opacity-60"
          )}
          style={{
            backgroundColor: designTokens.colors.background.main,
            borderColor: token.color,
            boxShadow:
              selectedToken === token.id
                ? `3px 3px 6px 0px rgba(127,86,217,0.15), -3px -3px 6px 0px white`
                : `1.5px 1.5px 3px 0px rgba(127,86,217,0.08), -1.5px -1.5px 3px 0px white`,
            pointerEvents: 'auto',
          }}
        >
          <div className="relative w-4 h-4 shrink-0 pointer-events-none">
            <Image
              src={token.icon}
              alt={token.name}
              fill
              className="object-contain pointer-events-none"
            />
          </div>
          <span
            className="font-medium text-xs leading-none pointer-events-none"
            style={{
              color: selectedToken === token.id ? token.color : designTokens.colors.text.primary,
              opacity: selectedToken === token.id ? 1 : 0.6,
            }}
          >
            {token.symbol}
          </span>
        </button>
      ))}
    </div>
  )
}

