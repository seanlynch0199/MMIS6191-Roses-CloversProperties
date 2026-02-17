/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    'http://34.227.145.219:3001',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
  ],
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig
