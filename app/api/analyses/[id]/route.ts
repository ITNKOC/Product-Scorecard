import { NextResponse } from 'next/server'

// This ensures the route is only executed during actual HTTP requests
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    console.log('Searching for analysis with ID:', params.id)

    // Lazy load Prisma to avoid build-time execution
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // First check if any analyses exist
    const count = await prisma.productAnalysis.count()
    console.log('Total analyses in database:', count)

    // List all IDs for debugging
    const allAnalyses = await prisma.productAnalysis.findMany({
      select: { id: true, productName: true }
    })
    console.log('Available analyses:', allAnalyses)

    const analysis = await prisma.productAnalysis.findUnique({
      where: {
        id: params.id
      },
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
          }
        }
      }
    })

    if (!analysis) {
      await prisma.$disconnect()
      return NextResponse.json(
        { 
          error: 'Analysis not found', 
          searchedId: params.id,
          availableIds: allAnalyses.map(a => a.id),
          totalCount: count
        },
        { status: 404 }
      )
    }

    await prisma.$disconnect()
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error fetching analysis:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    // Lazy load Prisma to avoid build-time execution
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    
    const analysis = await prisma.productAnalysis.update({
      where: {
        id: params.id
      },
      data,
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
    console.error('Error updating analysis:', error)
    return NextResponse.json(
      { error: 'Failed to update analysis' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Lazy load Prisma to avoid build-time execution
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    
    await prisma.productAnalysis.delete({
      where: {
        id: params.id
      }
    })

    await prisma.$disconnect()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting analysis:', error)
    return NextResponse.json(
      { error: 'Failed to delete analysis' },
      { status: 500 }
    )
  }
}