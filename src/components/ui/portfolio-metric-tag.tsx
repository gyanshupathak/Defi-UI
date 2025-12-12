"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { cn } from "@/lib/utils"

interface PortfolioMetricTagProps {
  value: string
  className?: string
}

export function PortfolioMetricTag({ value, className }: PortfolioMetricTagProps) {
  const isPositive = value.startsWith("+")
  const isNegative = value.startsWith("-")
  const isDollar = value.startsWith("$")
  
  let backgroundColor: string = designTokens.colors.background.main
  let borderColor: string = designTokens.colors.border.separator
  let textColor: string = designTokens.colors.text.primary
  
  if (isPositive) {
    backgroundColor = designTokens.colors.status.successBg
    borderColor = designTokens.colors.pnl.positive
    textColor = designTokens.colors.pnl.positive
  } else if (isNegative) {
    backgroundColor = designTokens.colors.status.errorBg
    borderColor = designTokens.colors.pnl.negative
    textColor = designTokens.colors.pnl.negative
  } else if (isDollar) {
    backgroundColor = designTokens.colors.status.successBg
    borderColor = designTokens.colors.pnl.positive
    textColor = designTokens.colors.pnl.positive
  } else {
    backgroundColor = designTokens.colors.background.main
    borderColor = designTokens.colors.border.separator
    textColor = designTokens.colors.text.secondary
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-[99px] px-[6px] py-[2px]",
        className
      )}
      style={{
        backgroundColor,
        border: `1px solid ${borderColor}`,
      }}
    >
      <p
        className={cn(
          typographyClasses.label1
        )}
        style={{
          color: textColor,
          fontSize: designTokens.typography.label1.fontSize,
          lineHeight: designTokens.typography.label1.lineHeight,
          letterSpacing: isPositive ? "0.33px" : "normal",
        }}
      >
        {value}
      </p>
    </div>
  )
}

