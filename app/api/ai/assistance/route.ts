import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// ============================================
// SYSTÈME DE PROMPTS DYNAMIQUES CONTEXTUELS
// ============================================
function generateContextualGuidancePrompt(section: string, field: string, context: any): string {
  const { productName, category, description } = context
  
  // Template de base pour tous les prompts contextuels
  const baseContext = `
    Tu es un expert en analyse de produits e-commerce spécialisé dans le marché canadien.
    
    CONTEXTE PRODUIT:
    - Nom: "${productName || 'produit non défini'}"
    - Catégorie: "${category || 'catégorie non définie'}"
    - Description: "${description || 'description non disponible'}"
    
    OBJECTIF: Fournir une aide personnalisée, actionnable et précise pour le champ "${field}" de la section "${section}".
    
    STYLE DE RÉPONSE:
    - Ton direct et professionnel comme un consultant expert
    - Instructions étape par étape très concrètes
    - Utilise les informations du produit pour personnaliser tes conseils
    - Format: Action Guidée avec des étapes numérotées
    - Maximum 200 mots, focalisé sur l'action
  `

  // Prompts spécialisés par section/champ
  switch (`${section}-${field}`) {
    // SECTION ESSENTIAL
    case 'essential-productName':
      return `${baseContext}
      
      💡 AIDE PERSONNALISÉE - Optimisation du nom de produit
      
      Basé sur "${productName}" dans la catégorie "${category}", voici des conseils spécifiques:
      
      Action Guidée:
      1. Vérifie que ton nom contient le bénéfice principal (ex: "correcteur", "automatique", "intelligent")
      2. Teste ces variantes: "${productName || '[NomProduit]'} Pro", "${productName || '[NomProduit]'} Expert", "${productName || '[NomProduit]'} Premium"
      3. Recherche sur Amazon.ca: tape "${productName}" et note les noms similaires dans les 5 premiers résultats
      4. Évite les noms trop génériques - ajoute un élément unique qui différencie
      
      🎯 Pour ${category}: privilégie les mots qui évoquent la solution/transformation rather que la description technique.`
      
    case 'essential-sourcing':
      return `${baseContext}
      
      🔍 AIDE PERSONNALISÉE - Recherche fournisseur pour "${productName}"
      
      Action Guidée spécifique à votre produit:
      1. Ouvre Alibaba.com et tape exactement ces termes: "${productName?.toLowerCase().replace(/\s+/g, ' ')}", puis "${category?.toLowerCase()} supplier"
      2. Applique ces filtres:
         - Trade Assurance: OUI
         - Supplier Assessment: 4+ étoiles  
         - Years in Industry: 5+ ans
      3. Cherche ces certifications selon votre catégorie ${category}: CE, FDA, RoHS
      4. Contacte 3-5 fournisseurs avec ce message type: "Hello, interested in ${productName} for Canadian market. Please send: MOQ, pricing for 100/500/1000 units, lead time, and quality certificates."
      
      💡 Astuce catégorie ${category}: Focus sur les fournisseurs avec expérience export Canada/US.`

    // SECTION MARKET-TREND  
    case 'market-trend-googleTrends':
      return `${baseContext}
      
      📈 AIDE PERSONNALISÉE - Analyse Google Trends pour "${productName}"
      
      Action Guidée:
      1. Va sur trends.google.com
      2. Tape exactement ces termes UN PAR UN:
         - "${productName}"
         - Mots-clés dérivés pour ${category}: [génère 2-3 termes basés sur le nom/catégorie]
      3. Réglages obligatoires:
         - Région: Canada 
         - Période: 12 derniers mois
         - Catégorie: ${category}
      4. Note la moyenne des pics (si >40 = bon signe, >60 = excellent)
      5. Vérifie les "Requêtes associées" pour découvrir d'autres variantes populaires
      
      🎯 Pour "${productName}" cherche spécialement les tendances autour de [mots-clés saisonniers basés sur la catégorie].`

    // SECTION COMPETITION
    case 'competition-competitionLevel':
      return `${baseContext}
      
      🎯 AIDE PERSONNALISÉE - Analyse concurrentielle "${productName}"
      
      Action Guidée:
      1. Recherche Amazon.ca: tape "${productName}" exactement
      2. Compte les produits similaires dans les 2 premières pages (40 résultats)
      3. Note ces métriques pour les 5 premiers:
         - Prix moyen
         - Nombre d'avis
         - Rating moyen
      4. Recherche Google: "${productName} Canada" + "acheter"
      5. Échelle de concurrence:
         - <10 concurrents = Faible (Score: 4-5)
         - 10-25 = Modérée (Score: 3)  
         - >25 = Élevée (Score: 1-2)
      
      💡 Pour ${category}: les marchés avec beaucoup de variations de produits = concurrence saine, pas forcément négative.`

    // SECTION PRICING
    case 'pricing-unitPrice':
      return `${baseContext}
      
      💰 AIDE PERSONNALISÉE - Prix unitaire optimal "${productName}"
      
      Action Guidée:
      1. Recherche Alibaba: tape "${productName}" 
      2. Note les prix MOQ 100, 500, 1000 unités des 5 premiers fournisseurs
      3. Calcule la moyenne et ajoute 15% (frais import/douane Canada)
      4. Pour ${category}, marge recommandée: [donne pourcentage basé sur catégorie]
      5. Prix final suggéré: [Prix Alibaba] × 1.15 × [Multiplicateur catégorie]
      
      🎯 Référence marché ${category}: vérifie que ton prix final reste dans le range [fourchette de prix typique pour cette catégorie] pour être compétitif au Canada.`

    case 'pricing-shipping':
      return `${baseContext}
      
      🚢 AIDE PERSONNALISÉE - Coûts d'expédition pour "${productName}"
      
      Action Guidée:
      1. Estime le poids de ton produit ${category} (consulte des produits similaires)
      2. Va sur le site d'un transitaire (ex: Freightos.com)
      3. Simule expédition Chine → Canada pour ce poids
      4. Compare: Sea freight (20-40 jours, moins cher) vs Air freight (3-7 jours, plus cher)
      5. Ajoute 10-15% pour frais de dédouanement
      
      💡 Pour ${category}: privilégie l'expédition maritime si pas urgent, divise par quantité commandée pour obtenir le coût unitaire.`

    case 'pricing-branding':
      return `${baseContext}
      
      🎨 AIDE PERSONNALISÉE - Coûts de branding pour "${productName}"
      
      Action Guidée:
      1. Logo personnalisé: demande à ton fournisseur les coûts de gravure/impression
      2. Packaging custom: généralement 0.20-2.00 CAD par unité selon complexité
      3. Pour ${category}: vérifie si l'étiquetage français est obligatoire (souvent oui au Canada)
      4. Calcule: (Coût setup logo + coût packaging par unité) = coût branding unitaire
      
      🎯 Astuce: négocie le coût de setup du logo si tu commandes plus de 500 unités.`

    case 'pricing-sellingPrice':
      return `${baseContext}
      
      💵 AIDE PERSONNALISÉE - Prix de vente optimal pour "${productName}"
      
      Basé sur tes coûts actuels, voici ta stratégie:
      
      Action Guidée:
      1. Applique la règle des marges ${category}: minimum 60% pour produits physiques
      2. Vérifie les prix concurrents sur Amazon.ca en tapant "${productName}"
      3. Positionne-toi: Premium (+20% vs concurrence), Standard (prix moyen), ou Économique (-15%)
      4. Teste prix psychologiques: 39.99 vs 40.00 (impact majeur sur conversions)
      
      🎯 Pour ${category} au Canada: sweet spot généralement entre [fourchette de prix recommandée].`

    case 'pricing-competitorPrices':
      return `${baseContext}
      
      🔍 AIDE PERSONNALISÉE - Analyse prix concurrents "${productName}"
      
      Action Guidée:
      1. Amazon.ca: tape "${productName}" et note les 5 premiers prix
      2. Google Shopping Canada: cherche "${productName} Canada"
      3. Shopify stores: tape "${productName}" site:shopify.com
      4. Walmart.ca et Costco.ca: vérifie s'ils vendent des produits similaires
      5. Calcule la moyenne et identifie le prix le plus bas/haut
      
      💡 Ignore les prix aberrants (très bas = qualité douteuse, très haut = luxe premium).`

    // SECTION QUALITATIVE
    case 'qualitative-wowFactor':
      return `${baseContext}
      
      ✨ AIDE PERSONNALISÉE - Facteur WOW de "${productName}"
      
      Évalue objectivement ton produit:
      
      Action Guidée:
      1. Montre une photo/description à 5 personnes: notent-elles une réaction immédiate ?
      2. Demande-toi: "Est-ce que je dirais WOW en voyant ce produit pour la première fois ?"
      3. Compare à des innovations récentes en ${category}: ton produit surprend-t-il autant ?
      4. Test réseaux sociaux: publie une image et mesure l'engagement (likes, commentaires)
      
      💡 Score 5: révolutionnaire, Score 3: très intéressant, Score 1: basique mais utile.`

    case 'qualitative-simplicity':
      return `${baseContext}
      
      🎯 AIDE PERSONNALISÉE - Simplicité de "${productName}"
      
      Test de clarté immédiate:
      
      Action Guidée:
      1. Écris en 1 phrase ce que fait ton produit
      2. Fais le test des 10 secondes: quelqu'un comprend-il l'usage en 10 sec ?
      3. Pour ${category}: évite le jargon technique, privilégie les bénéfices simples
      4. Test grand-mère: ta grand-mère comprendrait-elle à quoi ça sert ?
      
      🎯 Plus c'est simple à expliquer, plus c'est facile à vendre !`

    case 'qualitative-easeOfUse':
      return `${baseContext}
      
      🔧 AIDE PERSONNALISÉE - Facilité d'utilisation "${productName}"
      
      Évaluation praticité:
      
      Action Guidée:
      1. Compte les étapes nécessaires pour utiliser ton produit
      2. Y a-t-il besoin d'un manuel ? (Si oui, score automatiquement ≤ 3)
      3. Pour ${category}: compare avec les leaders du marché en simplicité
      4. Test utilisateur: fais tester à quelqu'un sans explication préalable
      
      💡 Objectif: utilisable immédiatement sans formation = Score 5.`

    case 'qualitative-beforeAfterPotential':
      return `${baseContext}
      
      📸 AIDE PERSONNALISÉE - Potentiel avant/après "${productName}"
      
      Test de transformation visible:
      
      Action Guidée:
      1. Peux-tu prendre 2 photos: avant et après utilisation du produit ?
      2. La différence est-elle visible et impressionnante ?
      3. Pour ${category}: identifie les transformations possibles (physiques, esthétiques, pratiques)
      4. Cherche sur Instagram/TikTok: y a-t-il des posts avant/après pour des produits similaires ?
      
      🎯 Plus la transformation est visible, plus le potentiel viral est élevé !`

    case 'qualitative-solvesProblem':
      return `${baseContext}
      
      💡 AIDE PERSONNALISÉE - Résolution de problème "${productName}"
      
      Validation du problème:
      
      Action Guidée:
      1. Définis le problème exact que résout ton produit en 1 phrase
      2. Ce problème arrive-t-il souvent ? (quotidien = excellent, rare = mauvais)
      3. Pour ${category}: identifie les frustrations communes de ta cible
      4. Test validé: 8/10 personnes de ta cible confirment-elles avoir ce problème ?
      
      🎯 Sans vrai problème, pas de vraies ventes !`

    case 'qualitative-isInnovative':
      return `${baseContext}
      
      🚀 AIDE PERSONNALISÉE - Innovation de "${productName}"
      
      Test d'innovation:
      
      Action Guidée:
      1. Compare aux 5 leaders actuels en ${category}: qu'apportes-tu de nouveau ?
      2. Innovation peut être: technologique, design, prix, expérience utilisateur
      3. Recherche brevets: ton innovation existe-t-elle déjà ?
      4. Test marché: peux-tu dire "le premier X qui fait Y" ?
      
      💡 L'innovation n'est pas obligatoire, mais elle aide à percer plus facilement.`

    // SECTION LOGISTICS
    case 'logistics-fragile':
      return `${baseContext}
      
      📦 AIDE PERSONNALISÉE - Fragilité "${productName}"
      
      Évaluation robustesse:
      
      Action Guidée:
      1. Matériaux: verre, plastique fin, électronique = potentiellement fragile
      2. Test chute: résiste-t-il à une chute de 1 mètre ?
      3. Pour ${category}: vérifie les standards de résistance du secteur
      4. Impact shipping: fragile = emballage renforcé = coûts +30-50%
      
      🎯 Fragile = plus de retours, plus de SAV, emballage premium requis.`

    case 'logistics-variants':
      return `${baseContext}
      
      🎨 AIDE PERSONNALISÉE - Variantes "${productName}"
      
      Stratégie variantes:
      
      Action Guidée:
      1. Analyse les concurrents: quelles variantes proposent-ils ?
      2. Pour ${category}: couleurs populaires, tailles standards, modèles demandés
      3. Start simple: 2-3 variantes max pour commencer
      4. Évite: trop de choix = paralysie d'achat (paradox of choice)
      
      💡 Chaque variante = stock séparé à gérer, commence minimal et expand selon la demande.`

    // SECTION SOCIAL-PROOF
    case 'social-proof-socialProofStrength':
      return `${baseContext}
      
      👥 AIDE PERSONNALISÉE - Force preuve sociale "${productName}"
      
      Évaluation réaliste:
      
      Action Guidée:
      1. Recherche TikTok/Instagram: hashtag "${productName.toLowerCase()}" ou mots-clés
      2. Compte les posts organiques (non sponsorisés) des 30 derniers jours
      3. Pour ${category}: compare avec des produits à succès du secteur
      4. Vérifie YouTube: y a-t-il des reviews/unboxings indépendants ?
      
      🎯 Sois honnête: pas de preuve sociale = start from scratch, c'est normal pour un nouveau produit.`

    case 'social-proof-avgReviews':
      return `${baseContext}
      
      💬 AIDE PERSONNALISÉE - Moyenne avis concurrents "${productName}"
      
      Benchmark concurrentiel:
      
      Action Guidée:
      1. Amazon.ca: tape "${productName}" et note le nombre d'avis des 5 premiers résultats
      2. Calcule la moyenne: (avis1 + avis2 + avis3 + avis4 + avis5) ÷ 5
      3. Pour ${category}: identifie les patterns (nouveaux produits vs établis)
      4. Note aussi les notes moyennes (/5 étoiles)
      
      💡 Cette donnée t'aide à estimer combien d'avis tu devras générer pour être crédible.`

    // SECTION FINANCIAL
    case 'financial-marketGrowth':
      return `${baseContext}
      
      📈 AIDE PERSONNALISÉE - Croissance marché "${productName}"
      
      Recherche tendances secteur:
      
      Action Guidée:
      1. Google: "${category} market growth Canada 2024"
      2. Statistique Canada: recherche données secteur ${category}
      3. Amazon trends: observe si les ventes ${category} augmentent
      4. Google Trends: tendance 5 ans pour mots-clés ${category}
      
      🎯 Marché en croissance = vent en poupe, marché stable = plus difficile de percer.`

    case 'financial-legalBarriers':
      return `${baseContext}
      
      ⚖️ AIDE PERSONNALISÉE - Barrières légales "${productName}"
      
      Check réglementaire Canada:
      
      Action Guidée:
      1. Site Health Canada: vérifie si ${category} nécessite des certifications
      2. Pour ${category}: recherche "import ${category} Canada requirements"
      3. Étiquetage: français obligatoire ? Informations nutritionnelles ?
      4. Certifications: CE, FDA, FCC selon ton produit
      
      🎯 Mieux vaut découvrir les contraintes AVANT de commander ton stock !`

    // Default pour autres combinaisons
    default:
      return `${baseContext}
      
      🤖 AIDE CONTEXTUELLE - ${field}
      
      Basé sur votre produit "${productName}" (${category}):
      
      Action Recommandée:
      1. [Étape spécifique basée sur les données du produit]
      2. [Action concrète utilisant le nom/catégorie]
      3. [Conseil optimisé pour le marché canadien]
      
      💡 Pour cette catégorie ${category}: [conseil spécifique à la catégorie]
      
      Avez-vous besoin d'aide plus spécifique sur cet aspect ?`
  }
}

