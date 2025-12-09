"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"

export interface NoteCardProps {
  /**
   * The note text content
   */
  text: string
  /**
   * Height of the card in pixels
   */
  height: number
  /**
   * Width of the card in pixels
   * @default 356
   */
  width?: number
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * NoteCard Component
 * 
 * A simple card for displaying informational notes with "Note:" prefix.
 * Used in deposit and withdrawal pages to show important information to users.
 * 
 * Features:
 * - Neumorphic styling
 * - Bold "Note:" prefix with regular text
 * - Configurable height and width
 * - Wraps text automatically
 */
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
      {/* Card Background */}
      <div 
        className="absolute inset-0 rounded-[16px]"
        style={{ 
          backgroundColor: designTokens.colors.background.main,
          boxShadow: shadows.noteCard
        }}
      />
      
      {/* Note Text */}
      <p 
        className={cn(
          typographyClasses.label1,
          "absolute left-[24px] top-[20px] leading-[18px] tracking-[0.15px] whitespace-pre-wrap"
        )}
        style={{ 
          color: designTokens.colors.text.primary,
          width: `${width - 48}px`, // 24px padding on each side
        }}
      >
        <span className="font-semibold">Note: </span>
        <span className="font-normal">{text}</span>
      </p>
    </div>
  )
}

