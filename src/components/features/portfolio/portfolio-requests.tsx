"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { designTokens, shadows, typographyClasses } from "@/lib/design-system"
import { WithdrawalRequestCard } from "./withdrawal-request-card"
import { Button } from "@/components/ui/button"
import { useAnalytics } from "@/lib/hooks/use-analytics"

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
  emptyStateDescription?: string
  onDepositClick?: () => void
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
  emptyStateMessage = "No Pending Withdrawals",
  emptyStateDescription = "Ready to grow your funds? Start a secure on-chain deposit",
  onDepositClick,
}: PortfolioRequestsProps) {
  const { analytics } = useAnalytics()
  
  const handleCancel = (requestId: string, syToken: string, amount: string) => {
    analytics.withdrawalRequestCancelled(requestId, syToken, amount)
    onCancelRequest?.(requestId)
  }

  if (requests.length === 0 && showEmptyState) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center text-center",
          className
        )}
        style={{
          minHeight: "360px",
          gap: "16px",
        }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: "96px",
            height: "96px",
            backgroundColor: "rgba(127, 86, 217, 0.12)",
            boxShadow: shadows.buttonSmall,
          }}
        >
          <div
            className="flex flex-col items-center justify-center rounded-[12px]"
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: designTokens.colors.background.white,
              boxShadow: shadows.cardDefault,
              gap: "6px",
            }}
          >
            <div
              className="flex flex-col items-center justify-center"
              style={{ gap: "4px" }}
            >
              <div
                className="rounded-[8px]"
                style={{
                  width: "24px",
                  height: "14px",
                  border: `2px solid ${designTokens.colors.primary}`,
                  borderBottomWidth: "4px",
                }}
              />
              <div
                className="grid grid-cols-1 gap-[4px]"
                style={{ width: "26px" }}
              >
                <div
                  style={{
                    height: "3px",
                    backgroundColor: designTokens.colors.primary,
                    borderRadius: "6px",
                  }}
                />
                <div
                  style={{
                    height: "3px",
                    backgroundColor: designTokens.colors.primary,
                    borderRadius: "6px",
                  }}
                />
                <div
                  style={{
                    height: "3px",
                    backgroundColor: designTokens.colors.primary,
                    borderRadius: "6px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col items-center"
          style={{ gap: "8px" }}
        >
          <p
            className={typographyClasses.heading2}
            style={{ color: designTokens.colors.text.primary }}
          >
            {emptyStateMessage}
          </p>
          <p
            className={`${typographyClasses.label1} opacity-60`}
            style={{
              color: designTokens.colors.text.primary,
              maxWidth: "280px",
            }}
          >
            {emptyStateDescription}
          </p>
        </div>

        <div style={{ marginTop: "8px" }}>
          <Button
            variant="blue"
            showDepositIcon
            style={{ width: "260px" }}
            onClick={() => {
              analytics.emptyStateButtonClicked("Make a Deposit", "portfolio_requests_empty")
              onDepositClick?.()
            }}
          >
            Make a Deposit
          </Button>
        </div>
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
          onCancel={() => handleCancel(request.id, request.syToken, request.syAmount)}
        />
      ))}
    </div>
  )
}
