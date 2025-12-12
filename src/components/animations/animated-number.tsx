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
      if (decimals === 0) {
        return Math.floor(value).toLocaleString('en-US')
      }
      const parts = fixed.split('.')
      const integerPart = parseInt(parts[0], 10).toLocaleString('en-US')
      return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart
    }
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

  const getDigitOffset = (targetDigit: string, digitIndex: number): string => {
    const target = parseInt(targetDigit, 10)
    const rotations = 0.5 + digitIndex * 0.1
    const rotationSteps = Math.floor(rotations * 10)
    const currentDigitAfterRotation = rotationSteps % 10
    let additionalSteps = target - currentDigitAfterRotation
    if (additionalSteps < 0) {
      additionalSteps += 10
    }
    const totalSteps = rotationSteps + additionalSteps
    return `${-totalSteps}em`
  }

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      {parts.map((part, partIndex) => {
        if (part.type === "char") {
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
