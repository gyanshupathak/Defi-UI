/**
 * Chart Utility Functions
 * Shared utilities for data transformation, scaling, and formatting
 */

import { ChartDataPoint, ChartConfig } from "./types"

/**
 * Normalize data to fit chart dimensions
 */
export function normalizeChartData(
  data: ChartDataPoint[],
  config: ChartConfig
): ChartDataPoint[] {
  if (data.length === 0) return []

  const padding = config.padding || { top: 0, right: 0, bottom: 0, left: 0 }
  const chartWidth = config.width - (padding.left || 0) - (padding.right || 0)
  const chartHeight = config.height - (padding.top || 0) - (padding.bottom || 0)

  const minY = Math.min(...data.map(d => d.y))
  const maxY = Math.max(...data.map(d => d.y))
  const yRange = maxY - minY || 1

  return data.map((point, index) => ({
    ...point,
    x: (index / (data.length - 1 || 1)) * chartWidth + (padding.left || 0),
    y: chartHeight - ((point.y - minY) / yRange) * chartHeight + (padding.top || 0),
  }))
}

/**
 * Generate SVG path for line chart
 */
export function generateLinePath(
  data: ChartDataPoint[],
  config: ChartConfig
): string {
  if (data.length === 0) return ""

  const normalized = normalizeChartData(data, config)
  return normalized
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')
}

/**
 * Generate SVG path for area chart
 */
export function generateAreaPath(
  data: ChartDataPoint[],
  config: ChartConfig,
  baselineY?: number
): string {
  if (data.length === 0) return ""

  const padding = config.padding || { top: 0, right: 0, bottom: 0, left: 0 }
  const chartHeight = config.height - (padding.top || 0) - (padding.bottom || 0)
  const baseline = baselineY !== undefined 
    ? chartHeight - baselineY + (padding.top || 0)
    : config.height - (padding.bottom || 0)

  const normalized = normalizeChartData(data, config)
  const firstX = normalized[0].x
  const lastX = normalized[normalized.length - 1].x

  const linePath = normalized
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  return `${linePath} L ${lastX} ${baseline} L ${firstX} ${baseline} Z`
}

/**
 * Format large numbers for display
 */
export function formatChartValue(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  }
  return `$${value.toFixed(2)}`
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Calculate chart domain (min/max) for scaling
 */
export function calculateDomain(
  data: ChartDataPoint[],
  padding: number = 0.1
): { min: number; max: number } {
  if (data.length === 0) return { min: 0, max: 100 }

  const values = data.map(d => d.y)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min

  return {
    min: min - range * padding,
    max: max + range * padding,
  }
}

