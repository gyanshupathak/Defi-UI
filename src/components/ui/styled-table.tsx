"use client"

import * as React from "react"
import { DataTable, type TableColumn } from "./data-table"

// ============================================================================
// TYPES
// ============================================================================

export interface StyledTableProps<T = any> {
  /** Column definitions */
  columns: TableColumn<T>[]
  /** Row data */
  data: T[]
  /** Function to render a cell content */
  renderCell: (column: TableColumn<T>, row: T, rowIndex: number) => React.ReactNode
  /** Optional custom row renderer (for complex rows) */
  renderRow?: (row: T, rowIndex: number, cells: React.ReactNode[]) => React.ReactNode
  /** Optional row key extractor */
  getRowKey?: (row: T, index: number) => string | number
  /** Custom className for the container */
  containerClassName?: string
  /** Custom style for the container */
  containerStyle?: React.CSSProperties
  /** Table width (default: 620px) */
  width?: string
  /** Maximum height for scrollable table body */
  maxHeight?: string
  /** Minimum row height (default: 48px) */
  minRowHeight?: string
  /** Empty state message */
  emptyStateMessage?: string
  /** Show empty state when no data */
  showEmptyState?: boolean
  /** Show border bottom on header */
  headerBorderBottom?: boolean
  /** Custom header style */
  headerStyle?: React.CSSProperties
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * StyledTable Component - Reusable table component matching allocations table design
 * 
 * Provides consistent styling and layout matching the allocations table.
 * Can be positioned absolutely or relatively based on container props.
 * 
 * @example
 * ```tsx
 * <StyledTable
 *   columns={columns}
 *   data={data}
 *   renderCell={(column, row) => {
 *     // Custom cell rendering
 *   }}
 *   width="620px"
 *   minRowHeight="48px"
 * />
 * ```
 */
export function StyledTable<T = any>({
  columns,
  data,
  renderCell,
  renderRow,
  getRowKey,
  containerClassName,
  containerStyle,
  width = "620px",
  maxHeight,
  minRowHeight = "48px",
  emptyStateMessage = "No data available",
  showEmptyState = true,
  headerBorderBottom = false,
  headerStyle,
}: StyledTableProps<T>) {
  return (
    <div
      className={containerClassName}
      style={{
        width,
        ...containerStyle,
      }}
    >
      <DataTable<T>
        columns={columns}
        data={data}
        getRowKey={getRowKey}
        renderCell={renderCell}
        renderRow={renderRow}
        minRowHeight={minRowHeight}
        emptyStateMessage={emptyStateMessage}
        showEmptyState={showEmptyState}
        headerBorderBottom={headerBorderBottom}
        headerStyle={headerStyle}
        maxBodyHeight={maxHeight}
      />
    </div>
  )
}

