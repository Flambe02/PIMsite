import bundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
let nextConfig = {
  typescript: { 
    ignoreBuildErrors: true 
  },
  eslint: { 
    ignoreDuringBuilds: true 
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// Configuration temporaire sans Sentry pour validation V2
nextConfig = withBundleAnalyzer(nextConfig);

export default nextConfig;