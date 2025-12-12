"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { designTokens, typographyClasses } from "@/lib/design-system"

export interface NoteCardProps {
  text: string
  height: number
  width?: number
  className?: string
}

export function NoteCard({
  text,
  height,
  width = 356,
  className,
}: NoteCardProps) {
  return (
    <div 
      className={cn("relative rounded-[16px]", className)}
      style={{ 
        height: `${height}px`, 
        width: `${width}px`,
      }}
    >
      <div 
        className="absolute inset-0 rounded-[16px]"
        style={{ 
          backgroundColor: designTokens.colors.background.main,
          boxShadow: designTokens.shadows.noteCard
        }}
      />
      <p 
        className={cn(
          typographyClasses.label1,
          "absolute left-[24px] top-[20px] leading-[18px] tracking-[0.15px] whitespace-pre-wrap"
        )}
        style={{ 
          color: designTokens.colors.text.primary,
          width: `${width - 48}px`, 
        }}
      >
        <span className="font-semibold">Note: </span>
        <span className="font-normal">{text}</span>
      </p>
    </div>
  )
}
