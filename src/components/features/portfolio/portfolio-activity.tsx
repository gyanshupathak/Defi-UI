"use client"

import * as React from "react"
import { ExternalLink, Filter, Info, ChevronsUpDown, ArrowDown, ArrowUp, ArrowLeftRight } from "lucide-react"
import { designTokens, typographyClasses, shadows } from "@/lib/design-system"
import { DropdownSelector, type DropdownOption } from "@/components/ui/dropdown-selector"
import { DataTable, type TableColumn } from "@/components/ui/data-table"
import { StyledTable } from "@/components/ui/styled-table"
import { DashboardCard } from "@/components/ui/dashboard-card"
import { cn } from "@/lib/utils"

export type TransactionStatus = "deposit" | "withdraw" | "bridge"

export type SortField = "date" | "status" | "from" | "to"
export type SortDirection = "asc" | "desc"

export interface Transaction {
  id: string
  date: string
  status: TransactionStatus
  from: {
    amount: string
    token: string
    chain: string
  }
  to: {
    amount: string
    token: string
    chain: string
  }
  txHash?: string // Optional transaction hash for external link
}

export interface ActivityFilter {
  status?: TransactionStatus[]
  tokens?: string[]
  chains?: string[]
}

export interface PortfolioActivityProps {
  transactions?: Transaction[]
  initialFilter?: ActivityFilter
  onFilterChange?: (filter: ActivityFilter) => void
  onTransactionClick?: (transaction: Transaction) => void
  className?: string
  showEmptyState?: boolean
  emptyStateMessage?: string
}


const statusConfig: Record<
  TransactionStatus,
  {
    label: string
    bgColor: string
    textColor: string
    icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  }
> = {
  deposit: {
    label: "Deposit",
    bgColor: designTokens.colors.status.successBg,
    textColor: designTokens.colors.status.success,
    icon: ArrowDown,
  },
  withdraw: {
    label: "Withdraw",
    bgColor: designTokens.colors.status.errorBg,
    textColor: designTokens.colors.status.error,
    icon: ArrowUp,
  },
  bridge: {
    label: "Bridge",
    bgColor: designTokens.colors.status.infoBg,
    textColor: designTokens.colors.status.info,
    icon: ArrowLeftRight,
  },
}

const defaultTransactions: Transaction[] = [
  {
    id: "1",
    date: "3rd January'25",
    status: "deposit",
    from: { amount: "482", token: "syUSD", chain: "Base" },
    to: { amount: "483", token: "USDC", chain: "Base" },
  },
  {
    id: "2",
    date: "28th July'25",
    status: "bridge",
    from: { amount: "1,0954", token: "syUSD", chain: "Base" },
    to: { amount: "1,0955", token: "syUSD", chain: "Katana" },
  },
  {
    id: "3",
    date: "14th February'25",
    status: "withdraw",
    from: { amount: "1,937", token: "syUSD", chain: "Base" },
    to: { amount: "1,938.09", token: "USDC", chain: "Base" },
  },
  {
    id: "4",
    date: "22nd April'25",
    status: "deposit",
    from: { amount: "2,750", token: "syUSD", chain: "Base" },
    to: { amount: "2,751.06", token: "USDC", chain: "Base" },
  },
  {
    id: "5",
    date: "14th February'25",
    status: "withdraw",
    from: { amount: "1,937", token: "syUSD", chain: "Base" },
    to: { amount: "1,938.09", token: "USDC", chain: "Base" },
  },
  {
    id: "6",
    date: "28th July'25",
    status: "bridge",
    from: { amount: "1,0954", token: "syUSD", chain: "Base" },
    to: { amount: "1,0955", token: "syUSD", chain: "Katana" },
  },
  {
    id: "7",
    date: "15th June'25",
    status: "withdraw",
    from: { amount: "1,094", token: "syUSD", chain: "Base" },
    to: { amount: "1,095", token: "USDC", chain: "Base" },
  },
  {
    id: "8",
    date: "15th June'25",
    status: "withdraw",
    from: { amount: "1,094", token: "syUSD", chain: "Base" },
    to: { amount: "1,095", token: "USDC", chain: "Base" },
  },
  {
    id: "9",
    date: "28th July'25",
    status: "bridge",
    from: { amount: "1,0954", token: "syUSD", chain: "Base" },
    to: { amount: "1,0955", token: "syUSD", chain: "Katana" },
  },
]

