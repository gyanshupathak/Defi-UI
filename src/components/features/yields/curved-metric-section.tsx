import * as React from "react"
import { designTokens } from "@/lib/design-system"

interface CurvedMetricSectionProps {
  label: string
  value: string
  labelStartAngle: number 
  valueStartAngle: number 
  labelRadius: number 
  valueRadius: number 
  centerX: number
  centerY: number
}

/**
 * A single curved metric section with label and value
 * Each character is positioned individually along the curve
 * Matches Figma design exactly
 */
export function CurvedMetricSection({
  label,
  value,
  labelStartAngle,
  valueStartAngle,
  labelRadius,
  valueRadius,
  centerX,
  centerY,
}: CurvedMetricSectionProps) {
  
  
  const getCharWidth = (char: string, fontSize: number): number => {
    if (char === " ") return fontSize * 0.3
    if (char === ".") return fontSize * 0.25
    if (char === "$") return fontSize * 0.55
    if (char === "%") return fontSize * 0.6
    if (char === "K") return fontSize * 0.65
    if (char.match(/[iIlL1|]/)) return fontSize * 0.3
    if (char.match(/[mwMW]/)) return fontSize * 0.85
    if (char.match(/[0-9]/)) return fontSize * 0.6
    if (char.match(/[A-Z]/)) return fontSize * 0.7
    return fontSize * 0.6
  }

  
  const renderChar = (
    char: string,
    index: number,
    text: string,
    startAngle: number,
    radius: number,
    fontSize: number,
    fontWeight: "normal" | "bold",
    opacity: number,
    color: string
  ) => {
    
    if (char === " ") return null

    
    let cumulativeDistance = 0
    for (let i = 0; i < index; i++) {
      cumulativeDistance += getCharWidth(text[i], fontSize)
    }
    
    cumulativeDistance += getCharWidth(char, fontSize) / 2

    
    const angleRad = cumulativeDistance / radius
    const angleDeg = (angleRad * 180) / Math.PI
    const currentAngle = startAngle + angleDeg

    
    
    
    const angleForPosition = currentAngle - 90
    const angleRadFinal = (angleForPosition * Math.PI) / 180

    
    const x = centerX + radius * Math.cos(angleRadFinal)
    const y = centerY + radius * Math.sin(angleRadFinal)

    
    
    const rotation = currentAngle

    const fontFamily = "'Hanken Grotesk', sans-serif"
    const weight = fontWeight === "bold" ? 700 : 400

    return (
      <div
        key={`${char}-${index}-${text}`}
        className="absolute"
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
  }

  return (
    <>
      {}
      {label.split("").map((char, index) =>
        renderChar(
          char,
          index,
          label,
          labelStartAngle,
          labelRadius,
          12,
          "normal",
          0.5,
          designTokens.colors.text.primary
        )
      )}

      {}
      {value.split("").map((char, index) =>
        renderChar(
          char,
          index,
          value,
          valueStartAngle,
          valueRadius,
          32,
          "bold",
          1,
          designTokens.colors.text.primary
        )
      )}
    </>
  )
}
