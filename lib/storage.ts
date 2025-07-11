// Système de stockage temporaire avec localStorage
// Pour remplacer la base de données en attendant la configuration

export interface StoredAnalysis {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
  finalScore?: number
  // Toutes les propriétés de ProductAnalysisData
  [key: string]: any
}

export interface StoredReport {
  id: string
  productAnalysisId: string
  userId: string
  createdAt: string
  finalScore: number
  customerPersona: string
  swotAnalysis: any
  marketingStrategy: any
  operationalRecommendations: any
}

class LocalStorage {
  private analysesKey = 'product-scorecard-analyses'
  private reportsKey = 'product-scorecard-reports'

  // ANALYSES
  getAnalyses(): StoredAnalysis[] {
    if (typeof window === 'undefined') return []
    try {
      const data = localStorage.getItem(this.analysesKey)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  saveAnalysis(analysis: Omit<StoredAnalysis, 'id' | 'createdAt' | 'updatedAt'>): StoredAnalysis {
    const analyses = this.getAnalyses()
    const newAnalysis: StoredAnalysis = {
      ...analysis,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    analyses.push(newAnalysis)
    localStorage.setItem(this.analysesKey, JSON.stringify(analyses))
    return newAnalysis
  }

  getAnalysisById(id: string): StoredAnalysis | null {
    const analyses = this.getAnalyses()
    return analyses.find(a => a.id === id) || null
  }

  updateAnalysis(id: string, updates: Partial<StoredAnalysis>): StoredAnalysis | null {
    const analyses = this.getAnalyses()
    const index = analyses.findIndex(a => a.id === id)
    
    if (index === -1) return null
    
    analyses[index] = {
      ...analyses[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    localStorage.setItem(this.analysesKey, JSON.stringify(analyses))
    return analyses[index]
  }

  deleteAnalysis(id: string): boolean {
    const analyses = this.getAnalyses()
    const filtered = analyses.filter(a => a.id !== id)
    
    if (filtered.length === analyses.length) return false
    
    localStorage.setItem(this.analysesKey, JSON.stringify(filtered))
    return true
  }

  // REPORTS
  getReports(): StoredReport[] {
    if (typeof window === 'undefined') return []
    try {
      const data = localStorage.getItem(this.reportsKey)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  saveReport(report: Omit<StoredReport, 'id' | 'createdAt'>): StoredReport {
    const reports = this.getReports()
    const newReport: StoredReport = {
      ...report,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    
    reports.push(newReport)
    localStorage.setItem(this.reportsKey, JSON.stringify(reports))
    return newReport
  }

  getReportsByAnalysisId(analysisId: string): StoredReport[] {
    const reports = this.getReports()
    return reports.filter(r => r.productAnalysisId === analysisId)
  }

  // UTILS
  clearAll(): void {
    localStorage.removeItem(this.analysesKey)
    localStorage.removeItem(this.reportsKey)
  }

  // Migrer vers la vraie DB plus tard
  exportData() {
    return {
      analyses: this.getAnalyses(),
      reports: this.getReports()
    }
  }
}

export const localStorage_db = new LocalStorage()