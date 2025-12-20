/**
 * Static Vault Configurations
 * 
 * This file contains static vault configurations for syUSD, syETH, and syBTC.
 * Currently acts as a mock database - all configs are stored here.
 * 
 * TODO: In production, replace this with API call to fetch from database:
 * - Remove this file
 * - Update vault-config-service.ts to call: GET /api/vaults/:symbol/config
 * - Backend will query database and return config
 */

import type { VaultConfig, VaultSymbol } from './vault-config'

/**
 * Static vault configurations
 * Structure matches database schema
 */
export const VAULT_CONFIGS: Record<VaultSymbol, VaultConfig> = {
  syUSD: {
    last_updated: '2025-12-18T07:33:04.045336+00:00',
    vault_constants: {
      address: '0x279CAD277447965AF3d24a78197aad1B02a2c589',
      audited_by: 'Pashov',
      base_asset: {
        asset: 'USDC',
        network: 'Base',
      },
      category: 'Flagship',
      decimals: 6,
      deployment_date: '29 May 2025',
      deposit_assets: [
        {
          assets: ['USDC', 'USDS', 'sUSDS'],
          network: 'Base',
        },
      ],
      description: 'Perpetual syUSD strategy on base network',
      dest_network: 'Base',
      faqs: [
        {
          answer: 'syUSD is a stable yield USD strategy on Base network that aims to provide stable returns by investing in a diversified portfolio of yield-generating assets.',
          question: 'What is syUSD?',
        },
        {
          answer: 'You can deposit USDC or USDT into the syUSD vault through our web application. Simply connect your wallet, select the amount you wish to deposit, and confirm the transaction.',
          question: 'How can I deposit into syUSD?',
        },
      ],
      fee_payout: '0x1b514df3413DA9931eB31f2Ab72e32c0A507Cad5',
      logo: 'CDN_URL',
      management_fee: '2',
      name: 'Stable Yield USD',
      owner: '0x1b514df3413DA9931eB31f2Ab72e32c0A507Cad5',
      performance_fee: '10',
      queue_address: '0xF632c10b19f2a0451cD4A653fC9ca0c15eA1040b',
      rate_provider: '0x03D9a9cE13D16C7cFCE564f41bd7E85E5cde8Da6',
      solver_address: '0x1d82e9bCc8F325caBBca6E6A3B287fE586536805',
      symbol: 'syUSD',
      teller_address: '0xaefc11908fF97c335D16bdf9F2Bf720817423825',
      type: 'Liquid',
      withdraw_assets: [
        {
          assets: ['USDC'],
          network: 'Base',
        },
      ],
    },
    vault_endpoints: {
      allocations_by_time: 'https://api.lucidly.finance/services/allocations_data?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589&timestamp=',
      apy_by_time: 'https://api.lucidly.finance/services/apy_data?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589&timestamp=',
      apy_endpoint: 'https://j3zbikckse.execute-api.ap-south-1.amazonaws.com/prod/api/base-apy/today-7d-ma',
      asset_exposure: 'https://api.lucidly.finance/services/asset_exposure?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      available_liquidity: 'https://api.lucidly.finance/services/available_liquidity?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      base_asset_price: 'https://api.lucidly.finance/services/asset_price?asset=USDC',
      last_updated_deposit: 'https://api.lucidly.finance/services/last_updated_deposit?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      last_updated_withdrawal: 'https://api.lucidly.finance/services/last_updated_withdrawal?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      lifetime_returns: 'https://api.lucidly.finance/services/lifetime_returns?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      share_price: 'https://api.lucidly.finance/services/exchange_rates?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      strategy_exposure: 'https://api.lucidly.finance/services/strategy_exposure?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      tvl: 'https://api.lucidly.finance/services/aum_data?vaultName=syUSD',
      tvl_by_time: 'https://api.lucidly.finance/services/tvl_data?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589&timestamp=',
      withdraw_request: 'https://api.lucidly.finance/services/queueData?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589&userAddress=',
    },
    vault_incentives: {
      enabled: true,
      points: [
        {
          description: 'Earn 1.5x Lucildy Drops as bonus for Liquidity Land users',
          image: '/images/icons/syUSD/liquidity_land.png',
          link: 'https://app.liquidity.land/project/Lucidly',
          multiplier: 1.5,
          name: 'Liquidity Land',
        },
        {
          description: 'Points earned through protocol fund allocation strategies',
          image: '/images/icons/syUSD/resolv.svg',
          multiplier: 1,
          name: 'Resolv Points',
        },
      ],
    },
    vault_networks: {
      arbitrum: {
        chainId: 42161,
        chainObject: {
          id: 42161,
          name: 'Arbitrum',
          nativeCurrency: {
            decimals: 18,
            name: 'Ether',
            symbol: 'ETH',
          },
          network: 'arbitrum',
          rpcUrls: {
            default: {
              http: ['https://arb1.arbitrum.io/rpc'],
            },
            public: {
              http: ['https://arb1.arbitrum.io/rpc'],
            },
          },
        },
        image: 'CDN_URL',
        rpc: 'https://arb1.arbitrum.io/rpc',
        tokens: {
          USDC: {
            contract: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
            decimal: 6,
            image: 'CDN_URL',
            isWithdrawable: false,
          },
          USDS: {
            contract: '0x6491c05A82219b8D1479057361ff1654749b876b',
            decimal: 18,
            image: 'CDN_URL',
            isWithdrawable: false,
          },
        },
      },
      base: {
        chainId: 8453,
        chainObject: {
          id: 8453,
          name: 'Base',
          nativeCurrency: {
            decimals: 18,
            name: 'Ethereum',
            symbol: 'ETH',
          },
          network: 'base',
          rpcUrls: {
            default: {
              http: ['https://base.llamarpc.com'],
            },
            public: {
              http: ['https://base.llamarpc.com'],
            },
          },
        },
        image: 'CDN_URL',
        rpc: 'https://base.llamarpc.com',
        tokens: {
          USDC: {
            contract: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
            decimal: 6,
            image: 'CDN_URL',
            isWithdrawable: true,
          },
          USDS: {
            contract: '0x820C137fa70C8691f0e44Dc420a5e53c168921Dc',
            decimal: 18,
            image: 'CDN_URL',
            isWithdrawable: false,
          },
          sUSDS: {
            contract: '0x5875eEE11Cf8398102FdAd704C9E96607675467a',
            decimal: 18,
            image: 'CDN_URL',
            isWithdrawable: false,
          },
        },
      },
      ethereum: {
        chainId: 1,
        chainObject: {
          id: 1,
          name: 'Ethereum',
          nativeCurrency: {
            decimals: 18,
            name: 'Ether',
            symbol: 'ETH',
          },
          network: 'ethereum',
          rpcUrls: {
            default: {
              http: ['https://eth.llamarpc.com'],
            },
            public: {
              http: ['https://eth.llamarpc.com'],
            },
          },
        },
        image: 'CDN_URL',
        rpc: 'https://eth.llamarpc.com',
        tokens: {
          USDC: {
            contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            decimal: 6,
            image: 'CDN_URL',
            isWithdrawable: false,
          },
          USDS: {
            contract: '0xdC035D45d973E3EC169d2276DDab16f1e407384F',
            decimal: 18,
            image: 'CDN_URL',
            isWithdrawable: false,
          },
          USDT: {
            contract: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            decimal: 6,
            image: 'CDN_URL',
            isWithdrawable: false,
          },
        },
      },
      katana: {
        chainId: 747474,
        chainObject: {
          id: 747474,
          name: 'Katana',
          nativeCurrency: {
            decimals: 18,
            name: 'ETH',
            symbol: 'ETH',
          },
          network: 'katana',
          rpcUrls: {
            default: {
              http: ['https://rpc.katana.network'],
            },
            public: {
              http: ['https://rpc.katana.network'],
            },
          },
        },
        image: 'CDN_URL',
        rpc: 'https://rpc.katana.network',
        tokens: {
          vbUSDC: {
            contract: '0x203A662b0BD271A6ed5a60EdFbd04bFce608FD36',
            decimal: 6,
            image: 'CDN_URL',
            isWithdrawable: false,
          },
          vbUSDS: {
            contract: '0x62D6A123E8D19d06d68cf0d2294F9A3A0362c6b3',
            decimal: 18,
            image: 'CDN_URL',
            isWithdrawable: false,
          },
          vbUSDT: {
            contract: '0x2DCa96907fde857dd3D816880A0df407eeB2D2F2',
            decimal: 6,
            image: 'CDN_URL',
            isWithdrawable: false,
          },
        },
      },
    },
  },
  syETH: {
    last_updated: '2025-12-18T07:33:04.045336+00:00',
    vault_constants: {
      address: '0x279CAD277447965AF3d24a78197aad1B02a2c589', // TODO: Update with actual syETH address
      audited_by: 'Pashov',
      base_asset: {
        asset: 'ETH',
        network: 'Base',
      },
      category: 'Delta Neutral',
      decimals: 18,
      deployment_date: '29 May 2025',
      deposit_assets: [
        {
          assets: ['ETH', 'WETH'],
          network: 'Base',
        },
      ],
      description: 'Perpetual syETH strategy on base network',
      dest_network: 'Base',
      faqs: [
        {
          answer: 'syETH is a stable yield ETH strategy on Base network that aims to provide stable returns by investing in a diversified portfolio of yield-generating assets.',
          question: 'What is syETH?',
        },
        {
          answer: 'You can deposit ETH or WETH into the syETH vault through our web application. Simply connect your wallet, select the amount you wish to deposit, and confirm the transaction.',
          question: 'How can I deposit into syETH?',
        },
      ],
      fee_payout: '0x1b514df3413DA9931eB31f2Ab72e32c0A507Cad5',
      logo: 'CDN_URL',
      management_fee: '2',
      name: 'Stable Yield ETH',
      owner: '0x1b514df3413DA9931eB31f2Ab72e32c0A507Cad5',
      performance_fee: '10',
      queue_address: '0xF632c10b19f2a0451cD4A653fC9ca0c15eA1040b', // TODO: Update with actual syETH queue address
      rate_provider: '0x03D9a9cE13D16C7cFCE564f41bd7E85E5cde8Da6',
      solver_address: '0x1d82e9bCc8F325caBBca6E6A3B287fE586536805',
      symbol: 'syETH',
      teller_address: '0xaefc11908fF97c335D16bdf9F2Bf720817423825',
      type: 'Liquid',
      withdraw_assets: [
        {
          assets: ['ETH'],
          network: 'Base',
        },
      ],
    },
    vault_endpoints: {
      allocations_by_time: 'https://api.lucidly.finance/services/allocations_data?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589&timestamp=',
      apy_by_time: 'https://api.lucidly.finance/services/apy_data?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589&timestamp=',
      apy_endpoint: 'https://j3zbikckse.execute-api.ap-south-1.amazonaws.com/prod/api/base-apy/today-7d-ma',
      asset_exposure: 'https://api.lucidly.finance/services/asset_exposure?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      available_liquidity: 'https://api.lucidly.finance/services/available_liquidity?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      base_asset_price: 'https://api.lucidly.finance/services/asset_price?asset=ETH',
      last_updated_deposit: 'https://api.lucidly.finance/services/last_updated_deposit?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      last_updated_withdrawal: 'https://api.lucidly.finance/services/last_updated_withdrawal?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      lifetime_returns: 'https://api.lucidly.finance/services/lifetime_returns?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      share_price: 'https://api.lucidly.finance/services/exchange_rates?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      strategy_exposure: 'https://api.lucidly.finance/services/strategy_exposure?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      tvl: 'https://api.lucidly.finance/services/aum_data?vaultName=syETH',
      tvl_by_time: 'https://api.lucidly.finance/services/tvl_data?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589&timestamp=',
      withdraw_request: 'https://api.lucidly.finance/services/queueData?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589&userAddress=',
    },
    vault_incentives: {
      enabled: true,
      points: [
        {
          description: 'Earn 1.5x Lucildy Drops as bonus for Liquidity Land users',
          image: '/images/icons/syETH/liquidity_land.png',
          link: 'https://app.liquidity.land/project/Lucidly',
          multiplier: 1.5,
          name: 'Liquidity Land',
        },
        {
          description: 'Points earned through protocol fund allocation strategies',
          image: '/images/icons/syETH/resolv.svg',
          multiplier: 1,
          name: 'Resolv Points',
        },
      ],
    },
    vault_networks: {
      arbitrum: {
        chainId: 42161,
        chainObject: {
          id: 42161,
          name: 'Arbitrum',
          nativeCurrency: {
            decimals: 18,
            name: 'Ether',
            symbol: 'ETH',
          },
          network: 'arbitrum',
          rpcUrls: {
            default: {
              http: ['https://arb1.arbitrum.io/rpc'],
            },
            public: {
              http: ['https://arb1.arbitrum.io/rpc'],
            },
          },
        },
        image: 'CDN_URL',
        rpc: 'https://arb1.arbitrum.io/rpc',
        tokens: {
          ETH: {
            contract: '0x0000000000000000000000000000000000000000',
            decimal: 18,
            image: 'CDN_URL',
            isWithdrawable: false,
          },
          WETH: {
            contract: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
            decimal: 18,
            image: 'CDN_URL',
            isWithdrawable: false,
          },
        },
      },
      base: {
        chainId: 8453,
        chainObject: {
          id: 8453,
          name: 'Base',
          nativeCurrency: {
            decimals: 18,
            name: 'Ethereum',
            symbol: 'ETH',
          },
          network: 'base',
          rpcUrls: {
            default: {
              http: ['https://base.llamarpc.com'],
            },
            public: {
              http: ['https://base.llamarpc.com'],
            },
          },
        },
        image: 'CDN_URL',
        rpc: 'https://base.llamarpc.com',
        tokens: {
          ETH: {
            contract: '0x0000000000000000000000000000000000000000',
            decimal: 18,
            image: 'CDN_URL',
            isWithdrawable: true,
          },
          WETH: {
            contract: '0x4200000000000000000000000000000000000006',
            decimal: 18,
            image: 'CDN_URL',
            isWithdrawable: false,
          },
        },
      },
      ethereum: {
        chainId: 1,
        chainObject: {
          id: 1,
          name: 'Ethereum',
          nativeCurrency: {
            decimals: 18,
            name: 'Ether',
            symbol: 'ETH',
          },
          network: 'ethereum',
          rpcUrls: {
            default: {
              http: ['https://eth.llamarpc.com'],
            },
            public: {
              http: ['https://eth.llamarpc.com'],
            },
          },
        },
        image: 'CDN_URL',
        rpc: 'https://eth.llamarpc.com',
        tokens: {
          ETH: {
            contract: '0x0000000000000000000000000000000000000000',
            decimal: 18,
            image: 'CDN_URL',
            isWithdrawable: false,
          },
          WETH: {
            contract: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimal: 18,
            image: 'CDN_URL',
            isWithdrawable: false,
          },
        },
      },
      katana: {
        chainId: 747474,
        chainObject: {
          id: 747474,
          name: 'Katana',
          nativeCurrency: {
            decimals: 18,
            name: 'ETH',
            symbol: 'ETH',
          },
          network: 'katana',
          rpcUrls: {
            default: {
              http: ['https://rpc.katana.network'],
            },
            public: {
              http: ['https://rpc.katana.network'],
            },
          },
        },
        image: 'CDN_URL',
        rpc: 'https://rpc.katana.network',
        tokens: {
          vbETH: {
            contract: '0x203A662b0BD271A6ed5a60EdFbd04bFce608FD36',
            decimal: 18,
            image: 'CDN_URL',
            isWithdrawable: false,
          },
        },
      },
    },
  },
  syBTC: {
    last_updated: '2025-12-18T07:33:04.045336+00:00',
    vault_constants: {
      address: '0x279CAD277447965AF3d24a78197aad1B02a2c589', // TODO: Update with actual syBTC address
      audited_by: 'Pashov',
      base_asset: {
        asset: 'BTC',
        network: 'Base',
      },
      category: 'Leverage Looping',
      decimals: 8,
      deployment_date: '29 May 2025',
      deposit_assets: [
        {
          assets: ['BTC', 'WBTC'],
          network: 'Base',
        },
      ],
      description: 'Perpetual syBTC strategy on base network',
      dest_network: 'Base',
      faqs: [
        {
          answer: 'syBTC is a stable yield BTC strategy on Base network that aims to provide stable returns by investing in a diversified portfolio of yield-generating assets.',
          question: 'What is syBTC?',
        },
        {
          answer: 'You can deposit BTC or WBTC into the syBTC vault through our web application. Simply connect your wallet, select the amount you wish to deposit, and confirm the transaction.',
          question: 'How can I deposit into syBTC?',
        },
      ],
      fee_payout: '0x1b514df3413DA9931eB31f2Ab72e32c0A507Cad5',
      logo: 'CDN_URL',
      management_fee: '2',
      name: 'Stable Yield BTC',
      owner: '0x1b514df3413DA9931eB31f2Ab72e32c0A507Cad5',
      performance_fee: '10',
      queue_address: '0xF632c10b19f2a0451cD4A653fC9ca0c15eA1040b', // TODO: Update with actual syBTC queue address
      rate_provider: '0x03D9a9cE13D16C7cFCE564f41bd7E85E5cde8Da6',
      solver_address: '0x1d82e9bCc8F325caBBca6E6A3B287fE586536805',
      symbol: 'syBTC',
      teller_address: '0xaefc11908fF97c335D16bdf9F2Bf720817423825',
      type: 'Liquid',
      withdraw_assets: [
        {
          assets: ['BTC'],
          network: 'Base',
        },
      ],
    },
    vault_endpoints: {
      allocations_by_time: 'https://api.lucidly.finance/services/allocations_data?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589&timestamp=',
      apy_by_time: 'https://api.lucidly.finance/services/apy_data?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589&timestamp=',
      apy_endpoint: 'https://j3zbikckse.execute-api.ap-south-1.amazonaws.com/prod/api/base-apy/today-7d-ma',
      asset_exposure: 'https://api.lucidly.finance/services/asset_exposure?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      available_liquidity: 'https://api.lucidly.finance/services/available_liquidity?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      base_asset_price: 'https://api.lucidly.finance/services/asset_price?asset=BTC',
      last_updated_deposit: 'https://api.lucidly.finance/services/last_updated_deposit?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      last_updated_withdrawal: 'https://api.lucidly.finance/services/last_updated_withdrawal?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      lifetime_returns: 'https://api.lucidly.finance/services/lifetime_returns?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      share_price: 'https://api.lucidly.finance/services/exchange_rates?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      strategy_exposure: 'https://api.lucidly.finance/services/strategy_exposure?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589',
      tvl: 'https://api.lucidly.finance/services/aum_data?vaultName=syBTC',
      tvl_by_time: 'https://api.lucidly.finance/services/tvl_data?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589&timestamp=',
      withdraw_request: 'https://api.lucidly.finance/services/queueData?vaultAddress=0x279CAD277447965AF3d24a78197aad1B02a2c589&userAddress=',
    },
    vault_incentives: {
      enabled: true,
      points: [
        {
          description: 'Earn 1.5x Lucildy Drops as bonus for Liquidity Land users',
          image: '/images/icons/syBTC/liquidity_land.png',
          link: 'https://app.liquidity.land/project/Lucidly',
          multiplier: 1.5,
          name: 'Liquidity Land',
        },
        {
          description: 'Points earned through protocol fund allocation strategies',
          image: '/images/icons/syBTC/resolv.svg',
          multiplier: 1,
          name: 'Resolv Points',
        },
      ],
    },
    vault_networks: {
      arbitrum: {
        chainId: 42161,
        chainObject: {
          id: 42161,
          name: 'Arbitrum',
          nativeCurrency: {
            decimals: 18,
            name: 'Ether',
            symbol: 'ETH',
          },
          network: 'arbitrum',
          rpcUrls: {
            default: {
              http: ['https://arb1.arbitrum.io/rpc'],
            },
            public: {
              http: ['https://arb1.arbitrum.io/rpc'],
            },
          },
        },
        image: 'CDN_URL',
        rpc: 'https://arb1.arbitrum.io/rpc',
        tokens: {
          WBTC: {
            contract: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0F',
            decimal: 8,
            image: 'CDN_URL',
            isWithdrawable: false,
          },
        },
      },
      base: {
        chainId: 8453,
        chainObject: {
          id: 8453,
          name: 'Base',
          nativeCurrency: {
            decimals: 18,
            name: 'Ethereum',
            symbol: 'ETH',
          },
          network: 'base',
          rpcUrls: {
            default: {
              http: ['https://base.llamarpc.com'],
            },
            public: {
              http: ['https://base.llamarpc.com'],
            },
          },
        },
        image: 'CDN_URL',
        rpc: 'https://base.llamarpc.com',
        tokens: {
          WBTC: {
            contract: '0x3aab2285ddcDdaD8edf438C1bAB47e1a9D05a9b4',
            decimal: 8,
            image: 'CDN_URL',
            isWithdrawable: true,
          },
        },
      },
      ethereum: {
        chainId: 1,
        chainObject: {
          id: 1,
          name: 'Ethereum',
          nativeCurrency: {
            decimals: 18,
            name: 'Ether',
            symbol: 'ETH',
          },
          network: 'ethereum',
          rpcUrls: {
            default: {
              http: ['https://eth.llamarpc.com'],
            },
            public: {
              http: ['https://eth.llamarpc.com'],
            },
          },
        },
        image: 'CDN_URL',
        rpc: 'https://eth.llamarpc.com',
        tokens: {
          WBTC: {
            contract: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
            decimal: 8,
            image: 'CDN_URL',
            isWithdrawable: false,
          },
        },
      },
      katana: {
        chainId: 747474,
        chainObject: {
          id: 747474,
          name: 'Katana',
          nativeCurrency: {
            decimals: 18,
            name: 'ETH',
            symbol: 'ETH',
          },
          network: 'katana',
          rpcUrls: {
            default: {
              http: ['https://rpc.katana.network'],
            },
            public: {
              http: ['https://rpc.katana.network'],
            },
          },
        },
        image: 'CDN_URL',
        rpc: 'https://rpc.katana.network',
        tokens: {
          vbWBTC: {
            contract: '0x203A662b0BD271A6ed5a60EdFbd04bFce608FD36',
            decimal: 8,
            image: 'CDN_URL',
            isWithdrawable: false,
          },
        },
      },
    },
  },
}

/**
 * Get vault config from static configs
 * 
 * TODO: Replace with database API call:
 * - Change this function to call: GET /api/vaults/:symbol/config
 * - Backend will query database and return config
 */
export function getVaultConfig(vaultSymbol: VaultSymbol): VaultConfig {
  const config = VAULT_CONFIGS[vaultSymbol]
  if (!config) {
    throw new Error(`Vault config not found for symbol: ${vaultSymbol}`)
  }
  return config
}