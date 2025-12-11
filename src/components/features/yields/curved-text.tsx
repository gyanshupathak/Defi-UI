import * as React from "react"

interface CurvedTextProps {
  text: string
  radius: number
  startAngle: number 
  fontSize: number
  fontWeight?: "normal" | "bold" | "semibold"
  color?: string
  opacity?: number
  centerX: number
  centerY: number
  className?: string
  reverse?: boolean
  letterSpacing?: number
}

/**
 * Renders text along a curved path (arc) using individual character positioning
 * Each character is positioned and rotated individually to follow the curve
 */
export function CurvedText({
  text,
  radius,
  startAngle,
  fontSize,
  fontWeight = "normal",
  color = "#000000",
  opacity = 1,
  centerX,
  centerY,
  className = "",
  reverse = false,
  letterSpacing = 0,
}: CurvedTextProps) {
  const characters = text.split("")
  
  
  const getCharWidth = (char: string): number => {
    if (char === " ") return fontSize * 0.35
    if (char === ".") return fontSize * 0.2
    if (char === "$" || char === "%") return fontSize * 0.55
    if (char === "K") return fontSize * 0.65
    if (char.match(/[iIlL1|]/)) return fontSize * 0.3
    if (char.match(/[mwMW]/)) return fontSize * 0.85
    if (char.match(/[0-9]/)) return fontSize * 0.6
    if (char.match(/[A-Z]/)) return fontSize * 0.7
    return fontSize * 0.6
  }

  return (
    <>
      {characters.map((char, index) => {
        
        if (char === " ") {
          return null
        }

        
        let cumulativeDistance = 0
        for (let i = 0; i < index; i++) {
          cumulativeDistance += getCharWidth(characters[i]) + letterSpacing
        }
        
        
        const charWidth = getCharWidth(char)
        cumulativeDistance += charWidth / 2
        
        
        const angleRad = cumulativeDistance / radius
        const angleDeg = (angleRad * 180) / Math.PI
        const currentAngle = reverse ? startAngle - angleDeg : startAngle + angleDeg
        
        
        
        const angleForPosition = currentAngle - 90
        const angleRadFinal = (angleForPosition * Math.PI) / 180
        
        
        const x = centerX + radius * Math.cos(angleRadFinal)
        const y = centerY + radius * Math.sin(angleRadFinal)
        
        
        
        const rotation = currentAngle

        
        // Font family matching Figma design
        let fontFamily = "'Hanken Grotesk', sans-serif"
        if (fontWeight === "semibold" && fontSize <= 10.125) {
          // For "Stable Yield USD" text - uses Inter Semi_Bold
          fontFamily = "'Inter', sans-serif"
        }
        
        const weight =
          fontWeight === "bold" ? 700 : fontWeight === "semibold" ? 600 : 400

        return (
          <div
            key={`${char}-${index}`}
            className={`absolute ${className}`}
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              fontSize: `${fontSize}px`,
              fontFamily,
              fontWeight: weight,
              color,
              opacity,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 10,
              display: 'inline-block',
            }}
          >
            {char}
          </div>
        )
      })}
    </>
  )
}
