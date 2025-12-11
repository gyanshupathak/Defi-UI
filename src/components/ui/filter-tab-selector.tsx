"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { cn } from "@/lib/utils"

export interface FilterTabOption<T extends string = string> {
  id: T
  label: string
}

interface FilterTabSelectorProps<T extends string = string> {
  options: FilterTabOption<T>[]
  activeValue: T
  onValueChange: (value: T) => void
  className?: string
}

export function FilterTabSelector<T extends string = string>({
  options,
  activeValue,
  onValueChange,
  className,
}: FilterTabSelectorProps<T>) {
  return (
    <div 
      className={cn(
        "flex items-center rounded-[99px] border border-solid h-[24px]",
        className
      )}
      style={{ 
        borderColor: designTokens.colors.border.separator,
        backgroundColor: designTokens.colors.background.main,
        gap: '4px',
      }}
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onValueChange(option.id)}
          className={cn(
            "flex items-center justify-center rounded-[99px] h-full px-[12px] py-[4px] transition-all cursor-pointer border border-solid bg-transparent",
            activeValue === option.id ? "" : "border-transparent"
          )}
          style={{
            borderColor: activeValue === option.id ? designTokens.colors.primary : 'transparent',
          }}
        >
          <p 
            className={typographyClasses.label1}
            style={{
              color: activeValue === option.id 
                ? designTokens.colors.primary 
                : designTokens.colors.text.muted,
              fontWeight: activeValue === option.id ? 500 : 400,
            }}
          >
            {option.label}
          </p>
        </button>
      ))}
    </div>
  )
}

