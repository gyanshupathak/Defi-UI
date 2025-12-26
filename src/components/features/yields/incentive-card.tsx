"use client"

import * as React from "react"
import Image from "next/image"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"

const { popIn, popInHover } = shadows

interface IncentiveCardProps {
  multiplier: string
  title: string
  description: string
  logoPath: string
  redirectUrl?: string
  onCardClick?: () => void
}

export function IncentiveCard({ multiplier, title, description, logoPath, redirectUrl, onCardClick }: IncentiveCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)
  const fallbackLogo = "/images/icons/liquidity-land.png"
  const effectiveLogoPath = imageError ? fallbackLogo : (logoPath || fallbackLogo)

  return (
    <div 
      className="relative cursor-pointer"
      style={{
        width: '202px',
        borderRadius: designTokens.spacing.card.borderRadius,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onCardClick}
    >
      <div 
        className="absolute inset-0 transition-all duration-200"
        style={{
          backgroundColor: designTokens.colors.background.main,
          boxShadow: designTokens.shadows.popOut,
          borderRadius: designTokens.spacing.card.borderRadius,
        }}
      >
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-200"
          style={{
            boxShadow: isHovered ? popInHover : popIn,
            borderRadius: designTokens.spacing.card.borderRadius,
          }}
        />
      </div>

      <div 
        className="relative flex flex-col"
        style={{
          padding: designTokens.spacing.card.paddingX,
          gap: '16px',
        }}
      >
        <div 
          className="flex items-center justify-center overflow-clip"
          style={{
            width: '154px',
            height: '66px',
            padding: `${designTokens.spacing.card.gapInternal} ${designTokens.spacing.navigation.itemsGap}`,
            backgroundColor: designTokens.colors.background.gradient,
            boxShadow: designTokens.shadows.cardDefault,
            borderRadius: designTokens.spacing.card.borderRadius,
          }}
        >
          <div className="flex flex-col items-center justify-center">
            <div 
              className="flex items-baseline rounded-[99px]"
              style={{
                gap: designTokens.spacing.buttonSmall.gap,
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <p 
                className={typographyClasses.display1}
                style={{
                  color: designTokens.colors.text.primary,
                }}
              >
                {multiplier}
              </p>
              <div className="flex items-center justify-center">
                <p 
                  className={typographyClasses.subtext}
                  style={{
                    color: designTokens.colors.text.muted,
                  }}
                >
                  Multiplier
                </p>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="flex items-center justify-between"
          style={{
            width: '154px',
          }}
        >
          <div 
            className="flex items-center flex-1 min-w-0"
            style={{
              gap: designTokens.spacing.text.headingTickerGap,
            }}
          >
            <div 
              className="relative rounded-full border-4 border-solid shrink-0"
              style={{
                width: '32px',
                height: '32px',
                borderColor: designTokens.colors.background.main,
                boxShadow: designTokens.shadows.tokenBadge,
              }}
            >
              <Image
                src={effectiveLogoPath}
                alt={title}
                fill
                className="rounded-full object-cover pointer-events-none"
                onError={() => {
                  if (!imageError) {
                    setImageError(true)
                  }
                }}
              />
            </div>
            
            <p 
              className={`${typographyClasses.button} shrink-0`}
              style={{
                color: designTokens.colors.text.primary,
              }}
            >
              {title}
            </p>
          </div>

          {redirectUrl && (
            <a
              href={redirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer hover:opacity-80 transition-opacity shrink-0 ml-2"
              style={{
                width: '12px',
                height: '12px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image
                  src="/images/icons/redirect.svg"
                  alt="Redirect"
                  fill
                  className="object-contain"
                />
              </div>
            </a>
          )}
        </div>

        <p 
          className={`${typographyClasses.label1}`}
          style={{
            width: '154px',
            color: designTokens.colors.text.muted,
            lineHeight: designTokens.typography.subtext.lineHeight,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}
