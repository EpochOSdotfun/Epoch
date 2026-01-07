/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    
    // Handle pino-pretty and other optional modules
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'pino-pretty': false,
      };
    }
    
    config.externals = config.externals || [];
    config.externals.push('pino-pretty');
    
    return config;
  },
};

module.exports = nextConfig;
