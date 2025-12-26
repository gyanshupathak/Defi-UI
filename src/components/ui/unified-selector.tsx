"use client"

import * as React from "react"
import Image from "next/image"
import { Check, ChevronDown } from "lucide-react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { cn } from "@/lib/utils"
import { useAnalytics } from "@/lib/hooks/use-analytics"
import type { VaultConfig } from "@/lib/config/vault-config"
import { getNetworkImage, getTokenImage, NETWORK_IMAGE_FALLBACKS, TOKEN_IMAGE_FALLBACKS } from "@/lib/utils/vault-images"

export type Network = "Base" | "Ethereum" | "Arbitrum" | "Katana" | "HyperEVM"
export type BridgeToken = "syUSD" | "syETH" | "syBTC" | "syHLP" | "USDC" | "USDS" | "SUSD"

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
  { id: "Base", name: "Base", icon: NETWORK_IMAGE_FALLBACKS["Base"] },
  { id: "Ethereum", name: "Ethereum", icon: NETWORK_IMAGE_FALLBACKS["Ethereum"] },
  { id: "Arbitrum", name: "Arbitrum", icon: NETWORK_IMAGE_FALLBACKS["Arbitrum"] }, 
  { id: "Katana", name: "Katana", icon: NETWORK_IMAGE_FALLBACKS["Katana"] },
  { id: "HyperEVM", name: "HyperEVM", icon: NETWORK_IMAGE_FALLBACKS["HyperEVM"] },
]

const YIELDS_TOKENS: BridgeTokenOption[] = [
  { id: "syUSD", name: "syUSD", icon: "/images/icons/USD-stable.svg", category: "yields" },
  { id: "syETH", name: "syETH", icon: "/images/icons/ETH-stable.svg", category: "yields" },
  { id: "syBTC", name: "syBTC", icon: "/images/icons/BTC Stable (1).svg", category: "yields" },
  { id: "syHLP", name: "syHLP", icon: "/images/icons/syHLP.svg", category: "yields" },
]

const ASSETS_TOKENS: BridgeTokenOption[] = [
  { id: "USDC", name: "USDC", icon: "/images/icons/USD-stable.svg", category: "assets" },
  { id: "USDS", name: "USDS", icon: "/images/icons/USD-stable.svg", category: "assets" },
  { id: "SUSD", name: "SUSD", icon: "/images/icons/USD-stable.svg", category: "assets" },
]

const ALL_TOKENS: BridgeTokenOption[] = [...YIELDS_TOKENS, ...ASSETS_TOKENS]


type UnifiedSelectorType = "network" | "token"

interface UnifiedSelectorProps {
  type: UnifiedSelectorType
  selectedValue: Network | BridgeToken | null | undefined
  onValueChange?: (value: Network | BridgeToken | null) => void
  className?: string
  label?: string
  disabled?: boolean
  placeholder?: string
  tokenFilter?: "all" | "yields-only"
  location?: string // For analytics tracking (e.g., "deposit_page", "bridge_page")
  vaultConfig?: VaultConfig | null // Optional vault config to get images from
  allowedNetworks?: Network[] // Optional array of allowed networks (for filtering)
}

