"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import Image from "next/image"
import { AllocationColorBar } from "./allocation-color-bar"
import { DataTable, type TableColumn } from "@/components/ui/data-table"
import { StyledTable } from "@/components/ui/styled-table"

export interface AllocationRow {
  id: string
  strategy: string
  percentage: string
  colorBar: string
  collateralIcons: string[]
  collateralAmount: string
  debtAmount: string
  healthRatio: string
}

export interface AllocationsTableProps {
  allocations?: AllocationRow[]
}

const defaultAllocations: AllocationRow[] = [
  {
    id: "1",
    strategy: "Curve.fi...WETH/ETH",
    percentage: "20.00%",
    colorBar: "#2b66ff",
    collateralIcons: ["/images/icons/base.png", "/images/icons/base.png"],
    collateralAmount: "$1,403.72",
    debtAmount: "$1,403.72",
    healthRatio: "Idle",
  },
  {
    id: "2",
    strategy: "PufEth...wstETH/ETH",
    percentage: "25.00%",
    colorBar: "#3dbc97",
    collateralIcons: ["/images/icons/base.png"],
    collateralAmount: "$1,016.96",
    debtAmount: "$1,016.96",
    healthRatio: "Idle",
  },
  {
    id: "3",
    strategy: "0xD9A...6a72",
    percentage: "05.00%",
    colorBar: "#4a78ab",
    collateralIcons: ["/images/icons/base.png", "/images/icons/base.png"],
    collateralAmount: "$450.00",
    debtAmount: "$450.00",
    healthRatio: "Idle",
  },
  {
    id: "4",
    strategy: "Morpho.org...WETH/ETH",
    percentage: "35.00%",
    colorBar: "#ce6b8a",
    collateralIcons: ["/images/icons/base.png"],
    collateralAmount: "$1,403.72",
    debtAmount: "$1,403.72",
    healthRatio: "Idle",
  },
  {
    id: "5",
    strategy: "Morpho.org...WETH/ETH",
    percentage: "35.00%",
    colorBar: "#f467ac",
    collateralIcons: ["/images/icons/base.png"],
    collateralAmount: "$1,403.72",
    debtAmount: "$1,403.72",
    healthRatio: "Idle",
  },
  {
    id: "6",
    strategy: "Curve.fi...WETH/ETH",
    percentage: "15.00%",
    colorBar: "#f47c44",
    collateralIcons: ["/images/icons/base.png"],
    collateralAmount: "$320.00",
    debtAmount: "$320.00",
    healthRatio: "Idle",
  },
]

export function AllocationsTable({
  allocations = defaultAllocations,
}: AllocationsTableProps) {
  const columns: TableColumn<AllocationRow>[] = [
    {
      id: "strategy",
      label: "Strategy",
      width: "180px",
      align: "left",
    },
    {
      id: "collateral",
      label: "Collateral",
      width: "90px",
      align: "right",
      paddingRight: "8px",
    },
    {
      id: "collateralAmount",
      label: "Collateral Amount",
      width: "flex-1",
      align: "right",
    },
    {
      id: "debtAmount",
      label: "Debt Amount",
      width: "flex-1",
      align: "right",
    },
    {
      id: "healthRatio",
      label: "Health Ratio",
      width: "100px",
      align: "right",
    },
  ]

  const renderCellWithPadding = (column: TableColumn<AllocationRow>, row: AllocationRow, rowIndex: number) => {
    const cellContent = (() => {
      switch (column.id) {
        case "strategy":
          return (
            <div className="flex items-center gap-[8px]" style={{ minHeight: "40px", width: "100%" }}>
              <AllocationColorBar color={row.colorBar} />
              <div className="flex flex-col gap-[2px] items-start justify-center">
                <p
                  className={typographyClasses.label1}
                  style={{ color: designTokens.colors.text.primary }}
                >
                  {row.strategy}
                </p>
                <p
                  className={`${typographyClasses.label2} opacity-50`}
                  style={{
                    color: designTokens.colors.text.primary,
                    fontSize: "10px",
                  }}
                >
                  {row.percentage}
                </p>
              </div>
            </div>
          )
        case "collateral":
          return (
            <div className="flex items-center justify-end h-full w-full">
              <div className="flex items-center" style={{ paddingRight: "4px" }}>
                {row.collateralIcons.map((icon, iconIndex) => (
                  <div
                    key={iconIndex}
                    className="relative"
                    style={{
                      width: "16px",
                      height: "16px",
                      marginRight:
                        iconIndex < row.collateralIcons.length - 1 ? "-4px" : "0",
                      zIndex: row.collateralIcons.length - iconIndex,
                    }}
                  >
                    <Image
                      src={icon}
                      alt="Collateral"
                      width={16}
                      height={16}
                      className="object-contain w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        case "collateralAmount":
          return (
            <p
              className={typographyClasses.label1}
              style={{
                color: designTokens.colors.text.primary,
                textAlign: "right",
                width: "100%",
              }}
            >
              {row.collateralAmount}
            </p>
          )
        case "debtAmount":
          return (
            <p
              className={typographyClasses.label1}
              style={{
                color: designTokens.colors.text.primary,
                textAlign: "right",
                width: "100%",
              }}
            >
              {row.debtAmount}
            </p>
          )
        case "healthRatio":
          return (
            <p
              className={typographyClasses.label1}
              style={{
                color: designTokens.colors.text.primary,
                textAlign: "right",
                width: "100%",
              }}
            >
              {row.healthRatio}
            </p>
          )
        default:
          return null
      }
    })()

    return cellContent
  }

  return (
    <div
      className="absolute left-1/2 top-[68px] -translate-x-1/2"
      style={{ width: "620px" }}
    >
      <StyledTable<AllocationRow>
        columns={columns}
        data={allocations}
        getRowKey={(row) => row.id}
        renderCell={renderCellWithPadding}
        width="620px"
        minRowHeight="40px"
      />
    </div>
  )
}
