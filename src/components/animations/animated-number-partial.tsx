"use client"

import * as React from "react"
import { motion } from "framer-motion"

export interface AnimatedNumberPartialProps {
  value: number | string
  decimals?: number
  suffix?: string
  className?: string
  delay?: number
  duration?: number
  animateLastDigits?: number
}

export function AnimatedNumberPartial({
  value,
  decimals = 2,
  suffix = "",
  className = "",
  delay = 0,
  duration = 1.2,
  animateLastDigits = 2,
}: AnimatedNumberPartialProps) {
  const formattedValue = React.useMemo(() => {
    if (typeof value === "number") {
      return value.toFixed(decimals)
    }
    const numValue = parseFloat(value.toString())
    if (!isNaN(numValue)) {
      return numValue.toFixed(decimals)
    }
    return value.toString()
  }, [value, decimals])

  const parts = React.useMemo(() => {
    const result: Array<{ type: "digit" | "char"; value: string; index: number; shouldAnimate: boolean }> = []
    let digitIndex = 0
    const digits: Array<{ value: string; index: number }> = []
    
    for (const char of formattedValue) {
      if (/\d/.test(char)) {
        digits.push({ value: char, index: digitIndex })
        digitIndex++
      }
    }
    
    let currentDigitIndex = 0
    for (const char of formattedValue) {
      if (/\d/.test(char)) {
        const shouldAnimate = currentDigitIndex >= digits.length - animateLastDigits
        result.push({ 
          type: "digit", 
          value: char, 
          index: currentDigitIndex,
          shouldAnimate 
        })
        currentDigitIndex++
      } else {
        result.push({ 
          type: "char", 
          value: char, 
          index: -1,
          shouldAnimate: false 
        })
      }
    }
    
    return result
  }, [formattedValue, animateLastDigits])

  const getDigitOffset = (targetDigit: string, digitIndex: number): string => {
    const target = parseInt(targetDigit, 10)
    const rotations = 0.5 + digitIndex * 0.1
    const totalSteps = Math.floor(rotations * 10) + target
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
        if (!part.shouldAnimate) {
          return (
            <span
              key={`digit-${partIndex}`}
              className="inline-block"
            >
              {part.value}
            </span>
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
                ease: [0.25, 0.1, 0.25, 1] as const,
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

