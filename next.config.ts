import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000'
      },
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  }
}

export default nextConfig
