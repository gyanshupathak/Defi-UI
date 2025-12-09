"use client"

import * as React from "react"
import { Info, ChevronsUpDown } from "lucide-react"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"
import { cn } from "@/lib/utils"

// ============================================================================
// TYPES
// ============================================================================

export interface TableColumn<T = any> {
  /** Unique identifier for the column */
  id: string
  /** Header label text */
  label: string
  /** Width of the column (e.g., "180px", "90px", or "flex-1" for flexible) */
  width?: string | number
  /** Alignment of content in the column */
  align?: "left" | "right" | "center"
  /** Whether the column header is sortable */
  sortable?: boolean
  /** Custom header content (overrides label if provided) */
  headerContent?: React.ReactNode
  /** Info icon in header */
  showInfoIcon?: boolean
  /** Callback when header is clicked (for sorting) */
  onHeaderClick?: () => void
  /** Custom padding right for this column (overrides default logic) */
  paddingRight?: string
}

export interface DataTableProps<T = any> {
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
  /** Custom className for the table container */
  className?: string
  /** Custom style for the table container */
  style?: React.CSSProperties
  /** Empty state message */
  emptyStateMessage?: string
  /** Show empty state when no data */
  showEmptyState?: boolean
  /** Custom row className */
  rowClassName?: (row: T, index: number) => string
  /** Custom row style */
  rowStyle?: (row: T, index: number) => React.CSSProperties
  /** Minimum row height */
  minRowHeight?: string | number
  /** Show border bottom on header */
  headerBorderBottom?: boolean
  /** Custom header style */
  headerStyle?: React.CSSProperties
  /** Maximum height for scrollable body */
  maxBodyHeight?: string
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * DataTable Component - Reusable table component based on allocation table design
 * 
 * Maintains the exact UI styling of the allocation table while being flexible
 * enough to be used for different table types (allocation, activity, etc.)
 * 
 * @example
 * ```tsx
 * <DataTable
 *   columns={[
 *     { id: "strategy", label: "Strategy", width: "180px" },
 *     { id: "amount", label: "Amount", width: "flex-1", align: "right" },
 *   ]}
 *   data={myData}
 *   renderCell={(column, row) => {
 *     if (column.id === "strategy") return row.name
 *     if (column.id === "amount") return row.amount
 *     return null
 *   }}
 * />
 * ```
 */
export function DataTable<T = any>({
  columns,
  data,
  renderCell,
  renderRow,
  getRowKey = (_, index) => index,
  className,
  style,
  emptyStateMessage = "No data available",
  showEmptyState = true,
  rowClassName,
  rowStyle,
  minRowHeight = "48px",
  headerBorderBottom = false,
  headerStyle,
  maxBodyHeight,
}: DataTableProps<T>) {
  return (
    <div
      className={cn("flex flex-col items-start rounded-[8px]", className)}
      style={{ 
        width: "620px", 
        maxHeight: maxBodyHeight || "none",
        overflow: "visible",
        position: "relative",
        ...style 
      }}
    >
      {/* Table Header */}
      <div
        className="flex items-center rounded-[99px] w-full flex-shrink-0"
        style={{
          height: "38px",
          backgroundColor: designTokens.colors.background.main,
          boxShadow: shadows.popOut,
          borderBottom: headerBorderBottom
            ? `1px solid ${designTokens.colors.border.separator}`
            : undefined,
          position: "relative",
          zIndex: 10,
          marginBottom: "1px",
          ...headerStyle,
        }}
      >
        {columns.map((column, index) => {
          const isLast = index === columns.length - 1
          const columnWidth =
            column.width === "flex-1"
              ? { flex: "1 0 0" }
              : column.width
              ? { width: column.width }
              : {}

          const headerPadding = {
            paddingLeft: index === 0 ? "16px" : "8px",
            paddingRight: isLast ? "16px" : column.width === "flex-1" ? "16px" : "0px",
            paddingTop: "8px",
            paddingBottom: "8px",
          }

          const alignStyle =
            column.align === "right"
              ? { justifyContent: "flex-end", textAlign: "right" as const }
              : column.align === "center"
              ? { justifyContent: "center", textAlign: "center" as const }
              : { justifyContent: "flex-start", textAlign: "left" as const }

          return (
            <div
              key={column.id}
              className={cn(
                "flex items-center",
                column.sortable || column.onHeaderClick ? "cursor-pointer" : ""
              )}
              style={{
                ...columnWidth,
                ...headerPadding,
                ...alignStyle,
              }}
              onClick={column.onHeaderClick}
            >
              {column.headerContent ? (
                column.headerContent
              ) : (
                <>
                  {column.showInfoIcon && (
                    <Info size={12} style={{ color: designTokens.colors.text.primary, opacity: 1, marginRight: "2px" }} />
                  )}
                  <p
                    className={typographyClasses.label2}
                    style={{
                      color: designTokens.colors.text.primary,
                      opacity: 0.6,
                      fontSize: "11px",
                      lineHeight: "14px",
                      ...alignStyle,
                    }}
                  >
                    {column.label}
                  </p>
                  {(column.sortable || column.onHeaderClick) && (
                    <div
                      className="opacity-40"
                      style={{ width: "14px", height: "14px", marginLeft: "4px" }}
                    >
                      <ChevronsUpDown size={14} />
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Table Body */}
      <div 
        className={cn("flex flex-col items-start w-full", maxBodyHeight && "custom-scrollbar")}
        style={{
          overflowY: maxBodyHeight ? "auto" : "visible",
          overflowX: "hidden",
          maxHeight: maxBodyHeight ? `calc(${maxBodyHeight} - 38px - 1px)` : "none",
          position: "relative",
        }}
      >
        {data.length === 0 && showEmptyState ? (
          <div
            className="flex items-center justify-center w-full"
            style={{ minHeight: "200px" }}
          >
            <p
              className={typographyClasses.label1}
              style={{
                color: designTokens.colors.text.primary,
                opacity: 0.5,
              }}
            >
              {emptyStateMessage}
            </p>
          </div>
        ) : (
          data.map((row, rowIndex) => {
            const isLast = rowIndex === data.length - 1
            const key = getRowKey(row, rowIndex)

            // Render cells
            const cells = columns.map((column, colIndex) => {
              const isFirst = colIndex === 0
              const isLast = colIndex === columns.length - 1
              
              // Determine padding based on column position and width
              // Use custom paddingRight if specified, otherwise use default logic
              let paddingRight: string
              if (column.paddingRight !== undefined) {
                paddingRight = column.paddingRight
              } else if (isFirst) {
                paddingRight = "0px"
              } else if (isLast) {
                paddingRight = "16px"
              } else if (column.width === "flex-1") {
                paddingRight = "16px"
              } else {
                // Fixed width middle columns get 16px padding
                paddingRight = "16px"
              }
              
              return (
                <div
                  key={column.id}
                  style={{
                    ...(column.width === "flex-1"
                      ? { flex: "1 0 0" }
                      : column.width
                      ? { width: column.width }
                      : {}),
                    paddingLeft: isFirst ? "16px" : "8px",
                    paddingRight,
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    ...(column.align === "right"
                      ? { textAlign: "right", display: "flex", justifyContent: "flex-end", alignItems: "center" }
                      : column.align === "center"
                      ? { textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center" }
                      : { display: "flex", alignItems: "center" }),
                  }}
                >
                  {renderCell(column, row, rowIndex)}
                </div>
              )
            })

            // Use custom renderer if provided, otherwise use default
            if (renderRow) {
              return (
                <React.Fragment key={key}>
                  {renderRow(row, rowIndex, cells)}
                </React.Fragment>
              )
            }

            // Default row renderer
            return (
              <div
                key={key}
                className={cn(
                  "flex items-center w-full",
                  rowClassName?.(row, rowIndex)
                )}
                style={{
                  borderBottom: isLast
                    ? "none"
                    : `1px solid rgba(0, 0, 0, 0.08)`,
                  minHeight: minRowHeight,
                  ...rowStyle?.(row, rowIndex),
                }}
              >
                {cells}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}


