import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.toiimg.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