export function UnifiedSelector({
  type,
  selectedValue,
  onValueChange,
  className,
  label,
  disabled = false,
  placeholder = "Select",
  tokenFilter = "all",
  location = "unknown",
  vaultConfig,
  allowedNetworks,
}: UnifiedSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)
  const [imageErrors, setImageErrors] = React.useState<Set<string>>(new Set())
  const { analytics } = useAnalytics()
  const previousValueRef = React.useRef<Network | BridgeToken | null | undefined>(selectedValue)

  // Get options with images from config if available
  const networksWithConfigImages = React.useMemo(() => {
    let networks = NETWORKS.map(network => ({
      ...network,
      icon: getNetworkImage(
        vaultConfig,
        network.name,
        network.icon
      ),
    }))
    
    // Filter networks if allowedNetworks is provided
    if (allowedNetworks && allowedNetworks.length > 0) {
      networks = networks.filter(network => allowedNetworks.includes(network.id))
    }
    
    return networks
  }, [vaultConfig, allowedNetworks])

  const yieldsTokensWithConfigImages = React.useMemo(() => {
    return YIELDS_TOKENS.map(token => ({
      ...token,
      icon: getTokenImage(
        vaultConfig,
        token.id,
        undefined, // Search all networks
        token.icon
      ),
    }))
  }, [vaultConfig])

  const assetsTokensWithConfigImages = React.useMemo(() => {
    return ASSETS_TOKENS.map(token => ({
      ...token,
      icon: getTokenImage(
        vaultConfig,
        token.id,
        undefined, // Search all networks
        token.icon
      ),
    }))
  }, [vaultConfig])

  const tokenOptions = tokenFilter === "yields-only" 
    ? yieldsTokensWithConfigImages 
    : [...yieldsTokensWithConfigImages, ...assetsTokensWithConfigImages]
  const options = type === "network" ? networksWithConfigImages : tokenOptions
  const selectedOption = selectedValue ? options.find(opt => opt.id === selectedValue) : null

  // Get the actual icon to display (use fallback if image failed to load)
  const getDisplayIcon = (optionId: string, originalIcon: string): string => {
    if (imageErrors.has(optionId)) {
      // Use fallback based on type
      if (type === "network") {
        return NETWORK_IMAGE_FALLBACKS[optionId] || NETWORK_IMAGE_FALLBACKS["Base"]
      } else {
        return TOKEN_IMAGE_FALLBACKS[optionId] || originalIcon
      }
    }
    return originalIcon
  }

  const handleImageError = (optionId: string) => {
    setImageErrors(prev => new Set(prev).add(optionId))
  }

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

  // Reset image errors when selected value or config changes
  React.useEffect(() => {
    setImageErrors(new Set())
  }, [selectedValue, vaultConfig])

  // Track selector changes
  React.useEffect(() => {
    const previousValue = previousValueRef.current
    if (previousValue !== selectedValue && previousValue !== null && previousValue !== undefined && selectedValue !== null && selectedValue !== undefined) {
      analytics.selectorChanged(
        type,
        previousValue.toString(),
        selectedValue.toString(),
        location
      )
    }
    previousValueRef.current = selectedValue
  }, [selectedValue, type, location, analytics])

  const handleSelect = (value: Network | BridgeToken) => {
    onValueChange?.(value)
    setIsOpen(false)
  }

  const handleSelectorClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!disabled) {
      // Track selector click
      analytics.selectorClicked(type, location)
      setIsOpen(!isOpen)
    }
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
        onClick={handleSelectorClick}
        disabled={disabled}
        aria-expanded={isOpen}
        className={cn(
          "flex items-center gap-[8px] rounded-[99px] shrink-0 transition-all relative z-10",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:scale-95 cursor-pointer"
        )}
        style={{ 
          backgroundColor: designTokens.colors.background.main,
          boxShadow: isOpen ? designTokens.shadows.inputInset : designTokens.shadows.tokenBadge,
          height: "28px",
          paddingLeft: "8px",
          paddingRight: "8px",
          paddingTop: "6px",
          paddingBottom: "6px",
        }}
      >
        {selectedOption && (
          <div className={cn(
            "relative shrink-0",
            type === "network" ? "size-[16px]" : "w-[16px] h-[16px]"
          )}>
            <Image
              src={getDisplayIcon(selectedOption.id, selectedOption.icon)}
              alt={selectedOption.name}
              width={16}
              height={16}
              className={type === "network" ? "object-cover w-full h-full" : "object-contain w-full h-full"}
              onError={() => handleImageError(selectedOption.id)}
            />
          </div>
        )}
        <p 
          className="font-normal text-[12px] leading-normal font-sans"
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
            style={{ color: designTokens.colors.text.secondary, opacity: 0.6 }}
          />
        </div>
      </button>

      {isOpen && !disabled && (
        <div
          role="listbox"
          className="absolute top-full right-0 mt-3 z-50 rounded-bl-[12px] rounded-br-[12px] rounded-tr-[12px]"
          style={{
            backgroundColor: designTokens.colors.background.main,
            boxShadow: designTokens.shadows.dropdown,
            minWidth: type === "network" ? "180px" : "180px",
            width: type === "network" ? "180px" : "180px",
            paddingTop: "16px",
            paddingBottom: "16px",
            paddingLeft: "16px",
            paddingRight: "16px",
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
                    height: '36px',
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
                        src={getDisplayIcon(option.id, option.icon)}
                        alt={option.name}
                        width={20}
                        height={20}
                        className="object-cover w-full h-full"
                        onError={() => handleImageError(option.id)}
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
            <div className="flex flex-col gap-[12px]">
              <div className="flex flex-col gap-[12px]">
                {tokenFilter === "all" && (
                  <p
                    className="font-semibold text-[12px] leading-normal font-sans"
                    style={{ color: designTokens.colors.text.secondary }}
                  >
                    Yields
                  </p>
                )}
                <div className="flex flex-col gap-[12px]">
                  {yieldsTokensWithConfigImages.map((option) => (
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
                        height: '36px',
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
                            src={getDisplayIcon(option.id, option.icon)}
                            alt={option.name}
                            width={20}
                            height={20}
                            className="object-contain w-full h-full"
                            onError={() => handleImageError(option.id)}
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
              {tokenFilter === "all" && (
                <div className="flex flex-col gap-[12px]">
                  <p
                    className="font-semibold text-[12px] leading-normal font-sans"
                    style={{ color: designTokens.colors.text.secondary }}
                  >
                    Assets
                  </p>
                  <div className="flex flex-col gap-[12px]">
                    {assetsTokensWithConfigImages.map((option) => (
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
                        height: '36px',
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
                            src={getDisplayIcon(option.id, option.icon)}
                            alt={option.name}
                            width={20}
                            height={20}
                            className="object-contain w-full h-full"
                            onError={() => handleImageError(option.id)}
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