export async function POST(request: Request) {
  let section: string = '', field: string = '', context: any = {}
  try {
    const requestData = await request.json()
    section = requestData.section
    field = requestData.field
    context = requestData.context
    const requestType = requestData.requestType || 'contextual_guidance'
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'API Gemini non configurée' },
        { status: 500 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    let prompt = ''
    
    // Nouveau système de prompts dynamiques contextuels
    if (requestType === 'contextual_guidance') {
      prompt = generateContextualGuidancePrompt(section, field, context)
    } else {
      // Fallback vers l'ancien système
      switch (section) {
        case 'essential':
          prompt = generateEssentialPrompt(field, context)
          break
        case 'pricing':
          prompt = generatePricingPrompt(field, context)
          break
        case 'market-trend':
          prompt = generateMarketTrendPrompt(field, context)
          break
        case 'qualitative':
          prompt = generateQualitativePrompt(field, context)
          break
        case 'competition':
          prompt = generateCompetitionPrompt(field, context)
          break
        case 'social-proof':
          prompt = generateSocialProofPrompt(field, context)
          break
        case 'financial':
          prompt = generateFinancialPrompt(field, context)
          break
        default:
          return NextResponse.json(
            { error: 'Section non reconnue' },
            { status: 400 }
          )
      }
    }

    const result = await model.generateContent(prompt)
    const response = await result.response
    const assistance = response.text()

    return NextResponse.json({
      assistance,
      section,
      field,
      context: {
        productName: context.productName,
        category: context.category
      }
    })
  } catch (error) {
    console.error('Error generating AI assistance:', error)
    
    // Handle Gemini API overload gracefully
    if ((error as any).message?.includes('overloaded') || (error as any).status === 503) {
      return NextResponse.json({
        assistance: getFallbackAssistance(section, field, context),
        section,
        field,
        isFromFallback: true,
        context: {
          productName: context.productName,
          category: context.category
        }
      })
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'assistance' },
      { status: 500 }
    )
  }
}

