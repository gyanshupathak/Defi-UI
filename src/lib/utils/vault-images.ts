/**
 * Utility functions to get images from vault config with fallback to local images
 */

import type { VaultConfig } from '@/lib/config/vault-config'
import imagesData from './images.json'

/**
 * Check if a URL is valid
 */
function isValidUrl(url: string | undefined | null): boolean {
  if (!url || url.trim() === '') return false
  // Check for placeholder values
  if (url.toUpperCase() === 'CDN_URL' || url === 'CDN_URL') return false
  // Check if it's a valid URL (starts with http:// or https://) or relative path (starts with /)
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      new URL(url)
      return true
    }
    if (url.startsWith('/')) {
      return true
    }
    return false
  } catch {
    return false
  }
}

/**
 * Get network image from config with fallback
 * 
 * @param vaultConfig - The vault config
 * @param networkName - Network name (e.g., "Base", "Arbitrum", "Ethereum", "Katana")
 * @param fallbackImage - Fallback image path if not found in config
 * @returns Image URL from config or fallback
 */
export function getNetworkImage(
  vaultConfig: VaultConfig | null | undefined,
  networkName: string,
  fallbackImage: string
): string {
  if (!vaultConfig) return fallbackImage

  // Map network names to config keys
  // Note: hyperEVM has two entries because config uses 'hyperEVM' (lowercase h) and
  // input may come as either 'HyperEVM' or 'hyperEVM'. JavaScript object keys are case-sensitive.
  const networkKeyMap: Record<string, string> = {
    'Base': 'base',
    'Arbitrum': 'arbitrum',
    'Ethereum': 'ethereum',
    'Katana': 'katana',
    'HyperEVM': 'hyperEVM',
    'hyperEVM': 'hyperEVM', // Config uses lowercase 'h', so we handle both variants
  }

  const configKey = networkKeyMap[networkName] || networkName.toLowerCase()
  const networkConfig = vaultConfig.vault_networks[configKey as keyof typeof vaultConfig.vault_networks]

  if (networkConfig?.image && isValidUrl(networkConfig.image)) {
    return networkConfig.image
  }

  return fallbackImage
}

/**
 * Get token image from config with fallback
 * 
 * @param vaultConfig - The vault config
 * @param tokenSymbol - Token symbol (e.g., "USDC", "wETH", "wBTC")
 * @param networkName - Optional network name to prioritize. If not provided, searches all networks
 * @param fallbackImage - Fallback image path if not found in config
 * @returns Image URL from config or fallback
 */
export function getTokenImage(
  vaultConfig: VaultConfig | null | undefined,
  tokenSymbol: string,
  networkName: string | undefined,
  fallbackImage: string
): string {
  if (!vaultConfig) return fallbackImage

  // Map network names to config keys
  // Note: hyperEVM has two entries because config uses 'hyperEVM' (lowercase h) and
  // input may come as either 'HyperEVM' or 'hyperEVM'. JavaScript object keys are case-sensitive.
  const networkKeyMap: Record<string, string> = {
    'Base': 'base',
    'Arbitrum': 'arbitrum',
    'Ethereum': 'ethereum',
    'Katana': 'katana',
    'HyperEVM': 'hyperEVM',
    'hyperEVM': 'hyperEVM', // Config uses lowercase 'h', so we handle both variants
  }

  // If network is specified, prioritize that network
  const networksToCheck = networkName
    ? [networkKeyMap[networkName] || networkName.toLowerCase()]
    : Object.keys(networkKeyMap).map(name => networkKeyMap[name])

  // Search through networks (prioritized network first if specified)
  for (const configKey of networksToCheck) {
    const networkConfig = vaultConfig.vault_networks[configKey as keyof typeof vaultConfig.vault_networks]
    
    if (networkConfig?.tokens) {
      // Try exact match first
      const token = networkConfig.tokens[tokenSymbol]
      if (token?.image && isValidUrl(token.image)) {
        return token.image
      }

      // Try case-insensitive match
      const tokenKey = Object.keys(networkConfig.tokens).find(
        key => key.toLowerCase() === tokenSymbol.toLowerCase()
      )
      if (tokenKey) {
        const token = networkConfig.tokens[tokenKey]
        if (token?.image && isValidUrl(token.image)) {
          return token.image
        }
      }
    }
  }

  // If network specified but not found, search all networks as fallback
  if (networkName) {
    for (const key of Object.keys(vaultConfig.vault_networks)) {
      const networkConfig = vaultConfig.vault_networks[key as keyof typeof vaultConfig.vault_networks]
      if (networkConfig?.tokens) {
        const token = networkConfig.tokens[tokenSymbol]
        if (token?.image && isValidUrl(token.image)) {
          return token.image
        }
        const tokenKey = Object.keys(networkConfig.tokens).find(
          k => k.toLowerCase() === tokenSymbol.toLowerCase()
        )
        if (tokenKey) {
          const token = networkConfig.tokens[tokenKey]
          if (token?.image && isValidUrl(token.image)) {
            return token.image
          }
        }
      }
    }
  }

  return fallbackImage
}

