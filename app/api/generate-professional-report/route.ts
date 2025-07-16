import { NextResponse } from 'next/server'

// Prevent execution during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { analysisId, regenerate = false } = await request.json()
    
    if (!analysisId) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      )
    }

    // Lazy load Prisma to avoid build-time execution
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Get the analysis
    const analysis = await prisma.productAnalysis.findUnique({
      where: { id: analysisId },
      include: {
        user: true,
        analysisReports: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      )
    }

    // If regenerate is true, delete existing report
    if (regenerate && analysis.analysisReports.length > 0) {
      console.log('🔄 Regenerating report - deleting existing one...')
      await prisma.analysisReport.deleteMany({
        where: { productAnalysisId: analysisId }
      })
    }

    // Calculate final score
    const finalScore = calculateAdvancedScore(analysis)

    // Generate comprehensive AI report
    console.log('🚀 Generating PROFESSIONAL AI report for analysis:', analysis.id)
    const startTime = Date.now()
    const professionalReport = await generateProfessionalReport(analysis, finalScore)
    const processingTime = Date.now() - startTime
    console.log(`✅ Professional report generated in ${processingTime}ms`)

    // Save the comprehensive report
    console.log('💾 Saving professional report to database...')
    const report = await prisma.analysisReport.create({
      data: {
        productAnalysisId: analysis.id,
        userId: analysis.userId,
        finalScore,
        
        // Executive level
        executiveSummary: professionalReport.executiveSummary,
        riskAssessment: typeof professionalReport.riskAssessment === 'string' 
          ? professionalReport.riskAssessment 
          : JSON.stringify(professionalReport.riskAssessment),
        
        // Business Analysis
        customerPersona: typeof professionalReport.customerPersona === 'string' 
          ? professionalReport.customerPersona 
          : JSON.stringify(professionalReport.customerPersona),
        swotAnalysis: professionalReport.swotAnalysis,
        competitiveAnalysis: professionalReport.competitiveAnalysis,
        
        // Market Analysis
        marketAnalysis: professionalReport.marketAnalysis,
        demandValidation: professionalReport.demandValidation,
        
        // Product Strategy
        productTesting: professionalReport.productTesting,
        sourcingStrategy: professionalReport.sourcingStrategy,
        
        // Marketing Strategy
        tiktokStrategy: professionalReport.tiktokStrategy,
        metaAdsStrategy: professionalReport.metaAdsStrategy,
        marketingStrategy: professionalReport.marketingStrategy,
        
        // Operations
        operationalPlan: professionalReport.operationalPlan,
        financialProjections: professionalReport.financialProjections,
        
        // Action Plan
        implementationRoadmap: professionalReport.implementationRoadmap,
        kpiDashboard: professionalReport.kpiDashboard,
        contingencyPlans: professionalReport.contingencyPlans,
        
        // Metadata
        aiModel: 'gemini-1.5-flash',
        generationPrompt: professionalReport.prompt,
        processingTime,
        reportVersion: 'v2.0-professional',
        reportTemplate: 'ecommerce-professional',
        analysisDepth: 'comprehensive',
        industryFocus: 'e-commerce'
      }
    })

    // Update the analysis with the final score
    await prisma.productAnalysis.update({
      where: { id: analysis.id },
      data: { finalScore }
    })

    console.log('✅ Professional report saved successfully:', report.id)
    await prisma.$disconnect()

    return NextResponse.json(report)
  } catch (error) {
    console.error('Error generating professional report:', error)
    return NextResponse.json(
      { error: 'Failed to generate professional report' },
      { status: 500 }
    )
  }
}

