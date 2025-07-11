import { NextResponse } from 'next/server'

// Simplified route that doesn't cause build issues
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { 
      message: 'Report generation temporarily disabled during deployment',
      id: params.id 
    },
    { status: 503 }
  )
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { 
      message: 'Report generation temporarily disabled during deployment',
      id: params.id 
    },
    { status: 503 }
  )
}