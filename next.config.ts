import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  experimental: {
    optimizePackageImports: ['@/components', '@/feature', '@/repository'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  async headers() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Robots-Tag',
              value: 'noindex, nofollow, noarchive, nosnippet, noimageindex',
            },
            {
              key: 'Permissions-Policy',
              value: 'nfc=(self), camera=(), microphone=(), geolocation=()',
            },
          ],
        },
      ];
    }
    return [];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }
    
    return config;
  },
  reactStrictMode: true,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
};

export default nextConfig;
