"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { DropdownSelector } from "@/components/ui/dropdown-selector"
import { StrategyFilterCard } from "./strategy-filter-card"
import { ChartContainerWrapper } from "./chart-container-wrapper"
import { AllocationsTable } from "./allocations-table"
import { YieldsDateLabels } from "./yields-date-labels"
import { YieldsNoteCard } from "./yields-note-card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface StackedBarChartDataPoint {
  [key: string]: number | string | undefined
  orange?: number
  purple?: number
  blue?: number
  date?: string
  formattedDate?: string
  index?: number
}

type ViewType = "chart" | "table"

export function AllocationsTab() {
  const [viewType, setViewType] = React.useState<ViewType>("chart")
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  
  const viewOptions = [
    { id: "chart" as ViewType, label: "Allocation Chart" },
    { id: "table" as ViewType, label: "Allocation Table" },
  ]
  
  const dates = ["11 AUG", "12 AUG", "13 AUG", "14 AUG", "15 AUG", "16 AUG", "17 AUG"]
  
  // Format bar data with dates
  const formatAllocationsData = (): StackedBarChartDataPoint[] => {
    const rawData = [
      // 11 AUG (8 bars)
      { orange: 56, purple: 142, blue: 81 },
      { orange: 151, purple: 40, blue: 133 },
      { orange: 106, purple: 166, blue: 70 },
      { orange: 100, purple: 226, blue: 40 },
      { orange: 170, purple: 38, blue: 133 },
      { orange: 93, purple: 120, blue: 93 },
      { orange: 55, purple: 102, blue: 102 },
      { orange: 64, purple: 206, blue: 50 },
      // 12 AUG (8 bars)
      { orange: 64, purple: 206, blue: 50 },
      { orange: 64, purple: 206, blue: 50 },
      { orange: 111, purple: 50, blue: 128 },
      { orange: 179, purple: 38, blue: 133 },
      { orange: 140, purple: 58, blue: 124 },
      { orange: 52, purple: 200, blue: 52 },
      { orange: 52, purple: 200, blue: 52 },
      { orange: 52, purple: 200, blue: 52 },
      // 13 AUG (8 bars)
      { orange: 135, purple: 50, blue: 128 },
      { orange: 92, purple: 176, blue: 65 },
      { orange: 169, purple: 42, blue: 132 },
      { orange: 81, purple: 142, blue: 81 },
      { orange: 81, purple: 142, blue: 81 },
      { orange: 81, purple: 142, blue: 81 },
      { orange: 73, purple: 230, blue: 38 },
      { orange: 127, purple: 166, blue: 70 },
      // 14 AUG (8 bars)
      { orange: 178, purple: 120, blue: 93 },
      { orange: 126, purple: 52, blue: 126 },
      { orange: 144, purple: 64, blue: 121 },
      { orange: 146, purple: 102, blue: 102 },
      { orange: 86, purple: 86, blue: 134 },
      { orange: 91, purple: 107, blue: 107 },
      { orange: 91, purple: 107, blue: 107 },
      { orange: 94, purple: 164, blue: 70 },
      // 15 AUG (8 bars)
      { orange: 177, purple: 58, blue: 124 },
      { orange: 121, purple: 62, blue: 121 },
      { orange: 183, purple: 34, blue: 136 },
      { orange: 189, purple: 40, blue: 132 },
      { orange: 78, purple: 150, blue: 78 },
      { orange: 146, purple: 102, blue: 102 },
      { orange: 86, purple: 86, blue: 134 },
      { orange: 93, purple: 166, blue: 69 },
      // 16 AUG (8 bars)
      { orange: 183, purple: 66, blue: 120 },
      { orange: 128, purple: 80, blue: 113 },
      { orange: 128, purple: 80, blue: 113 },
      { orange: 86, purple: 86, blue: 134 },
      { orange: 137, purple: 62, blue: 121 },
      { orange: 125, purple: 142, blue: 82 },
      { orange: 117, purple: 70, blue: 117 },
      { orange: 86, purple: 86, blue: 134 },
      // 17 AUG (6 bars)
      { orange: 110, purple: 160, blue: 72 },
      { orange: 110, purple: 160, blue: 72 },
      { orange: 81, purple: 142, blue: 81 },
      { orange: 91, purple: 170, blue: 68 },
      { orange: 111, purple: 138, blue: 83 },
      { orange: 101, purple: 200, blue: 53 },
    ]

    // Group bars by date (8 bars per day for first 6 days, 6 bars for last day)
    const barsPerDay = [8, 8, 8, 8, 8, 8, 6]
    
    return rawData.map((item, index) => {
      // Find which date this bar belongs to
      let dateIndex = 0
      let cumulativeBars = 0
      for (let i = 0; i < barsPerDay.length; i++) {
        cumulativeBars += barsPerDay[i]
        if (index < cumulativeBars) {
          dateIndex = i
          break
        }
      }
      
      return {
        ...item,
        date: dates[dateIndex] || dates[dates.length - 1],
        formattedDate: dates[dateIndex] || dates[dates.length - 1],
      }
    })
  }

  const barData = formatAllocationsData().map((item, index) => ({
    ...item,
    index,
  }))

  // Custom bar shapes for each segment with hover handling
  const createCustomBarShape = (fill: string, radius: [number, number, number, number]) => {
    return (props: any) => {
      const { payload, x, y, width, height } = props
      const barIndex = payload?.index ?? barData.findIndex(d => 
        d.orange === payload?.orange && 
        d.purple === payload?.purple && 
        d.blue === payload?.blue
      )
      const isHovered = hoveredIndex === barIndex
      
      // All bars start light (opacity 0.25)
      // On hover: hovered bar becomes dark (opacity 1), others stay light (opacity 0.25)
      const opacity = isHovered ? 1 : 0.25

      const handleMouseEnter = () => {
        if (barIndex >= 0 && barIndex < barData.length) {
          setHoveredIndex(barIndex)
        }
      }

      const handleMouseLeave = () => {
        setHoveredIndex(null)
      }

      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          opacity={opacity}
          rx={radius[0]}
          ry={radius[1]}
          style={{
            transition: "opacity 0.2s ease-in-out",
            cursor: "pointer",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )
    }
  }

  return (
    <>
      <p 
        className={`absolute ${typographyClasses.label1} opacity-50`}
        style={{
          left: '24px',
          top: '24px',
          color: designTokens.colors.text.primary,
        }}
      >
        {viewType === "chart" ? "Current Date" : "Last Date Allocation"}
      </p>

      <div className="absolute" style={{ right: '24px', top: '20px' }}>
        <DropdownSelector
          selectedValue={viewType}
          onValueChange={setViewType}
          options={viewOptions}
          minWidth="160px"
        />
      </div>

      {viewType === "chart" ? (
        <>
          <div className="absolute" style={{ left: '24px', top: '56px' }}>
            <StrategyFilterCard
              label="Unallocated Cash"
              value="30%"
              borderColor="#2b66ff"
              hasInnerShadow={false}
            />
          </div>

          <div className="absolute" style={{ left: '177px', top: '56px' }}>
            <StrategyFilterCard
              label="RLP/USDC Morpho (4x)"
              value="30.1%"
              borderColor="#8198ee"
              hasInnerShadow={true}
            />
          </div>

          <div className="absolute" style={{ left: '366px', top: '56px' }}>
            <StrategyFilterCard
              label="siUSD/USDC Morpho (10x)"
              value="30%"
              borderColor="#f9b666"
              hasInnerShadow={true}
            />
          </div>

          <ChartContainerWrapper className="overflow-clip">
            <div
              onMouseLeave={() => {
                setHoveredIndex(null)
              }}
              style={{ width: "100%", height: "100%" }}
            >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                barCategoryGap="4px"
              >
                <CartesianGrid strokeDasharray="none" stroke="transparent" />
                <XAxis hide />
                <YAxis hide />
                <Tooltip contentStyle={{ display: 'none' }} />
                <Bar
                  dataKey="blue"
                  stackId="a"
                  fill="#2b66ff"
                  shape={createCustomBarShape("#2b66ff", [0, 0, 2, 2])}
                  barSize={10}
                />
                <Bar
                  dataKey="purple"
                  stackId="a"
                  fill="#8198ee"
                  shape={createCustomBarShape("#8198ee", [0, 0, 0, 0])}
                />
                <Bar
                  dataKey="orange"
                  stackId="a"
                  fill="#f9b666"
                  shape={createCustomBarShape("#f9b666", [2, 2, 0, 0])}
                />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </ChartContainerWrapper>

          <YieldsDateLabels />
          <YieldsNoteCard 
            content="By initiating a withdrawal, your vault shares (syUSD) will be converted into the underlying asset based on the latest market rates, which may fluctuate slightly; once the request is submitted."
          />
        </>
      ) : (
        <AllocationsTable />
      )}
    </>
  )
}
