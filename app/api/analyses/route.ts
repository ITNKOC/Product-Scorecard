import { NextResponse } from 'next/server'

// This ensures the route is only executed during actual HTTP requests
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  // Prevent execution during build
  if (process.env.SKIP_PRISMA_VALIDATION === 'true') {
    return NextResponse.json({ error: 'Build mode - route disabled' }, { status: 503 })
  }
  
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    // Lazy load Prisma to avoid build-time execution
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    const analyses = await prisma.productAnalysis.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        analysisReports: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    await prisma.$disconnect()
    return NextResponse.json(analyses)
  } catch (error) {
    console.error('Error fetching analyses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  // Prevent execution during build
  if (process.env.SKIP_PRISMA_VALIDATION === 'true') {
    return NextResponse.json({ error: 'Build mode - route disabled' }, { status: 503 })
  }
  
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    // Lazy load Prisma to avoid build-time execution
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    const data = await request.json()
    
    // For now, create without user authentication
    // In a real app, you'd get the user from the session
    const userId = 'temp-user-id'
    
    // Create a temporary user if it doesn't exist
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: 'temp@example.com',
        name: 'Utilisateur Test'
      }
    })
    
    const analysis = await prisma.productAnalysis.create({
      data: {
        userId,
        ...data
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    await prisma.$disconnect()
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error creating analysis:', error)
    return NextResponse.json(
      { error: 'Failed to create analysis' },
      { status: 500 }
    )
  }
}