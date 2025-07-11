import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Function to get Prisma client - avoid global instantiation
function getPrismaClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured')
  }
  return new PrismaClient({
    errorFormat: 'minimal'
  })
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  let prisma: PrismaClient | null = null
  
  try {
    // Check if required environment variables are available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    // Initialize Prisma client
    prisma = getPrismaClient()

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

    return NextResponse.json(report)
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  } finally {
    // Clean up Prisma client
    if (prisma) {
      await prisma.$disconnect()
    }
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
      score += (analysis[field] / 5) * 5 // Each field worth 5 points
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
- Point d'équilibre: ${analysis.breakEvenPoint} unités
- Taux de retour estimé: ${analysis.estimatedReturnRate}%

DONNÉES MARCHÉ:
- Tendance Google (12 mois): ${analysis.googleTrends12MonthAverage}/100
- Volume de recherche mensuel: ${analysis.monthlySearchVolume}
- Produit saisonnier: ${analysis.isSeasonalProduct ? 'Oui' : 'Non'}
- Croissance du marché: ${analysis.marketGrowthRate}%
- Popularité réseaux sociaux: ${analysis.socialMediaPopularity}

ANALYSE CONCURRENTIELLE:
- Nombre de concurrents directs: ${analysis.competitorCount}
- Niveau de concurrence: ${analysis.competitionLevel}/5
- Analyse des concurrents: ${analysis.competitorAdsAnalysis}
- Prix des concurrents: ${analysis.competitorPrices}

CRITÈRES QUALITATIFS:
- Impact wow: ${analysis.wowFactor}/5
- Simplicité d'explication: ${analysis.simplicity}/5
- Facilité d'utilisation: ${analysis.easeOfUse}/5
- Résout un vrai problème: ${analysis.solvesProblem ? 'Oui' : 'Non'}
- Caractère innovant: ${analysis.isInnovative ? 'Oui' : 'Non'}
- Potentiel avant/après: ${analysis.beforeAfterPotential}/5

DONNÉES LOGISTIQUES:
- Stock minimum: ${analysis.minimumStock}
- Délai de livraison: ${analysis.deliveryTime} jours
- Coût de stockage unitaire: ${analysis.storageCostPerUnit}€
- Produit fragile: ${analysis.isFragile ? 'Oui' : 'Non'}
- Variantes disponibles: ${analysis.availableVariants}

SOCIAL PROOF:
- Force de la preuve sociale: ${analysis.socialProofStrength}/5
- Nombre d'avis moyens: ${analysis.averageReviewCount}
- Note moyenne: ${analysis.averageRating}/5
- Taux d'engagement: ${analysis.socialEngagementRate}%
- Observations UGC: ${analysis.ugcObservations}

STRATÉGIE COMMERCIALE:
- Investissement initial: ${analysis.initialInvestment}€
- Budget marketing: ${analysis.marketingBudget}€
- Taux de croissance marché: ${analysis.marketGrowthRate}%
- Niveau barrières légales: ${analysis.legalBarriersLevel}/5
- Notes stratégiques: ${analysis.strategicNotes}

MISSION: Génère un rapport d'analyse ULTRA-DÉTAILLÉ et STRATÉGIQUE destiné à des professionnels du e-commerce. Sois précis, actionnable et sans complaisance.

STRUCTURE ATTENDUE:

1. PERSONA CLIENT DÉTAILLÉ (200 mots minimum)
- Démographie précise (âge, genre, revenu, éducation)
- Psychographie (valeurs, motivations, peurs)
- Comportement d'achat (où, quand, comment)
- Pain points spécifiques que ce produit résout
- Objections potentielles et comment les surmonter

2. ANALYSE SWOT APPROFONDIE
- Forces (6 points minimum avec explication)
- Faiblesses (6 points minimum avec impact business)
- Opportunités (6 points minimum avec potentiel chiffré)
- Menaces (6 points minimum avec stratégies de mitigation)

3. ANALYSE CONCURRENTIELLE STRATÉGIQUE
- Positionnement vs concurrents
- Avantages concurrentiels identifiés
- Vulnérabilités à exploiter
- Stratégies de différenciation
- Analyse des prix et recommandations

4. STRATÉGIE MARKETING MULTI-CANAL
- 5 canaux d'acquisition prioritaires avec budget suggéré
- 5 angles créatifs avec exemples de messages
- Stratégie de contenu (types, fréquence, plateformes)
- Influenceurs et partenariats recommandés
- Calendrier de lancement sur 90 jours

5. RECOMMANDATIONS OPÉRATIONNELLES PRÉCISES
- Quantité de test initiale avec justification
- Stratégie d'inventaire et saisonnalité
- Optimisations produit/packaging recommandées
- 8 points de vigilance critiques
- KPIs à surveiller et seuils d'alerte

6. PROJECTION FINANCIÈRE
- Scénarios optimiste/réaliste/pessimiste
- Investissement initial requis
- Retour sur investissement prévu
- Seuils de rentabilité
- Risques financiers majeurs

7. PLAN D'ACTION 90 JOURS
- Actions semaine par semaine
- Milestones et objectifs mesurables
- Ressources nécessaires
- Budget détaillé par poste

IMPORTANT: Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après. Commence directement par { et termine par }.

Format JSON exact:
{
  "customerPersona": "string détaillé",
  "swotAnalysis": {
    "strengths": ["point 1", "point 2", ...],
    "weaknesses": ["point 1", "point 2", ...], 
    "opportunities": ["point 1", "point 2", ...],
    "threats": ["point 1", "point 2", ...]
  },
  "competitiveAnalysis": {
    "positioning": "string",
    "advantages": ["avantage 1", "avantage 2", ...],
    "vulnerabilities": ["vulnérabilité 1", "vulnérabilité 2", ...],
    "differentiation": ["différence 1", "différence 2", ...],
    "priceStrategy": "string"
  },
  "marketingStrategy": {
    "channels": ["canal 1", "canal 2", ...],
    "angles": ["angle 1", "angle 2", ...],
    "contentStrategy": "string",
    "budget": "string",
    "launchPlan": "string"
  },
  "operationalRecommendations": {
    "testQuantity": nombre,
    "inventoryStrategy": "string",
    "kpis": ["kpi 1", "kpi 2", ...],
    "vigilancePoints": ["point 1", "point 2", ...]
  },
  "financialProjection": {
    "optimistic": "string",
    "realistic": "string", 
    "pessimistic": "string",
    "initialInvestment": "string",
    "roi": "string"
  },
  "actionPlan90Days": {
    "weeks1to4": "string",
    "weeks5to8": "string",
    "weeks9to12": "string"
  }
}

N'ajoute AUCUN texte explicatif, UNIQUEMENT le JSON.
`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Extract and clean JSON from response
    let jsonText = text
    
    // First try to find JSON block between ```json and ```
    const jsonBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
    if (jsonBlockMatch) {
      jsonText = jsonBlockMatch[1]
    } else {
      // Try to find JSON object in the text
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonText = jsonMatch[0]
      }
    }
    
    // Clean up common JSON issues
    jsonText = jsonText
      .replace(/,\s*}/g, '}') // Remove trailing commas before }
      .replace(/,\s*]/g, ']') // Remove trailing commas before ]
      .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Quote unquoted keys
      .replace(/:\s*'([^']*)'/g, ': "$1"') // Replace single quotes with double quotes
      .replace(/\\n/g, ' ') // Replace literal \n with spaces
      .replace(/\n/g, ' ') // Replace actual newlines with spaces
      .replace(/\r/g, '') // Remove carriage returns
      .replace(/\t/g, ' ') // Replace tabs with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
    
    try {
      const parsedData = JSON.parse(jsonText)
      return {
        ...parsedData,
        prompt
      }
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      console.log('Problematic JSON:', jsonText.substring(0, 500) + '...')
      
      // If parsing fails, try with a more aggressive cleanup
      const cleanedJson = jsonText
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas more aggressively
        .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":') // Quote all keys
        .replace(/:\s*([^",{\[\]\d\-][^,}\]]*?)(\s*[,}\]])/g, ': "$1"$2') // Quote unquoted string values
      
      try {
        const parsedData = JSON.parse(cleanedJson)
        return {
          ...parsedData,
          prompt
        }
      } catch (secondParseError) {
        console.error('Second JSON Parse Error:', secondParseError)
        console.log('Second attempt JSON:', cleanedJson.substring(0, 500) + '...')
        
        // If still failing, fall back to the hardcoded response
        throw secondParseError
      }
    }
    
    // Fallback if JSON parsing fails
    return {
      customerPersona: "Homme ou femme âgé de 25-45 ans, actif sur les réseaux sociaux, à la recherche de solutions pratiques pour améliorer son quotidien. Ce profil type dispose d'un revenu moyen à élevé et privilégie les achats en ligne. Il est influencé par les tendances, les avis clients et recherche des produits qui offrent un gain de temps ou d'efficacité. Ses principales objections concernent la qualité, le prix et la livraison.",
      swotAnalysis: {
        strengths: ["Produit innovant avec potentiel de différenciation", "Marge brute attractive permettant un marketing agressif", "Marché en croissance avec demande soutenue", "Simplicité d'utilisation favorisant l'adoption", "Potentiel viral sur les réseaux sociaux", "Résolution d'un problème réel identifié"],
        weaknesses: ["Concurrence établie avec budgets importants", "Validation marché nécessaire avant scale", "Dépendance aux plateformes publicitaires", "Risque de copie par la concurrence", "Coûts d'acquisition clients potentiellement élevés", "Nécessité d'investissement initial significatif"],
        opportunities: ["Tendance positive sur 12 mois confirmée", "Marché digital en expansion constante", "Possibilité de cross-sell avec produits complémentaires", "Partenariats influenceurs accessibles", "Optimisation SEO pour réduire les coûts", "Expansion internationale possible"],
        threats: ["Nouveaux concurrents avec capitaux importants", "Évolution des préférences consommateurs", "Changements d'algorithmes publicitaires", "Augmentation des coûts d'acquisition", "Réglementation plus stricte possible", "Crise économique affectant le pouvoir d'achat"]
      },
      competitiveAnalysis: {
        positioning: "Positionnement premium avec focus sur la qualité et l'innovation",
        advantages: ["Prix compétitif", "Meilleure expérience utilisateur", "Marketing différencié"],
        vulnerabilities: ["Concurrents établis", "Budgets marketing limités"],
        differentiation: ["Innovation produit", "Service client supérieur", "Branding moderne"],
        priceStrategy: `Prix recommandé: ${analysis.desiredSellingPrice}€ (optimisé pour la marge)`
      },
      marketingStrategy: {
        channels: ["Facebook Ads (30% budget)", "TikTok Ads (25% budget)", "Google Ads (20% budget)", "Influenceurs (15% budget)", "Email Marketing (10% budget)"],
        angles: ["Résolution de problème spécifique", "Transformation avant/après", "Innovation et modernité", "Gain de temps/efficacité", "Tendance et popularité"],
        contentStrategy: "Contenu vidéo démonstratif 3x/semaine, témoignages clients, tutoriels d'utilisation",
        budget: "Budget initial recommandé: 5000€/mois pour les tests",
        launchPlan: "Lancement en 3 phases: test (30 jours), optimisation (30 jours), scale (30 jours)"
      },
      operationalRecommendations: {
        testQuantity: Math.max(100, Math.round((analysis.initialInvestment || 1000) / (analysis.unitPrice || 10))),
        inventoryStrategy: "Stock de sécurité: 60 jours, réapprovisionnement automatique",
        kpis: ["CAC (coût d'acquisition)", "LTV (lifetime value)", "Taux de conversion", "ROAS (retour sur investissement publicitaire)"],
        vigilancePoints: ["Surveiller les métriques de performance quotidiennement", "Valider la qualité produit avec chaque lot", "Optimiser les coûts logistiques", "Monitorer la concurrence et leurs stratégies", "Analyser les retours clients pour améliorer", "Respecter les réglementations produit", "Diversifier les canaux d'acquisition", "Préparer la gestion des pics saisonniers"]
      },
      financialProjection: {
        optimistic: `CA mensuel: ${Math.round(analysis.desiredSellingPrice * analysis.monthlySearchVolume * 0.02)}€`,
        realistic: `CA mensuel: ${Math.round(analysis.desiredSellingPrice * analysis.monthlySearchVolume * 0.01)}€`,
        pessimistic: `CA mensuel: ${Math.round(analysis.desiredSellingPrice * analysis.monthlySearchVolume * 0.005)}€`,
        initialInvestment: `Investissement initial recommandé: ${Math.round(analysis.unitPrice * 200 + 5000)}€`,
        roi: "ROI attendu: 150-300% sur 12 mois"
      },
      actionPlan90Days: {
        weeks1to4: "Finaliser le sourcing, créer le branding, lancer les campagnes test",
        weeks5to8: "Optimiser les campagnes, recueillir les feedbacks, ajuster la stratégie",
        weeks9to12: "Scaler les campagnes rentables, diversifier les canaux, préparer la phase 2"
      },
      prompt
    }
  } catch (error) {
    console.error('Error generating AI report:', error)
    throw error
  }
}