"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { designTokens } from "@/lib/design-system"
import { cn } from "@/lib/utils"
import { useAnalytics } from "@/lib/hooks/use-analytics"

export type NavMenuItem = "yields" | "bridge" | "portfolio" | "docs" | "none"

interface NavMenuProps {
  activeItem?: NavMenuItem
  onItemClick?: (item: NavMenuItem) => void
  className?: string
}

const menuConfig = {
  yields: {
    label: "Yields",
    path: "/yields",
  },
  bridge: {
    label: "Bridge",
    path: "/bridge",
  },
  portfolio: {
    label: "Portfolio",
    path: "/portfolio",
  },
  docs: {
    label: "Docs",
    path: "/docs",
  },
} as const

const NAV_ITEMS: Exclude<NavMenuItem, "none">[] = [
  "yields",
  "bridge",
  "portfolio",
  "docs",
]

export function NavMenu({ 
  activeItem: propActiveItem, 
  onItemClick,
  className 
}: NavMenuProps) {

  const router = useRouter()
  const pathname = usePathname()
  const { analytics } = useAnalytics()

  const containerRef = React.useRef<HTMLDivElement>(null)

  const activeItem = React.useMemo(() => {
    if (propActiveItem !== undefined) {
      return propActiveItem
    }

    for (const [key, config] of Object.entries(menuConfig)) {
      if (pathname === config.path || pathname.startsWith(config.path + "/")) {
        return key as NavMenuItem
      }
    }

    return "none"
  }, [propActiveItem, pathname])

  const handleItemClick = (key: NavMenuItem) => {
    if (key === "none") return

    // Track navigation menu change
    analytics.navMenuChanged(key, menuConfig[key].path)
    
    router.push(menuConfig[key].path)
    onItemClick?.(key)
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-x-auto overflow-y-visible scrollbar-hide",
        className
      )}
      style={{
        paddingTop: "8px",
        paddingBottom: "8px",
        paddingLeft: "8px",
        paddingRight: "8px",
        minWidth: designTokens.spacing.navigation.menu.width,
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        scrollPaddingLeft: "16px",
        scrollPaddingRight: "16px",
      }}
    >
      <div
        className="relative inline-flex items-center"
        style={{
          height: designTokens.spacing.navigation.menu.height,
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          overflow: "visible",
          borderRadius: designTokens.spacing.navigation.menu.radius,
          backgroundColor: designTokens.colors.background.main,
          boxShadow: designTokens.shadows.navContainer,
        }}
      >
        {NAV_ITEMS.map((key) => {
          const item = menuConfig[key]
          const isActive = activeItem === key

          return (
            <button
              key={key}
              onClick={() => handleItemClick(key)}
              className={cn(
                "relative z-20 flex items-center justify-center border-none cursor-pointer whitespace-nowrap",
                "font-medium text-[16px] leading-[26px] font-['Hanken_Grotesk',sans-serif]"
              )}
              style={{
                height: designTokens.spacing.navigation.menu.height,
                paddingLeft: designTokens.spacing.navigation.menu.activeTabPaddingX,
                paddingRight: designTokens.spacing.navigation.menu.activeTabPaddingX,
                paddingTop: designTokens.spacing.navigation.menu.activeTabPaddingY,
                paddingBottom: designTokens.spacing.navigation.menu.activeTabPaddingY,
                borderRadius: designTokens.spacing.navigation.menu.radius,
                backgroundColor: isActive ? designTokens.colors.background.main : "transparent",
                boxShadow: isActive 
                  ? "4px 4px 8px 0px rgba(0,0,0,0.08), -4px -4px 8px 0px #FFFFFF"
                  : "none",
                color: isActive
                  ? designTokens.colors.text.primary
                  : designTokens.colors.text.muted,
                transition: "all 200ms ease",
              }}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
