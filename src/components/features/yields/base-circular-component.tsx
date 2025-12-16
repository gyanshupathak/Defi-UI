"use client"

import * as React from "react"
import YieldCircle from "./imports/Frame";
import { Ribbon } from "./imports/Frame";
import { TokenSelector, TokenType } from "./token-selector";
import { StrategyType } from "@/app/(dashboard)/yields/page";

export function BaseCircularComponent() {
  const [selectedToken, setSelectedToken] = React.useState<TokenType>("usd");
  const [isAnimating, setIsAnimating] = React.useState(false);
  const hasAnimatedRef = React.useRef(false);

  const handleTokenChange = React.useCallback((token: TokenType) => {
    console.log('BaseCircularComponent: Token changing from', selectedToken, 'to', token);
    setSelectedToken(token);
  }, [selectedToken]);

  React.useEffect(() => {
    console.log('BaseCircularComponent: Selected token is now:', selectedToken);
  }, [selectedToken]);

  // Trigger animation only once on initial mount
  React.useEffect(() => {
    if (!hasAnimatedRef.current) {
      setIsAnimating(true);
      hasAnimatedRef.current = true;
    }
  }, []);

  // Map token to strategy: syUSD → Flagship, syETH → Delta Neutral, syBTC → Leverage Looping
  const getStrategyFromToken = (token: TokenType): StrategyType => {
    switch (token) {
      case "usd":
        return "flagship";
      case "eth":
        return "delta-neutral";
      case "btc":
        return "leverage-looping";
      default:
        return "flagship";
    }
  };

  const strategyType = getStrategyFromToken(selectedToken);

  // Get gradient colors based on strategy
  const getGradientColors = (strategy: StrategyType) => {
    switch (strategy) {
      case "flagship":
        return { from: "#9071fb", to: "#5433c7" };
      case "delta-neutral":
        return { from: "#E26C36", to: "#93390F" };
      case "leverage-looping":
        return { from: "#E91E63", to: "#AA0808" };
      default:
        return { from: "#9071fb", to: "#5433c7" };
    }
  };

  const gradientColors = getGradientColors(strategyType);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className={`relative ${isAnimating ? 'opacity-0 animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '4500ms', animationFillMode: 'forwards', zIndex: 10 }}>
        <TokenSelector selectedToken={selectedToken} onTokenChange={handleTokenChange} />
      </div>
      <div className="relative flex items-end justify-center" style={{ marginTop: "250px" }}>
        <div 
          className={`absolute pointer-events-none ${isAnimating ? 'opacity-0 animate-fade-in' : 'opacity-0'}`}
          style={{ 
            left: '50%',
            top: '65px',
            transform: 'translate(-50%, -50%)',
            zIndex: 9,
            width: '650px',
            height: '650px',
            animationDelay: '3500ms',
            animationFillMode: 'forwards',
          }}
        >
          <svg 
            className="w-full h-full"
            viewBox="0 0 650 650"
          >
            <defs>
              <linearGradient id={`yieldCircleGradient-${strategyType}`} gradientUnits="userSpaceOnUse" x1="325" y1="5" x2="325" y2="325">
                <stop offset="0%" stopColor={gradientColors.from} stopOpacity="1" />
                <stop offset="15%" stopColor={gradientColors.from} stopOpacity="0.8" />
                <stop offset="20%" stopColor={gradientColors.from} stopOpacity="0.4" />
                <stop offset="50%" stopColor={gradientColors.to} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 5 325 A 320 320 0 0 1 645 325"
              fill="none"
              stroke={`url(#yieldCircleGradient-${strategyType})`}
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="-translate-y-[420px] -translate-x-[55px]">
          <YieldCircle tokenType={selectedToken} isAnimating={isAnimating} />
        </div>
        <div className={`absolute top-[-265px] left-1/2 -translate-x-1/2 ${isAnimating ? 'opacity-0 animate-fade-in' : 'opacity-0'}`} style={{ zIndex: 10, animationDelay: '4000ms', animationFillMode: 'forwards' }}>
          <Ribbon strategyType={strategyType} />
        </div>
      </div>
    </div>
  );
}
