import { NextResponse } from 'next/server'

// This ensures the route is only executed during actual HTTP requests
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
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
    
    // Clean the data and ensure required fields
    const cleanData = {
      userId,
      // Essential info
      productName: data.productName || '',
      category: data.category || '',
      productDescription: data.productDescription || '',
      targetAudience: data.targetAudience || '',
      
      // Market analysis
      searchVolume: data.searchVolume || 0,
      trend: data.trend || 'stable',
      competitionLevel: data.competitionLevel || 'medium',
      averagePrice: data.averagePrice || 0,
      
      // Quality assessment
      wowFactor: data.wowFactor || 5,
      simplicity: data.simplicity || 5,
      easeOfUse: data.easeOfUse || 5,
      beforeAfterPotential: data.beforeAfterPotential || 5,
      problemSolving: data.problemSolving || 5,
      innovation: data.innovation || 5,
      socialProofStrength: data.socialProofStrength || 5,
      
      // Financial data
      costPrice: data.costPrice || 0,
      sellingPrice: data.sellingPrice || 0,
      profitMargin: data.profitMargin || 0,
      minimumStock: data.minimumStock || 0,
      deliveryTime: data.deliveryTime || 0,
      storageCostPerUnit: data.storageCostPerUnit || 0,
      initialInvestment: data.initialInvestment || 0,
      marketingBudget: data.marketingBudget || 0,
      
      // Competition data
      competitorPrices: data.competitorPrices || [],
      competitorAnalysis: data.competitorAnalysis || '',
      marketGrowth: data.marketGrowth || 'stable',
      
      // SWOT Analysis
      strengths: data.strengths || [],
      weaknesses: data.weaknesses || [],
      opportunities: data.opportunities || [],
      threats: data.threats || [],
      
      // Target audience
      demographicProfile: data.demographicProfile || '',
      psychographicProfile: data.psychographicProfile || '',
      geographicProfile: data.geographicProfile || '',
      
      // Marketing strategy
      marketingChannels: data.marketingChannels || [],
      contentStrategy: data.contentStrategy || '',
      promotionalTactics: data.promotionalTactics || [],
      
      // Calculated scores
      totalScore: data.totalScore || 0,
      maxScore: data.maxScore || 100
    }
    
    const analysis = await prisma.productAnalysis.create({
      data: cleanData,
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
      { error: 'Failed to create analysis', details: error.message },
      { status: 500 }
    )
  }
}