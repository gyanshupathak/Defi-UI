'use client';

import * as React from 'react';
import Image from 'next/image';
import { useChainId, useChains, useAccount } from 'wagmi';
import { useChainModal } from '@rainbow-me/rainbowkit';
import { designTokens } from '@/lib/design-system';
import { useAnalytics } from '@/lib/hooks/use-analytics';
import type { VaultConfig } from '@/lib/config/vault-config';
import { getNetworkImage, NETWORK_IMAGE_FALLBACKS } from '@/lib/utils/vault-images';

interface NetworkSelectorProps {
  ethereumLogo?: string;
  vaultConfig?: VaultConfig | null; // Optional vault config to get network images from
}

const DEFAULT_ETH_LOGO = '/images/icons/eth.svg';

// Network icon mapping - fallback defaults
const NETWORK_ICONS: Record<number, string> = {
  1: '/images/icons/eth.svg',        // Ethereum Mainnet
  8453: '/images/icons/base.png',     // Base
  42161: '/images/icons/base.png',    // Arbitrum (using Base logo as no specific icon available)
  747474: '/images/icons/katana.png', // Katana
  999: '/images/icons/base.png',      // HyperEVM (using base as fallback)
};

// Network name mapping
const NETWORK_NAMES: Record<number, string> = {
  1: 'Ethereum',
  8453: 'Base',
  42161: 'Arbitrum',
  747474: 'Katana',
};

export function NetworkSelector({ ethereumLogo = DEFAULT_ETH_LOGO, vaultConfig }: NetworkSelectorProps) {
  // Use hooks - provider is always available in the component tree
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const chains = useChains();
  const currentChain = chains.find((chain) => chain.id === chainId);
  const { openChainModal } = useChainModal();
  const { analytics } = useAnalytics();
  const previousChainIdRef = React.useRef<number | null>(null);

  // Track network changes
  React.useEffect(() => {
    if (isConnected && chainId && previousChainIdRef.current !== null && previousChainIdRef.current !== chainId) {
      const fromNetwork = NETWORK_NAMES[previousChainIdRef.current] || 'Unknown';
      const toNetwork = NETWORK_NAMES[chainId] || currentChain?.name || 'Unknown';
      analytics?.networkChanged(fromNetwork, toNetwork, previousChainIdRef.current, chainId);
    }
    if (isConnected && chainId) {
      previousChainIdRef.current = chainId;
    }
  }, [chainId, isConnected, analytics, currentChain?.name]);

  // Don't show network selector if wallet is not connected
  if (!isConnected) {
    return null;
  }

  // Get network name first
  const networkName = NETWORK_NAMES[chainId] || currentChain?.name || 'Unknown';
  
  // Get network icon from config if available, otherwise use fallback
  const fallbackIcon = NETWORK_ICONS[chainId] || ethereumLogo || DEFAULT_ETH_LOGO;
  const networkIcon = vaultConfig
    ? getNetworkImage(vaultConfig, networkName, fallbackIcon)
    : fallbackIcon;

  const handleNetworkClick = () => {
    if (analytics) {
      analytics.networkClicked(networkName, chainId);
    }
    if (openChainModal) {
      openChainModal();
    }
  };

  return (
    <button
      onClick={handleNetworkClick}
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

