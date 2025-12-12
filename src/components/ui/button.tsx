"use client"

import * as React from "react"
import Image from "next/image"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { designTokens } from "@/lib/design-system"

type ButtonSize = "default" | "sm" | "xs"
type ButtonVariant =
  | "default" 
  | "outline" 
  | "blue" 
  | "deposit"
  | "withdraw" 
  | "inactive"
  | "usd"
  | "eth"
  | "btc"
  | "cancel"
  | "connectWallet"

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  asChild?: boolean
  size?: ButtonSize
  icon?: React.ReactNode | string
  loading?: boolean
  showDepositIcon?: boolean
  showWithdrawIcon?: boolean
  /** Legacy variant prop - maps to bgColor/textColor */
  variant?: ButtonVariant
  /** Custom background color - defaults to variant or design primary color */
  bgColor?: string
  /** Custom text color - defaults to variant or white */
  textColor?: string
  /** Custom width - defaults to auto */
  width?: string | number
  /** Custom height - defaults to size-based */
  height?: string | number
  /** Custom style prop for additional overrides */
  style?: React.CSSProperties
  children?: React.ReactNode
  /** For connectWallet variant: if true, uses solid #7f56d9 (for bridge deposit/withdraw pages), otherwise rgba(127, 86, 217, 0.15) */
  isBridgeContext?: boolean
}

// Map variants to colors
const getVariantColors = (variant?: ButtonVariant, isBridgeContext?: boolean): { bg: string; text: string } => {
  if (!variant || variant === "default") {
    return { bg: designTokens.colors.primary, text: "#FFFFFF" }
  }
  
  switch (variant) {
    case "blue":
    case "deposit":
      return { bg: "#5C96E4", text: "#FFFFFF" }
    case "outline":
    case "withdraw":
      return { bg: "#E4EBFF", text: "#2B66FF" }
    case "usd":
      return { bg: designTokens.colors.strategy.usd, text: "#FFFFFF" }
    case "eth":
      return { bg: designTokens.colors.strategy.eth, text: "#FFFFFF" }
    case "btc":
      return { bg: designTokens.colors.strategy.btc, text: "#FFFFFF" }
    case "cancel":
      return { bg: designTokens.colors.background.main, text: "#E91E21" }
    case "inactive":
      return { bg: "#BDBDBD", text: "#757575" }
    case "connectWallet":
      // Solid primary color for bridge/deposit/withdraw pages, otherwise rgba(127, 86, 217, 0.15)
      // Text color: white on bridge/deposit/withdraw pages, primary color otherwise
      return { 
        bg: isBridgeContext ? designTokens.colors.primary : "rgba(127, 86, 217, 0.15)", 
        text: isBridgeContext ? "#FFFFFF" : designTokens.colors.primary
      }
    default:
      return { bg: designTokens.colors.primary, text: "#FFFFFF" }
  }
}

type ButtonState = "default" | "pressed" | "loading" | "disabled" | "hover"

interface ButtonStyles {
  background: string
  text: string
  shadow: string
  border?: string
}

const getButtonStyles = (
  state: ButtonState,
  bgColor: string,
  textColor: string,
  hasBorder: boolean = false,
  size: ButtonSize = "default",
  variant?: ButtonVariant
): ButtonStyles => {
  // Neumorphic shadow pattern from Figma: white highlight top-left, darker shadow bottom-right
  const baseShadow = "-4px -4px 4px #FFF, 4px 4px 8px rgba(127, 86, 217, 0.15)"
  // Connect wallet button uses different shadow and border
  const connectWalletShadow = "-4px -4px 5px 0px #FFFFFF, 4px 4px 5px 0px rgba(0,0,0,0.08)"
  const borderColor = "#F4F0FF"
  
  // Connect wallet button uses 3px border, others use 4px
  const borderWidth = variant === "connectWallet" ? "3px" : "4px"
  const shadow = variant === "connectWallet" ? connectWalletShadow : baseShadow
  
  const baseStyles = {
    background: bgColor,
    text: textColor,
    shadow: shadow,
    border: hasBorder ? "1px solid #D5E2FF" : `${borderWidth} solid ${borderColor}`,
  }
  
  switch (state) {
    case "default":
      return baseStyles
    case "hover":
      // On hover, only icon animates, nothing else changes
      return baseStyles
    case "pressed":
      // Pressed state: slightly reduced shadow for pressed effect
      return {
        ...baseStyles,
        shadow: "-2px -2px 2px #FFF, 2px 2px 4px rgba(127, 86, 217, 0.2)",
        border: hasBorder ? "1px solid #C0D0FF" : `4px solid ${borderColor}`,
      }
    case "loading":
      return baseStyles
    case "disabled":
      return {
        background: "#BDBDBD",
        text: "#757575",
        shadow: "0px 8px 16px rgba(0, 0, 0, 0.08)",
        border: hasBorder ? "1px solid #E1E8FB" : `${borderWidth} solid ${borderColor}`,
      }
    default:
      return baseStyles
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
    font: "font-['Hanken_Grotesk',sans-serif] font-medium leading-[24px] text-[16px]",
  },
  sm: {
    height: 40,
    paddingX: 16,
    gap: 8,
    icon: 20,
    font: "font-['Hanken_Grotesk',sans-serif] font-medium leading-[20px] text-[14px]",
  },
  xs: {
    height: 32,
    paddingX: 12,
    gap: 4,
    icon: 12,
    font: "font-['Hanken_Grotesk',sans-serif] font-medium leading-[16px] text-[12px]",
  },
}

