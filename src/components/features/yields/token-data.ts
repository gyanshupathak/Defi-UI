import { TokenType } from "./token-selector"

export interface TokenData {
  symbol: string
  name: string
  icon: string
  centerIcon: string
  smallIcon: string
  baseApy: number
  tvl: string
  lifetimeReturns: string
  sharePrice: string
  fastRedeemed: string
}

export const tokenData: Record<TokenType, TokenData> = {
  usd: {
    symbol: "syUSD",
    name: "Stable Yield USD",
    icon: "/images/icons/USD-stable.svg",
    centerIcon: "/images/icons/USD-stable.svg",
    smallIcon: "/images/icons/USD-stable.svg",
    baseApy: 21.44,
    tvl: "$222K",
    lifetimeReturns: "$5.6K",
    sharePrice: "10.4%",
    fastRedeemed: "$22.8K",
  },
  eth: {
    symbol: "syETH",
    name: "Stable Yield ETH",
    icon: "/images/icons/ETH-stable.svg",
    centerIcon: "/images/icons/ETH-stable.svg",
    smallIcon: "/images/icons/ETH-stable.svg",
    baseApy: 18.18,
    tvl: "$185K",
    lifetimeReturns: "$4.2K",
    sharePrice: "8.7%",
    fastRedeemed: "$19.5K",
  },
  btc: {
    symbol: "syBTC",
    name: "Stable Yield BTC",
    icon: "/images/icons/BTC Stable (1).svg",
    centerIcon: "/images/icons/BTC Stable (1).svg",
    smallIcon: "/images/icons/BTC Stable (1).svg",
    baseApy: 12.06,
    tvl: "$145K",
    lifetimeReturns: "$3.1K",
    sharePrice: "6.2%",
    fastRedeemed: "$15.2K",
  },
  hlp: {
    symbol: "syHLP",
    name: "Stable Yield HLP",
    icon: "/images/icons/syHLP.svg",
    centerIcon: "/images/icons/syHLP.svg",
    smallIcon: "/images/icons/syHLP.svg",
    baseApy: 0,
    tvl: "$0",
    lifetimeReturns: "$0",
    sharePrice: "0%",
    fastRedeemed: "$0",
  },
}

