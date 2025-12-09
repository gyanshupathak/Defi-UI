"use client"

import * as React from "react"

interface AllocationColorBarProps {
  color: string
  className?: string
}

export function AllocationColorBar({ color, className }: AllocationColorBarProps) {
  return (
    <div 
      className={`rounded-[9px] shrink-0 self-stretch ${className || ''}`}
      style={{
        width: '3px',
        backgroundColor: color,
      }}
    />
  )
}

