"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
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
  activeItem: propActiveItem, 
  onItemClick,
  className 
}: NavMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const buttonRefs = React.useRef<Record<NavMenuItem, HTMLButtonElement | null>>(
    {} as Record<NavMenuItem, HTMLButtonElement | null>
  )

  // Automatically determine active item from pathname if not provided
  const activeItem = React.useMemo(() => {
    if (propActiveItem !== undefined) {
      return propActiveItem
    }
    
    // Match pathname to menu item
    for (const [key, config] of Object.entries(menuConfig)) {
      if (pathname === config.path || pathname.startsWith(config.path + '/')) {
        return key as NavMenuItem
      }
    }
    
    return "none"
  }, [propActiveItem, pathname])

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

  
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return
    
    
    container.scrollLeft = 0
  }, [])

  React.useEffect(() => {
    if (activeItem === "none") return

    const container = containerRef.current
    const btn = buttonRefs.current[activeItem]

    if (!container || !btn) return

    
    requestAnimationFrame(() => {
      const containerScrollLeft = container.scrollLeft
      const containerWidth = container.clientWidth
      const btnOffsetLeft = btn.offsetLeft
      const btnWidth = btn.offsetWidth
      
      
      const padding = 16
      
      
      const btnRight = btnOffsetLeft + btnWidth
      const visibleLeft = containerScrollLeft
      const visibleRight = containerScrollLeft + containerWidth
      
      
      if (btnRight > visibleRight - padding) {
        const newScrollLeft = btnRight - containerWidth + padding
        const maxScroll = container.scrollWidth - containerWidth
        container.scrollTo({
          left: Math.max(0, Math.min(newScrollLeft, maxScroll)),
          behavior: "smooth",
        })
      }
      
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
        "relative overflow-x-auto overflow-y-visible scrollbar-hide",
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
          paddingRight: "20px",
          marginTop: '-12px',
          marginBottom: '-12px',
          paddingTop: '12px',
          paddingBottom: '12px',
          overflow: 'visible',
        }}
      >
        {}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: designTokens.spacing.navigation.menu.radius,
            backgroundColor: designTokens.colors.background.main,
            boxShadow: designTokens.shadows.navContainer,
          }}
        />

        {}
        {activeItem !== "none" && activeRect && (
          <div
            className="absolute transition-all duration-200 z-10"
            style={{
              left: activeRect.left,
              width: activeRect.width,
              top: '-4px',
              bottom: '-4px',
              borderRadius: designTokens.spacing.navigation.menu.radius,
              paddingTop: designTokens.spacing.navigation.menu.activeTabPaddingY,
              paddingBottom:
                designTokens.spacing.navigation.menu.activeTabPaddingY,
              backgroundColor: designTokens.colors.background.main,
              boxShadow: '-4px -4px 8px 0px #FFFFFF, 4px 4px 8px 0px rgba(0,0,0,0.08)',
            }}
          />
        )}

        {}
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
