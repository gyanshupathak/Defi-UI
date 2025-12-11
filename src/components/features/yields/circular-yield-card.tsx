"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { designTokens } from "@/lib/design-system"
import { CurvedText } from "./curved-text"

interface CircularYieldCardProps {
  name: string
  symbol: string
  baseApy: number
  tvl: string
  fastRedeem: string
  sharePrice: string
  lifetimeReturns: string
  variant: "usd" | "eth" | "btc"
}

const strategyConfig = {
  usd: {
    color: designTokens.colors.strategy.usd,
    icon: "/images/icons/USD-stable.svg",
    tickerColor: designTokens.colors.strategy.usd,
  },
  eth: {
    color: designTokens.colors.strategy.eth,
    icon: "/images/icons/ETH-stable.svg",
    tickerColor: designTokens.colors.strategy.eth,
  },
  btc: {
    color: designTokens.colors.strategy.btc,
    icon: "/images/icons/BTC Stable (1).svg",
    tickerColor: designTokens.colors.strategy.btc,
  },
}

export function CircularYieldCard({
  name,
  symbol,
  baseApy,
  tvl,
  fastRedeem,
  sharePrice,
  lifetimeReturns,
  variant,
}: CircularYieldCardProps) {
  const config = strategyConfig[variant]
  const tokenIcon = config.icon

  // Container dimensions from Figma (exact match)
  // Frame: x="0" y="22" width="676" height="710"
  // Main circle: x="44" y="102" width="596" height="596" (relative to frame)
  const containerWidth = 676
  const containerHeight = 710
  const circleSize = 596
  const circleLeft = 44 // From Figma: x="44"
  const circleTop = 102 - 22 // From Figma: y="102" relative to frame at y="22"
  const centerX = circleLeft + circleSize / 2
  const centerY = circleTop + circleSize / 2

  // Radii for curved text (from Figma metadata)
  const valueRadius = 271 // For large value text ($5.6K, 21.44%, etc)
  const labelRadius = 253 // For label text (LIFETIME RETURNS, etc)

  return (
    <div
      className="relative"
      style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}
    >
      {/* Main circular container */}
      <div
        className="absolute"
        style={{ 
          left: `${circleLeft}px`, 
          top: `${circleTop}px`, 
          width: `${circleSize}px`, 
          height: `${circleSize}px` 
        }}
      >
        {/* Outer circle layer */}
        <div
          className="absolute rounded-full"
          style={{
            inset: 0,
            background: designTokens.colors.background.main,
            boxShadow: "4.496px 4.496px 13.488px rgba(127,86,217,0.12), -4.496px -4.496px 11.24px #fff",
            borderRadius: "329px",
          }}
        />

        {/* Middle circle layer */}
        <div
          className="absolute rounded-full border"
          style={{
            inset: 14,
            borderColor: "#fff",
            background: designTokens.colors.background.main,
            borderRadius: "11238.877px",
          }}
        />

        {/* Inner circle layer */}
        <div
          className="absolute rounded-full"
          style={{
            inset: 36,
            background: designTokens.colors.background.main,
            borderRadius: "11238.877px",
          }}
        />

        {/* Central logo/badge area - exact match from Figma */}
        <div
          className="absolute rounded-full border-2 flex flex-col items-center justify-center"
          style={{
            left: "50%",
            top: "50%",
            width: "230px",
            height: "230px",
            transform: "translate(-50%, -50%)",
            background: designTokens.colors.background.main,
            borderColor: "rgba(255,255,255,0.64)",
            borderRadius: "186.584px",
            borderWidth: "2.248px",
            zIndex: 10,
          }}
        >
          {/* Logo circle with shadow */}
          <div
            className="absolute rounded-full"
            style={{
              left: "50%",
              top: "50%",
              width: "134px",
              height: "134px",
              transform: "translate(-50%, -50%)",
              background: designTokens.colors.background.main,
              boxShadow: "3.799px 3.799px 11.398px rgba(127,86,217,0.12), -3.799px -3.799px 9.499px #fff",
              borderRadius: "9497.642px",
            }}
          >
            {/* Dashed border circle around icon */}
            <div
              className="absolute rounded-full"
              style={{
                left: "50%",
                top: "50%",
                width: "90px",
                height: "90px",
                transform: "translate(-50%, -50%)",
                border: "1px dashed",
                borderColor: config.tickerColor,
                borderRadius: "50%",
              }}
            />
            {/* Token icon in center */}
            <div
              className="absolute flex items-center justify-center"
              style={{
                left: "50%",
                top: "50%",
                width: "72px",
                height: "72px",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Image
                src={tokenIcon}
                alt={symbol}
                width={72}
                height={72}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Curved text sections - exact angles from Figma */}
        {/* BASE APY - Top */}
        <CurvedText
          text={`${baseApy.toFixed(2)}%`}
          radius={valueRadius}
          startAngle={348.401}
          fontSize={32}
          fontWeight="bold"
          centerX={centerX}
          centerY={centerY}
          color={designTokens.colors.text.primary}
        />
        <CurvedText
          text="BASE APY"
          radius={labelRadius}
          startAngle={350.673}
          fontSize={12}
          fontWeight="normal"
          centerX={centerX}
          centerY={centerY}
          color={designTokens.colors.text.primary}
          opacity={0.5}
        />

        {/* TVL - Right */}
        <CurvedText
          text={tvl}
          radius={valueRadius}
          startAngle={49.645}
          fontSize={32}
          fontWeight="bold"
          centerX={centerX}
          centerY={centerY}
          color={designTokens.colors.text.primary}
        />
        <CurvedText
          text="TVL"
          radius={labelRadius}
          startAngle={58.927}
          fontSize={12}
          fontWeight="normal"
          centerX={centerX}
          centerY={centerY}
          color={designTokens.colors.text.primary}
          opacity={0.5}
        />

        {/* FAST REDEEM - Bottom Right */}
        <CurvedText
          text={fastRedeem}
          radius={valueRadius}
          startAngle={68.444}
          fontSize={32}
          fontWeight="bold"
          centerX={centerX}
          centerY={centerY}
          color={designTokens.colors.text.primary}
        />
        <CurvedText
          text="FAST REDEEM"
          radius={labelRadius}
          startAngle={73.418}
          fontSize={12.188}
          fontWeight="normal"
          centerX={centerX}
          centerY={centerY}
          color={designTokens.colors.text.primary}
          opacity={0.5}
        />

        {/* SHARE PRICE - Left */}
        <CurvedText
          text={sharePrice}
          radius={valueRadius}
          startAngle={306.151}
          fontSize={32}
          fontWeight="bold"
          centerX={centerX}
          centerY={centerY}
          color={designTokens.colors.text.primary}
        />
        <CurvedText
          text="SHARE PRICE"
          radius={labelRadius}
          startAngle={301.181}
          fontSize={12.188}
          fontWeight="normal"
          centerX={centerX}
          centerY={centerY}
          color={designTokens.colors.text.primary}
          opacity={0.5}
        />

        {/* LIFETIME RETURNS - Top Left */}
        <CurvedText
          text={lifetimeReturns}
          radius={valueRadius}
          startAngle={290.532}
          fontSize={32}
          fontWeight="bold"
          centerX={centerX}
          centerY={centerY}
          color={designTokens.colors.text.primary}
        />
        <CurvedText
          text="LIFETIME RETURNS"
          radius={labelRadius}
          startAngle={281.959}
          fontSize={12}
          fontWeight="normal"
          centerX={centerX}
          centerY={centerY}
          color={designTokens.colors.text.primary}
          opacity={0.5}
        />

        {/* Share price icon - exact position from Figma */}
        {/* From Figma: x="144.3984375" y="446.97265625" relative to frame */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: `${144.3984375 - 22}px`, // Adjust for frame offset
            top: `${446.97265625 - 22}px`, // Adjust for frame offset
            width: "30.211px",
            height: "30.211px",
            transform: "rotate(72.113deg)",
          }}
        >
          <div
            className="relative"
            style={{
              width: "24px",
              height: "24px",
            }}
          >
            <Image
              src={tokenIcon}
              alt="token"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
        </div>

        {/* Central name text (curved around center) - exact from Figma */}
        <CurvedText
          text={name}
          radius={115}
          startAngle={310.529}
          fontSize={10.125}
          fontWeight="semibold"
          centerX={centerX}
          centerY={centerY}
          color={config.tickerColor}
        />

        {/* Symbol/ticker text (curved around center, smaller radius) - exact from Figma */}
        <CurvedText
          text={symbol}
          radius={22}
          startAngle={17.664}
          fontSize={10}
          fontWeight="semibold"
          centerX={centerX}
          centerY={centerY}
          color={designTokens.colors.text.primary}
        />

        {/* DEPOSIT button - Bottom - exact from Figma */}
        <Button
          variant="blue"
          style={{
            position: "absolute",
            left: "50%",
            top: `${circleTop + circleSize - 40}px`, // Positioned at bottom of circle
            width: "232px",
            height: "116px",
            borderRadius: "28px",
            paddingLeft: 0,
            paddingRight: 0,
            boxShadow: "0px 16px 32px rgba(92,150,228,0.28)",
            transform: "translate(-50%, 0)",
            background: "#5C96E4",
          }}
        >
          <div className="flex flex-col items-center justify-center leading-tight" style={{ gap: "4px" }}>
            <span
              style={{
                fontSize: "12.188px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#fff",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                lineHeight: "normal",
              }}
            >
              INITIATE
            </span>
            <span
              style={{
                fontSize: "24.18px",
                fontWeight: 700,
                letterSpacing: "0.02em",
                color: "#fff",
                fontFamily: "'Hanken Grotesk', sans-serif",
                lineHeight: "normal",
              }}
            >
              DEPOSIT
            </span>
          </div>
        </Button>

        {/* Flagship ribbon banner - Top - exact from Figma */}
        {/* Banner should be positioned relative to the circle, not container */}
        <div
          className="absolute flex flex-col items-center"
          style={{
            left: `${centerX}px`,
            top: `${circleTop - 20}px`, // Positioned above the circle
            transform: "translate(-50%, 0)",
            paddingBottom: "12.227px",
            zIndex: 20,
          }}
        >
          {/* Ribbon base */}
          <div
            className="flex items-center justify-center"
            style={{
              padding: "3.396px 10.529px",
              background: "linear-gradient(180deg, #9071fb 0%, #5433c7 100%)",
              marginBottom: "-12.227px",
              zIndex: 2,
              borderRadius: "2px",
            }}
          >
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: "7.13px",
                lineHeight: "10.529px",
                color: "#fff",
                textAlign: "center",
                whiteSpace: "nowrap",
                letterSpacing: "0.01em",
              }}
            >
              Flagship
            </p>
          </div>
          {/* Ribbon tails container */}
          <div
            className="absolute flex items-center justify-between"
            style={{
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "40px",
              height: "12.227px",
              zIndex: 1,
            }}
          >
            {/* Left ribbon tail */}
            <div
              className="absolute"
              style={{
                left: "-17.321px",
                bottom: 0,
                width: 0,
                height: 0,
                borderLeft: "8.6605px solid transparent",
                borderRight: "8.6605px solid transparent",
                borderTop: "12.227px solid",
                borderTopColor: "#5433c7",
              }}
            />
            {/* Right ribbon tail */}
            <div
              className="absolute"
              style={{
                right: "-17.321px",
                bottom: 0,
                width: 0,
                height: 0,
                borderLeft: "8.6605px solid transparent",
                borderRight: "8.6605px solid transparent",
                borderTop: "12.227px solid",
                borderTopColor: "#5433c7",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
