"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { UnifiedChartContainer } from "./unified-chart-container"
import { ChartContainerWrapper } from "@/components/features/yields/chart-container-wrapper"
import { EmptyChart } from "./empty-chart"
import { AnimatedNumber } from "@/components/animations"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface ChartDataPoint {
  value: number
  label?: string
  date?: string
  formattedValue?: string
  formattedDate?: string
  index?: number
}

interface TVLChartProps {
  
  data?: number[]
  
  totalValue?: string
  
  date?: string
  
  className?: string
  
  variant?: "home" | "yields"
  
  isEmpty?: boolean
}
const defaultHomeData = [
  100, 100, 100, 100, 100, 100, 100, 100, 
  378, 319, 319, 419, 319, 319, 334, 334, 219, 387, 378, 
  425, 425, 413, 244, 244, 319, 169, 419, 419, 375, 354, 
  354, 419, 378, 257, 366, 500, 225, 225, 253, 253, 213, 
  260, 260, 249, 249, 369, 369, 433, 449, 470, 481, 487, 492, 492 
]
const defaultYieldsData = [
  73, 73, 73, 73, 73, 73, 73, 73,
  274, 232, 232, 304, 232, 232, 242, 242,
  158, 281, 274, 308, 308, 300, 177, 177,
  232, 123, 304, 304, 272, 257, 257, 304,
  274, 186, 266, 400, 163, 163, 183, 183,
  155, 189, 189, 120, 120, 268, 268, 274,
  232, 232, 304, 304, 272, 257,
]
const emptyStateData = Array(54).fill(200)

const dates = ["11 AUG", "12 AUG", "13 AUG", "14 AUG", "15 AUG", "16 AUG", "17 AUG"]
const formatDataForChart = (
  data: number[],
  defaultTotalValue: string,
  defaultDate: string,
  variant: "home" | "yields"
): ChartDataPoint[] => {
  
  const barsPerDay = [8, 8, 8, 8, 8, 8, 6]
  
  
  const maxBarHeight = variant === "home" ? 500 : 400
  
  return data.map((value, index) => {
    
    let dateIndex = 0
    let cumulativeBars = 0
    for (let i = 0; i < barsPerDay.length; i++) {
      cumulativeBars += barsPerDay[i]
      if (index < cumulativeBars) {
        dateIndex = i
        break
      }
    }
    
    
    const scaleFactor = parseFloat(defaultTotalValue.replace(/[^0-9.]/g, '')) / maxBarHeight
    const calculatedValue = value * scaleFactor
    
    return {
      value,
      label: `bar-${index}`,
      date: dates[dateIndex] || defaultDate,
      formattedValue: `$${Math.round(calculatedValue).toLocaleString()}`,
      formattedDate: dates[dateIndex] || defaultDate,
    }
  })
}

