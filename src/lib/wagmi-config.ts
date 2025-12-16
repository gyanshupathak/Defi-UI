import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  base,
  arbitrum,
} from 'wagmi/chains';
import { defineChain } from 'viem';

// Custom Katana chain definition
const katana = defineChain({
  id: 747474,
  name: 'Katana',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.katana.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Katana Explorer',
      url: 'https://explorer.katana.network',
    },
  },
  iconUrl: '/images/icons/katana.png',
  testnet: false,
});

// Get project ID from environment variable
// You'll need to get this from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

export const wagmiConfig = getDefaultConfig({
  appName: 'Lucidly Finance',
  projectId: projectId || 'YOUR_PROJECT_ID', // Replace with your WalletConnect Project ID
  chains: [
    mainnet,    // Ethereum
    base,       // Base
    arbitrum,   // Arbitrum
    katana,     // Katana
  ],
  ssr: true, // Enable server-side rendering support
});

