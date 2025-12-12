"use client"

import * as React from "react"
import { ExternalLink, ArrowDown, ArrowUp, ArrowLeftRight, RefreshCw } from "lucide-react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { type TableColumn } from "@/components/ui/data-table"
import { StyledTable } from "@/components/ui/styled-table"
import { DashboardCard } from "@/components/ui/dashboard-card"
import { Button } from "@/components/ui/button"
import { UnifiedSelector, type Network, type BridgeToken } from "@/components/ui/unified-selector"
import { FilterTabSelector } from "@/components/ui/filter-tab-selector"
import { AssetTag } from "@/components/ui/asset-tag"
import { PortfolioDashboardEmptyState } from "./portfolio-dashboard-empty-state"
import Image from "next/image"
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
  txHash?: string 
}

export interface ActivityFilter {
  status?: TransactionStatus[]
  tokens?: string[]
  chains?: string[]
  fromNetwork?: Network | null
  toNetwork?: Network | null
  fromAsset?: string | null
  toAsset?: string | null
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
  emptyStateMessage = "Deposit now to start tracking your activity!",
}: PortfolioActivityProps) {
  const [showFilters, setShowFilters] = React.useState(false)
  const [filter, setFilter] = React.useState<ActivityFilter>(initialFilter || {})
  const [pendingFilter, setPendingFilter] = React.useState<ActivityFilter>(initialFilter || {})
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

    if (filter.fromNetwork) {
      result = result.filter((tx) => tx.from.chain === filter.fromNetwork)
    }

    if (filter.toNetwork) {
      result = result.filter((tx) => tx.to.chain === filter.toNetwork)
    }

    if (filter.fromAsset) {
      result = result.filter((tx) => tx.from.token === filter.fromAsset)
    }

    if (filter.toAsset) {
      result = result.filter((tx) => tx.to.token === filter.toAsset)
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

  React.useEffect(() => {
    if (showFilters) {
      setPendingFilter(filter)
    }
  }, [showFilters, filter])

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

  const uniqueChains = React.useMemo(
    () =>
      Array.from(
        new Set(
          transactions.flatMap((tx) => [tx.from.chain, tx.to.chain])
        )
      ),
    [transactions]
  )


  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: transactions.length }
    uniqueStatuses.forEach((status) => {
      counts[status] = transactions.filter((tx) => tx.status === status).length
    })
    return counts
  }, [transactions, uniqueStatuses])

  const activityOptions = [
    { id: "all", label: `All Activities (${statusCounts.all})` },
    ...uniqueStatuses.map((status) => ({
      id: status,
      label: `${statusConfig[status].label} (${statusCounts[status] ?? 0})`,
    })),
  ]

  const selectedActivityFilter =
    filter.status && filter.status.length > 0 ? filter.status[0] : "all"

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

  const isEmpty = filteredTransactions.length === 0

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
        <div className="flex items-center gap-[8px] flex-wrap" style={{ maxWidth: "480px" }}>
          <FilterTabSelector
            options={activityOptions}
            activeValue={selectedActivityFilter}
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
          />
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center rounded-[99px] border border-solid flex-shrink-0 cursor-pointer transition-all"
          style={{
            borderColor: "rgba(0, 0, 0, 0.15)",
            backgroundColor: designTokens.colors.background.main,
            paddingLeft: "12px",
            paddingRight: "12px",
            paddingTop: "4px",
            paddingBottom: "4px",
            gap: "4px",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4H14M4 8H12M6 12H10"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p
            className={typographyClasses.label1}
            style={{
              color: designTokens.colors.text.primary,
            }}
          >
            Filters
          </p>
        </button>
      </div>

      {showFilters && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowFilters(false)}
          />
        <div
            className="absolute z-40 rounded-bl-[12px] rounded-br-[12px] rounded-tr-[12px] custom-scrollbar"
          style={{
            top: "56px",
            right: "24px",
            backgroundColor: designTokens.colors.background.main,
              boxShadow: designTokens.shadows.cardDefault,
              minWidth: "381px",
            maxWidth: "calc(100% - 48px)",
              padding: "16px",
            }}
          >
            <div className="flex flex-col gap-[24px]">
              {}
              <div className="flex flex-col gap-[12px]">
                <div className="flex items-center justify-between">
                  <p 
                    className={typographyClasses.label1} 
                    style={{ 
                      color: "#9c9da2",
                      fontWeight: 600,
                    }}
                  >
                    Asset
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setPendingFilter((prev) => ({ ...prev, tokens: undefined }))
                    }}
                    className="opacity-50 hover:opacity-100 transition-opacity"
                  >
                    <RefreshCw size={12} style={{ color: designTokens.colors.text.primary }} />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-[8px]">
                  {(["syUSD", "syETH", "syBTC"] as const).map((token) => {
                    const TOKEN_ICONS: Record<string, string> = {
                      syUSD: "/images/icons/USD-stable.svg",
                      syETH: "/images/icons/ETH-stable.svg",
                      syBTC: "/images/icons/BTC Stable (1).svg",
                    }
                    const isSelected = pendingFilter.tokens?.includes(token) ?? false
                    return (
                      <AssetTag
                        key={token}
                        label={token}
                        iconSrc={TOKEN_ICONS[token]}
                        isSelected={isSelected}
                        onClick={() => {
                          setPendingFilter((prev) => {
                            const current = prev.tokens || []
                            if (current.includes(token)) {
                              const next = current.filter((t) => t !== token)
                              return { ...prev, tokens: next.length ? next : undefined }
                            } else {
                              return {
                                ...prev,
                                tokens: [...current, token],
                              }
                            }
                          })
                        }}
                        onRemove={() => {
                          setPendingFilter((prev) => {
                            const next = (prev.tokens || []).filter((t) => t !== token)
                            return { ...prev, tokens: next.length ? next : undefined }
                          })
                        }}
                      />
                    )
                  })}
                </div>
              </div>

              {}
              <div className="h-px w-full shrink-0" style={{ backgroundColor: "rgba(0,0,0,0.05)" }} />

              {}
              <div className="flex gap-[16px]">
                {[
                  { label: "From Asset", key: "fromAsset" as const },
                  { label: "To Asset", key: "toAsset" as const },
                ].map(({ label, key }) => (
                  <div key={key} className="flex flex-[1_0_0] flex-col gap-[8px] relative">
                    <div className="flex items-center justify-between">
                      <p 
                        className={typographyClasses.label1} 
                        style={{ 
                          color: "#9c9da2",
                          fontWeight: 600,
                        }}
                      >
                        {label}
                      </p>
                      <button
                        type="button"
                        onClick={() => setPendingFilter((prev) => ({ ...prev, [key]: null }))}
                        className="opacity-50 hover:opacity-100 transition-opacity"
                      >
                        <RefreshCw size={12} style={{ color: designTokens.colors.text.primary }} />
                      </button>
                    </div>
                    <UnifiedSelector
                      type="token"
                      selectedValue={(pendingFilter[key] as BridgeToken | null) ?? null}
                      onValueChange={(value) =>
                        setPendingFilter((prev) => ({
                          ...prev,
                          [key]: value as BridgeToken | null,
                        }))
                      }
                      className="w-full"
                      placeholder="Select"
                    />
                  </div>
                ))}
              </div>

              {}
              <div className="h-px w-full shrink-0" style={{ backgroundColor: "rgba(0,0,0,0.05)" }} />

              {}
              <div className="flex gap-[16px]">
                {[
                  { label: "From Network", key: "fromNetwork" as const },
                  { label: "To Network", key: "toNetwork" as const },
                ].map(({ label, key }) => (
                  <div key={key} className="flex flex-[1_0_0] flex-col gap-[8px] relative">
                    <div className="flex items-center justify-between">
                      <p 
                        className={typographyClasses.label1} 
                        style={{ 
                          color: "#9c9da2",
                          fontWeight: 600,
                        }}
                      >
                        {label}
                      </p>
                      <button
                        type="button"
                        onClick={() => setPendingFilter((prev) => ({ ...prev, [key]: null }))}
                        className="opacity-50 hover:opacity-100 transition-opacity"
                      >
                        <RefreshCw size={12} style={{ color: designTokens.colors.text.primary }} />
                      </button>
                    </div>
                    <UnifiedSelector
                      type="network"
                      selectedValue={(pendingFilter[key] as Network | null) ?? null}
                      onValueChange={(value) =>
                        setPendingFilter((prev) => ({
                          ...prev,
                          [key]: value as Network | null,
                        }))
                      }
                      className="w-full"
                      placeholder="Select"
                    />
                  </div>
                ))}
              </div>

              {}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPendingFilter({})}
                  className="rounded-[99px] px-[24px] py-[8px] transition-all"
                  style={{
                    backgroundColor: designTokens.colors.background.main,
                    boxShadow: designTokens.shadows.tokenBadge,
                  }}
                >
                  <p
                    className="text-[12px] leading-[16px] font-medium font-sans text-center"
                    style={{ color: designTokens.colors.primary }}
                  >
                    Reset All
                  </p>
                </button>
                <div className="flex items-center gap-[8px]">
                  <Button
                    variant="cancel"
                    size="xs"
                    onClick={() => setShowFilters(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="xs"
                    onClick={() => {
                      handleFilterChange(pendingFilter)
                      setShowFilters(false)
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
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
        {isEmpty ? (
          <PortfolioDashboardEmptyState
            icon={
              <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="20"
                  y="28"
                  width="60"
                  height="56"
                  rx="4"
                  fill="rgba(127, 86, 217, 0.1)"
                  stroke="#7F56D9"
                  strokeWidth="2"
                />
                <path
                  d="M20 32L40 20L60 20L80 32"
                  stroke="#7F56D9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <line
                  x1="30"
                  y1="48"
                  x2="70"
                  y2="48"
                  stroke="#7F56D9"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="30"
                  y1="60"
                  x2="70"
                  y2="60"
                  stroke="#7F56D9"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="28"
                  cy="72"
                  r="10"
                  fill="#7F56D9"
                  stroke="none"
                />
                <path
                  d="M28 66V70M28 74V74.01"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="68"
                  y1="20"
                  x2="72"
                  y2="20"
                  stroke="#7F56D9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="2 2"
                />
                <line
                  x1="68"
                  y1="16"
                  x2="72"
                  y2="16"
                  stroke="#7F56D9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="2 2"
                />
              </svg>
            }
            title="No Activity Yet"
            description={emptyStateMessage || "Deposit now to start tracking your activity!"}
            buttonText="Make a Deposit"
            buttonVariant="blue"
          />
        ) : (
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
          renderCell={(column, row, rowIndex) => {
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
                if (!status) return null
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
        )}
      </div>
    </DashboardCard>
  )
}
