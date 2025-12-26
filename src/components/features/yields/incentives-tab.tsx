"use client"

import * as React from "react"
import { IncentiveCard } from "./incentive-card"
import { useAnalytics } from "@/lib/hooks/use-analytics"
import { type VaultIncentives } from "@/lib/config/vault-config"

interface IncentivesTabProps {
  incentives?: VaultIncentives
}

export function IncentivesTab({ incentives }: IncentivesTabProps = {} as IncentivesTabProps) {
  const { analytics } = useAnalytics()

  // Use data from props if available, otherwise use empty array
  // Check if incentives are enabled (true) and have valid points
  const incentivePoints = React.useMemo(() => {
    if (incentives?.enabled === true && incentives?.points && Array.isArray(incentives.points) && incentives.points.length > 0) {
      // Filter out any invalid points and map to display format
      return incentives.points
        .filter(point => point && point.name && point.description) // Filter out invalid points
        .map(point => ({
          multiplier: `${point.multiplier}x`,
          title: point.name,
          description: point.description,
          logoPath: point.image || "/images/icons/liquidity-land.png",
          redirectUrl: point.link,
        }))
    }
    return []
  }, [incentives])

  if (!incentivePoints || incentivePoints.length === 0) {
    return (
      <div 
        className="flex items-center justify-center"
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <p 
          className="text-sm opacity-50"
          style={{
            color: 'var(--text-primary)',
          }}
        >
          No data to display
        </p>
      </div>
    )
  }

  return (
    <div 
      className="flex items-center"
      style={{
        gap: '24px',
      }}
    >
      {incentivePoints.map((incentive, index) => (
        <IncentiveCard
          key={index}
          multiplier={incentive.multiplier}
          title={incentive.title}
          description={incentive.description}
          logoPath={incentive.logoPath}
          redirectUrl={incentive.redirectUrl}
          onCardClick={() => {
            analytics.incentiveCardClicked(incentive.title, incentive.multiplier)
          }}
        />
      ))}
    </div>
  )
}