// Fallback assistance when Gemini is overloaded
function getFallbackAssistance(section: string, field: string, context: any): string {
  const { productName, category } = context
  
  switch (`${section}-${field}`) {
    case 'essential-productName':
      return `💡 AIDE RAPIDE - Nom de produit
      
      Pour "${productName || 'votre produit'}" en ${category || 'votre catégorie'}:
      
      ✅ Checklist nom efficace:
      1. Inclut le bénéfice principal (ex: "correcteur", "intelligent")
      2. Évite les mots trop techniques
      3. Facile à prononcer et mémoriser
      4. Unique dans votre niche
      
      🎯 Testez sur Amazon.ca pour vérifier la concurrence !`
      
    case 'essential-sourcing':
      return `🔍 AIDE RAPIDE - Sourcing fournisseur
      
      Pour trouver "${productName || 'votre produit'}":
      
      ✅ Étapes de base:
      1. Alibaba.com → Recherchez votre produit
      2. Filtrez: Trade Assurance OUI
      3. Minimum 4+ étoiles fournisseur
      4. Demandez échantillons avant commande
      
      💡 API temporairement surchargée - aide basique fournie.`
      
    default:
      return `🤖 AIDE RAPIDE - ${field}
      
      L'assistance IA détaillée est temporairement indisponible (serveur surchargé).
      
      ✅ Conseils généraux:
      1. Recherchez des exemples similaires en ligne
      2. Analysez vos concurrents directs
      3. Testez avec votre audience cible
      
      🔄 Réessayez dans quelques minutes pour une aide personnalisée !`
  }
}

