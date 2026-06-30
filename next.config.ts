import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false, // Hide X-Powered-By header for security
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb', // Increase limit for image uploads
    },
    cpus: 1, // Limit Webpack/Turbopack to 1 core to prevent maxing out the 1 vCPU
    memoryBasedWorkersCount: true, // Optimize memory allocation for the workers
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          // HSTS — production serves over HTTPS (innovera.co.th). Conservative:
          // 1 year, apex only. Add `; includeSubDomains; preload` once every
          // subdomain is confirmed HTTPS-only (those are hard to roll back).
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
          // Content-Security-Policy is set per-request (with a nonce +
          // strict-dynamic) in middleware.ts, not statically here.
        ]
      }
    ]
  }
};

// Forced restart for Prisma Schema update
export default nextConfig;
