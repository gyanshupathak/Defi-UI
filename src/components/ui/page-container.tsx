"use client"

import * as React from "react"
import { designTokens } from "@/lib/design-system"
import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  
  useAbsolutePositioning?: boolean
}

export function PageContainer({ 
  children, 
  className,
  useAbsolutePositioning = false 
}: PageContainerProps) {
  return (
    <div 
      className={cn(
        "flex-1 overflow-hidden",
        useAbsolutePositioning ? "relative" : "flex",
        className
      )}
      style={{ 
        paddingLeft: designTokens.spacing.layout.containerPadding,
        paddingRight: designTokens.spacing.layout.containerPadding,
        paddingTop: designTokens.spacing.layout.contentPaddingY,
        paddingBottom: designTokens.spacing.layout.contentPaddingY,
      }}
    >
      {useAbsolutePositioning ? (
        <div 
          className="relative w-full"
          style={{ 
            maxWidth: designTokens.spacing.layout.maxWidth,
            margin: '0 auto',
            minHeight: 'calc(100% - 48px)', 
          }}
        >
          {children}
        </div>
      ) : (
        <div 
          className="flex-1 flex mx-auto"
          style={{ 
            maxWidth: designTokens.spacing.layout.maxWidth,
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}
