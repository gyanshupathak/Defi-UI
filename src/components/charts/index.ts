/**
 * Charts Module - Centralized Exports
 * Following feature-sliced architecture
 */

// Base Components
export { BaseChartContainer } from "./base-chart-container"
export { ChartContainer } from "./chart-container" // Legacy, will be deprecated
export { UnifiedChartContainer } from "./unified-chart-container"

// Chart Components
export { TVLChart } from "./tvl-chart"
export { UnifiedBarChart } from "./unified-bar-chart"
export { UnifiedStackedBarChart } from "./unified-stacked-bar-chart"

// Types
export type * from "./types"
export type { BarChartDataPoint } from "./unified-bar-chart"
export type { StackedBarChartDataPoint } from "./unified-stacked-bar-chart"

// Utils
export * from "./utils"

