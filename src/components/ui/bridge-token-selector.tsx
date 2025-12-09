"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"
import { cn } from "@/lib/utils"

export type BridgeToken = "syUSD" | "syETH" | "syBTC"

export interface BridgeTokenOption {
  id: BridgeToken
  name: string
  icon: string
}

const BRIDGE_TOKENS: BridgeTokenOption[] = [
  { id: "syUSD", name: "syUSD", icon: "/images/icons/USD-stable.svg" },
  { id: "syETH", name: "syETH", icon: "/images/icons/ETH-stable.svg" },
  { id: "syBTC", name: "syBTC", icon: "/images/icons/BTC Stable (1).svg" },
]

interface BridgeTokenSelectorProps {
  selectedToken: BridgeToken
  onTokenChange?: (token: BridgeToken) => void
  className?: string
  /** Disable the selector */
  disabled?: boolean
}

/**
 * BridgeTokenSelector Component
 * 
 * A neumorphic dropdown selector for choosing bridge tokens.
 * Displays the selected token with icon and opens a dropdown menu with all available tokens.
 * 
 * Tokens: syUSD, syETH, syBTC
 */
export function BridgeTokenSelector({
  selectedToken,
  onTokenChange,
  className,
  disabled = false,
}: BridgeTokenSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Get selected token details
  const selectedTokenData = BRIDGE_TOKENS.find(token => token.id === selectedToken) || BRIDGE_TOKENS[0]

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleTokenSelect = (token: BridgeToken) => {
    onTokenChange?.(token)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          if (!disabled) {
            setIsOpen(!isOpen)
          }
        }}
        disabled={disabled}
        className={cn(
          "flex items-center gap-[8px] px-[8px] py-[6px] rounded-[99px] transition-all relative z-10",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:scale-95 cursor-pointer"
        )}
        style={{ 
          backgroundColor: designTokens.colors.background.main,
          boxShadow: shadows.tokenBadge
        }}
      >
        <div className="flex items-end justify-end relative w-[16px] h-[16px] shrink-0">
          <Image
            src={selectedTokenData.icon}
            alt={selectedTokenData.name}
            width={16}
            height={16}
            className="object-contain w-full h-full"
          />
        </div>
        <p 
          className={typographyClasses.label1}
          style={{ color: designTokens.colors.text.primary }}
        >
          {selectedTokenData.name}
        </p>
        <div className="flex items-center justify-center relative shrink-0 size-[12px]">
          <ChevronDown 
            size={12} 
            className={cn(
              "transition-transform",
              isOpen && "rotate-180"
            )}
            style={{ opacity: 0.5 }}
          />
        </div>
      </button>

      {/* Dropdown Menu - Opens below button, appears above all elements */}
      {isOpen && !disabled && (
        <div
          className="absolute top-full left-0 mt-[8px] min-w-[120px] rounded-[12px] overflow-hidden z-[9999] border border-solid"
          style={{
            backgroundColor: designTokens.colors.background.main,
            borderColor: designTokens.colors.border.separator,
            boxShadow: shadows.dropdown
          }}
        >
          {BRIDGE_TOKENS.map((token) => (
            <button
              key={token.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleTokenSelect(token.id)
              }}
              className={cn(
                "w-full flex items-center gap-[8px] px-[12px] py-[10px] transition-all text-left border-none cursor-pointer",
                selectedToken === token.id 
                  ? "opacity-100" 
                  : "hover:opacity-80"
              )}
              style={{
                backgroundColor: selectedToken === token.id 
                  ? `${designTokens.colors.primary}20` 
                  : 'transparent'
              }}
            >
              <div className="flex items-end justify-end relative w-[16px] h-[16px] shrink-0">
                <Image
                  src={token.icon}
                  alt={token.name}
                  width={16}
                  height={16}
                  className="object-contain w-full h-full"
                />
              </div>
              <p 
                className={cn(typographyClasses.label1, "flex-1")}
                style={{ color: designTokens.colors.text.primary }}
              >
                {token.name}
              </p>
              {selectedToken === token.id && (
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
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

