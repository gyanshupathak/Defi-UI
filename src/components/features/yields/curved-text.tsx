import * as React from "react"

interface CurvedTextProps {
  text: string
  radius: number
  startAngle: number // Angle in degrees, measured from top (0° = top, 90° = right, 180° = bottom, 270° = left)
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
  
  // Character width approximations
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
        // Skip rendering spaces but still account for their width
        if (char === " ") {
          return null
        }

        // Calculate cumulative distance along the arc
        let cumulativeDistance = 0
        for (let i = 0; i < index; i++) {
          cumulativeDistance += getCharWidth(characters[i]) + letterSpacing
        }
        
        // Add half the current character width to center it
        const charWidth = getCharWidth(char)
        cumulativeDistance += charWidth / 2
        
        // Convert distance to angle (arc length = radius * angle in radians)
        const angleRad = cumulativeDistance / radius
        const angleDeg = (angleRad * 180) / Math.PI
        const currentAngle = reverse ? startAngle - angleDeg : startAngle + angleDeg
        
        // Convert angle to radians for position calculation
        // Convert from "top is 0°" to "right is 0°" for cos/sin
        const angleForPosition = currentAngle - 90
        const angleRadFinal = (angleForPosition * Math.PI) / 180
        
        // Calculate position on circle
        const x = centerX + radius * Math.cos(angleRadFinal)
        const y = centerY + radius * Math.sin(angleRadFinal)
        
        // Rotation: text should be perpendicular to the radius
        // For text following a curve, rotate by the angle + 90° to make it tangent
        const rotation = currentAngle

        // Use Inter for semibold text (like "Stable Yield USD"), Hanken Grotesk for others
        const fontFamily = fontWeight === "semibold" && fontSize <= 10.125 
          ? "'Inter', sans-serif" 
          : "'Hanken Grotesk', sans-serif"
        const weight =
          fontWeight === "bold" ? 700 : fontWeight === "semibold" ? 500 : 400

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
