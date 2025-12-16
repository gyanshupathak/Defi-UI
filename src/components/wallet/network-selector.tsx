'use client';

import * as React from 'react';
import Image from 'next/image';
import { useChainId, useChains, useAccount } from 'wagmi';
import { useChainModal } from '@rainbow-me/rainbowkit';
import { designTokens } from '@/lib/design-system';

interface NetworkSelectorProps {
  ethereumLogo?: string;
}

const DEFAULT_ETH_LOGO = '/images/icons/eth.svg';

// Network icon mapping - only 4 networks supported
const NETWORK_ICONS: Record<number, string> = {
  1: '/images/icons/eth.svg',        // Ethereum Mainnet
  8453: '/images/icons/base.png',     // Base
  42161: '/images/icons/base.png',    // Arbitrum (using Base logo as no specific icon available)
  747474: '/images/icons/katana.png', // Katana
};

// Network name mapping
const NETWORK_NAMES: Record<number, string> = {
  1: 'Ethereum',
  8453: 'Base',
  42161: 'Arbitrum',
  747474: 'Katana',
};

export function NetworkSelector({ ethereumLogo = DEFAULT_ETH_LOGO }: NetworkSelectorProps) {
  // Use hooks - provider is always available in the component tree
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const chains = useChains();
  const currentChain = chains.find((chain) => chain.id === chainId);
  const { openChainModal } = useChainModal();

  // Don't show network selector if wallet is not connected
  if (!isConnected) {
    return null;
  }

  // Always use our custom icon mapping, never use chain.iconUrl
  const networkIcon = NETWORK_ICONS[chainId] || ethereumLogo || DEFAULT_ETH_LOGO;
  const networkName = NETWORK_NAMES[chainId] || currentChain?.name || 'Unknown';

  return (
    <button
      onClick={openChainModal}
      className="flex items-center justify-center shrink-0 hover:opacity-80 transition-all active:scale-95 relative group"
      style={{
        padding: designTokens.spacing.navigation.iconButtonPadding,
        borderRadius: designTokens.spacing.navigation.iconButtonRadius,
        width: designTokens.spacing.navigation.iconButtonSize,
        height: designTokens.spacing.navigation.iconButtonSize,
        backgroundColor: designTokens.colors.background.main,
        boxShadow: designTokens.shadows.navIcon,
        border: 'none',
        cursor: 'pointer',
      }}
      aria-label={`Current Network: ${networkName}`}
      title={`Network: ${networkName}`}
    >
      <div>
        <Image
          src={networkIcon}
          alt={networkName}
          width={parseInt(designTokens.spacing.navigation.iconSize) - 8}
          height={parseInt(designTokens.spacing.navigation.iconSize) - 8}
          className="object-contain"
          onError={() => {
            console.error('Network icon failed to load:', networkIcon, 'Chain ID:', chainId);
          }}
          onLoad={() => {
            console.log('Network icon loaded successfully:', networkIcon, 'Chain ID:', chainId);
          }}
        />
      </div>
    </button>
  );
}

