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
    
    // Clean the data and map to correct schema fields
    const cleanData = {
      userId,
      // Essential Information (required fields)
      productName: data.productName || 'Produit Test',
      productDescription: data.productDescription || 'Description du produit',
      category: data.category || 'General',
      sourcingUrl: data.sourcingUrl || null,
      
      // Pricing & Costs
      unitPrice: parseFloat(data.costPrice) || 0,
      shippingCost: parseFloat(data.shippingCost) || null,
      brandingCost: parseFloat(data.brandingCost) || null,
      desiredSellingPrice: parseFloat(data.sellingPrice) || 0,
      competitorPrices: data.competitorPrices || [],
      
      // Market Trend & Interest
      googleTrends12MonthAverage: parseFloat(data.googleTrends12MonthAverage) || null,
      monthlySearchVolume: parseInt(data.monthlySearchVolume) || null,
      isSeasonalProduct: data.isSeasonalProduct || null,
      socialMediaPopularity: data.socialMediaPopularity || null,
      
      // Qualitative Criteria
      wowFactor: parseInt(data.wowFactor) || null,
      simplicity: parseInt(data.simplicity) || null,
      easeOfUse: parseInt(data.easeOfUse) || null,
      solvesProblem: data.problemSolving ? true : false,
      isInnovative: data.innovation ? true : false,
      beforeAfterPotential: parseInt(data.beforeAfterPotential) || null,
      
      // Competition Analysis
      competitionLevel: parseInt(data.competitionLevel) || null,
      competitorCount: parseInt(data.competitorCount) || null,
      competitorAdsAnalysis: data.competitorAnalysis || null,
      differentiationPoints: data.differentiationPoints || null,
      
      // Logistics & Stock
      minimumStock: parseInt(data.minimumStock) || null,
      deliveryTime: parseInt(data.deliveryTime) || null,
      storageCostPerUnit: parseFloat(data.storageCostPerUnit) || null,
      isFragile: data.isFragile || null,
      availableVariants: data.availableVariants || null,
      
      // Social Proof & Reviews
      socialProofStrength: parseInt(data.socialProofStrength) || null,
      averageReviewCount: parseInt(data.averageReviewCount) || null,
      averageRating: parseFloat(data.averageRating) || null,
      socialEngagementRate: parseFloat(data.socialEngagementRate) || null,
      ugcObservations: data.ugcObservations || null,
      
      // Financial & Strategic Data
      initialInvestment: parseFloat(data.initialInvestment) || null,
      marketingBudget: parseFloat(data.marketingBudget) || null,
      marketGrowthRate: parseFloat(data.marketGrowthRate) || null,
      legalBarriersLevel: parseInt(data.legalBarriersLevel) || null,
      strategicNotes: data.strategicNotes || null,
      
      // Calculated fields
      finalScore: parseFloat(data.totalScore) || null,
      niche: data.niche || null
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