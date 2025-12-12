"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { designTokens, typographyClasses } from "@/lib/design-system"

export interface InsetContainerConfig {
  top: number
  height: number
  width?: number
}

export interface NeumorphicInputCardProps {
  height: number
  width?: number
  label: string
  rightElement?: React.ReactNode
  insetContainers: InsetContainerConfig | InsetContainerConfig[]
  children: React.ReactNode
  className?: string
}

export function NeumorphicInputCard({
  height,
  width = 400,
  label,
  rightElement,
  insetContainers,
  children,
  className,
}: NeumorphicInputCardProps) {
  const containers = Array.isArray(insetContainers) ? insetContainers : [insetContainers]
  const defaultInnerWidth = width - 24

  return (
    <div 
      className={cn("relative rounded-[16px]", className)}
      style={{ 
        height: `${height}px`,
        width: `${width}px`,
      }}
    >
      <div 
        className="absolute left-1/2 top-0 -translate-x-1/2 rounded-[16px]"
        style={{ 
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: designTokens.colors.background.main,
          boxShadow: designTokens.shadows.cardDefault
        }}
      />
      <div 
        className="absolute left-[24px] top-[12px] flex items-center justify-between"
        style={{ 
          width: `${width - 48}px` 
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
      {containers.map((container, index) => (
        <div
          key={index}
          className="absolute left-1/2 -translate-x-1/2 rounded-[16px]"
          style={{ 
            top: `${container.top}px`,
            height: `${container.height}px`,
            width: `${container.width || defaultInnerWidth}px`,
            backgroundColor: designTokens.colors.background.main,
            boxShadow: designTokens.shadows.inputInset
          }}
        />
      ))}
      <div className="relative w-full h-full">
        {children}
      </div>
    </div>
  )
}
