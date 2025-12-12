"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { designTokens } from "@/lib/design-system"

export interface NeumorphicInfoCardProps {
  height: number
  width?: number
  showInnerBorder?: boolean
  outerShadow?: string
  innerBorderColor?: string
  useGradientBorder?: boolean
  children?: React.ReactNode
  className?: string
}

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
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[16px]"
        style={{ 
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: designTokens.colors.background.main,
          boxShadow: outerShadow || designTokens.shadows.cardDefault,
        }}
      />
      {showInnerBorder && (
        <>
          {useGradientBorder ? (
            <div 
              className="absolute left-1/2 top-[12px] -translate-x-1/2 rounded-[12px]"
              style={{ 
                width: `${innerBorderWidth}px`,
                height: `${innerBorderHeight}px`,
                padding: '2px',
                background: `linear-gradient(135deg, ${designTokens.colors.border.white} 0%, rgba(127,86,217,0.15) 50%, ${designTokens.colors.border.white} 100%)`,
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
      <div className="relative w-full h-full">
        {children}
      </div>
    </div>
  )
}
