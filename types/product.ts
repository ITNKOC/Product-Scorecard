export interface ProductAnalysisData {
  // 1. Essential Information
  productName: string
  productDescription: string
  category: string
  sourcingUrl?: string

  // 2. Pricing & Costs
  unitPrice: number
  shippingCost?: number
  brandingCost?: number
  desiredSellingPrice: number
  competitorPrices: number[]

  // 3. Market Trend & Interest
  googleTrends12MonthAverage?: number
  monthlySearchVolume?: number
  isSeasonalProduct?: boolean
  socialMediaPopularity?: string

  // 4. Qualitative Criteria
  wowFactor?: number // 1-5
  simplicity?: number // 1-5
  easeOfUse?: number // 1-5
  solvesProblem: boolean
  isInnovative: boolean
  beforeAfterPotential?: number // 1-5

  // 5. Competition Analysis
  competitionLevel?: number // 1-5
  competitorCount?: number
  competitorAdsAnalysis?: string
  differentiationPoints?: string

  // 6. Logistics & Stock
  minimumStock?: number
  deliveryTime?: number
  storageCostPerUnit?: number
  isFragile?: boolean
  availableVariants?: string[]

  // 7. Social Proof & Reviews
  socialProofStrength?: number // 1-5
  averageReviewCount?: number
  averageRating?: number
  socialEngagementRate?: number
  ugcObservations?: string

  // 8. Financial & Strategic Data
  initialInvestment?: number
  marketingBudget?: number
  marketGrowthRate?: number
  legalBarriersLevel?: number // 1-5
  strategicNotes?: string
}

export interface AnalysisReport {
  id: string
  finalScore: number
  customerPersona: string
  swotAnalysis: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  marketingStrategy: {
    channels: string[]
    angles: string[]
    recommendedPrice: number
  }
  operationalRecommendations: {
    testQuantity: number
    vigilancePoints: string[]
  }
  createdAt: Date
}

export interface ProductTemplate {
  id: string
  name: string
  category: string
  description?: string
  templateData: Partial<ProductAnalysisData>
}

export interface ProductAnalysisWithUser extends ProductAnalysisData {
  id: string
  userId: string
  createdAt: Date
  updatedAt: Date
  finalScore?: number
  user: {
    id: string
    name: string | null
    email: string
  }
  analysisReports: AnalysisReport[]
}