export function PortfolioActivity({
  transactions = defaultTransactions,
  initialFilter,
  onFilterChange,
  onTransactionClick,
  className,
  showEmptyState = true,
  emptyStateMessage = "No activities found",
}: PortfolioActivityProps) {
  const [showFilters, setShowFilters] = React.useState(false)
  const [showActivityDropdown, setShowActivityDropdown] = React.useState(false)
  const [filter, setFilter] = React.useState<ActivityFilter>(initialFilter || {})
  const [sortField, setSortField] = React.useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("desc")
  const filteredTransactions = React.useMemo(() => {
    let result = [...transactions]

    if (filter.status && filter.status.length > 0) {
      result = result.filter((tx) => filter.status!.includes(tx.status))
    }

    if (filter.tokens && filter.tokens.length > 0) {
      result = result.filter(
        (tx) =>
          filter.tokens!.includes(tx.from.token) ||
          filter.tokens!.includes(tx.to.token)
      )
    }

    if (filter.chains && filter.chains.length > 0) {
      result = result.filter(
        (tx) =>
          filter.chains!.includes(tx.from.chain) ||
          filter.chains!.includes(tx.to.chain)
      )
    }
    if (sortField) {
      result.sort((a, b) => {
        let aValue: string | number
        let bValue: string | number

        switch (sortField) {
          case "date":
            aValue = a.date
            bValue = b.date
            break
          case "status":
            aValue = a.status
            bValue = b.status
            break
          case "from":
            aValue = a.from.amount
            bValue = b.from.amount
            break
          case "to":
            aValue = a.to.amount
            bValue = b.to.amount
            break
          default:
            return 0
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        return sortDirection === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue)
      })
    }

    return result
  }, [transactions, filter, sortField, sortDirection])

  const handleFilterChange = React.useCallback(
    (newFilter: ActivityFilter) => {
      setFilter(newFilter)
      onFilterChange?.(newFilter)
    },
    [onFilterChange]
  )

  const handleSort = React.useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
      } else {
        setSortField(field)
        setSortDirection("asc")
      }
    },
    [sortField, sortDirection]
  )

  const uniqueStatuses = React.useMemo(
    () => Array.from(new Set(transactions.map((tx) => tx.status))),
    [transactions]
  )

  const activityOptions: DropdownOption<string>[] = [
    { id: "all", label: `All Activities (${filteredTransactions.length})` },
    ...uniqueStatuses.map(status => ({
      id: status,
      label: statusConfig[status].label
    })),
  ]

  const selectedActivityFilter = filter.status && filter.status.length > 0 
    ? filter.status[0] 
    : "all"

  const columns: TableColumn<Transaction>[] = [
    {
      id: "date",
      label: "Date of Transaction",
      width: "175px",
      align: "left",
      sortable: true,
      onHeaderClick: () => handleSort("date"),
    },
    {
      id: "status",
      label: "Status",
      width: "115px",
      align: "left",
    },
    {
      id: "from",
      label: "From",
      width: "flex-1",
      align: "right",
      sortable: true,
      showInfoIcon: true,
      onHeaderClick: () => handleSort("from"),
    },
    {
      id: "to",
      label: "To",
      width: "flex-1",
      align: "right",
      showInfoIcon: true,
      onHeaderClick: () => handleSort("to"),
    },
  ]

  return (
    <DashboardCard width="668px" height="640px" className={className}>
      <div
        className="absolute flex items-center justify-between"
        style={{
          left: "24px",
          top: "24px",
          right: "24px",
          width: "calc(100% - 48px)",
        }}
      >
        <DropdownSelector
          selectedValue={selectedActivityFilter}
          onValueChange={(value) => {
            if (value === "all") {
              handleFilterChange({ ...filter, status: undefined })
            } else {
              handleFilterChange({
                ...filter,
                status: [value as TransactionStatus],
              })
            }
          }}
          options={activityOptions}
          minWidth="200px"
        />

        <button
          type="button"
          className="flex items-center justify-center border border-solid rounded-[99px] px-[12px] py-[4px] h-[24px] cursor-pointer bg-transparent hover:opacity-80 transition-opacity flex-shrink-0"
          onClick={() => setShowFilters(!showFilters)}
          style={{
            borderColor: designTokens.colors.border.default,
          }}
        >
          <div className="flex items-center gap-[4px]">
            <Filter size={16} style={{ color: designTokens.colors.text.primary }} />
            <p
              className={typographyClasses.label1}
              style={{ color: designTokens.colors.text.primary }}
            >
              Filters
            </p>
          </div>
        </button>
      </div>

      {showFilters && (
        <div
          className="absolute z-40 rounded-[8px] border border-solid p-4 custom-scrollbar"
          style={{
            top: "56px",
            right: "24px",
            backgroundColor: designTokens.colors.background.main,
            borderColor: designTokens.colors.border.separator,
            boxShadow: shadows.dropdown,
            minWidth: "200px",
            maxWidth: "calc(100% - 48px)",
            maxHeight: "calc(640px - 72px - 24px)",
            overflowY: "auto",
          }}
        >
          <div className="flex flex-col gap-3">
            <div>
              <p className={typographyClasses.label1} style={{ marginBottom: "8px" }}>
                Status
              </p>
              <div className="flex flex-col gap-1">
                {uniqueStatuses.map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filter.status?.includes(status) || false}
                      onChange={(e) => {
                        const newStatus = e.target.checked
                          ? [...(filter.status || []), status]
                          : filter.status?.filter((s) => s !== status) || []
                        handleFilterChange({
                          ...filter,
                          status: newStatus.length > 0 ? newStatus : undefined,
                        })
                      }}
                    />
                    <p className={typographyClasses.label1}>
                      {statusConfig[status].label}
                    </p>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: "72px",
          width: "620px",
          height: "calc(640px - 72px - 24px)",
          overflow: "visible",
        }}
      >
        <StyledTable<Transaction>
          columns={columns}
          data={filteredTransactions}
          getRowKey={(row) => row.id}
          width="620px"
          maxHeight="calc(640px - 72px - 24px)"
          minRowHeight="48px"
          headerBorderBottom={false}
          emptyStateMessage={emptyStateMessage}
          showEmptyState={showEmptyState}
          renderCell={(column, row) => {
            switch (column.id) {
              case "date":
                return (
                  <div className="flex items-center gap-[8px]" style={{ minHeight: "48px", width: "100%" }}>
                    <ExternalLink
                      size={16}
                      style={{ color: designTokens.colors.text.primary }}
                    />
                    <p
                      className={typographyClasses.label1}
                      style={{ color: designTokens.colors.text.primary }}
                    >
                      {row.date}
                    </p>
                  </div>
                )
              case "status":
                const status = statusConfig[row.status]
                return (
                  <div className="flex items-center" style={{ width: "100%" }}>
                    <div
                      className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[99px]"
                      style={{
                        backgroundColor: status.bgColor,
                        color: status.textColor,
                      }}
                    >
                      {React.createElement(status.icon, {
                        size: 16,
                        style: { color: status.textColor },
                      })}
                      <p
                        className={typographyClasses.label1}
                        style={{ color: status.textColor }}
                      >
                        {status.label}
                      </p>
                    </div>
                  </div>
                )
              case "from":
                return (
                  <div className="flex flex-col items-end justify-center gap-[2px]" style={{ width: "100%", minHeight: "48px" }}>
                    <div className="flex items-center gap-[4px]">
                      <p
                        className={typographyClasses.label1}
                        style={{ color: designTokens.colors.text.primary }}
                      >
                        {row.from.amount}
                      </p>
                      <p
                        className={typographyClasses.label1}
                        style={{
                          color: designTokens.colors.text.primary,
                          opacity: 0.5,
                        }}
                      >
                        {row.from.token}
                      </p>
                    </div>
                    <p
                      className={cn(typographyClasses.label2, "italic opacity-50")}
                      style={{
                        color: designTokens.colors.text.primary,
                        textAlign: "right",
                        fontSize: "10px",
                      }}
                    >
                      {row.from.chain}
                    </p>
                  </div>
                )
              case "to":
                return (
                  <div className="flex flex-col items-end justify-center gap-[2px]" style={{ width: "100%", minHeight: "48px" }}>
                    <div className="flex items-center gap-[4px]">
                      <p
                        className={typographyClasses.label1}
                        style={{ color: designTokens.colors.text.primary }}
                      >
                        {row.to.amount}
                      </p>
                      <p
                        className={typographyClasses.label1}
                        style={{
                          color: designTokens.colors.text.primary,
                          opacity: 0.5,
                        }}
                      >
                        {row.to.token}
                      </p>
                    </div>
                    <p
                      className={cn(typographyClasses.label2, "italic opacity-50")}
                      style={{
                        color: designTokens.colors.text.primary,
                        textAlign: "right",
                        fontSize: "10px",
                      }}
                    >
                      {row.to.chain}
                    </p>
                  </div>
                )
              default:
                return null
            }
          }}
          renderRow={(row, rowIndex, cells) => {
            const isLast = rowIndex === filteredTransactions.length - 1

            return (
              <div
                key={row.id}
                className="flex items-center cursor-pointer hover:bg-opacity-5 transition-colors w-full"
                onClick={() => onTransactionClick?.(row)}
                style={{
                  borderBottom: isLast
                    ? "none"
                    : `1px solid rgba(0, 0, 0, 0.08)`,
                  minHeight: "48px",
                }}
              >
                {cells}
              </div>
            )
          }}
        />
      </div>

      {showFilters && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowFilters(false)}
        />
      )}
    </DashboardCard>
  )
}
