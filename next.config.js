/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.figma.com',
        pathname: '/api/mcp/asset/**',
      },
      {
        protocol: 'https',
        hostname: 'api.lucidly.finance',
        pathname: '/images/**',
      },
    ],
    unoptimized: false,
  },
  webpack: (config, { isServer }) => {
    // Suppress warnings for optional peer dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
    }
    
    // Ignore these modules during bundling
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@react-native-async-storage/async-storage': false,
        'pino-pretty': false,
      }
    }
    
    return config
  },
}

module.exports = nextConfig

