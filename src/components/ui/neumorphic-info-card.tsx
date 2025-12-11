"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { designTokens, shadows } from "@/lib/design-system"

export interface NeumorphicInfoCardProps {
  /**
   * Height of the card in pixels
   */
  height: number
  /**
   * Width of the card in pixels
   * @default 356
   */
  width?: number
  /**
   * Whether to show the inner rectangular border
   * @default true
   */
  showInnerBorder?: boolean
  /**
   * Custom shadow for the outer card
   * @default standard neumorphic shadow
   */
  outerShadow?: string
  /**
   * Border color for the inner rectangle
   * @default rgba(255,255,255,0.64)
   */
  innerBorderColor?: string
  /**
   * Whether to use gradient border instead of solid
   * @default false (solid white border)
   */
  useGradientBorder?: boolean
  /**
   * Children to render inside the card
   */
  children?: React.ReactNode
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * NeumorphicInfoCard Component
 * 
 * A reusable card with neumorphic styling and optional inner rectangular border.
 * Used in deposit and withdrawal pages for displaying strategy/conversion information.
 * 
 * Features:
 * - Configurable height and width
 * - Neumorphic outer shadow
 * - Optional inner rectangular border (solid or gradient)
 * - Flexible content via children
 */
export function NeumorphicInfoCard({
  height,
  width = 356,
  showInnerBorder = true,
  outerShadow,
  innerBorderColor,
  useGradientBorder = false,
  children,
  className,
}: NeumorphicInfoCardProps) {
  
  const innerBorderHeight = height - 24 
  const innerBorderWidth = width - 24 
  
  
  const defaultBorderColor = innerBorderColor || designTokens.colors.border.white

  return (
    <div 
      className={cn("relative rounded-[16px]", className)}
      style={{ 
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[16px]"
        style={{ 
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: designTokens.colors.background.main,
          boxShadow: outerShadow || shadows.cardDefault,
        }}
      />
      
      {}
      {showInnerBorder && (
        <>
          {useGradientBorder ? (
            
            <div 
              className="absolute left-1/2 top-[12px] -translate-x-1/2 rounded-[12px]"
              style={{ 
                width: `${innerBorderWidth}px`,
                height: `${innerBorderHeight}px`,
                padding: '2px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.64) 0%, rgba(127,86,217,0.15) 50%, rgba(255,255,255,0.64) 100%)',
              }}
            >
              <div 
                className="w-full h-full rounded-[10px]"
                style={{ 
                  backgroundColor: designTokens.colors.background.main,
                }}
              />
            </div>
          ) : (
            
            <div 
              className="absolute left-1/2 top-[12px] -translate-x-1/2 rounded-[12px] border-2 border-solid"
              style={{ 
                width: `${innerBorderWidth}px`,
                height: `${innerBorderHeight}px`,
                borderColor: defaultBorderColor,
                backgroundColor: designTokens.colors.background.main,
              }}
            />
          )}
        </>
      )}

      {}
      <div className="relative w-full h-full">
        {children}
      </div>
    </div>
  )
}
