import { NeumorphicNav } from "@/components/layout/neumorphic-nav"
import { TVLChart } from "@/components/charts/tvl-chart"
import { YieldStrategyCard } from "@/components/features/yields/yield-strategy-card"
import { PageContainer } from "@/components/ui/page-container"
import { designTokens, typographyClasses } from "@/lib/design-system"


export default function Home() {
  return (
    <div 
      className="relative w-full h-screen overflow-hidden flex flex-col"
      style={{ backgroundColor: designTokens.colors.background.main }}
    >
      {/* Navigation */}
      <NeumorphicNav activeMenuItem="none" />

      {/* Main Content - Consistent spacing with PageContainer */}
      <PageContainer>
        <div 
          className="flex-1 flex"
          style={{ 
            gap: designTokens.spacing.card.gap 
          }}
        >
        {/* Left Column - Chart */}
        <div className="flex-shrink-0 flex items-start">
          <TVLChart 
            totalValue="$585,937"
            date="12 November 2025"
          />
        </div>

        {/* Right Column - Yields Section */}
        <div 
          className="flex-1 flex flex-col"
          style={{ 
            maxWidth: designTokens.spacing.layout.yieldsMaxWidth,
          }}
        >
          {/* Section Header */}
          <div style={{ marginBottom: designTokens.spacing.text.sectionHeaderMargin }}>
            <h1 
              className={typographyClasses.heading1}
              style={{ 
                color: designTokens.colors.text.primary,
                marginBottom: designTokens.spacing.text.labelHeadingGap 
              }}
            >
              Explore Yields
            </h1>
            <p 
              className={`${typographyClasses.subtext} whitespace-pre-wrap opacity-60`}
              style={{ color: designTokens.colors.text.primary }}
            >
              Maximize your investment returns and diversify your portfolio.{"\n"}
              Unlock higher earnings with smart yield strategies.
            </p>
          </div>

          {/* Strategy Cards Grid - Fits remaining space */}
          <div 
            className="flex-1 flex flex-col justify-start"
            style={{ gap: designTokens.spacing.card.gapInternal }}
          >
            {/* Row 1 */}
            <div 
              className="flex"
              style={{ gap: designTokens.spacing.card.gap }}
            >
              <YieldStrategyCard
                name="Stable Yield USD"
                symbol="syUSD"
                apy={18.18}
                variant="usd"
              />
              <YieldStrategyCard
                name="Stable Yield ETH"
                symbol="syETH"
                apy={10.37}
                variant="eth"
              />
            </div>

            {/* Row 2 */}
            <div 
              className="flex"
              style={{ gap: designTokens.spacing.card.gap }}
            >
              <YieldStrategyCard
                name="Stable Yield BTC"
                symbol="syBTC"
                apy={12.06}
                variant="btc"
              />
            </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
