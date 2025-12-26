"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"

interface YieldsDateLabelsProps {
  dates?: string[]
  className?: string
}

// Removed DEFAULT_DATES - don't show dummy dates
// Only show dates when provided from real data

export function YieldsDateLabels({ dates, className }: YieldsDateLabelsProps) {
  // Only render if dates are provided from real data
  if (!dates || dates.length === 0) {
    return null
  }

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
