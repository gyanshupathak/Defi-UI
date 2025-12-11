"use client"

import Image from "next/image"
import { X } from "lucide-react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { cn } from "@/lib/utils"

interface AssetTagProps {
  label: string
  iconSrc?: string
  onRemove?: () => void
  onClick?: () => void
  isSelected?: boolean
  className?: string
}

export function AssetTag({ label, iconSrc, onRemove, onClick, isSelected = true, className }: AssetTagProps) {
  const Component = onClick ? 'button' : 'span'
  
  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-[99px] border border-solid p-[8px] transition-all cursor-pointer",
        isSelected ? "bg-[#f6f2fd]" : "bg-transparent",
        className
      )}
      style={{
        borderColor: isSelected ? "rgba(127,86,217,0.25)" : designTokens.colors.border.separator,
        gap: '12px',
      }}
    >
      <span className="flex items-center gap-[8px]">
        {iconSrc && (
          <span className="flex items-center justify-center relative shrink-0" style={{ width: '18px', height: '18px' }}>
            <Image
              src={iconSrc}
              alt={label}
              width={18}
              height={18}
              className="object-contain w-full h-full"
            />
          </span>
        )}
        <span
          className="font-normal text-[14px] leading-normal font-sans"
          style={{ color: designTokens.colors.text.primary }}
        >
          {label}
        </span>
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="flex items-center justify-center shrink-0 rounded-full hover:opacity-80 transition-opacity"
          style={{ width: '16px', height: '16px' }}
          aria-label={`Remove ${label}`}
        >
          <X size={14} style={{ color: designTokens.colors.text.primary }} />
        </button>
      )}
    </Component>
  )
}
