"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { cn } from "@/lib/utils"

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
  activeItem = "none", 
  onItemClick,
  className 
}: NavMenuProps) {
  const router = useRouter()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const buttonRefs = React.useRef<Record<NavMenuItem, HTMLButtonElement | null>>(
    {} as Record<NavMenuItem, HTMLButtonElement | null>
  )

  const [activeRect, setActiveRect] = React.useState<{ left: number; width: number } | null>(null)

  React.useLayoutEffect(() => {
    if (activeItem === "none") {
      setActiveRect(null)
      return
    }

    const container = containerRef.current
    const btn = buttonRefs.current[activeItem]

    if (!container || !btn) return

    const containerScrollLeft = container.scrollLeft
    const btnOffsetLeft = btn.offsetLeft

    setActiveRect({
      left: btnOffsetLeft,
      width: btn.offsetWidth,
    })
  }, [activeItem])

  // Ensure container starts at the beginning to show leftmost tabs
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return
    
    // Start at scrollLeft 0 to show Yields and other left tabs
    container.scrollLeft = 0
  }, [])

  React.useEffect(() => {
    if (activeItem === "none") return

    const container = containerRef.current
    const btn = buttonRefs.current[activeItem]

    if (!container || !btn) return

    // Use requestAnimationFrame to ensure layout is complete
    requestAnimationFrame(() => {
      const containerScrollLeft = container.scrollLeft
      const containerWidth = container.clientWidth
      const btnOffsetLeft = btn.offsetLeft
      const btnWidth = btn.offsetWidth
      
      // Calculate padding to ensure full visibility
      const padding = 16
      
      // Check if button is fully visible
      const btnRight = btnOffsetLeft + btnWidth
      const visibleLeft = containerScrollLeft
      const visibleRight = containerScrollLeft + containerWidth
      
      // If button is cut off on the right, scroll to show it fully
      if (btnRight > visibleRight - padding) {
        const newScrollLeft = btnRight - containerWidth + padding
        const maxScroll = container.scrollWidth - containerWidth
        container.scrollTo({
          left: Math.max(0, Math.min(newScrollLeft, maxScroll)),
          behavior: "smooth",
        })
      }
      // If button is cut off on the left, scroll to show it fully
      else if (btnOffsetLeft < visibleLeft + padding) {
        const newScrollLeft = Math.max(0, btnOffsetLeft - padding)
        container.scrollTo({
          left: newScrollLeft,
          behavior: "smooth",
        })
      }
    })
  }, [activeItem])

  const handleItemClick = (key: NavMenuItem) => {
    if (key === "none") return

    const path = menuConfig[key].path
    router.push(path)
    onItemClick?.(key)
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-x-auto overflow-y-hidden scrollbar-hide",
        className
      )}
      style={{
        height: designTokens.spacing.navigation.menu.height,
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
          paddingLeft: "4px",
          paddingRight: "20px", // Increased padding to ensure last item is fully visible
        }}
      >
        {/* Neumorphic background pill */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            borderRadius: designTokens.spacing.navigation.menu.radius,
            backgroundColor: designTokens.colors.background.main,
            boxShadow: designTokens.shadows.navContainer,
          }}
        />

        {/* Active tab pill – width & position come from measured button rect */}
        {activeItem !== "none" && activeRect && (
          <div
            className="absolute top-0 bottom-0 transition-all duration-200 z-10"
            style={{
              left: activeRect.left,
              width: activeRect.width,
              borderRadius: designTokens.spacing.navigation.menu.radius,
              paddingTop: designTokens.spacing.navigation.menu.activeTabPaddingY,
              paddingBottom:
                designTokens.spacing.navigation.menu.activeTabPaddingY,
              backgroundColor: designTokens.colors.background.main,
              boxShadow: designTokens.shadows.navButton,
            }}
          />
        )}

        {/* Nav items */}
        {NAV_ITEMS.map((key) => {
          const item = menuConfig[key]
          const isActive = activeItem === key

          return (
            <button
              key={key}
              ref={(el) => {
                buttonRefs.current[key] = el
              }}
              onClick={() => handleItemClick(key)}
              className={cn(
                "relative z-20 flex items-center justify-center border-none bg-transparent cursor-pointer whitespace-nowrap",
                typographyClasses.button
              )}
              style={{
                paddingLeft: designTokens.spacing.navigation.menu.activeTabPaddingX,
                paddingRight: designTokens.spacing.navigation.menu.activeTabPaddingX,
                color: isActive
                  ? designTokens.colors.text.primary
                  : designTokens.colors.text.muted,
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
