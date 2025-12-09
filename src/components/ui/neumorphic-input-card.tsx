"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { designTokens, typographyClasses } from "@/lib/design-system"

export interface InsetContainerConfig {
  /**
   * Top position of the inner inset container
   */
  top: number
  /**
   * Height of the inner inset container
   */
  height: number
  /**
   * Width of the inner inset container (default: cardWidth - 24px)
   */
  width?: number
}

export interface NeumorphicInputCardProps {
  /**
   * Height of the outer card in pixels
   */
  height: number
  /**
   * Width of the outer card in pixels
   * @default 400
   */
  width?: number
  /**
   * Label text for the header
   */
  label: string
  /**
   * Optional component to render on the right side of the header
   * (e.g., NetworkSelector, TokenSelector, badge)
   */
  rightElement?: React.ReactNode
  /**
   * Configuration for inner inset container(s)
   * Can be a single config or array of configs for multiple containers
   */
  insetContainers: InsetContainerConfig | InsetContainerConfig[]
  /**
   * Children content to render inside the card
   */
  children: React.ReactNode
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * NeumorphicInputCard Component
 * 
 * A reusable card component with neumorphic styling used for input forms.
 * Used in deposit, withdrawal, and bridge pages.
 * 
 * Features:
 * - Outer card with neumorphic shadow
 * - Header section with label and optional right element
 * - One or more inner containers with inset shadows (for input areas)
 * - Flexible content via children prop
 * - Configurable dimensions and positioning
 * 
 * @example
 * // Single inset container (deposit/withdraw)
 * <NeumorphicInputCard
 *   height={189}
 *   label="Deposit assets from"
 *   rightElement={<NetworkSelector />}
 *   insetContainers={{ top: 52, height: 125 }}
 * >
 *   <input />
 *   <CircularPercentageSelector />
 * </NeumorphicInputCard>
 * 
 * @example
 * // Multiple inset containers (bridge)
 * <NeumorphicInputCard
 *   height={325}
 *   width={426}
 *   label="Bridge"
 *   rightElement={<BridgeTokenSelector />}
 *   insetContainers={[
 *     { top: 52, height: 96 },
 *     { top: 160, height: 125 }
 *   ]}
 * >
 *   <NetworkSelectors />
 *   <AmountInput />
 * </NeumorphicInputCard>
 */
export function NeumorphicInputCard({
  height,
  width = 400,
  label,
  rightElement,
  insetContainers,
  children,
  className,
}: NeumorphicInputCardProps) {
  // Normalize insetContainers to array for consistent handling
  const containers = Array.isArray(insetContainers) ? insetContainers : [insetContainers]
  
  // Calculate default inner container width (24px padding = 12px each side)
  const defaultInnerWidth = width - 24

  return (
    <div 
      className={cn("relative rounded-[16px]", className)}
      style={{ 
        height: `${height}px`,
        width: `${width}px`,
      }}
    >
      {/* Card Background - Outer Shadow */}
      <div 
        className="absolute left-1/2 top-0 -translate-x-1/2 rounded-[16px]"
        style={{ 
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: designTokens.colors.background.main,
          boxShadow: '4px 4px 12px 0px rgba(0,0,0,0.1), -4px -4px 12px 0px #ffffff'
        }}
      />

      {/* Header Section */}
      <div 
        className="absolute left-[24px] top-[12px] flex items-center justify-between"
        style={{ 
          width: `${width - 48}px` // 24px padding on each side
        }}
      >
        <p 
          className={typographyClasses.label1}
          style={{ 
            color: designTokens.colors.text.primary,
            opacity: 0.5
          }}
        >
          {label}
        </p>
        {rightElement && (
          <div className="flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {/* Inner Inset Container(s) */}
      {containers.map((container, index) => (
        <div
          key={index}
          className="absolute left-1/2 -translate-x-1/2 rounded-[16px]"
          style={{ 
            top: `${container.top}px`,
            height: `${container.height}px`,
            width: `${container.width || defaultInnerWidth}px`,
            backgroundColor: designTokens.colors.background.main,
            boxShadow: 'inset 4px 4px 6px 0px rgba(0,0,0,0.08), inset -4px -4px 6px 0px #ffffff'
          }}
        />
      ))}

      {/* Content - Positioned relatively for absolute children */}
      <div className="relative w-full h-full">
        {children}
      </div>
    </div>
  )
}

