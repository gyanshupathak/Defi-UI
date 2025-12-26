"use client"

import * as React from "react"
import Image from "next/image"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"
import { cn } from "@/lib/utils"
import { TOKEN_IMAGE_FALLBACKS } from "@/lib/utils/vault-images"

interface CircularPercentageSelectorProps {
  
  value: number
  
  onValueChange?: (value: number) => void
  
  tokenIcon?: string
  
  fallbackIcon?: string
  
  className?: string
}

export function CircularPercentageSelector({
  value = 0,
  onValueChange,
  tokenIcon,
  fallbackIcon,
  className,
}: CircularPercentageSelectorProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [currentIcon, setCurrentIcon] = React.useState(tokenIcon || fallbackIcon)

  // Update current icon when tokenIcon prop changes
  React.useEffect(() => {
    setCurrentIcon(tokenIcon || fallbackIcon)
  }, [tokenIcon, fallbackIcon])

  const radius = 37 
  const centerX = 38
  const centerY = 38
  
  const arcStartAngle = 140
  const arcEndAngle = 40
  const arcSpan = (360 - arcStartAngle) + arcEndAngle
  const gapAngle = arcStartAngle - arcEndAngle
  const arcEndAngleRad = (arcEndAngle * Math.PI) / 180
  
  const arcStartAngleRad = (arcStartAngle * Math.PI) / 180
  let currentAngle = arcStartAngle + (value / 100) * arcSpan
  if (currentAngle >= 360) currentAngle -= 360
  const angleRad = (currentAngle * Math.PI) / 180
  const indicatorX = centerX + radius * Math.cos(angleRad)
  const indicatorY = centerY + radius * Math.sin(angleRad)
  
  const indicatorLeft = indicatorX - 4 
  const indicatorTop = indicatorY - 4

  
  const calculatePercentage = (clientX: number, clientY: number): number => {
    if (!containerRef.current) return value
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left - centerX
    const y = clientY - rect.top - centerY
    
    let angle = Math.atan2(y, x) * (180 / Math.PI)
    if (angle < 0) angle += 360
    
    if (angle > arcEndAngle && angle < arcStartAngle) {
      const distToStart = Math.abs(angle - arcStartAngle)
      const distToEnd = Math.abs(angle - arcEndAngle)
      return distToStart < distToEnd ? 0 : 100
    }
    
    let angleInArc
    if (angle >= arcStartAngle) {
      angleInArc = angle - arcStartAngle
    } else {
      angleInArc = (360 - arcStartAngle) + angle
    }
    
    const percentage = (angleInArc / arcSpan) * 100
    return Math.max(0, Math.min(100, percentage))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    const newPercentage = calculatePercentage(e.clientX, e.clientY)
    onValueChange?.(newPercentage)
  }

  React.useEffect(() => {
    if (isDragging) {
      const handleMove = (e: MouseEvent) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left - centerX
        const y = e.clientY - rect.top - centerY
        
        let angle = Math.atan2(y, x) * (180 / Math.PI)
        if (angle < 0) angle += 360
        
        if (angle > arcEndAngle && angle < arcStartAngle) {
          const distToStart = Math.abs(angle - arcStartAngle)
          const distToEnd = Math.abs(angle - arcEndAngle)
          onValueChange?.(distToStart < distToEnd ? 0 : 100)
          return
        }
        
        let angleInArc
        if (angle >= arcStartAngle) {
          angleInArc = angle - arcStartAngle
        } else {
          angleInArc = (360 - arcStartAngle) + angle
        }
        
        const percentage = (angleInArc / arcSpan) * 100
        onValueChange?.(Math.max(0, Math.min(100, percentage)))
      }

      const handleUp = () => {
        setIsDragging(false)
      }

      window.addEventListener('mousemove', handleMove)
      window.addEventListener('mouseup', handleUp)
      return () => {
        window.removeEventListener('mousemove', handleMove)
        window.removeEventListener('mouseup', handleUp)
      }
    }
  }, [isDragging, onValueChange, arcStartAngle, arcEndAngle, arcSpan])

  
  const arcCircumference = 2 * Math.PI * radius * (arcSpan / 360)
  const currentArcLength = (value / 100) * arcCircumference
  const dashOffset = arcCircumference - currentArcLength
  
  return (
    <div className={cn("relative w-[110px] h-[147px]", className)}>
      <div 
        ref={containerRef}
        className="absolute left-[17px] top-0 w-[76px] h-[76px] cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        <svg 
          width="76" 
          height="76" 
          viewBox="0 0 76 76"
          className="absolute inset-0"
        >
          <path
            d={`M ${centerX + radius * Math.cos(arcStartAngleRad)} ${centerY + radius * Math.sin(arcStartAngleRad)} A ${radius} ${radius} 0 ${arcSpan > 180 ? 1 : 0} 1 ${centerX + radius * Math.cos(arcEndAngleRad)} ${centerY + radius * Math.sin(arcEndAngleRad)}`}
            fill="none"
            stroke={designTokens.colors.circularSelector.track}
            strokeWidth="1"
          />
        </svg>
       
        <svg 
          width="76" 
          height="76" 
          viewBox="0 0 76 76"
          className="absolute inset-0"
          style={{ overflow: 'visible' }}
        >
          <path
            d={`M ${centerX + radius * Math.cos(arcStartAngleRad)} ${centerY + radius * Math.sin(arcStartAngleRad)} A ${radius} ${radius} 0 ${arcSpan > 180 ? 1 : 0} 1 ${centerX + radius * Math.cos(arcEndAngleRad)} ${centerY + radius * Math.sin(arcEndAngleRad)}`}
            fill="none"
            stroke={designTokens.colors.circularSelector.progress}
            strokeWidth="2"
            strokeDasharray={arcCircumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ 
              transition: 'stroke-dashoffset 0.15s cubic-bezier(2, 2, 2, 2)',
              opacity: value > 0 ? 1 : 0,
              filter: 'blur(0.5px)',
              transform: 'translate(0.8px, 0.8px)',
            }}
          />
          <path
            d={`M ${centerX + radius * Math.cos(arcStartAngleRad)} ${centerY + radius * Math.sin(arcStartAngleRad)} A ${radius} ${radius} 0 ${arcSpan > 180 ? 1 : 0} 1 ${centerX + radius * Math.cos(arcEndAngleRad)} ${centerY + radius * Math.sin(arcEndAngleRad)}`}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeDasharray={arcCircumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ 
              transition: 'stroke-dashoffset 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: value > 0 ? 1 : 0,
              filter: 'blur(1px)',
              transform: 'translate(-0.5px, -0.5px)',
            }}
          />
          <path
            d={`M ${centerX + radius * Math.cos(arcStartAngleRad)} ${centerY + radius * Math.sin(arcStartAngleRad)} A ${radius} ${radius} 0 ${arcSpan > 180 ? 1 : 0} 1 ${centerX + radius * Math.cos(arcEndAngleRad)} ${centerY + radius * Math.sin(arcEndAngleRad)}`}
            fill="none"
            stroke="#F4F0FF"
            strokeWidth="2"
            strokeDasharray={arcCircumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ 
              transition: 'stroke-dashoffset 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: value > 0 ? 1 : 0,
            }}
          />
        </svg>

        <div 
          className="absolute w-[8px] h-[8px] rounded-full z-10"
          style={{
            left: `${indicatorLeft}px`,
            top: `${indicatorTop}px`,
            backgroundColor: designTokens.colors.background.main,
            boxShadow: shadows.circularIndicator,
            transition: isDragging ? 'none' : 'left 0.3s ease, top 0.3s ease',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none'
          }}
        />
      </div>

      <div className="absolute left-[30px] top-[13px] w-[50px] h-[50px]">
        <div 
          className="absolute inset-0 rounded-full"
          style={{ 
            backgroundColor: designTokens.colors.background.main,
            borderRadius: '3543.896px', 
            boxShadow: shadows.circularCenter,
          }}
        />
        {currentIcon && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[26.866px] h-[26.866px]">
            <Image
              src={currentIcon}
              alt="Token"
              width={27}
              height={27}
              className="object-contain w-full h-full"
              onError={(e) => {
                // Fallback to local image if CDN image fails
                const target = e.target as HTMLImageElement
                // Try to determine token from current icon URL
                let tokenFallback = fallbackIcon
                if (!tokenFallback && currentIcon) {
                  // Try to extract token symbol from URL (e.g., syUSD, syETH, syBTC)
                  const urlMatch = currentIcon.match(/(syUSD|syETH|syBTC|USD|ETH|BTC)/i)
                  if (urlMatch) {
                    const symbol = urlMatch[1].toUpperCase()
                    if (symbol.startsWith('SY')) {
                      tokenFallback = TOKEN_IMAGE_FALLBACKS[symbol as keyof typeof TOKEN_IMAGE_FALLBACKS]
                    } else if (symbol === 'USD') {
                      tokenFallback = TOKEN_IMAGE_FALLBACKS['syUSD'] || '/images/icons/USD-stable.svg'
                    }
                  }
                }
                // Final fallback
                const finalFallback = tokenFallback || TOKEN_IMAGE_FALLBACKS['syUSD'] || '/images/icons/USD-stable.svg'
                if (target.src !== finalFallback && currentIcon !== finalFallback) {
                  setCurrentIcon(finalFallback)
                }
              }}
            />
          </div>
        )}
      </div>

      <button
        type="button"
        className="absolute left-[21px] top-[72px] flex flex-col items-center w-[11px] cursor-pointer hover:opacity-70 transition-opacity bg-transparent border-0 p-0"
        onClick={() => onValueChange?.(0)}
      >
        <p 
          className="text-[8px] leading-normal font-sans font-normal whitespace-pre-wrap"
          style={{ color: designTokens.colors.text.primary }}
        >
          0%
        </p>
      </button>
      <button
        type="button"
        className="absolute left-[75px] top-[72px] flex flex-col items-center w-[17px] cursor-pointer hover:opacity-70 transition-opacity bg-transparent border-0 p-0"
        onClick={() => onValueChange?.(100)}
      >
        <p 
          className="text-[8px] leading-normal font-sans font-normal opacity-50 whitespace-pre-wrap"
          style={{ color: designTokens.colors.text.primary }}
        >
          MAX
        </p>
      </button>
    </div>
  )
}
