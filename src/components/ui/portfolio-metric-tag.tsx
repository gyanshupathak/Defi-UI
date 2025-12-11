"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { cn } from "@/lib/utils"

interface PortfolioMetricTagProps {
  value: string
  className?: string
}

export function PortfolioMetricTag({ value, className }: PortfolioMetricTagProps) {
  // Determine if the value is positive or negative based on the sign
  const isPositive = value.startsWith("+")
  const isNegative = value.startsWith("-")
  const isDollar = value.startsWith("$")
  
  // Determine styling based on value type
  let backgroundColor: string = designTokens.colors.background.main
  let borderColor: string = designTokens.colors.border.separator
  let textColor: string = designTokens.colors.text.primary
  
  if (isPositive) {
    // For positive values (like +2.23%), use green background with green border
    backgroundColor = 'rgba(37, 153, 82, 0.1)'
    borderColor = designTokens.colors.pnl.positive
    textColor = designTokens.colors.pnl.positive
  } else if (isNegative) {
    // For negative values, use red styling
    backgroundColor = designTokens.colors.status.errorBg
    borderColor = designTokens.colors.pnl.negative
    textColor = designTokens.colors.pnl.negative
  } else if (isDollar) {
    // For dollar values (like $289.28), use green background with green border
    backgroundColor = 'rgba(37, 153, 82, 0.1)'
    borderColor = designTokens.colors.pnl.positive
    textColor = designTokens.colors.pnl.positive
  } else {
    // For other neutral values, use default styling
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
          fontSize: "12px",
          lineHeight: "normal",
          letterSpacing: isPositive ? "0.33px" : "normal",
        }}
      >
        {value}
      </p>
    </div>
  )
}