/**
 * Get vault logo from config with fallback
 * 
 * @param vaultConfig - The vault config
 * @param fallbackImage - Fallback image path if not found in config
 * @returns Logo URL from config or fallback
 */
export function getVaultLogo(
  vaultConfig: VaultConfig | null | undefined,
  fallbackImage: string
): string {
  if (!vaultConfig) return fallbackImage

  const logo = vaultConfig.vault_constants.logo
  if (logo && isValidUrl(logo)) {
    return logo
  }

  return fallbackImage
}

/**
 * Network image fallback mapping
 */
export const NETWORK_IMAGE_FALLBACKS: Record<string, string> = {
  'Base': '/images/icons/base.png',
  'Ethereum': '/images/icons/eth.svg',
  'Arbitrum': '/images/icons/Arbitrum.svg', // Using base as fallback since no specific arbitrum icon
  'Katana': '/images/icons/katana.png',
  'HyperEVM': '/images/icons/hyperEVM.svg', // Using base as fallback
}

/**
 * Token image fallback mapping
 */
export const TOKEN_IMAGE_FALLBACKS: Record<string, string> = {
  'syUSD': '/images/icons/USD-stable.svg',
  'syETH': '/images/icons/ETH-stable.svg',
  'syBTC': '/images/icons/BTC Stable (1).svg',
  'syHLP': '/images/icons/syHLP.svg',
  'USDC': '/images/icons/USD-stable.svg',
  'USDS': '/images/icons/USD-stable.svg',
  'SUSD': '/images/icons/USD-stable.svg',
  'wETH': '/images/icons/ETH-stable.svg',
  'wBTC': '/images/icons/BTC Stable (1).svg',
  'USDT': '/images/icons/USD-stable.svg',
  'USDT0': '/images/icons/USD-stable.svg',
  'sUSDS': '/images/icons/USD-stable.svg',
  'vbUSDC': '/images/icons/USDC.svg',
  'vbUSDS': '/images/icons/usds.svg',
  'vbUSDT': '/images/icons/usdt.svg',
}

/**
 * Category icon fallback mapping
 */
export const CATEGORY_ICON_FALLBACKS: Record<string, string> = {
  'flagship': '/images/icons/flagship-icon.svg',
  'delta-neutral': '/images/icons/delta-neutral-icon.svg',
  'leverage-looping': '/images/icons/leverage-looping-icon.svg',
}

/**
 * Get category icon URL from images.json with fallback to local icon
 * 
 * @param categoryId - Category ID ('flagship', 'delta-neutral', 'leverage-looping')
 * @returns CDN URL from images.json or local fallback path
 */
export function getCategoryIcon(categoryId: string): string {
  // Try to find the icon in images.json
  const generalIcons = imagesData.images_by_category.General || []
  
  // Map category IDs to icon filenames
  const iconFilenameMap: Record<string, string> = {
    'flagship': 'flagship-icon.svg',
    'delta-neutral': 'delta-neutral-icon.svg',
    'leverage-looping': 'leverage-looping-icon.svg',
  }
  
  const iconFilename = iconFilenameMap[categoryId]
  if (!iconFilename) {
    // If category not found, return fallback
    return CATEGORY_ICON_FALLBACKS[categoryId] || CATEGORY_ICON_FALLBACKS['flagship']
  }
  
  // Find the icon in images.json
  const iconData = generalIcons.find(
    (icon: any) => icon.filename === iconFilename
  )
  
  // Return CDN URL if found and valid, otherwise fallback to local icon
  if (iconData?.url && isValidUrl(iconData.url)) {
    return iconData.url
  }
  
  return CATEGORY_ICON_FALLBACKS[categoryId] || CATEGORY_ICON_FALLBACKS['flagship']
}

/**
 * Get category icon with both CDN URL and fallback
 * 
 * @param categoryId - Category ID ('flagship', 'delta-neutral', 'leverage-looping')
 * @returns Object with url (CDN URL) and fallback (local path)
 */
export function getCategoryIconWithFallback(categoryId: string): { url: string; fallback: string } {
  const fallback = CATEGORY_ICON_FALLBACKS[categoryId] || CATEGORY_ICON_FALLBACKS['flagship']
  const generalIcons = imagesData.images_by_category.General || []
  
  const iconFilenameMap: Record<string, string> = {
    'flagship': 'flagship-icon.svg',
    'delta-neutral': 'delta-neutral-icon.svg',
    'leverage-looping': 'leverage-looping-icon.svg',
  }
  
  const iconFilename = iconFilenameMap[categoryId]
  if (!iconFilename) {
    return { url: fallback, fallback }
  }
  
  const iconData = generalIcons.find(
    (icon: any) => icon.filename === iconFilename
  )
  
  const url = (iconData?.url && isValidUrl(iconData.url)) ? iconData.url : fallback
  
  return { url, fallback }
}

