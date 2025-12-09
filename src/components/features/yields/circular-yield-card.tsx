import * as React from "react"
import { designTokens } from "@/lib/design-system"
import { CurvedMetricSection } from "./curved-metric-section"

interface CircularYieldCardProps {
  name: string
  symbol: string
  baseApy: number
  tvl: string
  fastRedeem: string
  sharePrice: string
  lifetimeReturns: string
  variant: "usd" | "eth" | "btc"
}

const strategyConfig = {
  usd: {
    color: "#5496DE",
    name: "Stable Yield USD",
  },
  eth: {
    color: "#627EEA",
    name: "Stable Yield ETH",
  },
  btc: {
    color: "#F7931A",
    name: "Stable Yield BTC",
  },
}

export function CircularYieldCard({
  name,
  symbol,
  baseApy,
  tvl,
  fastRedeem,
  sharePrice,
  lifetimeReturns,
  variant,
}: CircularYieldCardProps) {
  const config = strategyConfig[variant]

  // Image paths from icons folder
  const usdIcon = "/images/icons/USD-stable.svg"
  const ethIcon = "/images/icons/ETH-stable.svg"
  const btcIcon = "/images/icons/BTC Stable (1).svg"

  // Scale factor: 0.85 (85% of original size)
  const scale = 0.85
  
  return (
    <div className="relative flex flex-col items-center" style={{ width: `${676 * scale}px`, height: `${710 * scale}px` }}>
      {/* Token Icons Above Card with Connecting Line */}
      <div className="relative w-full mb-8" style={{ height: `${68 * scale}px` }}>
        {/* Connecting Solid Arc - Elliptical curve through icon centers */}
        <svg 
          className="absolute top-0 left-0 pointer-events-none"
          style={{ overflow: 'hidden', width: `${676 * scale}px`, height: `${68 * scale}px` }}
        >
          <defs>
            <clipPath id="arcClip">
              <rect x="0" y="0" width={676 * scale} height={68 * scale} />
            </clipPath>
          </defs>
          {/* Large ellipse - showing only top portion that passes through icon centers */}
          <ellipse
            cx={338 * scale}
            cy={372 * scale}
            rx={338 * scale}
            ry={338 * scale}
            fill="none"
            stroke="#D1D5DB"
            strokeWidth="1"
            opacity="0.5"
            clipPath="url(#arcClip)"
          />
        </svg>

        {/* ETH Icon - scaled */}
        <div className="absolute" style={{ left: `${168 * scale}px`, top: `${39 * scale}px`, width: `${56 * scale}px`, height: `${56 * scale}px` }}>
          <div 
            className="absolute inset-0 rounded-full"
            style={{ 
              backgroundColor: '#f8f5ff',
              boxShadow: 'inset 4px 4px 4px 0px rgba(127,86,217,0.08), inset -4px -4px 4px 0px #ffffff'
            }}
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex-none" style={{ transform: 'rotate(337.504deg)' }}>
              <img
                src={ethIcon}
                alt="ETH"
                className="object-contain"
                style={{ width: `${31.747 * scale}px`, height: `${31.747 * scale}px` }}
              />
            </div>
          </div>
        </div>

        {/* USD Icon - scaled */}
        <div className="absolute" style={{ left: `${308 * scale}px`, top: '0', width: `${68 * scale}px`, height: `${68 * scale}px` }}>
          <div 
            className="absolute inset-0 rounded-full"
            style={{ 
              backgroundColor: designTokens.colors.background.main,
              boxShadow: '4px 4px 6px 0px rgba(127,86,217,0.12), -4px -4px 5px 0px #ffffff'
            }}
          />
          <img
            src={usdIcon}
            alt="USD"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
            style={{ width: `${41.775 * scale}px`, height: `${41.775 * scale}px` }}
          />
        </div>

        {/* BTC Icon - scaled */}
        <div className="absolute" style={{ left: `${459 * scale}px`, top: `${41 * scale}px`, width: `${56 * scale}px`, height: `${56 * scale}px` }}>
          <div 
            className="absolute inset-0 rounded-full"
            style={{ 
              backgroundColor: '#f8f5ff',
              boxShadow: 'inset 4px 4px 4px 0px rgba(127,86,217,0.08), inset -4px -4px 4px 0px #ffffff'
            }}
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex-none" style={{ transform: 'rotate(22.362deg)' }}>
              <img
                src={btcIcon}
                alt="BTC"
                className="object-contain"
                style={{ width: `${31.687 * scale}px`, height: `${31.687 * scale}px` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Circular Card Container - scaled */}
      <div className="relative overflow-visible" style={{ width: `${596 * scale}px`, height: `${596 * scale}px` }}>
        {/* Outer Circle with Neumorphic Shadow */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{ 
            backgroundColor: designTokens.colors.background.main,
            boxShadow: '4.496px 4.496px 13.488px 0px rgba(127,86,217,0.12), -4.496px -4.496px 11.24px 0px #ffffff'
          }}
        />
        
        {/* Inner Circle with Border - scaled */}
        <div 
          className="absolute rounded-full border border-white"
          style={{ 
            left: `${14 * scale}px`,
            top: `${14 * scale}px`,
            width: `${568 * scale}px`,
            height: `${568 * scale}px`,
            backgroundColor: designTokens.colors.background.main,
          }}
        />

        {/* Only LIFETIME RETURNS Section */}
        {(() => {
          const circleCenterX = 298 * scale // Center of scaled circle
          const circleCenterY = 298 * scale
          const outerRadius = 271 * scale // Outer radius for labels
          const innerRadius = 245 * scale // Inner radius for values

          return (
            <CurvedMetricSection
              label="LIFETIME RETURNS"
              value={lifetimeReturns}
              labelStartAngle={281.959}
              valueStartAngle={290.532}
              labelRadius={outerRadius}
              valueRadius={innerRadius}
              centerX={circleCenterX}
              centerY={circleCenterY}
            />
          )
        })()}
      </div>
    </div>
  )
}
