"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"
import { cn } from "@/lib/utils"

export interface DropdownOption<T = string> {
  id: T
  label: string
}

interface DropdownSelectorProps<T = string> {
  selectedValue: T
  onValueChange?: (value: T) => void
  options: DropdownOption<T>[]
  className?: string
  disabled?: boolean
  minWidth?: string
}

export function DropdownSelector<T extends string = string>({
  selectedValue,
  onValueChange,
  options,
  className,
  disabled = false,
  minWidth = "120px",
}: DropdownSelectorProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.id === selectedValue) || options[0]

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleOptionSelect = (value: T) => {
    onValueChange?.(value)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          if (!disabled) {
            setIsOpen(!isOpen)
          }
        }}
        disabled={disabled}
        className={cn(
          "relative flex items-center justify-center border border-solid rounded-[99px] transition-opacity bg-transparent z-10",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 cursor-pointer"
        )}
        style={{
          height: '24px',
          paddingLeft: '12px',
          paddingRight: '12px',
          paddingTop: '4px',
          paddingBottom: '4px',
          borderColor: designTokens.colors.border.default,
        }}
      >
        <div className="flex items-center gap-[4px]">
          <p 
            className={typographyClasses.label1}
            style={{ color: designTokens.colors.text.primary }}
          >
            {selectedOption.label}
          </p>
          <div 
            className="opacity-50 flex items-center justify-center"
            style={{ width: '12px', height: '12px' }}
          >
            <ChevronDown 
              size={12} 
              className={cn(
                "transition-transform",
                isOpen && "rotate-180"
              )}
              style={{ color: designTokens.colors.text.primary }}
            />
          </div>
        </div>
      </button>

      {isOpen && !disabled && (
        <div
          className="absolute top-full right-0 mt-1 z-50 rounded-[8px] border border-solid"
          style={{
            backgroundColor: designTokens.colors.background.main,
            borderColor: designTokens.colors.border.separator,
            boxShadow: shadows.dropdown,
            minWidth,
            padding: '8px',
          }}
        >
          <div className="flex flex-col gap-1">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleOptionSelect(option.id)
                }}
                className="px-3 py-2 text-left rounded-[4px] hover:bg-opacity-10 transition-colors border-none cursor-pointer"
                style={{
                  backgroundColor: selectedValue === option.id 
                    ? `${designTokens.colors.primary}20` 
                    : "transparent",
                }}
              >
                <p className={typographyClasses.label1}>
                  {option.label}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

