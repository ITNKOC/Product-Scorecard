import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // During build time, block all API routes that need database
  if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
    if (request.nextUrl.pathname.includes('/generate-analysis-report')) {
      return NextResponse.json(
        { error: 'Route disabled during build' },
        { status: 503 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*'
}