function generateEssentialPrompt(field: string, context: any): string {
  const { productName, category } = context
  
  switch (field) {
    case 'productName':
      return `Suggère 3 noms de produits alternatifs pour un produit dans la catégorie "${category}". Les noms doivent être:
      - Accrocheurs et mémorables
      - Optimisés pour le marché canadien
      - Faciles à prononcer
      - Évocateurs du bénéfice principal
      
      Format: Liste numérotée avec explication courte pour chaque nom.`
      
    case 'description':
      return `Améliore cette description de produit pour la catégorie "${category}":
      Produit: ${productName}
      
      La description doit être:
      - Orientée bénéfices plutôt que caractéristiques
      - Optimisée SEO avec mots-clés naturels
      - Persuasive pour le marché canadien
      - Maximum 100 mots
      
      Écris une description accrocheuse qui donne envie d'acheter.`
      
    case 'category':
      return `Analyse ce produit "${productName}" et suggère la catégorie la plus pertinente parmi:
      - Kitchen (cuisine)
      - Fitness (sport/fitness)
      - Beauty (beauté/soins)
      - Technology (tech/gadgets)
      - Home (maison/décoration)
      - Fashion (mode/accessoires)
      
      Justifie ton choix en 2-3 phrases.`
      
    case 'sourcing':
      return `Pour un produit "${productName}" dans la catégorie "${category}", suggère:
      1. 5 mots-clés de recherche précis pour Alibaba
      2. 3 filtres recommandés (MOQ, prix, certifications)
      3. 2 critères de sélection de fournisseurs fiables
      
      Concentre-toi sur des fournisseurs qualifiés pour l'export vers le Canada.`
      
    default:
      return `Fournis une suggestion pertinente pour le champ "${field}" du produit "${productName}".`
  }
}

