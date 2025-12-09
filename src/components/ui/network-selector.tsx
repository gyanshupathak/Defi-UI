"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"
import { cn } from "@/lib/utils"

export type Network = "Base" | "Ethereum" | "Arbitrum" | "Katana"

export interface NetworkOption {
  id: Network
  name: string
  icon: string
}

const NETWORKS: NetworkOption[] = [
  { id: "Base", name: "Base", icon: "/images/icons/base.png" },
  { id: "Ethereum", name: "Ethereum", icon: "/images/icons/eth.svg" },
  { id: "Arbitrum", name: "Arbitrum", icon: "/images/icons/base.png" }, // TODO: Add Arbitrum icon
  { id: "Katana", name: "Katana", icon: "/images/icons/katana.png" },
]

interface NetworkSelectorProps {
  selectedNetwork: Network
  onNetworkChange?: (network: Network) => void
  className?: string
  /** Show label above selector */
  label?: string
  /** Disable the selector */
  disabled?: boolean
}

/**
 * NetworkSelector Component
 * 
 * A neumorphic dropdown selector for choosing blockchain networks.
 * Displays the selected network with icon and opens a dropdown menu with all available networks.
 * 
 * Networks: Base, Ethereum, Arbitrum, Katana
 */
export function NetworkSelector({
  selectedNetwork,
  onNetworkChange,
  className,
  label,
  disabled = false,
}: NetworkSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const selectedNetworkData = NETWORKS.find((n) => n.id === selectedNetwork) || NETWORKS[0]

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const handleSelect = (network: Network) => {
    onNetworkChange?.(network)
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
        className={cn(
          "flex items-center gap-[8px] px-[8px] py-[6px] rounded-[99px] shrink-0 transition-all relative z-10",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:scale-95 cursor-pointer"
        )}
        style={{ 
          backgroundColor: designTokens.colors.background.main,
          boxShadow: shadows.tokenBadge
        }}
      >
        <div className="relative shrink-0 size-[16px]">
          <Image
            src={selectedNetworkData.icon}
            alt={selectedNetworkData.name}
            width={16}
            height={16}
            className="object-cover w-full h-full"
          />
        </div>
        <p 
          className={typographyClasses.label1}
          style={{ color: designTokens.colors.text.primary }}
        >
          {selectedNetworkData.name}
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
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-[4px] rounded-[8px] border border-solid overflow-hidden z-[9999]"
          style={{
            backgroundColor: designTokens.colors.background.main,
            borderColor: designTokens.colors.border.separator,
            boxShadow: shadows.dropdown,
            minWidth: '140px'
          }}
        >
          {NETWORKS.map((network) => (
            <button
              key={network.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleSelect(network.id)
              }}
              className={cn(
                "w-full flex items-center gap-[8px] px-[12px] py-[8px] transition-colors text-left border-none",
                selectedNetwork === network.id 
                  ? "bg-opacity-10" 
                  : "hover:bg-opacity-5"
              )}
              style={{
                backgroundColor: selectedNetwork === network.id 
                  ? `${designTokens.colors.primary}20` 
                  : 'transparent',
              }}
            >
              <div className="relative shrink-0 size-[16px]">
                <Image
                  src={network.icon}
                  alt={network.name}
                  width={16}
                  height={16}
                  className="object-cover w-full h-full"
                />
              </div>
              <p 
                className={cn(typographyClasses.label1, "flex-1")}
                style={{ color: designTokens.colors.text.primary }}
              >
                {network.name}
              </p>
              {selectedNetwork === network.id && (
                <div 
                  className="size-[6px] rounded-full"
                  style={{ backgroundColor: designTokens.colors.primary }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

