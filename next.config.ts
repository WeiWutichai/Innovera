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
          // Enable HSTS after SSL is configured:
          // { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
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
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://innovera.co.th",
              "media-src 'self' blob: data:",
              "object-src 'none'",
              "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'"
            ].join('; ')
          }
        ]
      }
    ]
  }
};

// Forced restart for Prisma Schema update
export default nextConfig;
