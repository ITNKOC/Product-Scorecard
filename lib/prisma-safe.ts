// Safe Prisma client that prevents build-time execution
export async function createPrismaClient() {
  // Only create client at runtime, not during build
  if (process.env.NODE_ENV === undefined || typeof window !== 'undefined') {
    throw new Error('Prisma client can only be created on the server at runtime')
  }
  
  const { PrismaClient } = await import('@prisma/client')
  return new PrismaClient()
}

// Check if we're in a build environment
export function isBuildTime() {
  return process.env.NODE_ENV === undefined || 
         process.env.VERCEL_ENV === 'preview' && !process.env.DATABASE_URL
}