export function TVLChart({ 
  variant = "home",
  isEmpty = false,
  data,
  totalValue = variant === "home" ? "$585,937" : "$185,053",
  date = variant === "home" ? "12 November 2025" : "Current Date",
  className
}: TVLChartProps) {
  
  const defaultTotalValue = variant === "home" ? "$585,937" : "$185,053"
  const initialValue = isEmpty ? "$0" : (totalValue || defaultTotalValue)
  const [displayValue, setDisplayValue] = React.useState(() => {
    if (isEmpty) return "$0"
    return totalValue || defaultTotalValue
  })
  const [displayDate, setDisplayDate] = React.useState(date)
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const [isInitialLoad, setIsInitialLoad] = React.useState(true)
  
  React.useEffect(() => {
    if (!isEmpty && (displayValue === "$0" || !displayValue)) {
      const valueToUse = totalValue || defaultTotalValue
      setDisplayValue(valueToUse)
      setDisplayDate(date)
    }
  }, [isEmpty, totalValue, defaultTotalValue, date, displayValue])
  
  React.useEffect(() => {
    if (!isEmpty && hoveredIndex === null) {
      const newValue = totalValue || defaultTotalValue
      if (displayValue === "$0" || displayValue !== newValue) {
        setDisplayValue(newValue)
        setDisplayDate(date)
      }
    }
  }, [totalValue, date, isEmpty, hoveredIndex, variant, defaultTotalValue, displayValue])
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false)
      if (!isEmpty && (displayValue === "$0" || !displayValue)) {
        const valueToUse = totalValue || defaultTotalValue
        setDisplayValue(valueToUse)
        setDisplayDate(date)
      }
    }, 1500)
    return () => clearTimeout(timer)
  }, [isEmpty, displayValue, totalValue, defaultTotalValue, date])

  const chartDataArray = isEmpty 
    ? emptyStateData 
    : data || (variant === "home" ? defaultHomeData : defaultYieldsData)

  const chartData = formatDataForChart(chartDataArray, totalValue, date, variant).map((item, index) => ({
    ...item,
    index,
  }))

  const CustomBarShape = (props: any) => {
    const { payload, x, y, width, height } = props
    const barIndex = payload?.index ?? chartData.findIndex(d => d.value === payload?.value && d.label === payload?.label)
    const isHovered = hoveredIndex === barIndex
    
    const getBarFill = () => {
      if (isEmpty) {
        return "rgba(0, 0, 0, 1)"
      }
      return designTokens.colors.primary
    }
    
    const getBarOpacity = () => {
      if (isEmpty) {
        return 1 
      }
      return isHovered ? 1 : 0.25
    }

    const handleMouseEnter = () => {
      if (!isEmpty && barIndex >= 0 && barIndex < chartData.length) {
        setHoveredIndex(barIndex)
        const dataPoint = chartData[barIndex]
        if (dataPoint) {
          if (dataPoint.formattedValue) {
            setDisplayValue(dataPoint.formattedValue)
          }
          if (dataPoint.formattedDate) {
            setDisplayDate(dataPoint.formattedDate)
          }
        }
      }
    }

    const handleMouseLeave = () => {
      if (!isEmpty) {
        setHoveredIndex(null)
        const valueToUse = totalValue || defaultTotalValue
        setDisplayValue(valueToUse)
        setDisplayDate(date)
      }
    }

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={isEmpty ? "#000000" : getBarFill()}
        fillOpacity={isEmpty ? 1 : undefined}
        opacity={isEmpty ? 1 : getBarOpacity()}
        rx={2}
        ry={2}
        style={{
          fill: isEmpty ? "#000000" : undefined,
          fillOpacity: isEmpty ? 1 : undefined,
          transition: isEmpty ? "none" : "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: isEmpty ? "default" : "pointer",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    )
  }

  if (isEmpty && variant === "yields") {
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
          <div 
            className={typographyClasses.display1}
            style={{ 
              color: designTokens.colors.text.primary,
            }}
          >
            {isInitialLoad && displayValue === initialValue ? (
              displayValue.startsWith('$') ? (
                <>
                  $<AnimatedNumber key="initial" value={parseFloat(displayValue.replace(/[^0-9.]/g, '')) || 0} decimals={0} delay={0.1} duration={1.2} />
                </>
              ) : (
                <AnimatedNumber key="initial" value={parseFloat(displayValue.replace(/[^0-9.]/g, '')) || 0} decimals={0} delay={0.1} duration={1.2} />
              )
            ) : (
              displayValue
            )}
          </div>
          <p 
            className={typographyClasses.label1}
            style={{ 
              color: designTokens.colors.text.primary,
              opacity: 0.5,
            }}
          >
            {displayDate}
          </p>
        </div>

        <ChartContainerWrapper>
          <EmptyChart
            barCount={54}
            barHeight={200}
            maxDomain={400}
            barsLeft="0"
            barsTop="0"
            barsWidth="100%"
            barsHeight="100%"
            dateLabelsLeft="24px"
            dateLabelsTop="519.26px"
            dateLabelsWidth="620px"
          />
        </ChartContainerWrapper>
      </>
    )
  }

  
  if (isEmpty && variant === "home") {
    return (
      <UnifiedChartContainer className={className}>
        <EmptyChart
          barCount={54}
          barHeight={200}
          maxDomain={500}
        />

        {}
        <div 
          className="absolute flex flex-col"
          style={{ 
            left: designTokens.spacing.graph.tvlChart.contentPaddingX,
            top: designTokens.spacing.graph.tvlChart.contentTop,
            width: designTokens.spacing.graph.tvlChart.contentWidth,
            gap: designTokens.spacing.text.labelHeadingGap,
          }}
        >
          <div className="flex items-end w-full">
            <p 
              className={`flex-1 ${typographyClasses.label1}`}
              style={{ color: designTokens.colors.graph.labelMuted }}
            >
              Total Value Locked
            </p>
          </div>
          
          <div 
            className="flex flex-col items-start w-full leading-normal whitespace-pre-wrap"
            style={{ 
              gap: designTokens.spacing.graph.tvlChart.headerGap,
              color: designTokens.colors.graph.heading,
            }}
          >
            <div 
              className={`${typographyClasses.display1} w-full`}
              style={{ letterSpacing: designTokens.spacing.graph.tvlChart.valueTracking }}
            >
              {displayValue.startsWith('$') ? (
                <>
                  $<AnimatedNumber key={displayValue} value={parseFloat(displayValue.replace(/[^0-9.]/g, '')) || 0} decimals={0} delay={0.1} duration={1.2} />
                </>
              ) : (
                <AnimatedNumber key={displayValue} value={parseFloat(displayValue.replace(/[^0-9.]/g, '')) || 0} decimals={0} delay={0.1} duration={1.2} />
              )}
            </div>
            <p 
              className={`${typographyClasses.label1} w-full`}
              style={{ opacity: designTokens.spacing.graph.tvlChart.labelOpacity }}
            >
              {displayDate}
            </p>
          </div>
        </div>
      </UnifiedChartContainer>
    )
  }

  
  if (variant === "home") {
  return (
    <UnifiedChartContainer className={className}>
      <div 
        className="absolute overflow-hidden"
        style={{ 
          left: designTokens.spacing.graph.tvlChart.contentPaddingX,
          top: designTokens.spacing.graph.tvlChart.barsTop,
          width: designTokens.spacing.graph.tvlChart.contentWidth,
          height: designTokens.spacing.graph.tvlChart.barsHeight,
        }}
        onMouseLeave={() => {
          setHoveredIndex(null)
          setDisplayValue(totalValue)
          setDisplayDate(date)
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            barCategoryGap="4px"
          >
            <CartesianGrid strokeDasharray="none" stroke="transparent" />
            <XAxis hide />
            <YAxis hide domain={[0, 500]} />
            <Bar
              dataKey="value"
              fill="transparent"
              shape={CustomBarShape}
              barSize={10}
              activeBar={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div 
        className="absolute flex items-center justify-between text-center"
        style={{ 
          left: designTokens.spacing.graph.tvlChart.contentPaddingX,
          top: designTokens.spacing.graph.tvlChart.datesTop,
          width: designTokens.spacing.graph.tvlChart.contentWidth,
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

      <div 
        className="absolute flex flex-col"
        style={{ 
          left: designTokens.spacing.graph.tvlChart.contentPaddingX,
          top: designTokens.spacing.graph.tvlChart.contentTop,
          width: designTokens.spacing.graph.tvlChart.contentWidth,
          gap: designTokens.spacing.text.labelHeadingGap,
        }}
      >
        <div className="flex items-end w-full">
          <p 
            className={`flex-1 ${typographyClasses.label1}`}
            style={{ color: designTokens.colors.graph.labelMuted }}
          >
            Total Value Locked
          </p>
        </div>
        
        <div 
          className="flex flex-col items-start w-full leading-normal whitespace-pre-wrap"
          style={{ 
            gap: designTokens.spacing.graph.tvlChart.headerGap,
            color: designTokens.colors.graph.heading,
          }}
        >
          <div 
            className={`${typographyClasses.display1} w-full`}
            style={{ letterSpacing: designTokens.spacing.graph.tvlChart.valueTracking }}
          >
            {isInitialLoad && displayValue === initialValue ? (
              displayValue.startsWith('$') ? (
                <>
                  $<AnimatedNumber key="initial" value={parseFloat(displayValue.replace(/[^0-9.]/g, '')) || 0} decimals={0} delay={0.1} duration={1.2} />
                </>
              ) : (
                <AnimatedNumber key="initial" value={parseFloat(displayValue.replace(/[^0-9.]/g, '')) || 0} decimals={0} delay={0.1} duration={1.2} />
              )
            ) : (
              displayValue
            )}
          </div>
          <p 
            className={`${typographyClasses.label1} w-full`}
            style={{ opacity: designTokens.spacing.graph.tvlChart.labelOpacity }}
          >
            {displayDate}
          </p>
        </div>
      </div>
    </UnifiedChartContainer>
    )
  }

  
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
        <div 
          className={typographyClasses.display1}
          style={{ 
            color: designTokens.colors.text.primary,
          }}
        >
          {isInitialLoad && displayValue === initialValue ? (
            (() => {
              const valueToParse = totalValue || displayValue || defaultTotalValue
              let numericValue = parseFloat(valueToParse.replace(/[^0-9.]/g, ''))
              
              if (!numericValue || isNaN(numericValue) || numericValue === 0) {
                numericValue = 185053 // Default for yields variant
              }
              
              return displayValue.startsWith('$') || valueToParse.startsWith('$') ? (
                <>
                  $<AnimatedNumber key="initial" value={numericValue} decimals={0} delay={0.1} duration={1.2} />
                </>
              ) : (
                <AnimatedNumber key="initial" value={numericValue} decimals={0} delay={0.1} duration={1.2} />
              )
            })()
          ) : (
            (() => {
              const valueToShow = displayValue && displayValue !== "$0" ? displayValue : (totalValue || defaultTotalValue)
              return valueToShow
            })()
          )}
        </div>
        <p 
          className={typographyClasses.label1}
          style={{ 
            color: designTokens.colors.text.primary,
            opacity: parseFloat(designTokens.colors.text.muted.replace('rgba(0, 0, 0, ', '').replace(')', '')),
          }}
        >
          {displayDate}
        </p>
      </div>

      <ChartContainerWrapper>
        <div
          onMouseLeave={() => {
            setHoveredIndex(null)
            setDisplayValue(totalValue)
            setDisplayDate(date)
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              barCategoryGap="4px"
            >
              <CartesianGrid strokeDasharray="none" stroke="transparent" />
              <XAxis hide />
              <YAxis hide domain={[0, 400]} />
              <Bar
                dataKey="value"
                fill={designTokens.colors.primary}
                shape={CustomBarShape}
                barSize={10}
                activeBar={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartContainerWrapper>
    </>
  )
}
