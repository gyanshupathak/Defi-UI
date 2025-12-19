import type { Metadata } from "next"
import "./globals.css"
import { WalletProvider } from "@/components/providers/wallet-provider"
import { AnalyticsProvider } from "@/components/providers/analytics-provider"
import { ErrorBoundary } from "@/components/providers/error-boundary"
import { GoogleAnalytics } from "@next/third-parties/google"

export const metadata: Metadata = {
  title: "Lucidly Finance - Advanced Yield Platform",
  description: "Advanced Yield Platform for DeFi strategies",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="en" className="h-full overflow-hidden">
      <body className="h-full overflow-hidden">
        <ErrorBoundary>
          <AnalyticsProvider>
            <WalletProvider>
              {children}
            </WalletProvider>
          </AnalyticsProvider>
        </ErrorBoundary>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  )
}
