import type { Metadata } from "next"
import "./globals.css"
import { WalletProvider } from "@/components/providers/wallet-provider"

export const metadata: Metadata = {
  title: "Lucidly Finance - Advanced Yield Platform",
  description: "Advanced Yield Platform for DeFi strategies",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <body className="h-full overflow-hidden">
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}
