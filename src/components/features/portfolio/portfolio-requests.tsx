"use client"

import * as React from "react"
import { useAccount } from "wagmi"
import { cn } from "@/lib/utils"
import { designTokens, shadows, typographyClasses } from "@/lib/design-system"
import { WithdrawalRequestCard } from "./withdrawal-request-card"
import { Button } from "@/components/ui/button"
import { useAnalytics } from "@/lib/hooks/use-analytics"
import { useWithdrawalRequests } from "@/lib/hooks/use-portfolio"

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
  vaultAddress?: string // Vault contract address
  userAddress?: string // Optional - will use wagmi if not provided
  useApi?: boolean // Enable API integration (default: true)
  onRequestsCountChange?: (count: number) => void // Callback to update count in parent
}

export function PortfolioRequests({
  requests: propRequests,
  onCancelRequest,
  className,
  showEmptyState = true,
  emptyStateMessage = "No Pending Withdrawals",
  emptyStateDescription = "Ready to grow your funds? Start a secure on-chain deposit",
  onDepositClick,
  vaultAddress,
  userAddress: propUserAddress,
  useApi = true,
  onRequestsCountChange,
}: PortfolioRequestsProps) {
  const { analytics } = useAnalytics()
  const { address: wagmiAddress, isConnected } = useAccount()
  
  // Use provided address or fallback to wagmi address
  const userAddress = propUserAddress || wagmiAddress
  
  // Default vault address for syUSD (can be made configurable)
  const defaultVaultAddress = '0x279CAD277447965AF3d24a78197aad1B02a2c589' // syUSD vault
  const effectiveVaultAddress = vaultAddress || defaultVaultAddress
  
  // Fetch withdrawal requests from API
  const {
    data: apiRequests,
    isLoading,
    isError,
    error,
    refetch,
    rawData,
  } = useWithdrawalRequests(
    effectiveVaultAddress,
    userAddress,
    'PENDING', // Prefer pending requests, but will fallback to other statuses if empty
    {
      enabled: useApi && !!userAddress && !!effectiveVaultAddress,
      staleTime: 30_000,
    }
  )
  
  // Debug logging
  React.useEffect(() => {
    if (useApi) {
      console.log('[PortfolioRequests] API enabled:', useApi)
      console.log('[PortfolioRequests] User address:', userAddress)
      console.log('[PortfolioRequests] Vault address:', effectiveVaultAddress)
      console.log('[PortfolioRequests] API requests:', apiRequests)
      console.log('[PortfolioRequests] Raw data:', rawData)
      console.log('[PortfolioRequests] Loading:', isLoading)
      console.log('[PortfolioRequests] Error:', isError, error)
    }
  }, [useApi, userAddress, effectiveVaultAddress, apiRequests, rawData, isLoading, isError, error])
  
  // Use API data if available, otherwise use prop requests
  // Note: apiRequests is already transformed by the hook to match WithdrawalRequest interface
  const requests = React.useMemo(() => {
    if (useApi) {
      // Always use API data when useApi is true, even if empty (to show proper empty state)
      return apiRequests || []
    }
    return propRequests || []
  }, [useApi, apiRequests, propRequests])
  
  // Notify parent of request count change
  React.useEffect(() => {
    if (onRequestsCountChange) {
      onRequestsCountChange(requests.length)
    }
  }, [requests.length, onRequestsCountChange])
  
  // Show loading state
  if (useApi && isLoading && !propRequests) {
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
        <p className={typographyClasses.label1} style={{ color: designTokens.colors.text.secondary }}>
          Loading withdrawal requests...
        </p>
      </div>
    )
  }
  
  // Show error state
  if (useApi && isError && !propRequests) {
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
        <p className={typographyClasses.label1} style={{ color: designTokens.colors.status.error }}>
          Failed to load withdrawal requests
        </p>
        <Button
          variant="default"
          size="xs"
          onClick={() => refetch()}
        >
          Retry
        </Button>
      </div>
    )
  }
  
  // Show connect wallet message if wallet not connected and using API
  if (useApi && !userAddress && !propRequests) {
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
        <p className={typographyClasses.label1} style={{ color: designTokens.colors.text.secondary }}>
          Please connect your wallet to view withdrawal requests
        </p>
      </div>
    )
  }
  
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
      className={cn("flex flex-wrap items-start", className)}
      style={{
        gap: "31px",
        width: "100%",
      }}
    >
      {requests.map((request) => (
        <div
          key={request.id}
          style={{
            flex: "0 0 calc((100% - 62px) / 3)", // 3 per row: (100% - 2 gaps of 31px) / 3
            minWidth: "0", // Allow flex to work properly
            maxWidth: "calc((100% - 62px) / 3)",
          }}
        >
          <WithdrawalRequestCard
            date={request.date}
            syAmount={request.syAmount}
            syToken={request.syToken}
            usdcAmount={request.usdcAmount}
            tokenIcon={request.tokenIcon}
            onCancel={() => handleCancel(request.id, request.syToken, request.syAmount)}
          />
        </div>
      ))}
    </div>
  )
}
