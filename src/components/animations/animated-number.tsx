"use client"

import * as React from "react"
import { motion } from "framer-motion"

export interface AnimatedNumberProps {
  value: number | string
  decimals?: number
  suffix?: string
  className?: string
  delay?: number
  duration?: number
}

export function AnimatedNumber({
  value,
  decimals = 2,
  suffix = "",
  className = "",
  delay = 0,
  duration = 1.2,
}: AnimatedNumberProps) {

  const formattedValue = React.useMemo(() => {
    if (typeof value === "number") {
      const fixed = value.toFixed(decimals)
      // Add comma formatting for whole numbers (when decimals = 0)
      if (decimals === 0) {
        return Math.floor(value).toLocaleString('en-US')
      }
      // For decimal numbers, format the integer part with commas
      const parts = fixed.split('.')
      const integerPart = parseInt(parts[0], 10).toLocaleString('en-US')
      return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart
    }
    // If it's already a string, try to parse and format it
    const numValue = parseFloat(value.toString())
    if (!isNaN(numValue)) {
      if (decimals === 0) {
        return Math.floor(numValue).toLocaleString('en-US')
      }
      const fixed = numValue.toFixed(decimals)
      const parts = fixed.split('.')
      const integerPart = parseInt(parts[0], 10).toLocaleString('en-US')
      return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart
    }
    return value.toString()
  }, [value, decimals])

  const parts = React.useMemo(() => {
    const result: Array<{ type: "digit" | "char"; value: string; index: number }> = []
    let index = 0
    for (const char of formattedValue) {
      if (/\d/.test(char)) {
        result.push({ type: "digit", value: char, index })
        index++
      } else {
        result.push({ type: "char", value: char, index: -1 })
      }
    }
    return result
  }, [formattedValue])

  // Calculate the y-offset for each digit to show the target number
  const getDigitOffset = (targetDigit: string, digitIndex: number): string => {
    const target = parseInt(targetDigit, 10)
    // Add a subtle rotation (less than one full cycle) for a smooth effect
    const rotations = 0.5 + digitIndex * 0.1 // Subtle stagger, less rotation
    // Calculate total steps: 
    // - Start at position 20 (showing digit 0 from our buffer)
    // - Rotate by rotations * 10 steps (e.g., 0.5 * 10 = 5 steps)
    // - Then move to target digit (from current position to target)
    // Since we start at position 20 showing digit 0, and after rotation we're still at a position showing 0,
    // we need to move to the target: position 20 + rotationSteps - target
    const rotationSteps = Math.floor(rotations * 10)
    // After rotation, we're at digit (rotationSteps % 10)
    // To get to target, we need: rotationSteps + (target - (rotationSteps % 10))
    // But we need to handle wrapping: if target < (rotationSteps % 10), we need to go forward
    const currentDigitAfterRotation = rotationSteps % 10
    let additionalSteps = target - currentDigitAfterRotation
    if (additionalSteps < 0) {
      additionalSteps += 10 // Wrap around
    }
    const totalSteps = rotationSteps + additionalSteps
    // Each step is 1em (the height of one digit)
    // Negative because we're moving the container up to reveal the target digit
    return `${-totalSteps}em`
  }

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      {parts.map((part, partIndex) => {
        if (part.type === "char") {
          // Non-digit characters (decimal point, etc.) just fade in
          return (
            <motion.span
              key={`char-${partIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: delay + duration * 0.7,
                duration: 0.2,
              }}
              className="inline-block"
            >
              {part.value}
            </motion.span>
          )
        }

        // Digit: create odometer effect
        const targetDigit = parseInt(part.value, 10)
        const digitIndex = part.index

        return (
          <span
            key={`digit-${partIndex}`}
            className="inline-block relative overflow-hidden"
            style={{
              width: "0.6em",
              height: "1em",
              lineHeight: "1em",
              verticalAlign: "baseline",
            }}
          >
            <motion.div
              className="flex flex-col"
              initial={{ y: "0em" }}
              animate={{
                y: getDigitOffset(part.value, digitIndex),
              }}
              transition={{
                delay: delay + digitIndex * 0.1,
                duration: duration,
                ease: [0.25, 0.1, 0.25, 1], // Ease out for smooth stop
              }}
              style={{
                willChange: "transform",
              }}
            >
              {/* Render digits 0-9 multiple times for smooth scrolling */}
              {/* Render enough cycles to cover rotations + target */}
              {Array.from({ length: 50 }, (_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center"
                  style={{
                    width: "0.6em",
                    height: "1em",
                    lineHeight: "1em",
                    flexShrink: 0,
                  }}
                >
                  {i % 10}
                </div>
              ))}
            </motion.div>
          </span>
        )
      })}
      {suffix && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: delay + duration * 0.7,
            duration: 0.2,
          }}
          className="inline-block"
        >
          {suffix}
        </motion.span>
      )}
    </span>
  )
}
