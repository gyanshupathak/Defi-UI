import { NeumorphicNav } from "@/components/layout/neumorphic-nav"
import { BaseCircularComponent } from "@/components/features/yields/base-circular-component"
import { YieldsDashboard } from "@/components/features/yields/yields-dashboard"
import { PageContainer } from "@/components/ui/page-container"
import { designTokens } from "@/lib/design-system"

export default function YieldsPage() {
  return (
    <div 
      className="relative w-full h-screen flex flex-col"
      style={{ 
        backgroundColor: designTokens.colors.background.main,
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      <div style={{ overflow: 'visible', position: 'relative', zIndex: 10 }}>
        <NeumorphicNav activeMenuItem="yields" />
      </div>

      <PageContainer>
        <div 
          className="flex-1 flex"
          style={{ 
            gap: designTokens.spacing.card.gap 
          }}
        >
          <div className="flex-shrink-0 flex flex-col items-start gap-6">
            <div className="flex items-start gap-4">
              <div
                style={{
                  width: 4,
                  height: 72,
                  backgroundColor: "#f4f0ff",
                  borderRadius: 9,
                  boxShadow: "2px 2px 2px rgba(127,86,217,0.15), -2px -2px 2px #fff",
                }}
              />
              <div className="flex flex-col gap-1">
                <p
                  className="font-medium"
                  style={{
                    fontSize: 20,
                    color: designTokens.colors.text.primary,
                    lineHeight: "28px",
                  }}
                >
                  Transparency Dashboard
                </p>
                <p
                  className="opacity-60"
                  style={{
                    fontSize: 14,
                    color: designTokens.colors.text.primary,
                    lineHeight: "20px",
                    maxWidth: 560,
                  }}
                >
                  Maximize your investment returns and diversify your portfolio. Unlock higher earnings with smart yield strategies.
                </p>
              </div>
            </div>

            {/* Base Circular Component - centered */}
            <div 
              className="flex items-center justify-center"
              style={{
                width: "636px",
              }}
            >
              <BaseCircularComponent />
            </div>
          </div>

          <div 
            className="flex-1 flex flex-col"
            style={{ 
              maxWidth: designTokens.spacing.layout.yieldsMaxWidth,
            }}
          >
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
