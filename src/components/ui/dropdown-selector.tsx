"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"
import { cn } from "@/lib/utils"

export interface DropdownOption<T = string> {
  id: T
  label: string
  iconSrc?: string
  icon?: React.ReactNode
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
  const [hoveredId, setHoveredId] = React.useState<T | null>(null)

  const selectedOption = options.find(opt => opt.id === selectedValue) || options[0]

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
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
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          "relative flex items-center justify-center border border-solid rounded-[99px] transition-opacity z-10",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 cursor-pointer"
        )}
        style={{
          paddingLeft: "12px",
          paddingRight: "12px",
          paddingTop: "4px",
          paddingBottom: "4px",
          minHeight: "24px",
          borderColor: designTokens.colors.border.separator,
          backgroundColor: designTokens.colors.background.main,
          boxShadow: "none",
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
          role="listbox"
          className="absolute top-full right-0 mt-2 z-50 rounded-[12px] border border-solid"
          style={{
            backgroundColor: designTokens.colors.background.main,
            boxShadow: shadows.dropdown,
            minWidth,
            borderColor: designTokens.colors.border.white,
            padding: '8px',
          }}
        >
          <div className="flex flex-col gap-[8px]">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleOptionSelect(option.id)
                }}
                onMouseEnter={() => setHoveredId(option.id)}
                onMouseLeave={() => setHoveredId(null)}
                role="option"
                aria-selected={selectedValue === option.id}
                className={cn(
                  "relative w-full flex items-center justify-between rounded-[99px] transition-all cursor-pointer"
                )}
                style={{
                  paddingLeft: designTokens.spacing.dropdown.paddingX,
                  paddingRight: designTokens.spacing.dropdown.paddingX,
                  paddingTop: designTokens.spacing.dropdown.paddingY,
                  paddingBottom: designTokens.spacing.dropdown.paddingY,
                  backgroundColor:
                    hoveredId === option.id
                      ? designTokens.colors.background.gradient
                      : "transparent",
                }}
              >
                <div className="flex items-center gap-[8px] min-w-0">
                  {(option.icon || option.iconSrc) && (
                    <div
                      className="flex items-center justify-center rounded-full overflow-hidden shrink-0"
                      style={{ width: '20px', height: '20px' }}
                    >
                      {option.icon
                        ? option.icon
                        : (
                          <img
                            src={option.iconSrc}
                            alt=""
                            className="object-cover w-full h-full"
                            loading="lazy"
                          />
                        )}
                    </div>
                  )}
                  <p
                  className={cn(
                    "truncate text-[16px] leading-[20px] font-sans",
                    selectedValue === option.id || hoveredId === option.id ? "font-medium" : "font-normal"
                  )}
                  style={{
                    color: designTokens.colors.text.primary,
                    opacity: selectedValue === option.id || hoveredId === option.id ? 1 : 0.8,
                  }}
                  >
                    {option.label}
                  </p>
                </div>
                {selectedValue === option.id && (
                  <Check
                    size={12}
                    strokeWidth={2}
                    style={{ color: designTokens.colors.status.success }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
