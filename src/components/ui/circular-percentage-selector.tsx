"use client"

import * as React from "react"
import Image from "next/image"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"
import { cn } from "@/lib/utils"

interface CircularPercentageSelectorProps {
  
  value: number
  
  onValueChange?: (value: number) => void
  
  tokenIcon: string
  
  className?: string
}

export function CircularPercentageSelector({
  value = 0,
  onValueChange,
  tokenIcon,
  className,
}: CircularPercentageSelectorProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  
  
  
  
  
  const startAngle = 90 
  const angleRad = (startAngle + (value / 100) * 360) * (Math.PI / 180)
  const radius = 37 
  const centerX = 38
  const centerY = 38
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
    
    
    
    angle = angle - 90
    
    if (angle < 0) angle += 360
    
    
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

  
  const circumference = 2 * Math.PI * 37
  
  
  
  const maxAngle = 360 - 2 
  const currentAngle = (value / 100) * maxAngle 
  
  
  
  
  
  
  
  const arcLength = (currentAngle / 360) * circumference
  const dashOffset = circumference - arcLength
  
  return (
    <div className={cn("relative w-[110px] h-[147px]", className)}>
      {}
      <div 
        ref={containerRef}
        className="absolute left-[17px] top-0 w-[76px] h-[76px] cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        {}
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
      
        {}
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

        {}
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

      {}
      <div className="absolute left-[30px] top-[13px] w-[50px] h-[50px]">
        <div 
          className="absolute inset-0 rounded-full"
          style={{ 
            backgroundColor: designTokens.colors.background.main,
            borderRadius: '3543.896px', 
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

      {}
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
