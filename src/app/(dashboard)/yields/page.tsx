import { NeumorphicNav } from "@/components/layout/neumorphic-nav"
import { CircularYieldCard } from "@/components/features/yields/circular-yield-card"
import { YieldsDashboard } from "@/components/features/yields/yields-dashboard"
import { PageContainer } from "@/components/ui/page-container"
import { designTokens } from "@/lib/design-system"

export default function YieldsPage() {
  return (
    <div 
      className="relative w-full h-screen overflow-hidden flex flex-col"
      style={{ backgroundColor: designTokens.colors.background.main }}
    >
      {/* Navigation */}
      <NeumorphicNav activeMenuItem="yields" />

      {/* Main Content */}
      <PageContainer>
        <div 
          className="flex-1 flex"
          style={{ 
            gap: designTokens.spacing.card.gap 
          }}
        >
          {/* Circular Yield Card */}
          <div className="flex-shrink-0 flex items-start">
            <CircularYieldCard
              name="Stable Yield USD"
              symbol="syUSD"
              baseApy={21.44}
              tvl="$222K"
              fastRedeem="$22.8K"
              sharePrice="1.04"
              lifetimeReturns="$5.6K"
              variant="usd"
            />
      </div>

          <div className="flex-1 flex items-start justify-end">
            <YieldsDashboard
              currentValue="$185,053"
              currentDate="Current Date"
            />
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