// Deposit Icon SVG Component
const DepositIcon = ({ size, color, isHovered }: { size: number; color: string; isHovered?: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
    style={{ transformOrigin: "center" }}
  >
    <g className={cn(isHovered && "deposit-arrow-animate")}>
      <path
        d="M15.2513 10V3.33333M15.2513 3.33333L17.5846 5.83333M15.2513 3.33333L12.918 5.83333"
        stroke={color}
        strokeWidth="0.666667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <path
      d="M11.6667 9.29387C11.6667 10.2846 9.61464 11.0877 7.08333 11.0877C4.55203 11.0877 2.5 10.2846 2.5 9.29387M11.6667 9.29387C11.6667 8.30314 9.61464 7.5 7.08333 7.5C4.55203 7.5 2.5 8.30314 2.5 9.29387M11.6667 9.29387V14.9745M2.5 9.29387V14.9745M11.6667 12.0843C11.6667 13.075 9.61464 13.8782 7.08333 13.8782C4.55203 13.8782 2.5 13.075 2.5 12.0843M11.6667 14.8728C11.6667 15.8635 9.61464 16.6667 7.08333 16.6667C4.55203 16.6667 2.5 15.8635 2.5 14.8728"
      stroke={color}
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Withdraw Icon SVG Component
const WithdrawIcon = ({ size, color, isHovered }: { size: number; color: string; isHovered?: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
    style={{ transformOrigin: "center" }}
  >
    <g className={cn(isHovered && "withdraw-arrow-animate")}>
      <path
        d="M15.2513 10V16.6667M15.2513 16.6667L17.5846 14.1667M15.2513 16.6667L12.918 14.1667"
        stroke={color}
        strokeWidth="0.666667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <path
      d="M11.6667 10.7061C11.6667 9.71539 9.61464 8.91228 7.08333 8.91228C4.55203 8.91228 2.5 9.71539 2.5 10.7061M11.6667 10.7061C11.6667 11.6969 9.61464 12.5 7.08333 12.5C4.55203 12.5 2.5 11.6969 2.5 10.7061M11.6667 10.7061V5.02554M2.5 10.7061V5.02554M11.6667 7.91572C11.6667 6.925 9.61464 6.12188 7.08333 6.12188C4.55203 6.12188 2.5 6.925 2.5 7.91572M11.6667 5.12723C11.6667 4.13651 9.61464 3.33339 7.08333 3.33339C4.55203 3.33339 2.5 4.13651 2.5 5.12723"
      stroke={color}
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
      size = "default",
      icon,
      loading = false,
      showDepositIcon = false,
      showWithdrawIcon = false,
      variant,
      bgColor,
      textColor,
      width,
      height,
      style: userStyle,
      disabled,
      children,
      type,
      isBridgeContext = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const [buttonState, setButtonState] = React.useState<ButtonState>("default")
    const [isHovered, setIsHovered] = React.useState(false)

    // Get colors from variant or use provided colors
    const variantColors = getVariantColors(variant, isBridgeContext)
    const finalBgColor = bgColor ?? variantColors.bg
    const finalTextColor = textColor ?? variantColors.text
    const isInactive = disabled || variant === "inactive"

    // Determine current state
    React.useEffect(() => {
      if (isInactive) {
        setButtonState("disabled")
      } else if (loading) {
        setButtonState("loading")
      } else if (buttonState === "pressed") {
        // Keep pressed state if mouse is down
        return
    } else if (isHovered) {
        setButtonState("hover")
      } else {
        setButtonState("default")
      }
    }, [isInactive, loading, isHovered, buttonState])

    const hasBorder = variant === "outline"
    const styles = getButtonStyles(buttonState, finalBgColor, finalTextColor, hasBorder, size, variant)
    // Connect wallet button has specific dimensions with reduced height
    const isConnectWallet = variant === "connectWallet"
    const sizeTokens = isConnectWallet 
      ? { height: 0, paddingX: 16, paddingY: 10, gap: 8, icon: 20, font: "font-['Hanken_Grotesk',sans-serif] font-medium leading-[16px] text-[16px]" }
      : (sizeMap[size] ?? sizeMap.default)

    // Determine icon to display
    let displayIcon: React.ReactNode = null
    const iconColor = styles.text

    if (showDepositIcon) {
      displayIcon = <DepositIcon size={sizeTokens.icon} color={iconColor} isHovered={isHovered && !disabled && !loading} />
    } else if (showWithdrawIcon) {
      displayIcon = <WithdrawIcon size={sizeTokens.icon} color={iconColor} isHovered={isHovered && !disabled && !loading} />
    } else if (icon) {
      displayIcon = icon
    }

    // Check if className contains w-full to handle width properly
    const hasFullWidth = className?.includes("w-full")
    const computedWidth = width 
      ? (typeof width === "number" ? `${width}px` : width)
      : hasFullWidth 
        ? "100%" 
        : "auto"

    const buttonStyle: React.CSSProperties = {
      backgroundColor: styles.background,
      color: styles.text,
      boxShadow: styles.shadow,
      borderRadius: "9999px",
      height: height ? (typeof height === "number" ? `${height}px` : height) : isConnectWallet ? "auto" : `${sizeTokens.height}px`,
      paddingLeft: `${sizeTokens.paddingX}px`,
      paddingRight: `${sizeTokens.paddingX}px`,
      ...(isConnectWallet && 'paddingY' in sizeTokens ? {
        paddingTop: `${sizeTokens.paddingY}px`,
        paddingBottom: `${sizeTokens.paddingY}px`,
      } : {}),
      width: computedWidth,
      outline: "none",
      border: styles.border,
      boxSizing: "border-box",
      cursor: isInactive || loading ? "not-allowed" : "pointer",
      transition: "all 0.2s ease-in-out",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      ...userStyle,
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !loading) {
        setButtonState("pressed")
      }
      props.onMouseDown?.(e)
    }

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !loading) {
        setButtonState(isHovered ? "hover" : "default")
      }
      props.onMouseUp?.(e)
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !loading) {
        setIsHovered(true)
        if (buttonState !== "pressed") {
          setButtonState("hover")
        }
      }
      props.onMouseEnter?.(e)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(false)
      if (buttonState !== "pressed") {
        setButtonState("default")
      }
      props.onMouseLeave?.(e)
    }

    return (
      <Comp
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center whitespace-nowrap focus-visible:outline-none",
          className
        )}
        style={buttonStyle}
        disabled={isInactive || loading}
        aria-busy={loading}
        data-state={buttonState}
        data-variant={variant}
        type={type ?? "button"}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <div
          className="relative flex items-center justify-center"
          style={{ gap: `${sizeTokens.gap}px` }}
        >
          {loading ? (
            <>
              <div
                className="border-2 border-t-transparent rounded-full shrink-0 animate-spin"
                style={{
                  width: `${sizeTokens.icon}px`,
                  height: `${sizeTokens.icon}px`,
                  borderColor: styles.text,
                  borderTopColor: "transparent",
                }}
              />
              <span
                className={sizeTokens.font}
                style={{ color: styles.text }}
              >
                {children}
              </span>
            </>
          ) : (
            <>
              {displayIcon && (
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: `${sizeTokens.icon}px`,
                    height: `${sizeTokens.icon}px`,
                    color: iconColor,
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
                      isHovered?: boolean
                    }>, {
                      size: sizeTokens.icon,
                      color: iconColor,
                      isHovered: isHovered && !disabled && !loading,
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
                style={{ color: styles.text }}
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
