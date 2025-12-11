"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { designTokens, typographyClasses } from "@/lib/design-system"

export interface TabSelectorOption<T extends string = string> {
  id: T
  label: string
}

interface TabSelectorProps<T extends string = string> {
  value: T
  options: TabSelectorOption<T>[]
  onChange: (value: T) => void
  className?: string
}

/**
 * Segmented tab selector used in Yields > Allocations top-right control.
 */
export function TabSelector<T extends string = string>({
  value,
  options,
  onChange,
  className,
}: TabSelectorProps<T>) {
  const accent = designTokens.colors.primary
  const inactive = "#5a5a5f"
  const containerBg = "#f6f2ff"
  const containerBorder = "#c9c9cf"

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1.5",
        "border gap-2",
        className
      )}
      role="tablist"
      style={{
        backgroundColor: containerBg,
        borderColor: containerBorder,
        boxShadow: "inset 0 0 0 1px rgba(201, 201, 207, 0.35)",
      }}
    >
      {options.map((option) => {
        const isActive = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            role="tab"
            aria-selected={isActive}
            aria-pressed={isActive}
            className={cn(
              "relative h-[44px] min-w-[132px] px-5 rounded-full",
              "flex items-center justify-center",
              "transition-[color,background,border,box-shadow] duration-150 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
              "focus-visible:ring-[rgba(127,86,217,0.35)]"
            )}
            style={{
              backgroundColor: isActive ? designTokens.colors.background.white : "transparent",
              color: isActive ? accent : inactive,
              border: isActive ? `2px solid ${accent}` : "1px solid transparent",
              boxShadow: isActive ? "0 0 0 0 rgba(0,0,0,0)" : "none",
              ["--ring-color" as string]: "rgba(127, 86, 217, 0.35)",
            }}
          >
            <span
              className={typographyClasses.label1}
              style={{
                fontWeight: isActive ? 600 : 500,
                letterSpacing: "0.01em",
                fontSize: 18,
              }}
            >
              {option.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
