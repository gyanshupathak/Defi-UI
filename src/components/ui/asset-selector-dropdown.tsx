"use client"

import * as React from "react"
import Image from "next/image"
import { Check, ChevronDown } from "lucide-react"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"
import { cn } from "@/lib/utils"

export type AssetType = string

export interface AssetOption {
  id: AssetType
  label: string
  icon: string
  category?: "yields" | "assets" | string
}

const YIELD_ASSETS: AssetOption[] = [
  { id: "syUSD", label: "syUSD", icon: "/images/icons/USD-stable.svg", category: "yields" },
  { id: "syETH", label: "syETH", icon: "/images/icons/ETH-stable.svg", category: "yields" },
  { id: "syBTC", label: "syBTC", icon: "/images/icons/BTC Stable (1).svg", category: "yields" },
]

const BASE_ASSETS: AssetOption[] = [
  { id: "USDC", label: "USDC", icon: "/images/icons/USD-stable.svg", category: "assets" },
  { id: "USDS", label: "USDS", icon: "/images/icons/USD-stable.svg", category: "assets" },
  { id: "SUSD", label: "SUSD", icon: "/images/icons/USD-stable.svg", category: "assets" },
]

interface AssetSelectorDropdownProps {
  selectedAsset?: AssetType | null
  onAssetChange?: (asset: AssetType | null) => void
  className?: string
  disabled?: boolean
  
  showAllOption?: boolean
  
  assets?: AssetOption[]
}

/**
 * AssetSelectorDropdown Component
 * 
 * A dropdown selector for choosing assets, organized into "Yields" and "Assets" sections.
 * Matches the Figma design with icons, checkmarks, and proper styling.
 */
export function AssetSelectorDropdown({
  selectedAsset,
  onAssetChange,
  className,
  disabled = false,
  showAllOption = false,
  assets,
}: AssetSelectorDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [hoveredId, setHoveredId] = React.useState<AssetType | null>(null)

  const allAssets = React.useMemo(() => {
    const source = assets && assets.length > 0 ? assets : [...YIELD_ASSETS, ...BASE_ASSETS]
    const grouped = {
      yields: source.filter((asset) => asset.category === "yields"),
      assets: source.filter((asset) => asset.category !== "yields"),
    }

    return grouped
  }, [assets])

  const selectedAssetData = selectedAsset
    ? [...(assets || []), ...YIELD_ASSETS, ...BASE_ASSETS].find(asset => asset.id === selectedAsset)
    : null

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

  const handleAssetSelect = (asset: AssetType | null) => {
    
    const newAsset = selectedAsset === asset ? null : asset
    onAssetChange?.(newAsset)
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
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          "relative flex items-center justify-center border border-solid rounded-[99px] transition-opacity bg-transparent z-10",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 cursor-pointer"
        )}
        style={{
          height: '24px',
          paddingLeft: '12px',
          paddingRight: '12px',
          paddingTop: '4px',
          paddingBottom: '4px',
          borderColor: designTokens.colors.border.default,
        }}
      >
        <div className="flex items-center gap-[4px]">
          {selectedAssetData ? (
            <>
              <div className="flex items-end justify-end relative shrink-0" style={{ width: '16px', height: '16px' }}>
                <Image
                  src={selectedAssetData.icon}
                  alt={selectedAssetData.label}
                  width={16}
                  height={16}
                  className="object-contain w-full h-full"
                />
              </div>
              <p 
                className={typographyClasses.label1}
                style={{ color: designTokens.colors.text.primary }}
              >
                {selectedAssetData.label}
              </p>
            </>
          ) : (
            <p 
              className={typographyClasses.label1}
              style={{ color: designTokens.colors.text.primary }}
            >
              All Assets
            </p>
          )}
          <div 
            className="opacity-50 flex items-center justify-center"
            style={{ width: '12px', height: '12px' }}
          >
            <ChevronDown 
              size={12} 
              className={cn(
                "transition-transform",
                isOpen && "rotate-180"
              )}
              style={{ color: designTokens.colors.text.primary }}
            />
          </div>
        </div>
      </button>

      {isOpen && !disabled && (
        <div
          role="listbox"
          className="absolute top-full right-0 mt-[8px] z-50 rounded-bl-[12px] rounded-br-[12px] rounded-tr-[12px] overflow-hidden"
          style={{
            backgroundColor: designTokens.colors.background.main,
            boxShadow: shadows.navButton,
            minWidth: "200px",
            padding: '16px',
          }}
        >
          <div className="flex flex-col gap-[8px]">
            {}
            {allAssets.yields.length > 0 && (
              <div className="flex flex-col gap-[8px]">
                <div className="flex items-center">
                  <p 
                    className={typographyClasses.label1}
                    style={{ 
                      color: '#9c9da2',
                      fontWeight: 600,
                    }}
                  >
                    Yields
                  </p>
                </div>
                <div className="flex flex-col">
                  {allAssets.yields.map((asset) => {
                    const isSelected = selectedAsset === asset.id
                    return (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAssetSelect(asset.id)
                        }}
                        onMouseEnter={() => setHoveredId(asset.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        role="option"
                        aria-selected={isSelected}
                        className={cn(
                          "relative w-full flex items-center justify-between rounded-[99px] px-[8px] py-[8px] transition-all cursor-pointer"
                        )}
                        style={{
                          backgroundColor: hoveredId === asset.id ? 'rgba(127, 86, 217, 0.05)' : 'transparent',
                        }}
                      >
                        <div className="flex items-center gap-[8px] min-w-0">
                          <div className="flex items-end justify-end relative shrink-0" style={{ width: '20px', height: '20px' }}>
                            <Image
                              src={asset.icon}
                              alt={asset.label}
                              width={20}
                              height={20}
                              className="object-contain w-full h-full"
                            />
                          </div>
                          <p
                            className="text-[16px] leading-[20px] font-normal font-sans"
                            style={{ 
                              color: designTokens.colors.text.primary,
                              fontWeight: isSelected ? 500 : 400,
                            }}
                          >
                            {asset.label}
                          </p>
                        </div>
                        {isSelected && (
                          <Check
                            size={12}
                            strokeWidth={2.5}
                            style={{ color: designTokens.colors.status.success }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {}
            {allAssets.assets.length > 0 && (
              <div className="flex flex-col gap-[8px]">
                <div className="flex items-center">
                  <p 
                    className={typographyClasses.label1}
                    style={{ 
                      color: '#9c9da2',
                      fontWeight: 600,
                    }}
                  >
                    Assets
                  </p>
                </div>
                <div className="flex flex-col">
                  {allAssets.assets.map((asset) => {
                    const isSelected = selectedAsset === asset.id
                    return (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAssetSelect(asset.id)
                        }}
                        onMouseEnter={() => setHoveredId(asset.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        role="option"
                        aria-selected={isSelected}
                        className={cn(
                          "relative w-full flex items-center gap-[8px] rounded-[99px] px-[8px] py-[8px] transition-all cursor-pointer"
                        )}
                        style={{
                          backgroundColor: hoveredId === asset.id ? 'rgba(127, 86, 217, 0.05)' : 'transparent',
                        }}
                      >
                        <div className="flex items-end justify-end relative shrink-0" style={{ width: '20px', height: '20px' }}>
                          <Image
                            src={asset.icon}
                            alt={asset.label}
                            width={20}
                            height={20}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <p
                          className="text-[16px] leading-normal font-normal font-sans"
                          style={{ 
                            color: designTokens.colors.text.primary,
                            opacity: 0.8,
                          }}
                        >
                          {asset.label}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
