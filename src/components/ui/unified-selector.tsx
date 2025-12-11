"use client"

import * as React from "react"
import Image from "next/image"
import { Check, ChevronDown } from "lucide-react"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"
import { cn } from "@/lib/utils"

export type Network = "Base" | "Ethereum" | "Arbitrum" | "Katana"
export type BridgeToken = "syUSD" | "syETH" | "syBTC" | "USDC" | "USDS" | "SUSD"

export interface NetworkOption {
  id: Network
  name: string
  icon: string
}

export interface BridgeTokenOption {
  id: BridgeToken
  name: string
  icon: string
  category?: "yields" | "assets"
}

const NETWORKS: NetworkOption[] = [
  { id: "Base", name: "Base", icon: "/images/icons/base.png" },
  { id: "Ethereum", name: "Ethereum", icon: "/images/icons/eth.svg" },
  { id: "Arbitrum", name: "Arbitrum", icon: "/images/icons/base.png" }, 
  { id: "Katana", name: "Katana", icon: "/images/icons/katana.png" },
]

const YIELDS_TOKENS: BridgeTokenOption[] = [
  { id: "syUSD", name: "syUSD", icon: "/images/icons/USD-stable.svg", category: "yields" },
  { id: "syETH", name: "syETH", icon: "/images/icons/ETH-stable.svg", category: "yields" },
  { id: "syBTC", name: "syBTC", icon: "/images/icons/BTC Stable (1).svg", category: "yields" },
]

const ASSETS_TOKENS: BridgeTokenOption[] = [
  { id: "USDC", name: "USDC", icon: "/images/icons/USD-stable.svg", category: "assets" },
  { id: "USDS", name: "USDS", icon: "/images/icons/USD-stable.svg", category: "assets" },
  { id: "SUSD", name: "SUSD", icon: "/images/icons/USD-stable.svg", category: "assets" },
]

const ALL_TOKENS: BridgeTokenOption[] = [...YIELDS_TOKENS, ...ASSETS_TOKENS]

const NEUMORPHIC_INSET_SHADOW =
  "inset 2px 2px 4px 0px rgba(0,0,0,0.08), inset -2px -2px 4px 0px #ffffff"

type UnifiedSelectorType = "network" | "token"

interface UnifiedSelectorProps {
  type: UnifiedSelectorType
  selectedValue: Network | BridgeToken | null | undefined
  onValueChange?: (value: Network | BridgeToken | null) => void
  className?: string
  label?: string
  disabled?: boolean
  placeholder?: string
  tokenFilter?: "all" | "yields-only" // Controls token display: "all" shows all 6 tokens, "yields-only" shows only yields (syUSD, syETH, syBTC)
}

/**
 * UnifiedSelector Component
 * 
 * A unified dropdown selector that can handle both network and token selection.
 * Uses the same dropdown menu design as the base APY tab dropdown (DropdownSelector).
 * 
 * Supports:
 * - Network selection: Base, Ethereum, Arbitrum, Katana
 * - Token selection: 
 *   - Yields: syUSD, syETH, syBTC
 *   - Assets: USDC, USDS, SUSD
 */
