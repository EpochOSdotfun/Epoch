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
    // Handle node modules that shouldn't be bundled for client
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    };

    // Ignore pino-pretty which is optional
    config.resolve.alias = {
      ...config.resolve.alias,
      'pino-pretty': false,
    };

    // Exclude problematic packages from client bundle
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'pino-pretty': 'pino-pretty',
      });
    }

    return config;
  },
  // Transpile Solana packages
  transpilePackages: [
    '@solana/wallet-adapter-base',
    '@solana/wallet-adapter-react',
    '@solana/wallet-adapter-react-ui',
    '@solana/wallet-adapter-wallets',
  ],
};

module.exports = nextConfig;
