"use client"

import * as React from "react"
import { DataTable, type TableColumn } from "./data-table"

export interface StyledTableProps<T = any> {
  columns: TableColumn<T>[]
  data: T[]
  renderCell: (column: TableColumn<T>, row: T, rowIndex: number) => React.ReactNode
  renderRow?: (row: T, rowIndex: number, cells: React.ReactNode[]) => React.ReactNode
  getRowKey?: (row: T, index: number) => string | number
  containerClassName?: string
  containerStyle?: React.CSSProperties
  width?: string
  maxHeight?: string
  minRowHeight?: string
  emptyStateMessage?: string
  showEmptyState?: boolean
  headerBorderBottom?: boolean
  headerStyle?: React.CSSProperties
}
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
