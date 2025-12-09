/**
 * Chart Types and Interfaces
 * Centralized type definitions for all chart components
 */

export interface ChartDataPoint {
  x: number | string
  y: number
  label?: string
  color?: string
}

export interface ChartSeries {
  name: string
  data: ChartDataPoint[]
  color?: string
  strokeWidth?: number
  fill?: boolean
  fillOpacity?: number
}

export interface ChartConfig {
  width: number
  height: number
  padding?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
  opacity?: number
}

export interface BarChartData {
  label: string
  value: number
  color?: string
}

export interface LineChartData {
  timestamp: number | string
  value: number
  series?: string
}

export interface AreaChartData {
  timestamp: number | string
  value: number
  series?: string
}

export interface StackedBarData {
  label: string
  segments: {
    label: string
    value: number
    color: string
  }[]
}

export type ChartVariant = "bar" | "line" | "area" | "stacked-bar" | "pie" | "donut"

export interface ChartProps {
  data: ChartDataPoint[] | BarChartData[] | LineChartData[] | AreaChartData[] | StackedBarData[]
  config?: ChartConfig
  className?: string
  variant?: ChartVariant
}

