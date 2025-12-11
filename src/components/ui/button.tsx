"use client"

import * as React from "react"
import Image from "next/image"
import { Slot } from "@radix-ui/react-slot"

import { designTokens } from "@/lib/design-system"
import { cn } from "@/lib/utils"

type ButtonVariant =
  | "default" 
  | "outline" 
  | "blue" 
  | "withdraw" 
  | "deposit" 
  | "inactive"
  | "usd"
  | "eth"
  | "btc"
  | "cancel"

type ButtonSize = "default" | "sm" | "xs"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: React.ReactNode | string
  loading?: boolean
  showDepositIcon?: boolean
  showWithdrawIcon?: boolean
  textColor?: string
}

type PaletteState = {
  background: string
  text: string
  border?: string
  shadow: string
  ring: string
}

type Palette = {
  default: PaletteState
  hover: PaletteState
  pressed: PaletteState
  disabled: PaletteState
  loading: PaletteState
}

const getPalette = (variant: ButtonVariant): Palette => {
  
  const actualVariant = variant === "withdraw" ? "outline" : variant === "deposit" ? "blue" : variant

  switch (actualVariant) {
    case "outline": {
      return {
        default: {
          background: "#E4EBFF",
          text: "#2B66FF",
          border: "1px solid #D5E2FF",
          shadow:
            "0px 12px 26px rgba(132, 115, 255, 0.22), 0px 0px 0px 4px rgba(233, 225, 255, 0.9)",
          ring: "rgba(132, 115, 255, 0.35)",
        },
        hover: {
          background: "#DAE3FF",
          text: "#2B66FF",
          border: "1px solid #CCDBFF",
          shadow:
            "0px 14px 30px rgba(132, 115, 255, 0.26), 0px 0px 0px 5px rgba(233, 225, 255, 0.95)",
          ring: "rgba(132, 115, 255, 0.38)",
        },
        pressed: {
          background: "#CDD9FF",
          text: "#2B66FF",
          border: "1px solid #C0D0FF",
          shadow:
            "0px 10px 20px rgba(132, 115, 255, 0.2), 0px 0px 0px 4px rgba(233, 225, 255, 0.8)",
          ring: "rgba(132, 115, 255, 0.32)",
        },
        disabled: {
          background: "#F1F4FF",
          text: "#B2BBD8",
          border: "1px solid #E1E8FB",
          shadow: "0px 6px 16px rgba(119, 133, 166, 0.12)",
          ring: "rgba(179, 190, 219, 0.35)",
        },
        loading: {
          background: "#F1F4FF",
          text: "#B2BBD8",
          border: "1px solid #E1E8FB",
          shadow: "0px 6px 16px rgba(119, 133, 166, 0.12)",
          ring: "rgba(179, 190, 219, 0.35)",
        },
      }
    }
    case "blue": {
      return {
        default: {
          background: "#5C96E4",
          text: "#FFFFFF",
          border: "none",
          shadow:
            "0px 14px 30px rgba(132, 115, 255, 0.24), 0px 0px 0px 4px rgba(233, 225, 255, 0.9)",
          ring: "rgba(132, 115, 255, 0.35)",
        },
        hover: {
          background: "#4E8ADD",
          text: "#FFFFFF",
          border: "none",
          shadow:
            "0px 16px 34px rgba(132, 115, 255, 0.28), 0px 0px 0px 5px rgba(233, 225, 255, 0.95)",
          ring: "rgba(132, 115, 255, 0.38)",
        },
        pressed: {
          background: "#3E7BD0",
          text: "#FFFFFF",
          border: "none",
          shadow:
            "0px 12px 26px rgba(132, 115, 255, 0.22), 0px 0px 0px 4px rgba(233, 225, 255, 0.85)",
          ring: "rgba(132, 115, 255, 0.32)",
        },
        disabled: {
          background: "#C5D7F3",
          text: "#F5F8FF",
          border: "none",
          shadow: "0px 6px 16px rgba(119, 133, 166, 0.12)",
          ring: "rgba(179, 190, 219, 0.35)",
        },
        loading: {
          background: "#C5D7F3",
          text: "#F5F8FF",
          border: "none",
          shadow: "0px 6px 16px rgba(119, 133, 166, 0.12)",
          ring: "rgba(179, 190, 219, 0.35)",
        },
      }
    }
    case "default": {
      return {
        default: {
          background: designTokens.colors.primary, 
          text: "#FFFFFF",
          border: "none",
          shadow: "0px 16px 32px rgba(127, 86, 217, 0.35)",
          ring: "rgba(127, 86, 217, 0.35)",
        },
        hover: {
          background: "#6B3FC7", 
          text: "#FFFFFF",
          border: "none",
          shadow: "0px 18px 36px rgba(127, 86, 217, 0.4)",
          ring: "rgba(127, 86, 217, 0.35)",
        },
        pressed: {
          background: "#5A2FA8", 
          text: "#FFFFFF",
          border: "none",
          shadow: "0px 12px 24px rgba(127, 86, 217, 0.3)",
          ring: "rgba(127, 86, 217, 0.35)",
        },
        disabled: {
          background: "#BDBDBD",
          text: "#757575",
          border: "none",
          shadow: "0px 8px 16px rgba(0, 0, 0, 0.08)",
          ring: "rgba(0, 0, 0, 0.1)",
        },
        loading: {
          background: "#BDBDBD",
          text: "#757575",
          border: "none",
          shadow: "0px 8px 16px rgba(0, 0, 0, 0.08)",
          ring: "rgba(0, 0, 0, 0.1)",
        },
      }
    }
    case "usd": {
      return {
        default: {
          background: designTokens.colors.strategy.usd,
          text: "#FFFFFF",
          border: "none",
          shadow: "0px 14px 30px rgba(84, 150, 222, 0.32)",
          ring: "rgba(84, 150, 222, 0.35)",
        },
        hover: {
          background: "#3D7FC7",
          text: "#FFFFFF",
          border: "none",
          shadow: "0px 16px 32px rgba(84, 150, 222, 0.38)",
          ring: "rgba(84, 150, 222, 0.35)",
        },
        pressed: {
          background: "#2B6BB0",
          text: "#FFFFFF",
          border: "none",
          shadow: "0px 10px 20px rgba(84, 150, 222, 0.28)",
          ring: "rgba(84, 150, 222, 0.35)",
        },
        disabled: {
          background: "#BDBDBD",
          text: "#757575",
          border: "none",
          shadow: "0px 8px 16px rgba(0, 0, 0, 0.08)",
          ring: "rgba(0, 0, 0, 0.1)",
        },
        loading: {
          background: "#BDBDBD",
          text: "#757575",
          border: "none",
          shadow: "0px 8px 16px rgba(0, 0, 0, 0.08)",
          ring: "rgba(0, 0, 0, 0.1)",
        },
      }
    }
    case "eth": {
      return {
        default: {
          background: designTokens.colors.strategy.eth,
          text: "#FFFFFF",
          border: "none",
          shadow: "0px 14px 30px rgba(98, 126, 234, 0.3)",
          ring: "rgba(98, 126, 234, 0.32)",
        },
        hover: {
          background: "#5269D4",
          text: "#FFFFFF",
          border: "none",
          shadow: "0px 16px 32px rgba(98, 126, 234, 0.36)",
          ring: "rgba(98, 126, 234, 0.32)",
        },
        pressed: {
          background: "#4158BE",
          text: "#FFFFFF",
          border: "none",
          shadow: "0px 10px 20px rgba(98, 126, 234, 0.26)",
          ring: "rgba(98, 126, 234, 0.32)",
        },
        disabled: {
          background: "#BDBDBD",
          text: "#757575",
          border: "none",
          shadow: "0px 8px 16px rgba(0, 0, 0, 0.08)",
          ring: "rgba(0, 0, 0, 0.1)",
        },
        loading: {
          background: "#BDBDBD",
          text: "#757575",
          border: "none",
          shadow: "0px 8px 16px rgba(0, 0, 0, 0.08)",
          ring: "rgba(0, 0, 0, 0.1)",
        },
      }
    }
    case "btc": {
      return {
        default: {
          background: designTokens.colors.strategy.btc,
          text: "#FFFFFF",
          border: "none",
          shadow: "0px 14px 30px rgba(247, 147, 26, 0.28)",
          ring: "rgba(247, 147, 26, 0.32)",
        },
        hover: {
          background: "#E6830F",
          text: "#FFFFFF",
          border: "none",
          shadow: "0px 16px 32px rgba(247, 147, 26, 0.34)",
          ring: "rgba(247, 147, 26, 0.32)",
        },
        pressed: {
          background: "#CC6F00",
          text: "#FFFFFF",
          border: "none",
          shadow: "0px 10px 20px rgba(247, 147, 26, 0.24)",
          ring: "rgba(247, 147, 26, 0.32)",
        },
        disabled: {
          background: "#BDBDBD",
          text: "#757575",
          border: "none",
          shadow: "0px 8px 16px rgba(0, 0, 0, 0.08)",
          ring: "rgba(0, 0, 0, 0.1)",
        },
        loading: {
          background: "#BDBDBD",
          text: "#757575",
          border: "none",
          shadow: "0px 8px 16px rgba(0, 0, 0, 0.08)",
          ring: "rgba(0, 0, 0, 0.1)",
        },
      }
    }
    case "cancel": {
      return {
        default: {
          background: designTokens.colors.background.main,
          text: "#E91E21",
          border: "none",
          shadow: "0px 12px 24px rgba(0, 0, 0, 0.12)",
          ring: "rgba(233, 30, 33, 0.2)",
        },
        hover: {
          background: "#FCE8EA",
          text: "#D01518",
          border: "none",
          shadow: "0px 14px 28px rgba(0, 0, 0, 0.14)",
          ring: "rgba(233, 30, 33, 0.2)",
        },
        pressed: {
          background: "#F9D1D5",
          text: "#B81214",
          border: "none",
          shadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
          ring: "rgba(233, 30, 33, 0.2)",
        },
        disabled: {
          background: "#BDBDBD",
          text: "#757575",
          border: "none",
          shadow: "0px 8px 16px rgba(0, 0, 0, 0.08)",
          ring: "rgba(0, 0, 0, 0.1)",
        },
        loading: {
          background: "#BDBDBD",
          text: "#757575",
          border: "none",
          shadow: "0px 8px 16px rgba(0, 0, 0, 0.08)",
          ring: "rgba(0, 0, 0, 0.1)",
        },
      }
    }
    case "inactive":
    default: {
      return {
        default: {
          background: "#BDBDBD",
          text: "#757575",
          border: "none",
          shadow: "0px 8px 16px rgba(0, 0, 0, 0.08)",
          ring: "rgba(0, 0, 0, 0.1)",
        },
        hover: {
          background: "#BDBDBD",
          text: "#757575",
          border: "none",
          shadow: "0px 8px 16px rgba(0, 0, 0, 0.08)",
          ring: "rgba(0, 0, 0, 0.1)",
        },
        pressed: {
          background: "#BDBDBD",
          text: "#757575",
          border: "none",
          shadow: "0px 8px 16px rgba(0, 0, 0, 0.08)",
          ring: "rgba(0, 0, 0, 0.1)",
        },
        disabled: {
          background: "#BDBDBD",
          text: "#757575",
          border: "none",
          shadow: "0px 8px 16px rgba(0, 0, 0, 0.08)",
          ring: "rgba(0, 0, 0, 0.1)",
        },
        loading: {
          background: "#BDBDBD",
          text: "#757575",
          border: "none",
          shadow: "0px 8px 16px rgba(0, 0, 0, 0.08)",
          ring: "rgba(0, 0, 0, 0.1)",
        },
      }
    }
  }
}