function calculateAdvancedScore(analysis: any): number {
  let score = 0
  let maxScore = 0

  // Calculate gross margin percentage
  const totalCost = (analysis.unitPrice || 0) + (analysis.shippingCost || 0) + (analysis.brandingCost || 0)
  const sellingPrice = analysis.desiredSellingPrice || 0
  const grossMarginPercentage = sellingPrice > 0 ? ((sellingPrice - totalCost) / sellingPrice) * 100 : 0

  // 1. Financial Viability (25 points)
  if (grossMarginPercentage > 0) {
    if (grossMarginPercentage >= 70) score += 25
    else if (grossMarginPercentage >= 60) score += 20
    else if (grossMarginPercentage >= 50) score += 15
    else if (grossMarginPercentage >= 40) score += 10
    else score += 5
  }
  maxScore += 25

  // 2. Market Opportunity (20 points)
  if (analysis.googleTrends12MonthAverage) {
    score += (analysis.googleTrends12MonthAverage / 100) * 10
  }
  if (analysis.monthlySearchVolume) {
    if (analysis.monthlySearchVolume >= 50000) score += 10
    else if (analysis.monthlySearchVolume >= 20000) score += 8
    else if (analysis.monthlySearchVolume >= 10000) score += 6
    else if (analysis.monthlySearchVolume >= 5000) score += 4
    else score += 2
  }
  maxScore += 20

  // 3. Product Positioning (20 points)
  const qualitativeFields = ['wowFactor', 'simplicity', 'easeOfUse', 'beforeAfterPotential']
  qualitativeFields.forEach(field => {
    if (analysis[field]) {
      score += (analysis[field] / 5) * 4
    }
    maxScore += 4
  })
  if (analysis.solvesProblem) score += 2
  if (analysis.isInnovative) score += 2
  maxScore += 4

  // 4. Competitive Landscape (15 points)
  if (analysis.competitorCount !== null) {
    if (analysis.competitorCount <= 10) score += 15
    else if (analysis.competitorCount <= 25) score += 12
    else if (analysis.competitorCount <= 50) score += 8
    else score += 4
  }
  maxScore += 15

  // 5. Social Proof & Validation (10 points)
  if (analysis.socialProofStrength) {
    score += (analysis.socialProofStrength / 5) * 5
  }
  if (analysis.averageRating) {
    score += (analysis.averageRating / 5) * 5
  }
  maxScore += 10

  // 6. Growth Potential (10 points)
  if (analysis.marketGrowthRate) {
    if (analysis.marketGrowthRate >= 15) score += 10
    else if (analysis.marketGrowthRate >= 10) score += 8
    else if (analysis.marketGrowthRate >= 5) score += 5
    else score += 2
  }
  maxScore += 10

  // Convert to percentage
  return Math.round((score / maxScore) * 100)
}