function generatePricingPrompt(field: string, context: any): string {
  const { productName, category, unitPrice, desiredSellingPrice } = context
  
  switch (field) {
    case 'unitPrice':
      return `Pour un produit "${productName}" catégorie "${category}", estime une fourchette de prix unitaire réaliste en analysant:
      - Coûts de production typiques pour cette catégorie
      - Marges standards du secteur
      - Qualité attendue par le marché canadien
      
      Donne une fourchette min-max avec justification.`
      
    case 'shipping':
      return `Estime les coûts d'expédition Chine → Canada pour "${productName}":
      - Poids estimé du produit
      - Dimensions approximatives
      - Méthodes d'expédition recommandées
      - Coût par unité selon les quantités
      
      Inclus des conseils pour optimiser les coûts logistiques.`
      
    case 'sellingPrice':
      return `Calcule un prix de vente optimal pour "${productName}" sachant:
      - Prix unitaire: ${unitPrice}€
      - Catégorie: ${category}
      - Marché: Canada
      
      Analyse:
      1. Marge recommandée pour cette catégorie
      2. Prix psychologique optimal
      3. Positionnement concurrentiel
      4. Élasticité prix attendue
      
      Justifie le prix suggéré.`
      
    default:
      return `Analyse le pricing pour "${field}" du produit "${productName}".`
  }
}

