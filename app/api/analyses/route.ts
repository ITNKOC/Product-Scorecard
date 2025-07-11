import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Function to get Prisma client - avoid global instantiation
function getPrismaClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured')
  }
  return new PrismaClient({
    errorFormat: 'minimal'
  })
}

export async function GET() {
  let prisma: PrismaClient | null = null
  
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    prisma = getPrismaClient()
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

    return NextResponse.json(analyses)
  } catch (error) {
    console.error('Error fetching analyses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    )
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}

export async function POST(request: Request) {
  let prisma: PrismaClient | null = null
  
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    prisma = getPrismaClient()
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

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error creating analysis:', error)
    return NextResponse.json(
      { error: 'Failed to create analysis' },
      { status: 500 }
    )
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}