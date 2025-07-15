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
      unitPrice: parseFloat(data.unitPrice) || 0,
      shippingCost: parseFloat(data.shippingCost) || null,
      brandingCost: parseFloat(data.brandingCost) || null,
      desiredSellingPrice: parseFloat(data.desiredSellingPrice) || 0,
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
      solvesProblem: data.solvesProblem ? true : false,
      isInnovative: data.isInnovative ? true : false,
      beforeAfterPotential: parseInt(data.beforeAfterPotential) || null,
      
      // Competition Analysis
      competitionLevel: parseInt(data.competitionLevel) || null,
      competitorCount: parseInt(data.competitorCount) || null,
      competitorAdsAnalysis: data.competitorAdsAnalysis || null,
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
      niche: data.niche || null
    }
    
    // Calculate final score
    const finalScore = calculateFinalScore(cleanData)
    cleanData.finalScore = finalScore
    
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

function calculateFinalScore(analysis: any): number {
  let score = 0
  let maxScore = 0

  // Calculate gross margin percentage
  const totalCost = (analysis.unitPrice || 0) + (analysis.shippingCost || 0) + (analysis.brandingCost || 0)
  const sellingPrice = analysis.desiredSellingPrice || 0
  const grossMarginPercentage = sellingPrice > 0 ? ((sellingPrice - totalCost) / sellingPrice) * 100 : 0

  // 1. Pricing & Margins (20 points)
  if (grossMarginPercentage > 0) {
    if (grossMarginPercentage >= 70) score += 20
    else if (grossMarginPercentage >= 50) score += 15
    else if (grossMarginPercentage >= 30) score += 10
    else score += 5
  }
  maxScore += 20

  // 2. Market Trend (15 points)
  if (analysis.googleTrends12MonthAverage) {
    score += (analysis.googleTrends12MonthAverage / 100) * 15
  }
  maxScore += 15

  // 3. Search Volume (10 points)
  if (analysis.monthlySearchVolume) {
    if (analysis.monthlySearchVolume >= 10000) score += 10
    else if (analysis.monthlySearchVolume >= 5000) score += 8
    else if (analysis.monthlySearchVolume >= 1000) score += 6
    else score += 3
  }
  maxScore += 10

  // 4. Qualitative Criteria (25 points)
  const qualitativeFields = ['wowFactor', 'simplicity', 'easeOfUse', 'beforeAfterPotential']
  qualitativeFields.forEach(field => {
    if (analysis[field]) {
      score += (analysis[field] / 5) * 5
    }
    maxScore += 5
  })

  // Boolean qualitative criteria (5 points each)
  if (analysis.solvesProblem) score += 5
  if (analysis.isInnovative) score += 5
  maxScore += 10

  // 5. Competition (15 points)
  if (analysis.competitorCount !== null) {
    if (analysis.competitorCount <= 5) score += 15
    else if (analysis.competitorCount <= 10) score += 12
    else if (analysis.competitorCount <= 20) score += 8
    else score += 5
  }
  maxScore += 15

  // 6. Social Proof (10 points)
  if (analysis.averageRating) {
    score += (analysis.averageRating / 5) * 10
  }
  maxScore += 10

  // 7. Market Growth (5 points)
  if (analysis.marketGrowthRate) {
    if (analysis.marketGrowthRate >= 10) score += 5
    else if (analysis.marketGrowthRate >= 5) score += 3
    else score += 1
  }
  maxScore += 5

  // Convert to percentage
  return Math.round((score / maxScore) * 100)
}