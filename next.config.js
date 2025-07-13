/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma']
  },
  webpack: (config, { isServer, buildId }) => {
    if (isServer) {
      config.externals.push('@prisma/client')
      config.externals.push('prisma')
    }
    
    return config
  },
  
  // Disable build tracing for API routes during build
  outputFileTracing: false,
  
  // Disable static optimization for API routes
  async rewrites() {
    return []
  }
}

module.exports = nextConfig