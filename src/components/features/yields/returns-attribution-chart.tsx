"use client"

import * as React from "react"
import {
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface ReturnsAttributionChartProps {
  className?: string
}

export function ReturnsAttributionChart({ className }: ReturnsAttributionChartProps) {

  const chartData = [
    { day: "11 AUG", purple: 120, blue: 80, grey1: 60, grey2: 40 },
    { day: "12 AUG", purple: 150, blue: 100, grey1: 70, grey2: 50 },
    { day: "13 AUG", purple: 180, blue: 110, grey1: 75, grey2: 55 },
    { day: "14 AUG", purple: 200, blue: 105, grey1: 80, grey2: 60 },
    { day: "15 AUG", purple: 50, blue: 95, grey1: 75, grey2: 55 },
    { day: "16 AUG", purple: 120, blue: 100, grey1: 70, grey2: 50 },
    { day: "17 AUG", purple: 160, blue: 105, grey1: 75, grey2: 55 },
  ]

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7F56D9" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#7F56D9" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5496DE" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#5496DE" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="none" stroke="rgba(0, 0, 0, 0.1)" />
          <XAxis hide />
          <YAxis hide />
          <Tooltip contentStyle={{ display: 'none' }} />
          <Line
            type="monotone"
            dataKey="grey2"
            stroke="rgba(0, 0, 0, 0.2)"
            strokeWidth={1}
            dot={false}
            activeDot={false}
          />
          <Line
            type="monotone"
            dataKey="grey1"
            stroke="rgba(0, 0, 0, 0.3)"
            strokeWidth={1}
            dot={false}
            activeDot={false}
          />
          <Line
            type="monotone"
            dataKey="blue"
            stroke="#5496DE"
            strokeWidth={2}
            dot={{ fill: "#5496DE", r: 2 }}
            activeDot={false}
          />
          <Line
            type="monotone"
            dataKey="purple"
            stroke="#7F56D9"
            strokeWidth={3}
            dot={{ fill: "#7F56D9", r: 3 }}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
