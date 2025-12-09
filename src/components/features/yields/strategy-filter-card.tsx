"use client"

import * as React from "react"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"

interface StrategyFilterCardProps {
  label: string
  value: string
  borderColor: string
  className?: string
  hasInnerShadow?: boolean
}

export function StrategyFilterCard({ 
  label, 
  value, 
  borderColor,
  className,
  hasInnerShadow = true,
}: StrategyFilterCardProps) {
  return (
    <div 
      className={`inline-flex ${className || ''}`}
      style={{
        height: '36px',
      }}
    >

      <div 
        className="absolute rounded-[12px]"
        style={{
          width: '100%',
          height: '36px',
          backgroundColor: designTokens.colors.background.main,
          boxShadow: shadows.cardDefault,
        }}
      />

      <div 
        className="absolute rounded-[8px] border border-solid"
        style={{
          left: '4px',
          top: '4px',
          right: '4px',
          height: '28px',
          borderColor: borderColor,
          backgroundColor: 'transparent',
          ...(hasInnerShadow && {
            boxShadow: shadows.cardDefault,
          }),
        }}
      />

      <div 
        className="relative flex items-center gap-[4px]"
        style={{
          paddingLeft: '10px',
          paddingRight: '10px',
          paddingTop: '10px',
          paddingBottom: '10px',
          height: '36px',
        }}
      >
        <p 
          className={`${typographyClasses.label1} opacity-70 whitespace-nowrap`}
          style={{ color: designTokens.colors.text.primary }}
        >
          {label}
        </p>
        <div 
          className="opacity-20 shrink-0"
          style={{ 
            width: '1px', 
            height: '12px',
            backgroundColor: designTokens.colors.text.primary 
          }}
        />
        <p 
          className={`${typographyClasses.label2} opacity-70 whitespace-nowrap`}
          style={{ color: designTokens.colors.text.primary }}
        >
          {value}
        </p>
      </div>
    </div>
  )
}
