"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface EmptyChartProps {
  barCount?: number
  barHeight?: number
  maxDomain?: number
  dates?: string[]
  dateLabelsWidth?: string
  dateLabelsLeft?: string
  dateLabelsTop?: string
  barsLeft?: string
  barsTop?: string
  barsWidth?: string
  barsHeight?: string
  className?: string
}

// Removed DEFAULT_DATES - don't show dummy dates
// Only show dates when provided from real data

export function EmptyChart({
  barCount = 54,
  barHeight = 200,
  maxDomain = 500,
  dates, // No default - only show dates when provided from real data
  dateLabelsWidth,
  dateLabelsLeft,
  dateLabelsTop,
  barsLeft,
  barsTop,
  barsWidth,
  barsHeight,
  className,
}: EmptyChartProps) {
  const emptyData = Array(barCount).fill(null).map((_, index) => ({
    value: barHeight,
    index,
  }))
  const EmptyBarShape = (props: any) => {
    const { x, y, width, height } = props

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#000000"
        fillOpacity={1}
        rx={2}
        ry={2}
        style={{
          fill: "#000000",
          fillOpacity: 0.2,
        }}
      />
    )
  }

  return (
    <div className={className}>
      <div 
        className="absolute overflow-hidden"
        style={{ 
          left: barsLeft || designTokens.spacing.graph.tvlChart.contentPaddingX,
          top: barsTop || designTokens.spacing.graph.tvlChart.barsTop,
          width: barsWidth || designTokens.spacing.graph.tvlChart.contentWidth,
          height: barsHeight || designTokens.spacing.graph.tvlChart.barsHeight,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={emptyData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            barCategoryGap="4px"
          >
            <CartesianGrid strokeDasharray="none" stroke="transparent" />
            <XAxis hide />
            <YAxis hide domain={[0, maxDomain]} />
            <Bar
              dataKey="value"
              shape={EmptyBarShape}
              barSize={10}
              activeBar={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Only show dates when provided from real data */}
      {dates && dates.length > 0 && (
        <div 
          className="absolute flex items-center justify-between text-center"
          style={{ 
            left: dateLabelsLeft || designTokens.spacing.graph.tvlChart.contentPaddingX,
            top: dateLabelsTop || designTokens.spacing.graph.tvlChart.datesTop,
            width: dateLabelsWidth || designTokens.spacing.graph.tvlChart.contentWidth,
            opacity: designTokens.spacing.graph.tvlChart.datesOpacity,
          }}
        >
          {dates.map((date, index) => (
            <p 
              key={index}
              className={typographyClasses.label1}
              style={{ 
                color: designTokens.colors.text.primary,
                opacity: designTokens.spacing.graph.tvlChart.dateOpacity,
              }}
            >
              {date}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
