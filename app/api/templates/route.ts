import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// This ensures the route is only executed during actual HTTP requests
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const templates = await prisma.productTemplate.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}