const sizeMap: Record<
  ButtonSize,
  { height: number; paddingX: number; gap: number; icon: number; font: string }
> = {
  default: {
    height: 56,
    paddingX: 24,
    gap: 8,
    icon: 20,
    font: "font-['Hanken_Grotesk',sans-serif] font-semibold leading-[24px] text-[16px]",
  },
  sm: {
    height: 40,
    paddingX: 16,
    gap: 8,
    icon: 20,
    font: "font-['Hanken_Grotesk',sans-serif] font-semibold leading-[20px] text-[14px]",
  },
  xs: {
    height: 32,
    paddingX: 12,
    gap: 4,
    icon: 12,
    font: "font-['Hanken_Grotesk',sans-serif] font-medium leading-[16px] text-[12px]",
  },
}

const DepositGlyph = ({ size, color }: { size: number; color: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color }}
    className="shrink-0"
  >
    <path
      d="M15.2513 10V3.33333M15.2513 3.33333L17.5846 5.83333M15.2513 3.33333L12.918 5.83333"
      stroke="currentColor"
      strokeWidth="0.666667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.6667 9.29387C11.6667 10.2846 9.61464 11.0877 7.08333 11.0877C4.55203 11.0877 2.5 10.2846 2.5 9.29387M11.6667 9.29387C11.6667 8.30314 9.61464 7.5 7.08333 7.5C4.55203 7.5 2.5 8.30314 2.5 9.29387M11.6667 9.29387V14.9745M2.5 9.29387V14.9745M11.6667 12.0843C11.6667 13.075 9.61464 13.8782 7.08333 13.8782C4.55203 13.8782 2.5 13.075 2.5 12.0843M11.6667 14.8728C11.6667 15.8635 9.61464 16.6667 7.08333 16.6667C4.55203 16.6667 2.5 15.8635 2.5 14.8728"
      stroke="currentColor"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const WithdrawGlyph = ({ size, color }: { size: number; color: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color }}
    className="shrink-0"
  >
    <path
      d="M15.2513 10V16.6667M15.2513 16.6667L17.5846 14.1667M15.2513 16.6667L12.918 14.1667"
      stroke="currentColor"
      strokeWidth="0.666667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.6667 10.7061C11.6667 9.71539 9.61464 8.91228 7.08333 8.91228C4.55203 8.91228 2.5 9.71539 2.5 10.7061M11.6667 10.7061C11.6667 11.6969 9.61464 12.5 7.08333 12.5C4.55203 12.5 2.5 11.6969 2.5 10.7061M11.6667 10.7061V5.02554M2.5 10.7061V5.02554M11.6667 7.91572C11.6667 6.925 9.61464 6.12188 7.08333 6.12188C4.55203 6.12188 2.5 6.925 2.5 7.91572M11.6667 5.12723C11.6667 4.13651 9.61464 3.33339 7.08333 3.33339C4.55203 3.33339 2.5 4.13651 2.5 5.12723"
      stroke="currentColor"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      className,
      variant = "default",
      size = "default",
      icon,
      loading = false,
      showDepositIcon = false,
      showWithdrawIcon = false,
      textColor,
      disabled,
      style: userStyle,
      children,
      type,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const [isPressed, setIsPressed] = React.useState(false)
    const [isHovered, setIsHovered] = React.useState(false)

    const isInactive = disabled || variant === "inactive"
    const actualVariant = isInactive ? "inactive" : variant

    const palette = getPalette(actualVariant)
    
    
    let currentState: keyof Palette = "default"
    if (loading) {
      currentState = "loading"
    } else if (disabled || isInactive) {
      currentState = "disabled"
    } else if (isPressed) {
      currentState = "pressed"
    } else if (isHovered) {
      currentState = "hover"
    }

    const stateStyles = palette[currentState]
    const resolvedTextColor = textColor ?? stateStyles.text
    const iconColor = resolvedTextColor

    const sizeTokens = sizeMap[size] ?? sizeMap.default
    
    
    let displayIcon: React.ReactNode = null
    if (showDepositIcon) {
      displayIcon = <DepositGlyph size={sizeTokens.icon} color={iconColor} />
    } else if (showWithdrawIcon || variant === "withdraw" || variant === "outline") {
      displayIcon = <WithdrawGlyph size={sizeTokens.icon} color={iconColor} />
    } else if (icon) {
      displayIcon = icon
    }

    const buttonStyle: React.CSSProperties = {
      backgroundColor: stateStyles.background,
      border: stateStyles.border || "none",
      boxShadow: stateStyles.shadow,
      height: `${sizeTokens.height}px`,
      paddingLeft: `${sizeTokens.paddingX}px`,
      paddingRight: `${sizeTokens.paddingX}px`,
      outline: "none",
      cursor: disabled || isInactive ? "not-allowed" : "pointer",
      transition: "all 0.2s ease-in-out",
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !isInactive && !loading) {
        setIsPressed(true)
        props.onMouseDown?.(e)
      }
    }

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(false)
      props.onMouseUp?.(e)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(false)
      setIsHovered(false)
      props.onMouseLeave?.(e)
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !isInactive && !loading) {
        setIsHovered(true)
      }
      props.onMouseEnter?.(e)
    }

    return (
      <Comp
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center whitespace-nowrap rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "focus-visible:ring-[var(--button-ring-color)]",
          className
        )}
        style={{
          ...buttonStyle,
          ...(userStyle as React.CSSProperties),
          ["--button-ring-color" as string]: stateStyles.ring,
        }}
        disabled={disabled || isInactive || loading}
        aria-busy={loading}
        data-state={currentState}
        data-variant={actualVariant}
        type={type ?? "button"}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        {...props}
      >
        <div
          className="relative flex items-center justify-center z-10"
          style={{ gap: `${sizeTokens.gap}px` }}
        >
          {loading ? (
            <>
              <div
                className="border-2 border-t-transparent rounded-full animate-spin shrink-0"
                style={{
                  width: `${sizeTokens.icon}px`,
                  height: `${sizeTokens.icon}px`,
                  borderColor: resolvedTextColor,
                  borderTopColor: "transparent",
                }}
              />
              <span
                className={sizeTokens.font}
                style={{ color: resolvedTextColor }}
              >
                {children}
              </span>
            </>
          ) : (
            <>
              {displayIcon && (
                <div
                  className="flex items-center justify-center shrink-0 transition-transform duration-200"
                  style={{
                    width: `${sizeTokens.icon}px`,
                    height: `${sizeTokens.icon}px`,
                    color: iconColor,
                    transform: isHovered && !isPressed ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  {typeof displayIcon === "string" ? (
                    <Image
                      src={displayIcon}
                      alt=""
                      width={sizeTokens.icon}
                      height={sizeTokens.icon}
                      className="object-contain"
                      style={{ color: iconColor }}
                    />
                  ) : React.isValidElement(displayIcon) ? (
                    React.cloneElement(displayIcon as React.ReactElement<{
                      size?: number
                      style?: React.CSSProperties
                      color?: string
                    }>, {
                      size: sizeTokens.icon,
                      color: iconColor,
                      style: {
                        color: iconColor,
                        ...((displayIcon as React.ReactElement<{ style?: React.CSSProperties }>).props?.style || {}),
                      },
                    })
                  ) : (
                    displayIcon
                  )}
                </div>
              )}
              <span
                className={sizeTokens.font}
                style={{ color: resolvedTextColor }}
              >
                {children}
              </span>
            </>
          )}
        </div>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button }
