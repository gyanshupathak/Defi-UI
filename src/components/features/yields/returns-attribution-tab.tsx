"use client"

import * as React from "react"
import { designTokens, typographyClasses } from "@/lib/design-system"
import { ReturnsAttributionChart } from "./returns-attribution-chart"
import { StrategyFilterCard } from "./strategy-filter-card"
import { ChartContainerWrapper } from "./chart-container-wrapper"
import { YieldsDateLabels } from "./yields-date-labels"
import { YieldsNoteCard } from "./yields-note-card"

interface ReturnsAttributionTabProps {
  className?: string
}

export function ReturnsAttributionTab({ className }: ReturnsAttributionTabProps) {
  return (
    <>

      <p 
        className={`absolute ${typographyClasses.label1} opacity-50`}
        style={{
          left: '24px',
          top: '24px',
          color: designTokens.colors.text.primary,
        }}
      >
        16 November 2025
      </p>

      <div 
        className="absolute"
        style={{
          left: '24px',
          top: '52px',
        }}
      >
        <StrategyFilterCard
          label="RLP/USDC Morpho (4x)"
          value="+8.77%"
          borderColor="#8198ee"
          hasInnerShadow={true}
        />
      </div>

      <div 
        className="absolute"
        style={{
          left: '218px',
          top: '52px',
        }}
      >
        <StrategyFilterCard
          label="siUSD/USDC Morpho (10x)"
          value="+1.03%"
          borderColor="#f9b666"
          hasInnerShadow={true}
        />
      </div>

      <ChartContainerWrapper>
        <ReturnsAttributionChart />
      </ChartContainerWrapper>

      <YieldsDateLabels />

      <YieldsNoteCard 
        content="By initiating a withdrawal, your vault shares (syUSD) will be converted into the underlying asset based on the latest market rates, which may fluctuate slightly; once the request is submitted."
      />
    </>
  )
}

