"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"

interface YieldsDateLabelsProps {
  dates?: string[]
  className?: string
}

const DEFAULT_DATES = ["11 AUG", "12 AUG", "13 AUG", "14 AUG", "15 AUG", "16 AUG", "17 AUG"]

export function YieldsDateLabels({ dates = DEFAULT_DATES, className }: YieldsDateLabelsProps) {
  return (
    <div 
      className={`absolute flex items-center justify-between text-center ${className || ''}`}
      style={{
        left: '24px',
        top: '519.26px',
        width: '620px',
        height: '16.743px',
      }}
    >
      {dates.map((date, index) => (
        <p 
          key={index}
          className={`${typographyClasses.label1} opacity-80 relative shrink-0`} 
          style={{ color: designTokens.colors.text.primary }}
        >
          {date}
        </p>
      ))}
    </div>
  )
}

