import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    // Web NFC API requires secure context
    esmExternals: true
  }
};

export default nextConfig;