export function UnifiedSelector({
  type,
  selectedValue,
  onValueChange,
  className,
  label,
  disabled = false,
  placeholder = "Select",
  tokenFilter = "all",
}: UnifiedSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)

  const tokenOptions = tokenFilter === "yields-only" ? YIELDS_TOKENS : ALL_TOKENS
  const options = type === "network" ? NETWORKS : tokenOptions
  const selectedOption = selectedValue ? options.find(opt => opt.id === selectedValue) : null

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const handleSelect = (value: Network | BridgeToken) => {
    onValueChange?.(value)
    setIsOpen(false)
  }

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {label && (
        <div className="flex gap-[8px] items-center mb-[8px]">
          <p 
            className={typographyClasses.label1}
            style={{ 
              color: designTokens.colors.text.primary,
              opacity: 0.5,
            }}
          >
            {label}
          </p>
        </div>
      )}
      
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          if (!disabled) {
            setIsOpen(!isOpen)
          }
        }}
        disabled={disabled}
        aria-expanded={isOpen}
        className={cn(
          "flex items-center gap-[8px] px-[12px] py-[8px] rounded-[99px] shrink-0 transition-all relative z-10",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:scale-95 cursor-pointer"
        )}
        style={{ 
          backgroundColor: designTokens.colors.background.main,
          boxShadow: isOpen ? NEUMORPHIC_INSET_SHADOW : shadows.tokenBadge
        }}
      >
        {selectedOption && (
          <div className={cn(
            "relative shrink-0",
            type === "network" ? "size-[16px]" : "w-[16px] h-[16px]"
          )}>
            <Image
              src={selectedOption.icon}
              alt={selectedOption.name}
              width={16}
              height={16}
              className={type === "network" ? "object-cover w-full h-full" : "object-contain w-full h-full"}
            />
          </div>
        )}
        <p 
          className="font-normal text-[14px] leading-normal font-sans"
          style={{ 
            color: selectedOption ? designTokens.colors.text.primary : designTokens.colors.text.muted,
            fontWeight: 600
          }}
        >
          {selectedOption ? selectedOption.name : placeholder}
        </p>
        <div className="flex items-center justify-center relative shrink-0 size-[12px]">
          <ChevronDown 
            size={12} 
            className={cn(
              "transition-transform",
              isOpen && "rotate-180"
            )}
            color="#9c9da2"
            style={{ opacity: 0.6 }}
          />
        </div>
      </button>

      {isOpen && !disabled && (
        <div
          role="listbox"
          className="absolute top-full right-0 mt-2 z-50 rounded-bl-[12px] rounded-br-[12px] rounded-tr-[12px]"
          style={{
            backgroundColor: designTokens.colors.background.main,
            boxShadow: '4px 4px 8px 0px rgba(0,0,0,0.08), -4px -4px 8px 0px #ffffff',
            minWidth: type === "network" ? "180px" : "180px",
            width: type === "network" ? "180px" : "180px",
            padding: '16px',
          }}
        >
          {type === "network" ? (
            <div className="flex flex-col gap-[8px]">
              {options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelect(option.id as Network | BridgeToken)
                  }}
                  onMouseEnter={() => setHoveredId(option.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  role="option"
                  aria-selected={selectedValue === option.id}
                  className={cn(
                    "relative w-full flex items-center rounded-[99px] transition-all cursor-pointer"
                  )}
                  style={{
                    paddingLeft: '8px',
                    paddingRight: '8px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    backgroundColor:
                      hoveredId === option.id
                        ? designTokens.colors.background.gradient
                        : "transparent",
                  }}
                >
                  <div className="flex items-center gap-[8px] min-w-0 flex-1">
                    <div className="flex items-center justify-center shrink-0 size-[20px]">
                      <Image
                        src={option.icon}
                        alt={option.name}
                        width={20}
                        height={20}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <p
                      className={cn(
                        "text-[16px] leading-[20px] font-sans",
                        selectedValue === option.id || hoveredId === option.id ? "font-medium" : "font-normal"
                      )}
                      style={{
                        color: designTokens.colors.text.primary,
                        opacity: selectedValue === option.id || hoveredId === option.id ? 1 : 0.8,
                      }}
                    >
                      {option.name}
                    </p>
                  </div>
                  {selectedValue === option.id && (
                    <div className="absolute right-[8px] shrink-0">
                      <Check
                        size={12}
                        strokeWidth={2}
                        style={{ color: designTokens.colors.status.success }}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-[8px]">
              {/* Yields Section */}
              <div className="flex flex-col gap-[8px]">
                {tokenFilter === "all" && (
                  <p
                    className="font-semibold text-[12px] leading-normal font-sans"
                    style={{ color: "#9c9da2" }}
                  >
                    Yields
                  </p>
                )}
                <div className="flex flex-col gap-[8px]">
                  {YIELDS_TOKENS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelect(option.id as Network | BridgeToken)
                      }}
                      onMouseEnter={() => setHoveredId(option.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      role="option"
                      aria-selected={selectedValue === option.id}
                      className={cn(
                        "relative w-full flex items-center rounded-[99px] transition-all cursor-pointer"
                      )}
                      style={{
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        backgroundColor:
                          hoveredId === option.id
                            ? designTokens.colors.background.gradient
                            : "transparent",
                      }}
                    >
                      <div className="flex items-center gap-[8px] min-w-0 flex-1">
                        <div className="flex items-center justify-center shrink-0 w-[20px] h-[20px]">
                          <Image
                            src={option.icon}
                            alt={option.name}
                            width={20}
                            height={20}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <p
                          className={cn(
                            "text-[16px] leading-[20px] font-sans",
                            selectedValue === option.id || hoveredId === option.id ? "font-medium" : "font-normal"
                          )}
                          style={{
                            color: designTokens.colors.text.primary,
                            opacity: selectedValue === option.id || hoveredId === option.id ? 1 : 0.8,
                          }}
                        >
                          {option.name}
                        </p>
                      </div>
                      {selectedValue === option.id && (
                        <div className="absolute right-[8px] shrink-0">
                          <Check
                            size={12}
                            strokeWidth={2}
                            style={{ color: designTokens.colors.status.success }}
                          />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assets Section - Only show if tokenFilter is "all" */}
              {tokenFilter === "all" && (
                <div className="flex flex-col gap-[8px]">
                  <p
                    className="font-semibold text-[12px] leading-normal font-sans"
                    style={{ color: "#9c9da2" }}
                  >
                    Assets
                  </p>
                  <div className="flex flex-col gap-[8px]">
                    {ASSETS_TOKENS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelect(option.id as Network | BridgeToken)
                      }}
                      onMouseEnter={() => setHoveredId(option.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      role="option"
                      aria-selected={selectedValue === option.id}
                      className={cn(
                        "relative w-full flex items-center rounded-[99px] transition-all cursor-pointer"
                      )}
                      style={{
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        backgroundColor:
                          hoveredId === option.id
                            ? designTokens.colors.background.gradient
                            : "transparent",
                      }}
                    >
                      <div className="flex items-center gap-[8px] min-w-0 flex-1">
                        <div className="flex items-center justify-center shrink-0 w-[20px] h-[20px]">
                          <Image
                            src={option.icon}
                            alt={option.name}
                            width={20}
                            height={20}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <p
                          className={cn(
                            "text-[16px] leading-[20px] font-sans",
                            selectedValue === option.id || hoveredId === option.id ? "font-medium" : "font-normal"
                          )}
                          style={{
                            color: designTokens.colors.text.primary,
                            opacity: selectedValue === option.id || hoveredId === option.id ? 1 : 0.8,
                          }}
                        >
                          {option.name}
                        </p>
                      </div>
                      {selectedValue === option.id && (
                        <div className="absolute right-[8px] shrink-0">
                          <Check
                            size={12}
                            strokeWidth={2}
                            style={{ color: designTokens.colors.status.success }}
                          />
                        </div>
                      )}
                    </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

