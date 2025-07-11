/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  // Force all API routes to be dynamic
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' }
        ]
      }
    ]
  },
  // Completely skip static generation for problematic routes
  async generateBuildId() {
    return 'vercel-deployment'
  }
}

module.exports = nextConfig