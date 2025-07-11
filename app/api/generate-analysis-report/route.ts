import { NextResponse } from 'next/server'

// Simple route that works during build
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { analysisId } = await request.json()
    
    if (!analysisId) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      )
    }

    // For now, return a simple response
    // We'll implement the full functionality after deployment
    return NextResponse.json({
      message: 'Report generation will be implemented after successful deployment',
      analysisId,
      status: 'pending'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}