function generateMarketTrendPrompt(field: string, context: any): string {
  const { productName, category } = context
  
  switch (field) {
    case 'googleTrends':
      return `Pour analyser "${productName}" sur Google Trends, suggère:
      1. 5 mots-clés principaux à rechercher
      2. 3 mots-clés de longue traîne
      3. Filtres géographiques pour le Canada
      4. Période d'analyse recommandée
      
      Explique comment interpréter les résultats pour cette catégorie "${category}".`
      
    case 'searchVolume':
      return `Évalue le potentiel de recherche pour "${productName}" (${category}):
      - Volume de recherche mensuel estimé au Canada
      - Variantes de mots-clés à analyser
      - Outils recommandés (gratuits et payants)
      - Saisonnalité attendue
      
      Donne des benchmarks pour cette catégorie.`
      
    case 'seasonality':
      return `Analyse la saisonnalité pour "${productName}" (${category}):
      - Périodes de forte/faible demande
      - Facteurs saisonniers au Canada
      - Impact sur la stratégie d'inventaire
      - Opportunités marketing saisonnières
      
      Base ton analyse sur le comportement canadien.`
      
    case 'socialMedia':
      return `Stratégie réseaux sociaux pour "${productName}" (${category}):
      1. Plateformes prioritaires au Canada
      2. Hashtags pertinents (10 suggestions)
      3. Types de contenu viral pour cette catégorie
      4. Influenceurs/créateurs à cibler
      
      Inclus des exemples de posts engageants.`
      
    default:
      return `Analyse des tendances marché pour "${field}" du produit "${productName}".`
  }
}

