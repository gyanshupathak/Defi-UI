"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { cn } from "@/lib/utils"

export interface AllocationsViewTabOption<T extends string = string> {
  id: T
  label: string
}

interface AllocationsViewTabsProps<T extends string = string> {
  value: T
  options: AllocationsViewTabOption<T>[]
  onChange: (value: T) => void
  className?: string
}

export function AllocationsViewTabs<T extends string = string>({
  value,
  options,
  onChange,
  className,
}: AllocationsViewTabsProps<T>) {
  const accentColor = "#7F56D9"
  const containerBg = "#F4F0FF"
  const inactiveTextColor = designTokens.colors.text.secondary
  const containerBorder = designTokens.colors.border.separator

  return (
    <div
      role="tablist"
      aria-label="View"
      className={cn(
        "inline-flex items-center rounded-full",
        className
      )}
      style={{
        background: containerBg,
        border: `1px solid ${containerBorder}`,
        gap: 4,
      }}
    >
      {options.map((option) => {
        const isActive = option.id === value

        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-pressed={isActive}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex items-center justify-center rounded-full select-none transition-[color,background,border,box-shadow] duration-150",
              "h-[28px] px-[12px] py-[4px]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            )}
            style={{
              background: "transparent",
              color: isActive ? accentColor : inactiveTextColor,
              border: isActive ? `1px solid ${accentColor}` : "1px solid transparent",
              boxShadow: isActive ? undefined : undefined,
              fontWeight: isActive ? 500 : 400,
              ["--tab-ring" as string]: "rgba(127, 86, 217, 0.28)",
            }}
          >
            <span
              className={typographyClasses.heading1}
              style={{ fontSize: 12 }}
            >
              {option.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
