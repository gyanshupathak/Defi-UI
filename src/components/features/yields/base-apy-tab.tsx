"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { ChartContainerWrapper } from "./chart-container-wrapper"
import { DropdownSelector, type DropdownOption } from "@/components/ui/dropdown-selector"
import { AnimatedNumber } from "@/components/animations"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type TimeRange = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "ALL"

interface BaseAPYTabProps {
  currentDate?: string
  isEmpty?: boolean
}

export function BaseAPYTab({ 
  currentDate = "Current Date",
  isEmpty = false,
}: BaseAPYTabProps) {
  const [timeRange, setTimeRange] = React.useState<TimeRange>("1M")
  const displayValue = isEmpty ? "0.00%" : "16.23%"

  const timeRangeOptions: DropdownOption<TimeRange>[] = [
    { id: "1M", label: "1M" },
    { id: "3M", label: "3M" },
    { id: "6M", label: "6M" },
    { id: "1Y", label: "1Y" },
  ]

  const areaChartData = [
    { x: 0, value: 12.5 },
    { x: 1, value: 13.2 },
    { x: 2, value: 14.1 },
    { x: 3, value: 15.3 },
    { x: 4, value: 14.8 },
    { x: 5, value: 15.6 },
    { x: 6, value: 16.0 },
    { x: 7, value: 15.9 },
    { x: 8, value: 16.2 },
    { x: 9, value: 16.1 },
    { x: 10, value: 16.3 },
    { x: 11, value: 16.0 },
    { x: 12, value: 16.2 },
    { x: 13, value: 16.1 },
    { x: 14, value: 16.0 },
    { x: 15, value: 16.2 },
    { x: 16, value: 16.1 },
    { x: 17, value: 16.2 },
    { x: 18, value: 16.1 },
    { x: 19, value: 16.2 },
    { x: 20, value: 16.2 },
    { x: 21, value: 16.1 },
    { x: 22, value: 16.2 },
    { x: 23, value: 16.2 },
    { x: 24, value: 16.2 },
    { x: 25, value: 16.2 },
    { x: 26, value: 16.2 },
    { x: 27, value: 16.2 },
    { x: 28, value: 16.2 },
    { x: 29, value: 16.2 },
    { x: 30, value: 16.2 },
    { x: 31, value: 16.2 },
    { x: 32, value: 16.2 },
    { x: 33, value: 16.2 },
    { x: 34, value: 16.2 },
    { x: 35, value: 16.2 },
    { x: 36, value: 16.2 },
    { x: 37, value: 16.2 },
    { x: 38, value: 16.2 },
    { x: 39, value: 16.2 },
    { x: 40, value: 16.2 },
    { x: 41, value: 16.2 },
    { x: 42, value: 16.2 },
    { x: 43, value: 16.2 },
    { x: 44, value: 16.2 },
    { x: 45, value: 16.2 },
    { x: 46, value: 16.2 },
    { x: 47, value: 16.2 },
    { x: 48, value: 16.2 },
    { x: 49, value: 16.2 },
    { x: 50, value: 16.2 },
    { x: 51, value: 16.2 },
    { x: 52, value: 16.2 },
    { x: 53, value: 16.23 },
  ]

  const emptyValue = 200
  const emptyAreaChartData = areaChartData.map((point) => ({
    ...point,
    value: emptyValue,
  }))

  const chartData = isEmpty ? emptyAreaChartData : areaChartData
  const yAxisDomain = isEmpty ? [0, 400] : ["auto", "auto"]
  const gradientId = isEmpty ? "colorBaseAPYEmpty" : "colorBaseAPY"

  return (
    <>
      <div 
        className="absolute flex flex-col items-start"
        style={{
          left: designTokens.spacing.card.paddingX,
          top: designTokens.spacing.card.paddingY,
          gap: designTokens.spacing.text.headingTickerGap,
        }}
      >
        <p 
          className={typographyClasses.display1}
          style={{ 
            color: designTokens.colors.text.primary,
          }}
        >
          <AnimatedNumber value={displayValue.replace('%', '')} decimals={2} suffix="%" delay={0.1} duration={1.2} />
        </p>
        <p 
          className={typographyClasses.label1}
          style={{ 
            color: designTokens.colors.text.primary,
            opacity: 0.5,
          }}
        >
          {currentDate}
        </p>
      </div>

      <div 
        className="absolute"
        style={{
          left: '587px',
          top: '20px',
        }}
      >
        <DropdownSelector
          selectedValue={timeRange}
          onValueChange={setTimeRange}
          options={timeRangeOptions}
          minWidth="80px"
        />
        </div>

      <ChartContainerWrapper className="relative" opacity={isEmpty ? 1 : 0.5}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="0%" 
                  stopColor={isEmpty ? "rgba(0, 0, 0, 0.15)" : designTokens.colors.primary} 
                  stopOpacity={isEmpty ? 0.35 : 0.5} 
                />
                <stop 
                  offset="100%" 
                  stopColor={isEmpty ? "rgba(0, 0, 0, 0.05)" : designTokens.colors.primary} 
                  stopOpacity={isEmpty ? 0.15 : 0.2} 
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="none" stroke="transparent" />
            <XAxis hide />
            <YAxis hide domain={yAxisDomain as [number | "auto", number | "auto"]} />
            <Tooltip contentStyle={{ display: 'none' }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="transparent"
              strokeWidth={0}
              fill={`url(#${gradientId})`}
              fillOpacity={1}
              isAnimationActive={!isEmpty}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainerWrapper>
    </>
  )
}