function generateQualitativePrompt(field: string, context: any): string {
  const { productName, category } = context
  
  return `Évalue objectivement "${productName}" (${category}) pour le critère "${field}":
  
  Fournis:
  1. Une note de 1 à 5 avec justification
  2. 3 points forts
  3. 2 points d'amélioration
  4. Benchmark avec des produits similaires
  5. Conseils pour améliorer ce critère
  
  Sois objectif et constructif dans ton évaluation.`
}

function generateCompetitionPrompt(field: string, context: any): string {
  const { productName, category } = context
  
  switch (field) {
    case 'competitorCount':
      return `Méthode pour compter les concurrents de "${productName}" (${category}):
      1. Requêtes de recherche spécifiques
      2. Plateformes à analyser (Amazon.ca, Google, Shopify)
      3. Critères de définition "concurrent direct"
      4. Outils d'analyse concurrentielle
      
      Donne une méthodologie étape par étape.`
      
    case 'competitorAnalysis':
      return `Analyse concurrentielle pour "${productName}" (${category}):
      1. Critères d'évaluation des concurrents
      2. Signaux de performance à surveiller
      3. Forces/faiblesses typiques du secteur
      4. Opportunités de différenciation
      
      Inclus une checklist d'analyse.`
      
    case 'competitorAds':
      return `Analyse publicitaire concurrentielle pour "${productName}":
      1. Comment utiliser la Meta Ads Library
      2. Indicateurs clés à surveiller
      3. Angles marketing populaires dans "${category}"
      4. Budgets publicitaires estimés
      
      Donne des conseils d'espionnage concurrentiel éthique.`
      
    default:
      return `Analyse concurrentielle pour "${field}" du produit "${productName}".`
  }
}

function generateSocialProofPrompt(field: string, context: any): string {
  const { productName, category } = context
  
  switch (field) {
    case 'reviewAnalysis':
      return `Analyse des avis pour "${productName}" (${category}):
      1. Où chercher des avis pertinents
      2. Métriques importantes à calculer
      3. Signaux de qualité dans les avis
      4. Red flags à éviter
      
      Inclus des conseils pour interpréter les patterns d'avis.`
      
    case 'engagement':
      return `Calcul du taux d'engagement pour "${productName}" (${category}):
      1. Formule exacte par plateforme
      2. Benchmarks sectoriels
      3. Facteurs d'influence
      4. Stratégies d'amélioration
      
      Donne des exemples concrets de calcul.`
      
    default:
      return `Analyse de la preuve sociale pour "${field}" du produit "${productName}".`
  }
}

function generateFinancialPrompt(field: string, context: any): string {
  const { productName, category, unitPrice, desiredSellingPrice } = context
  
  switch (field) {
    case 'grossMargin':
      return `Calcul de marge brute pour "${productName}" (${category}):
      Prix unitaire: ${unitPrice}€
      Prix de vente: ${desiredSellingPrice}€
      
      Analyse:
      1. Formule de calcul complète
      2. Coûts cachés à considérer
      3. Marge optimale pour cette catégorie
      4. Stratégies d'optimisation
      
      Inclus un exemple détaillé.`
      
    case 'breakEven':
      return `Calcul du seuil de rentabilité pour "${productName}":
      1. Méthode de calcul
      2. Coûts fixes à considérer
      3. Variables d'ajustement
      4. Scénarios optimiste/pessimiste
      
      Donne des conseils pour atteindre le seuil rapidement.`
      
    case 'legalBarriers':
      return `Réglementations pour "${productName}" (${category}) au Canada:
      1. Certifications obligatoires
      2. Normes de sécurité
      3. Étiquetage requis
      4. Restrictions d'importation
      5. Coûts de conformité
      
      Inclus les organismes de référence.`
      
    default:
      return `Analyse financière pour "${field}" du produit "${productName}".`
  }
}