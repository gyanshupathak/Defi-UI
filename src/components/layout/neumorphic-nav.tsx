"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { NavMenu, NavMenuItem } from "./nav-menu"

interface NeumorphicNavProps {
  logoImage?: string
  settingsIcon?: string
  ethereumLogo?: string
  activeMenuItem?: NavMenuItem
}

// Local images (downloaded from Figma)
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

  const handleLogoClick = () => {
    router.push("/")
  }

  return (
    <nav 
      className="relative w-full"
      style={{ 
        height: designTokens.spacing.navigation.height,
        backgroundColor: designTokens.colors.background.main 
      }}
    >
      {/* Container with same padding and max-width as page content */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{ paddingLeft: designTokens.spacing.navigation.paddingX, paddingRight: designTokens.spacing.navigation.paddingX }}
      >
        <div 
          className="relative w-full h-full flex items-center justify-between"
          style={{ maxWidth: designTokens.spacing.layout.maxWidth }}
        >
        {/* Logo - Left Side */}
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

        {/* Navigation Items - Right Side */}
        <div 
          className="flex items-center flex-shrink-0"
          style={{ gap: designTokens.spacing.navigation.itemsGap }}
        >
          {/* Nav Menu Component - Reusable with all variants */}
          <NavMenu activeItem={activeMenuItem} className="flex-shrink-0" />

        {/* Settings Button */}
        <button
          className="flex items-center justify-center shrink-0 hover:opacity-80 transition-all active:scale-95"
          style={{ 
            padding: designTokens.spacing.navigation.iconButtonPadding,
            borderRadius: designTokens.spacing.navigation.iconButtonRadius,
            width: designTokens.spacing.navigation.iconButtonSize,
            height: designTokens.spacing.navigation.iconButtonSize,
            backgroundColor: designTokens.colors.background.main,
            boxShadow: designTokens.shadows.navIcon
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

        {/* Divider */}
        <div className="flex flex-row items-center self-stretch">
          <div 
            className="h-full shrink-0"
            style={{ 
              width: designTokens.spacing.navigation.dividerWidth,
              backgroundColor: designTokens.colors.border.default 
            }}
          />
        </div>

        {/* Ethereum Chain Button */}
        <button
          className="flex items-center justify-center shrink-0 hover:opacity-80 transition-all active:scale-95"
          style={{ 
            padding: designTokens.spacing.navigation.iconButtonPadding,
            borderRadius: designTokens.spacing.navigation.iconButtonRadius,
            width: designTokens.spacing.navigation.iconButtonSize,
            height: designTokens.spacing.navigation.iconButtonSize,
            backgroundColor: designTokens.colors.background.main,
            boxShadow: designTokens.shadows.navIcon
          }}
          aria-label="Ethereum Chain"
        >
          <Image
            src={ethereumLogo}
            alt="Ethereum"
            width={parseInt(designTokens.spacing.navigation.iconSize)}
            height={parseInt(designTokens.spacing.navigation.iconSize)}
            className="object-contain"
            style={{ 
              width: designTokens.spacing.navigation.iconSize,
              height: designTokens.spacing.navigation.iconSize,
            }}
          />
        </button>

        {/* Connect Wallet Button */}
        <button
          className="flex items-center shrink-0 hover:opacity-90 transition-all active:scale-95"
          style={{ 
            height: designTokens.spacing.navigation.walletButtonHeight,
            paddingLeft: designTokens.spacing.navigation.walletButtonPaddingX,
            paddingRight: designTokens.spacing.navigation.walletButtonPaddingX,
            paddingTop: designTokens.spacing.navigation.walletButtonPaddingY,
            paddingBottom: designTokens.spacing.navigation.walletButtonPaddingY,
            borderRadius: designTokens.spacing.navigation.walletButtonRadius,
            backgroundColor: `${designTokens.colors.primary}26`, // 15% opacity (26 in hex)
            boxShadow: designTokens.shadows.connectWallet
          }}
        >
          <p 
            className={typographyClasses.button}
            style={{ color: designTokens.colors.primary }}
          >
            Connect Wallet
          </p>
        </button>
        </div>
        </div>
      </div>
    </nav>
  )
}
