/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  // Exclude pino-related packages from client bundle
  serverExternalPackages: ['pino', 'pino-pretty'],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
    NEXT_PUBLIC_DISTRIBUTOR_PROGRAM_ID: process.env.NEXT_PUBLIC_DISTRIBUTOR_PROGRAM_ID || 'DistrXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    NEXT_PUBLIC_TOKEN_MINT: process.env.NEXT_PUBLIC_TOKEN_MINT || '',
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Ignore pino-pretty in client-side builds
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'pino-pretty': false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;


