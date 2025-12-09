"use client"

import * as React from "react"
import Image from "next/image"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { designTokens, shadows } from "@/lib/design-system"

const primaryButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none relative border-0",
  {
      variants: {
        variant: {
          default: "",
          inactive: "",
          usd: "",
          eth: "",
          btc: "",
          withdraw: "",
          cancel: "",
        },
      size: {
        default: "h-[56px] px-[16px]",
        sm: "h-[40px] px-[12px]",
        xs: "h-[32px] px-[12px]",
      },
      state: {
        default: "hover:opacity-90 active:scale-[0.98]",
        hover: "opacity-90",
        click: "active:scale-[0.98]",
        loader: "opacity-75 cursor-wait",
        inactive: "opacity-50 cursor-not-allowed",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default",
    },
  }
)

export interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof primaryButtonVariants> {
  asChild?: boolean
  icon?: React.ReactNode | string
  loading?: boolean
  showDepositIcon?: boolean
  textColor?: string
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    state,
    asChild = false, 
    icon,
    showDepositIcon = false,
    loading = false,
    children,
    disabled,
    textColor,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const actualState = disabled || variant === "inactive" 
      ? "inactive" 
      : loading 
      ? "loader" 
      : state
    
    const iconSize = size === "xs" ? 12 : size === "sm" ? 20 : 20
    
    const gap = size === "xs" ? 4 : size === "sm" ? 8 : 8
    
    const getTextStyle = () => {
      if (size === "xs") {
        return "font-['Hanken_Grotesk',sans-serif] font-normal leading-normal text-[12px] text-center"
      }
      if (size === "sm") {
        return "font-['Hanken_Grotesk',sans-serif] font-medium leading-[20px] text-[14px] text-center"
      }
      return "font-['Inter',sans-serif] font-medium leading-[1.5] not-italic text-[16px] text-center"
    }
    const textStyle = getTextStyle()
    
    const isInactive = disabled || variant === "inactive" || actualState === "inactive"
    
    const getBackgroundColor = () => {
      if (variant === "cancel") return designTokens.colors.background.main
      if (variant === "withdraw") return designTokens.colors.withdraw
      if (isInactive) return designTokens.colors.background.main
      if (variant === "usd") return designTokens.colors.strategy.usd
      if (variant === "eth") return designTokens.colors.strategy.eth
      if (variant === "btc") return designTokens.colors.strategy.btc
      return designTokens.colors.primary
    }
    
    const getShadow = () => {
      if (isInactive) {
        return '4px 4px 12px 0px rgba(0,0,0,0.1), -4px -4px 12px 0px #ffffff'
      }
      return designTokens.shadows.button
    }
    
    const getTextColor = () => {
      if (textColor) return textColor
      if (variant === "withdraw") return 'rgba(43, 102, 255, 1)'
      if (variant === "cancel") return '#e91e21'
      if (isInactive) return '#080b17'
      return 'white'
    }
    const finalTextColor = getTextColor()
    
    const getIconColor = () => {
      if (variant === "withdraw") return 'rgba(43, 102, 255, 1)'
      if (variant === "cancel") return '#e91e21'
      if (isInactive) return '#080b17'
      return 'white'
    }
    const iconColor = getIconColor()
    
    const displayIcon = showDepositIcon || variant === "withdraw"
      ? "/images/icons/deposit-icon.svg"
      : icon
    
    const buttonStyle: React.CSSProperties = {
      backgroundColor: getBackgroundColor(),
      boxShadow: getShadow(),
      position: 'relative',
      border: 'none',
      outline: 'none',
    }

    return (
      <Comp
        className={cn(
          primaryButtonVariants({ variant, size, state: actualState, className })
        )}
        ref={ref}
        disabled={disabled || loading}
        style={buttonStyle}
        {...props}
      >
        {loading ? (
          <div className="relative flex items-center z-10" style={{ gap: `${gap}px` }}>
            <div 
              className="border-2 border-t-transparent rounded-full animate-spin shrink-0"
              style={{ 
                width: `${iconSize}px`, 
                height: `${iconSize}px`,
                borderColor: finalTextColor,
                borderTopColor: 'transparent'
              }}
            />
            <span className={textStyle} style={{ color: finalTextColor }}>{children}</span>
          </div>
        ) : (
          <div className="relative flex items-center z-10" style={{ gap: `${gap}px` }}>
            {displayIcon && (
              <div 
                className="flex items-center justify-center shrink-0"
                style={{ 
                  width: `${iconSize}px`, 
                  height: `${iconSize}px`,
                  color: iconColor,
                }}
              >
                {typeof displayIcon === 'string' ? (
                  <Image
                    src={displayIcon}
                    alt=""
                    width={iconSize}
                    height={iconSize}
                    className="object-contain"
                    style={{
                      filter: variant === "withdraw" || variant === "cancel"
                        ? variant === "withdraw"
                          ? 'brightness(0) saturate(100%) invert(35%) sepia(96%) saturate(2326%) hue-rotate(218deg) brightness(102%) contrast(101%)'
                          : variant === "cancel"
                          ? 'brightness(0) saturate(100%) invert(20%) sepia(95%) saturate(7471%) hue-rotate(346deg) brightness(95%) contrast(92%)'
                          : undefined
                        : undefined
                    }}
                  />
                ) : React.isValidElement(displayIcon) ? (
                  React.cloneElement(displayIcon as React.ReactElement<{ size?: number; style?: React.CSSProperties }>, {
                    size: iconSize,
                    style: { 
                      color: iconColor, 
                      ...((displayIcon as React.ReactElement<{ style?: React.CSSProperties }>).props?.style || {}) 
                    }
                  })
                ) : (
                  displayIcon
                )}
              </div>
            )}
            <span className={textStyle} style={{ color: finalTextColor }}>{children}</span>
          </div>
        )}
      </Comp>
    )
  }
)
PrimaryButton.displayName = "PrimaryButton"

export { PrimaryButton, primaryButtonVariants }

