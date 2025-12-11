"use client"

import { designTokens, typographyClasses } from "@/lib/design-system"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ChartEmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
  variant?: "default" | "compact" | "portfolio"
}

/**
 * Shared empty state used across charts (TVL, Allocations, Portfolio).
 * Keeps a consistent neumorphic look while staying neutral when the user
 * has not deposited yet.
 */
export function ChartEmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className,
  variant = "default",
}: ChartEmptyStateProps) {
  const padding = variant === "compact" ? "20px" : "28px"

  const styleByVariant =
    variant === "portfolio"
      ? {
          containerBg: "#FFFFFF",
          border: "transparent",
          shadow: designTokens.shadows.graphInner,
          gap: "14px",
          iconBg: `${designTokens.colors.primary}1A`,
          iconSize: "64px",
        }
      : {
          containerBg: "rgba(255,255,255,0.88)",
          border: designTokens.colors.border.white,
          shadow: designTokens.shadows.graphInner,
          gap: "12px",
          iconBg: `${designTokens.colors.primary}1A`,
          iconSize: "64px",
        }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center rounded-[16px] border border-solid",
        className
      )}
      style={{
        padding,
        gap: styleByVariant.gap,
        width: "100%",
        height: "100%",
        backgroundColor: styleByVariant.containerBg,
        borderColor: styleByVariant.border,
        boxShadow: styleByVariant.shadow,
      }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: styleByVariant.iconSize || "64px",
          height: styleByVariant.iconSize || "64px",
          backgroundColor: styleByVariant.iconBg,
        }}
      >
        {}
        {variant === "portfolio" ? (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http:
            <path
              d="M14 7V21M7 14H21"
              stroke={designTokens.colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http:
            <path
              d="M14 3.5V11M14 17V24.5M7 14H14M14 14H21"
              stroke={designTokens.colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      <p
        className={typographyClasses.heading1}
        style={{ color: designTokens.colors.text.primary }}
      >
        {title}
      </p>

      {description && (
        <p
          className={typographyClasses.subtext}
          style={{ color: designTokens.colors.text.muted, maxWidth: "360px" }}
        >
          {description}
        </p>
      )}

      {actionLabel && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

interface ApyEmptyStateProps {
  title: string
  description?: string
  className?: string
}

/**
 * Separate empty state for the Base APY chart as per design –
 * lighter treatment without the action button.
 */
export function ApyEmptyState({ title, description, className }: ApyEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center rounded-[16px] border border-dashed",
        className
      )}
      style={{
        padding: "20px",
        gap: "10px",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(244, 240, 255, 0.6)",
        borderColor: designTokens.colors.border.gradient,
      }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: "56px",
          height: "56px",
          backgroundColor: `${designTokens.colors.primary}12`,
        }}
      >
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http:
          <path
            d="M7 17C8.33333 15.3333 10.3333 14.5 13 14.5C15.6667 14.5 17.6667 15.3333 19 17M10 10.5C10 11.8807 11.1193 13 12.5 13C13.8807 13 15 11.8807 15 10.5C15 9.11929 13.8807 8 12.5 8C11.1193 8 10 9.11929 10 10.5Z"
            stroke={designTokens.colors.primary}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p
        className={typographyClasses.heading2}
        style={{ color: designTokens.colors.text.primary }}
      >
        {title}
      </p>

      {description && (
        <p
          className={typographyClasses.subtext}
          style={{ color: designTokens.colors.text.muted, maxWidth: "320px" }}
        >
          {description}
        </p>
      )}
    </div>
  )
}
