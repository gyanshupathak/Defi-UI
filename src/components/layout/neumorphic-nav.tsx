"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { NavMenu, NavMenuItem } from "./nav-menu"
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button"
import { NetworkSelector } from "@/components/wallet/network-selector"
import { useAnalytics } from "@/lib/hooks/use-analytics"

interface NeumorphicNavProps {
  logoImage?: string
  settingsIcon?: string
  ethereumLogo?: string
  activeMenuItem?: NavMenuItem
}
const DEFAULT_IMAGES = {
  logo: "/images/icons/logo.svg",
  settings: "/images/icons/setting-icon.svg",
  ethereum: "/images/icons/eth.svg",
}

export function NeumorphicNav({
  logoImage = DEFAULT_IMAGES.logo,
  settingsIcon = DEFAULT_IMAGES.settings,
  ethereumLogo = DEFAULT_IMAGES.ethereum,
  activeMenuItem = "none",
}: NeumorphicNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { analytics } = useAnalytics()

  const isBridgeContext = pathname === "/bridge" || pathname === "/deposit" || pathname === "/withdraw"

  const handleLogoClick = () => {
    analytics.logoClicked()
    router.push("/")
  }

  const handleSettingsClick = () => {
    analytics.settingsClicked()
  }

  return (
    <div 
      className="relative w-full z-10" 
      style={{ 
        marginTop: '-12px',
        marginBottom: '-12px',
        paddingTop: '12px',
        paddingBottom: '12px',
        overflow: 'visible',
        isolation: 'isolate',
        transform: 'translateZ(0)',
      }}
    >
      <nav 
        className="relative w-full"
        style={{ 
          height: designTokens.spacing.navigation.height,
          backgroundColor: designTokens.colors.background.main,
          overflow: 'visible',
        }}
      >
        <div 
          className="relative w-full h-full flex items-center justify-center"
          style={{ 
            paddingLeft: designTokens.spacing.layout.containerPadding, 
            paddingRight: designTokens.spacing.layout.containerPadding,
            overflow: 'visible',
          }}
        >
        <div 
          className="relative w-full h-full flex items-center justify-between mx-auto"
          style={{ maxWidth: designTokens.spacing.layout.maxWidth }}
        >
        <button
          onClick={handleLogoClick}
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          style={{ 
            gap: designTokens.spacing.navigation.logoGap,
            height: designTokens.spacing.navigation.logoHeight,
            background: 'transparent',
            border: 'none',
            padding: 0,
          }}
        >
          {logoImage && (
            <Image
              src={logoImage}
              alt="Lucidly Logo"
              width={parseFloat(designTokens.spacing.navigation.logoSize)}
              height={parseFloat(designTokens.spacing.navigation.logoSize)}
              className="object-contain"
              style={{ 
                width: designTokens.spacing.navigation.logoSize,
                height: designTokens.spacing.navigation.logoSize,
              }}
              priority
            />
          )}
          <p 
            className={typographyClasses.logo}
            style={{ 
              fontSize: designTokens.spacing.navigation.logoTextSize,
              letterSpacing: designTokens.spacing.navigation.logoTracking,
              color: designTokens.colors.text.primary,
            }}
          >
            LUCIDLY
          </p>
        </button>
        <div 
          className="flex items-center flex-shrink-0"
          style={{ gap: designTokens.spacing.navigation.itemsGap }}
        >
          <NavMenu activeItem={activeMenuItem} className="flex-shrink-0" />
          <button
            key="settings-button"
            onClick={handleSettingsClick}
            className="flex items-center justify-center shrink-0 hover:opacity-80 transition-all active:scale-95"
            style={{ 
              padding: designTokens.spacing.navigation.iconButtonPadding,
              borderRadius: designTokens.spacing.navigation.iconButtonRadius,
              width: designTokens.spacing.navigation.iconButtonSize,
              height: designTokens.spacing.navigation.iconButtonSize,
              backgroundColor: designTokens.colors.background.main,
              boxShadow: designTokens.shadows.navIcon,
              position: 'relative',
              zIndex: 1,
            }}
            aria-label="Settings"
          >
            <Image
              src={settingsIcon}
              alt="Settings"
              width={parseInt(designTokens.spacing.navigation.iconSize)}
              height={parseInt(designTokens.spacing.navigation.iconSize)}
              className="object-contain"
              style={{ 
                width: designTokens.spacing.navigation.iconSize,
                height: designTokens.spacing.navigation.iconSize,
              }}
            />
          </button>
          <div className="flex flex-row items-center self-stretch">
            <div 
              className="h-full shrink-0"
              style={{ 
                width: designTokens.spacing.navigation.dividerWidth,
                backgroundColor: designTokens.colors.border.default 
              }}
            />
          </div>
          <div key="network-selector-wrapper" style={{ position: 'relative', zIndex: 1 }}>
            <NetworkSelector ethereumLogo={ethereumLogo} />
          </div>
          <ConnectWalletButton
            isBridgeContext={isBridgeContext}
            className="shrink-0"
          />
        </div>
        </div>
      </div>
    </nav>
    </div>
  )
}
