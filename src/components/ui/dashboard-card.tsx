"use client"

import * as React from "react"
import { designTokens } from "@/lib/design-system"
import { cn } from "@/lib/utils"

interface DashboardCardProps {
  children: React.ReactNode
  height?: string
  width?: string
  className?: string
}

export function DashboardCard({
  children,
  height = '640px',
  width = '668px',
  className,
}: DashboardCardProps) {
  return (
    <div 
      className={cn("relative", className)}
      style={{
        width,
        height,
      }}
    >
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[16px]"
        style={{
          width,
          height,
          backgroundColor: designTokens.colors.background.main,
          boxShadow: designTokens.shadows.cardDefault,
        }}
      />
      {children}
    </div>
  )
}
