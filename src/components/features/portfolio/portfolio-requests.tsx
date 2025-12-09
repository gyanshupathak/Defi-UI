"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { WithdrawalRequestCard } from "./withdrawal-request-card"

export interface WithdrawalRequest {
  id: string
  date: string
  syAmount: string
  syToken: string
  usdcAmount: string
  tokenIcon?: string
}

export interface PortfolioRequestsProps {
  requests?: WithdrawalRequest[]
  onCancelRequest?: (requestId: string) => void
  className?: string
  showEmptyState?: boolean
  emptyStateMessage?: string
}

const defaultRequests: WithdrawalRequest[] = [
  {
    id: "1",
    date: "03 JAN 2025",
    syAmount: "482",
    syToken: "syUSD",
    usdcAmount: "483",
  },
  {
    id: "2",
    date: "03 JAN 2025",
    syAmount: "482",
    syToken: "syUSD",
    usdcAmount: "483",
  },
  {
    id: "3",
    date: "03 JAN 2025",
    syAmount: "482",
    syToken: "syUSD",
    usdcAmount: "483",
  },
]

export function PortfolioRequests({
  requests = defaultRequests,
  onCancelRequest,
  className,
  showEmptyState = true,
  emptyStateMessage = "No withdrawal requests",
}: PortfolioRequestsProps) {
  const handleCancel = (requestId: string) => {
    onCancelRequest?.(requestId)
  }

  if (requests.length === 0 && showEmptyState) {
    return (
      <div
        className={cn("flex items-center justify-center", className)}
        style={{
          minHeight: "232px",
        }}
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
    )
  }

  return (
    <div
      className={cn("flex items-center", className)}
      style={{
        gap: "31px",
      }}
    >
      {requests.map((request) => (
        <WithdrawalRequestCard
          key={request.id}
          date={request.date}
          syAmount={request.syAmount}
          syToken={request.syToken}
          usdcAmount={request.usdcAmount}
          tokenIcon={request.tokenIcon}
          onCancel={() => handleCancel(request.id)}
        />
      ))}
    </div>
  )
}