async function generateProfessionalReport(analysis: any, finalScore: number) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured')
  }
  
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  // Calculate comprehensive metrics
  const totalCost = (analysis.unitPrice || 0) + (analysis.shippingCost || 0) + (analysis.brandingCost || 0)
  const sellingPrice = analysis.desiredSellingPrice || 0
  const grossMarginPercentage = sellingPrice > 0 ? ((sellingPrice - totalCost) / sellingPrice) * 100 : 0
  const competitorAverage = analysis.competitorPrices?.length 
    ? analysis.competitorPrices.reduce((sum, price) => sum + price, 0) / analysis.competitorPrices.length
    : 0

  const prompt = `
Tu es un CONSULTANT SENIOR en e-commerce avec 20 ans d'expérience. Tu travailles avec des équipes professionnelles qui ont besoin d'analyses approfondies pour lancer des produits physiques rentables.

CONTEXTE BUSINESS:
Nom: ${analysis.productName}
Catégorie: ${analysis.category}
Description: ${analysis.productDescription}
Score Global: ${finalScore}/100

DONNÉES FINANCIÈRES COMPLÈTES:
- Prix unitaire: ${analysis.unitPrice}€ 
- Frais expédition: ${analysis.shippingCost || 0}€
- Coût branding: ${analysis.brandingCost || 0}€
- Coût total: ${totalCost}€
- Prix de vente visé: ${sellingPrice}€
- Marge brute: ${grossMarginPercentage.toFixed(1)}%
- Concurrents (moyenne): ${competitorAverage.toFixed(2)}€
- Investment initial: ${analysis.initialInvestment || 'Non défini'}€
- Budget marketing: ${analysis.marketingBudget || 'Non défini'}€

DONNÉES MARCHÉ & PERFORMANCE:
- Google Trends (12 mois): ${analysis.googleTrends12MonthAverage || 0}/100
- Volume recherche mensuel: ${analysis.monthlySearchVolume || 0}
- Croissance marché: ${analysis.marketGrowthRate || 0}%
- Concurrents directs: ${analysis.competitorCount || 0}
- Saisonnier: ${analysis.isSeasonalProduct ? 'Oui' : 'Non'}

CRITÈRES PRODUIT:
- Facteur WOW: ${analysis.wowFactor || 0}/5
- Simplicité: ${analysis.simplicity || 0}/5 
- Facilité d'usage: ${analysis.easeOfUse || 0}/5
- Potentiel avant/après: ${analysis.beforeAfterPotential || 0}/5
- Résout problème: ${analysis.solvesProblem ? 'Oui' : 'Non'}
- Innovant: ${analysis.isInnovative ? 'Oui' : 'Non'}

LOGISTIQUE & SOCIAL:
- Stock minimum: ${analysis.minimumStock || 0} unités
- Délai livraison: ${analysis.deliveryTime || 0} jours
- Fragile: ${analysis.isFragile ? 'Oui' : 'Non'}
- Force preuve sociale: ${analysis.socialProofStrength || 0}/5
- Note moyenne: ${analysis.averageRating || 0}/5
- Avis moyens: ${analysis.averageReviewCount || 0}

MISSION: Génère un rapport PROFESSIONNEL ultra-détaillé pour une équipe e-commerce expérimentée.

EXIGENCES:
- Analyses basées sur les données réelles fournies
- Recommandations stratégiques actionnables
- Méthodologies concrètes et step-by-step
- KPIs et métriques précises
- Plans d'action avec timelines
- Gestion des risques et scénarios
- Approche data-driven et ROI-focused

Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après.

{
  "executiveSummary": "Résumé exécutif de 200 mots avec recommandation GO/NO-GO claire",
  "riskAssessment": "Texte d'analyse des risques majeurs et probabilités d'échec (STRING uniquement)",
  "customerPersona": "Texte de persona détaillé avec psychographie, comportements, triggers d'achat (STRING uniquement)",
  "swotAnalysis": {
    "strengths": ["Force 1 spécifique", "Force 2 avec métrique", "Force 3 différentiation"],
    "weaknesses": ["Faiblesse 1 + impact", "Faiblesse 2 + mitigation", "Faiblesse 3 + priorité"],
    "opportunities": ["Opportunité 1 + sizing", "Opportunité 2 + timing", "Opportunité 3 + resources"],
    "threats": ["Menace 1 + probabilité", "Menace 2 + impact", "Menace 3 + contremesures"]
  },
  "competitiveAnalysis": {
    "positioning": "Positionnement vs concurrence avec prix et différenciation",
    "advantages": ["Avantage concurrentiel 1", "Avantage 2", "Avantage 3"],
    "threats": ["Menace concurrentielle 1", "Menace 2", "Menace 3"],
    "differentiation": ["Point différenciation 1", "Point 2", "Point 3"]
  },
  "marketAnalysis": {
    "size": "Taille marché estimée avec sources",
    "growth": "Taux croissance et projections 3 ans",
    "trends": ["Tendance 1 + impact", "Tendance 2 + durée", "Tendance 3 + opportunité"],
    "seasonality": "Analyse saisonnalité avec pics et creux"
  },
  "demandValidation": {
    "signals": ["Signal demande 1", "Signal 2", "Signal 3"],
    "risks": ["Risque validation 1", "Risque 2", "Risque 3"],
    "validation_methods": ["Méthode validation 1", "Méthode 2", "Méthode 3"]
  },
  "productTesting": {
    "methodology": "Méthodologie test produit step-by-step pour cette catégorie",
    "quantity": 100,
    "kpis": ["KPI test 1", "KPI 2", "KPI 3"],
    "timeline": "Timeline test avec milestones"
  },
  "sourcingStrategy": {
    "suppliers": ["Critère fournisseur 1", "Critère 2", "Critère 3"],
    "negotiation": ["Tactique négociation 1", "Tactique 2", "Tactique 3"],
    "quality_control": ["Contrôle qualité 1", "Contrôle 2", "Contrôle 3"],
    "logistics": ["Point logistique 1", "Point 2", "Point 3"]
  },
  "tiktokStrategy": {
    "organic": {
      "content_types": ["Type contenu 1", "Type 2", "Type 3"],
      "hooks": ["Hook viral 1", "Hook 2", "Hook 3"],
      "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
      "posting_schedule": "Planning publication optimal"
    },
    "viral_content": {
      "concepts": ["Concept viral 1", "Concept 2", "Concept 3"],
      "triggers": ["Trigger émotionnel 1", "Trigger 2", "Trigger 3"],
      "formats": ["Format 1 + why", "Format 2 + why", "Format 3 + why"]
    },
    "influencers": {
      "tiers": ["Tier influenceur 1", "Tier 2", "Tier 3"],
      "criteria": ["Critère sélection 1", "Critère 2", "Critère 3"],
      "compensation": "Modèles rémunération et négociation"
    }
  },
  "metaAdsStrategy": {
    "audiences": ["Audience 1 + size", "Audience 2 + behavior", "Audience 3 + lookalike"],
    "creatives": ["Creative angle 1", "Creative 2", "Creative 3"],
    "budgets": {
      "daily": "Budget quotidien par campagne",
      "testing": "Budget phase test",
      "scaling": "Budget phase scale"
    },
    "funnels": ["Funnel awareness", "Funnel consideration", "Funnel conversion"]
  },
  "marketingStrategy": {
    "channels": ["Canal priorité 1", "Canal 2", "Canal 3"],
    "budget_allocation": {
      "tiktok": "% budget TikTok + rationale",
      "meta": "% budget Meta + rationale", 
      "google": "% budget Google + rationale",
      "email": "% budget Email + rationale"
    },
    "launch_plan": {
      "phase1": "Phase 1: Pre-launch (semaine 1-2)",
      "phase2": "Phase 2: Launch (semaine 3-4)",
      "phase3": "Phase 3: Scale (semaine 5-8)"
    }
  },
  "operationalPlan": {
    "inventory": {
      "initial_order": "Commande initiale recommandée",
      "reorder_points": "Points de réapprovisionnement",
      "safety_stock": "Stock de sécurité"
    },
    "fulfillment": {
      "3pl_vs_inhouse": "Recommandation 3PL vs interne",
      "shipping_strategy": "Stratégie expédition",
      "returns_process": "Processus retours"
    },
    "customer_service": {
      "channels": ["Canal support 1", "Canal 2", "Canal 3"],
      "response_targets": "Objectifs temps réponse",
      "faq_preparation": "Préparation FAQ courantes"
    }
  },
  "financialProjections": {
    "revenue": {
      "month1": "CA mois 1 + unités",
      "month3": "CA mois 3 + unités",
      "month6": "CA mois 6 + unités",
      "month12": "CA année 1 + unités"
    },
    "costs": {
      "cogs": "Coût marchandises vendues %",
      "marketing": "Coût acquisition client",
      "operations": "Coûts opérationnels %",
      "fixed": "Coûts fixes mensuels"
    },
    "roi": {
      "payback_period": "Période retour investissement",
      "roas_targets": "Objectifs ROAS par canal",
      "break_even": "Point équilibre (unités + CA)"
    }
  },
  "implementationRoadmap": {
    "phases": [
      {
        "name": "Phase 1: Setup (0-4 semaines)",
        "tasks": ["Tâche critique 1", "Tâche 2", "Tâche 3"],
        "deliverables": ["Livrable 1", "Livrable 2", "Livrable 3"]
      },
      {
        "name": "Phase 2: Launch (4-8 semaines)", 
        "tasks": ["Tâche critique 1", "Tâche 2", "Tâche 3"],
        "deliverables": ["Livrable 1", "Livrable 2", "Livrable 3"]
      },
      {
        "name": "Phase 3: Scale (8-16 semaines)",
        "tasks": ["Tâche critique 1", "Tâche 2", "Tâche 3"],
        "deliverables": ["Livrable 1", "Livrable 2", "Livrable 3"]
      }
    ],
    "milestones": ["Milestone 1 + date", "Milestone 2 + critère", "Milestone 3 + validation"],
    "critical_path": "Chemin critique et dépendances"
  },
  "kpiDashboard": {
    "financial": ["KPI financier 1 + target", "KPI 2 + target", "KPI 3 + target"],
    "marketing": ["KPI marketing 1 + target", "KPI 2 + target", "KPI 3 + target"],
    "operational": ["KPI ops 1 + target", "KPI 2 + target", "KPI 3 + target"],
    "monitoring_frequency": "Fréquence monitoring et responsables"
  },
  "contingencyPlans": {
    "low_demand": {
      "triggers": ["Signal demande faible 1", "Signal 2", "Signal 3"],
      "actions": ["Action contingence 1", "Action 2", "Action 3"]
    },
    "high_competition": {
      "triggers": ["Signal concurrence 1", "Signal 2", "Signal 3"],
      "actions": ["Action défensive 1", "Action 2", "Action 3"]
    },
    "supply_issues": {
      "triggers": ["Signal supply 1", "Signal 2", "Signal 3"],
      "actions": ["Action mitigation 1", "Action 2", "Action 3"]
    }
  }
}
`

  try {
    console.log('🤖 Calling Gemini API for professional report...')
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    console.log('🤖 Gemini response received for professional report')
    
    // Clean and parse JSON
    let jsonText = text.replace(/```json|```/g, '').trim()
    
    try {
      const parsedData = JSON.parse(jsonText)
      console.log('✅ Professional report JSON parsed successfully')
      return {
        ...parsedData,
        prompt
      }
    } catch (parseError) {
      console.error('❌ JSON Parse Error in professional report:', parseError)
      console.log('📝 Raw text that failed to parse:', jsonText.substring(0, 500))
      
      // Professional fallback response
      console.log('🔄 Using professional fallback response')
      return {
        executiveSummary: `Produit ${analysis.productName} présente un potentiel ${finalScore >= 70 ? 'ÉLEVÉ' : finalScore >= 50 ? 'MODÉRÉ' : 'FAIBLE'} avec une marge de ${grossMarginPercentage.toFixed(1)}%. Recommandation: ${finalScore >= 60 ? 'GO - Procéder au test marché' : 'PRUDENCE - Optimiser avant lancement'}. Investissement estimé: ${analysis.initialInvestment || 10000}€.`,
        riskAssessment: "Risques principaux: validation marché insuffisante (30%), concurrence agressive (25%), coûts d'acquisition élevés (20%). Mitigation requise avant lancement.",
        customerPersona: `Cible principale: ${analysis.category === 'Beauty' ? 'Femmes 25-40 ans soucieuses de leur apparence' : analysis.category === 'Fitness' ? 'Adultes actifs 25-45 ans' : 'Consommateurs 25-45 ans'}, revenus moyens-élevés, actifs sur réseaux sociaux, recherchent solutions pratiques pour améliorer leur quotidien.`,
        swotAnalysis: {
          strengths: [`Marge attractive: ${grossMarginPercentage.toFixed(1)}%`, "Différenciation produit claire", "Marché accessible digitalement"],
          weaknesses: ["Validation marché limitée", "Dépendance fournisseur unique", "Capital requis important"],
          opportunities: ["Croissance e-commerce", "Marketing digital ciblé", "Expansion internationale possible"],
          threats: ["Nouveaux concurrents", "Évolution algorithmes", "Hausse coûts publicitaires"]
        },
        competitiveAnalysis: {
          positioning: `Positionnement ${competitorAverage > 0 ? (sellingPrice > competitorAverage ? 'premium' : 'compétitif') : 'pionnier'} avec différenciation sur qualité/service`,
          advantages: ["Innovation produit", "Agilité startup", "Marketing digital native"],
          threats: ["Concurrents établis", "Guerre des prix", "Copie produit"],
          differentiation: ["Design unique", "Expérience client premium", "Communication authentique"]
        },
        marketAnalysis: {
          size: `Marché ${analysis.category} estimé à ${analysis.monthlySearchVolume > 10000 ? 'multi-millions' : 'millions'} €/an`,
          growth: `Croissance ${analysis.marketGrowthRate || 5}% annuelle selon tendances secteur`,
          trends: ["Digitalisation accélérée", "Recherche solutions pratiques", "Influence réseaux sociaux"],
          seasonality: analysis.isSeasonalProduct ? "Produit saisonnier - planifier stocks et marketing" : "Demande stable année - avantage opérationnel"
        },
        demandValidation: {
          signals: [`Volume recherche: ${analysis.monthlySearchVolume || 0}/mois`, "Tendance Google positive", "Concurrence active"],
          risks: ["Validation limitée", "Seasonal patterns", "Market saturation"],
          validation_methods: ["Test Facebook Ads", "Landing page validation", "Sondages cible"]
        },
        productTesting: {
          methodology: `1. Commande test 100 unités, 2. Test qualité produit, 3. Test satisfaction client, 4. Validation pricing, 5. Mesure métriques clés`,
          quantity: 100,
          kpis: ["Taux satisfaction >80%", "Taux retour <5%", "NPS >7"],
          timeline: "4 semaines: 1 sem commande, 2 sem test, 1 sem analyse"
        },
        sourcingStrategy: {
          suppliers: ["Certification qualité", "Expérience export", "Capacité production"],
          negotiation: ["MOQ optimal", "Terms payment", "Quality guarantees"],
          quality_control: ["Inspection pre-shipment", "Random sampling", "Customer feedback loop"],
          logistics: ["Expédition air/mer", "Customs clearance", "Warehousing"]
        },
        tiktokStrategy: {
          organic: {
            content_types: ["Before/After videos", "Product demos", "User testimonials"],
            hooks: ["Problem statement", "Unexpected reveal", "Transformation"],
            hashtags: [`#${analysis.category.toLowerCase()}`, "#productivity", "#lifehack"],
            posting_schedule: "2-3 posts/jour heures peak (18h-21h)"
          },
          viral_content: {
            concepts: ["Day in life with product", "Problem solving demo", "Challenge/trend integration"],
            triggers: ["Surprise factor", "Relatability", "FOMO creation"],
            formats: ["Quick tutorials", "Behind scenes", "User reactions"]
          },
          influencers: {
            tiers: ["Micro: 10-100K", "Mid: 100K-1M", "Macro: 1M+"],
            criteria: ["Audience alignment", "Engagement rate >3%", "Content quality"],
            compensation: "Mix produits gratuits + commission + flat fee"
          }
        },
        metaAdsStrategy: {
          audiences: [`Intérêts ${analysis.category}`, "Lookalike clients", "Retargeting website"],
          creatives: ["Video product demo", "Carousel features", "Social proof ads"],
          budgets: {
            daily: "50€/jour phase test, 200€/jour scale",
            testing: "1500€ sur 30 jours",
            scaling: "6000€/mois profitable campaigns"
          },
          funnels: ["TOF: Awareness videos", "MOF: Product education", "BOF: Social proof + offers"]
        },
        marketingStrategy: {
          channels: ["TikTok Organic", "Meta Ads", "Google Ads", "Email Marketing"],
          budget_allocation: {
            tiktok: "40% - Forte ROI organique",
            meta: "35% - Audience mature",
            google: "20% - Intent élevé",
            email: "5% - Retention"
          },
          launch_plan: {
            phase1: "Semaines 1-2: Setup campaigns, test creatives",
            phase2: "Semaines 3-4: Launch full campaigns, optimize",
            phase3: "Semaines 5-8: Scale winning campaigns, expand"
          }
        },
        operationalPlan: {
          inventory: {
            initial_order: `${analysis.minimumStock || 500} unités first order`,
            reorder_points: "30 jours stock restant",
            safety_stock: "15 jours buffer stock"
          },
          fulfillment: {
            "3pl_vs_inhouse": "3PL recommended pour focus marketing",
            shipping_strategy: "Standard + Express options",
            returns_process: "30 jours return policy"
          },
          customer_service: {
            channels: ["Email priority", "Chat website", "Social media"],
            response_targets: "<24h email, <2h chat",
            faq_preparation: "Top 20 questions preparation"
          }
        },
        financialProjections: {
          revenue: {
            month1: `${Math.round(sellingPrice * 50)}€ (50 unités)`,
            month3: `${Math.round(sellingPrice * 200)}€ (200 unités)`,
            month6: `${Math.round(sellingPrice * 500)}€ (500 unités)`,
            month12: `${Math.round(sellingPrice * 1500)}€ (1500 unités)`
          },
          costs: {
            cogs: `${(100 - grossMarginPercentage).toFixed(1)}%`,
            marketing: "30% CA",
            operations: "10% CA",
            fixed: "2000€/mois"
          },
          roi: {
            payback_period: "6-8 mois",
            roas_targets: "TikTok: 4:1, Meta: 3:1, Google: 5:1",
            break_even: `${Math.round(15000 / (sellingPrice - totalCost))} unités`
          }
        },
        implementationRoadmap: {
          phases: [
            {
              name: "Phase 1: Setup (0-4 semaines)",
              tasks: ["Sourcing finalization", "Branding completion", "Website launch"],
              deliverables: ["Product samples", "Brand guidelines", "E-commerce site"]
            },
            {
              name: "Phase 2: Launch (4-8 semaines)",
              tasks: ["Inventory ordering", "Marketing campaigns", "Fulfillment setup"],
              deliverables: ["Stock received", "Campaigns live", "Orders flowing"]
            },
            {
              name: "Phase 3: Scale (8-16 semaines)",
              tasks: ["Performance optimization", "Channel expansion", "Team building"],
              deliverables: ["Profitable scaling", "Multi-channel presence", "Team hired"]
            }
          ],
          milestones: ["First sale: Week 5", "Break-even: Month 6", "1000 customers: Month 8"],
          critical_path: "Sourcing → Branding → Marketing → Sales → Scale"
        },
        kpiDashboard: {
          financial: [`ROAS >3:1`, `CAC <${Math.round(sellingPrice * 0.3)}€`, `Margin >50%`],
          marketing: ["CTR >2%", "CVR >3%", "CPC <1€"],
          operational: ["Fulfillment <48h", "Return rate <5%", "Customer satisfaction >4.5/5"],
          monitoring_frequency: "Daily: ads performance, Weekly: business metrics, Monthly: strategic review"
        },
        contingencyPlans: {
          low_demand: {
            triggers: ["ROAS <2:1 after 2 weeks", "CVR <1%", "High CAC"],
            actions: ["Creative refresh", "Audience optimization", "Pricing adjustment"]
          },
          high_competition: {
            triggers: ["CPC increase >50%", "Market share decline", "New competitor launch"],
            actions: ["USP reinforcement", "Exclusive partnerships", "Product innovation"]
          },
          supply_issues: {
            triggers: ["Supplier delays", "Quality issues", "Stock shortage"],
            actions: ["Backup supplier activation", "Quality control reinforcement", "Inventory buffers"]
          }
        },
        prompt
      }
    }
  } catch (error) {
    console.error('Error generating professional report:', error)
    throw error
  }
}