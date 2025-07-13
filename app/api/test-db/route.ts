import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'DATABASE_URL not configured' },
        { status: 500 }
      )
    }

    // Test basic database connection
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Test simple query
    const userCount = await prisma.user.count()
    await prisma.$disconnect()

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      userCount,
      databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing'
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json(
      { 
        error: 'Database connection failed', 
        details: error.message,
        databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing'
      },
      { status: 500 }
    )
  }
}