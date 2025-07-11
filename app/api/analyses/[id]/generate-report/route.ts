import { NextResponse } from 'next/server'

// Prevent execution during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Lazy load Prisma to avoid build-time execution
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Get the analysis
    const analysis = await prisma.productAnalysis.findUnique({
      where: { id: params.id },
      include: {
        user: true
      }
    })

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      )
    }

    // Calculate final score
    const finalScore = calculateFinalScore(analysis)

    // Generate AI report
    const aiReport = await generateAIReport(analysis, finalScore)

    // Save the report
    const report = await prisma.analysisReport.create({
      data: {
        productAnalysisId: analysis.id,
        userId: analysis.userId,
        finalScore,
        customerPersona: aiReport.customerPersona,
        swotAnalysis: aiReport.swotAnalysis,
        marketingStrategy: aiReport.marketingStrategy,
        operationalRecommendations: aiReport.operationalRecommendations,
        aiModel: 'gemini-1.5-flash',
        generationPrompt: aiReport.prompt
      }
    })

    // Update the analysis with the final score
    await prisma.productAnalysis.update({
      where: { id: analysis.id },
      data: { finalScore }
    })

    await prisma.$disconnect()

    return NextResponse.json(report)
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
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

async function generateAIReport(analysis: any, finalScore: number) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured')
  }
  
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  // Calculate gross margin percentage
  const totalCost = (analysis.unitPrice || 0) + (analysis.shippingCost || 0) + (analysis.brandingCost || 0)
  const sellingPrice = analysis.desiredSellingPrice || 0
  const grossMarginPercentage = sellingPrice > 0 ? ((sellingPrice - totalCost) / sellingPrice) * 100 : 0

  const prompt = `
Tu es un expert consultant en e-commerce avec 15 ans d'expérience dans l'analyse produit et la stratégie marketing. Tu travailles avec des entrepreneurs ambitieux qui veulent lancer des produits rentables.

CONTEXTE PRODUIT:
Nom: ${analysis.productName}
Catégorie: ${analysis.category}
Description: ${analysis.productDescription}
Score global: ${finalScore}/100

DONNÉES FINANCIÈRES:
- Prix d'achat unitaire: ${analysis.unitPrice}€
- Prix de vente visé: ${analysis.desiredSellingPrice}€
- Frais de livraison: ${analysis.shippingCost}€
- Coût de branding: ${analysis.brandingCost}€
- Marge brute: ${grossMarginPercentage.toFixed(1)}%

DONNÉES MARCHÉ:
- Tendance Google (12 mois): ${analysis.googleTrends12MonthAverage}/100
- Volume de recherche mensuel: ${analysis.monthlySearchVolume}
- Nombre de concurrents directs: ${analysis.competitorCount}

CRITÈRES QUALITATIFS:
- Impact wow: ${analysis.wowFactor}/5
- Simplicité d'explication: ${analysis.simplicity}/5
- Facilité d'utilisation: ${analysis.easeOfUse}/5
- Résout un vrai problème: ${analysis.solvesProblem ? 'Oui' : 'Non'}
- Caractère innovant: ${analysis.isInnovative ? 'Oui' : 'Non'}

MISSION: Génère un rapport d'analyse DÉTAILLÉ et STRATÉGIQUE.

IMPORTANT: Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après.

Format JSON exact:
{
  "customerPersona": "string détaillé",
  "swotAnalysis": {
    "strengths": ["point 1", "point 2", "point 3"],
    "weaknesses": ["point 1", "point 2", "point 3"], 
    "opportunities": ["point 1", "point 2", "point 3"],
    "threats": ["point 1", "point 2", "point 3"]
  },
  "marketingStrategy": {
    "channels": ["canal 1", "canal 2", "canal 3"],
    "budget": "string",
    "launchPlan": "string"
  },
  "operationalRecommendations": {
    "testQuantity": 100,
    "vigilancePoints": ["point 1", "point 2", "point 3"]
  }
}

N'ajoute AUCUN texte explicatif, UNIQUEMENT le JSON.
`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Clean and parse JSON
    let jsonText = text.replace(/```json|```/g, '').trim()
    
    try {
      const parsedData = JSON.parse(jsonText)
      return {
        ...parsedData,
        prompt
      }
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      
      // Fallback response
      return {
        customerPersona: "Homme ou femme âgé de 25-45 ans, actif sur les réseaux sociaux, à la recherche de solutions pratiques pour améliorer son quotidien.",
        swotAnalysis: {
          strengths: ["Produit innovant", "Marge attractive", "Marché en croissance"],
          weaknesses: ["Concurrence établie", "Validation marché nécessaire", "Coûts d'acquisition élevés"],
          opportunities: ["Tendance positive", "Marché digital", "Partenariats influenceurs"],
          threats: ["Nouveaux concurrents", "Évolution préférences", "Changements algorithmes"]
        },
        marketingStrategy: {
          channels: ["Facebook Ads", "TikTok Ads", "Google Ads"],
          budget: "Budget initial recommandé: 5000€/mois",
          launchPlan: "Lancement en 3 phases: test, optimisation, scale"
        },
        operationalRecommendations: {
          testQuantity: 100,
          vigilancePoints: ["Surveiller métriques performance", "Valider qualité produit", "Optimiser coûts logistiques"]
        },
        prompt
      }
    }
  } catch (error) {
    console.error('Error generating AI report:', error)
    throw error
  }
}