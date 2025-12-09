"use client"

import * as React from "react"
import Image from "next/image"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"
import { cn } from "@/lib/utils"

interface CircularPercentageSelectorProps {
  /** Current percentage value (0-100) */
  value: number
  /** Callback when value changes */
  onValueChange?: (value: number) => void
  /** Token icon to display in center */
  tokenIcon: string
  /** Custom className */
  className?: string
}

/**
 * CircularPercentageSelector Component
 * 
 * An interactive circular percentage selector with:
 * - Draggable indicator around a circle
 * - Token icon in the center
 * - Percentage labels (0% and MAX) below the circle
 * - Smooth animations and neumorphic styling
 * 
 * The selector starts from the bottom (0%) and moves clockwise.
 */
export function CircularPercentageSelector({
  value = 0,
  onValueChange,
  tokenIcon,
  className,
}: CircularPercentageSelectorProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  // Calculate indicator position based on percentage
  // Starting from bottom, moving clockwise
  // In screen coordinates: Y increases downward
  // Bottom is at 90° (sin(90°) = 1, so Y = centerY + radius)
  // Top is at -90° (sin(-90°) = -1, so Y = centerY - radius)
  const startAngle = 90 // Start from bottom in screen coordinates
  const angleRad = (startAngle + (value / 100) * 360) * (Math.PI / 180)
  const radius = 37 // Circle radius (matches r="37" in SVG)
  const centerX = 38
  const centerY = 38
  const indicatorX = centerX + radius * Math.cos(angleRad)
  const indicatorY = centerY + radius * Math.sin(angleRad)
  
  // Indicator dot is 8px, positioned relative to container
  const indicatorLeft = indicatorX - 4 // 4px = half of 8px dot
  const indicatorTop = indicatorY - 4

  // Calculate percentage from mouse position
  const calculatePercentage = (clientX: number, clientY: number): number => {
    if (!containerRef.current) return value
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left - centerX
    const y = clientY - rect.top - centerY
    
    // Calculate angle from center
    // Math.atan2(y, x) returns angle where 0° is right, 90° is bottom (in screen coords)
    let angle = Math.atan2(y, x) * (180 / Math.PI)
    // Convert to start from bottom (90 degrees in screen coordinates)
    // atan2 already gives us: 0°=right, 90°=bottom, 180°=left, -90°=top
    // We want: 0% at bottom (90°), so subtract 90° and normalize
    angle = angle - 90
    // Normalize to 0-360
    if (angle < 0) angle += 360
    
    // Convert to percentage (0-100)
    const percentage = (angle / 360) * 100
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
        // Convert to start from bottom (90 degrees in screen coordinates)
        angle = angle - 90
        if (angle < 0) angle += 360
        
        const percentage = (angle / 360) * 100
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
  }, [isDragging, onValueChange])

  // Calculate circumference for the arc
  const circumference = 2 * Math.PI * 37
  
  // Maximum angle is slightly less than 360° to maintain gap between 0% and MAX
  // This ensures there's always a visible gap, even at 100%
  const maxAngle = 360 - 2 // Leave ~2 degrees gap (adjust as needed for visual gap)
  const currentAngle = (value / 100) * maxAngle // Current sweep angle in degrees
  
  // Calculate stroke-dashoffset for smooth animation
  // SVG stroke-dasharray starts at 3 o'clock (right, 0°) by default
  // We rotate 90° clockwise to start from bottom (6 o'clock = 90°)
  // This aligns with our indicator which starts at 90° (bottom)
  // When value=0: show nothing (offset = full circumference)
  // When value=100: show arc up to maxAngle (not full 360°), maintaining gap
  const arcLength = (currentAngle / 360) * circumference
  const dashOffset = circumference - arcLength
  
  return (
    <div className={cn("relative w-[110px] h-[147px]", className)}>
      {/* Interactive Circle Container */}
      <div 
        ref={containerRef}
        className="absolute left-[17px] top-0 w-[76px] h-[76px] cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        {/* Outer Circle Track - Background Circle (always visible, complete circle) */}
        <svg 
          width="76" 
          height="76" 
          viewBox="0 0 76 76"
          className="absolute inset-0"
        >
          <circle
            cx="38"
            cy="38"
            r="37"
            fill="none"
            stroke={designTokens.colors.circularSelector.track}
            strokeWidth="1"
          />
        </svg>
      
        {/* Progress Arc - Filled portion of the circle */}
        <svg 
          width="76" 
          height="76" 
          viewBox="0 0 76 76"
          className="absolute inset-0"
        >
          <circle
            cx="38"
            cy="38"
            r="37"
            fill="none"
            stroke={designTokens.colors.circularSelector.progress}
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(90 38 38)"
            style={{ 
              transition: 'stroke-dashoffset 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: value > 0 ? 1 : 0,
            }}
          />
        </svg>

        {/* Indicator Dot */}
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

      {/* Center Circle with Token Icon */}
      <div className="absolute left-[30px] top-[13px] w-[50px] h-[50px]">
        <div 
          className="absolute inset-0 rounded-full"
          style={{ 
            backgroundColor: designTokens.colors.background.main,
            borderRadius: '3543.896px', // Very large radius for perfect circle
            boxShadow: shadows.circularCenter,
          }}
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[26.866px] h-[26.866px]">
          <Image
            src={tokenIcon}
            alt="Token"
            width={27}
            height={27}
            className="object-contain w-full h-full"
          />
        </div>
      </div>

      {/* Percentage Labels */}
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

