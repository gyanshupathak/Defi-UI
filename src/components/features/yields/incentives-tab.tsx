"use client"

import * as React from "react"
import { IncentiveCard } from "./incentive-card"
import { useAnalytics } from "@/lib/hooks/use-analytics"

export function IncentivesTab() {
  const { analytics } = useAnalytics()

  const incentives = [
    {
      multiplier: "1.5x",
      title: "Liquidity Land",
      description: "Earn 1.5x Lucildy Drops as bonus for Liquidity Land",
      logoPath: "/images/icons/liquidity-land.png",
      redirectUrl: "https://liquidity.land",
    },
    {
      multiplier: "1.5x",
      title: "Liquidity Land",
      description: "Earn 1.5x Lucildy Drops as bonus for Liquidity Land",
      logoPath: "/images/icons/liquidity-land.png",
      redirectUrl: "https://liquidity.land",
    },
    {
      multiplier: "1.5x",
      title: "Liquidity Land",
      description: "Earn 1.5x Lucildy Drops as bonus for Liquidity Land",
      logoPath: "/images/icons/liquidity-land.png",
      redirectUrl: "https://liquidity.land",
    },
  ]

  return (
    <div 
      className="flex items-center"
      style={{
        gap: '24px',
      }}
    >
      {incentives.map((incentive, index) => (
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
