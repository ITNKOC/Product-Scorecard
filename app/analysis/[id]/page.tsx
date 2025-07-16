'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Logo from '@/components/ui/Logo'
import { ProductAnalysisWithUser } from '@/types/product'
import { downloadAnalysisPDF } from '@/lib/pdf-generator'
import { ProfessionalReport } from '@/components/ui/professional-report'
import Link from 'next/link'

export default function AnalysisReportPage() {
  const params = useParams()
  const [analysis, setAnalysis] = useState<ProductAnalysisWithUser | null>(null)
  const [analysisWithMargin, setAnalysisWithMargin] = useState<any>(null)
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [exportingPDF, setExportingPDF] = useState(false)
  const [useProfessionalReport, setUseProfessionalReport] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchAnalysis(params.id as string)
    }
  }, [params.id])

  const fetchAnalysis = async (id: string) => {
    try {
      const response = await fetch(`/api/analyses/${id}`)
      const data = await response.json()
      setAnalysis(data)
      
      // Calculate gross margin
      const totalCost = (data.unitPrice || 0) + (data.shippingCost || 0) + (data.brandingCost || 0)
      const sellingPrice = data.desiredSellingPrice || 0
      const grossMarginPercentage = sellingPrice > 0 ? ((sellingPrice - totalCost) / sellingPrice) * 100 : 0
      const dataWithMargin = {
        ...data,
        grossMarginPercentage: Math.max(0, grossMarginPercentage)
      }
      setAnalysisWithMargin(dataWithMargin)
      
      // Fetch existing report if available
      if (data.analysisReports && data.analysisReports.length > 0) {
        setReport(data.analysisReports[0])
      }
    } catch (error) {
      console.error('Error fetching analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async () => {
    if (!analysis) return
    
    setGenerating(true)
    try {
      const endpoint = useProfessionalReport ? '/api/generate-professional-report' : '/api/generate-analysis-report'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ analysisId: analysis.id })
      })
      const newReport = await response.json()
      setReport(newReport)
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setGenerating(false)
    }
  }

  const regenerateReport = async () => {
    if (!analysis) return
    
    setRegenerating(true)
    try {
      const response = await fetch('/api/generate-professional-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ analysisId: analysis.id, regenerate: true })
      })
      const newReport = await response.json()
      setReport(newReport)
    } catch (error) {
      console.error('Error regenerating report:', error)
    } finally {
      setRegenerating(false)
    }
  }

  const handleExportPDF = async () => {
    if (!analysis) return
    
    setExportingPDF(true)
    try {
      await downloadAnalysisPDF(analysis.id, analysis.productName)
      alert('Rapport PDF exporté avec succès !')
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Erreur lors de l\'exportation du PDF')
    } finally {
      setExportingPDF(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-amber-600'
    return 'text-red-600'
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (score >= 60) return 'bg-blue-50 text-blue-700 border-blue-200'
    if (score >= 40) return 'bg-amber-50 text-amber-700 border-amber-200'
    return 'bg-red-50 text-red-700 border-red-200'
  }

  const getPerformanceIndicator = (score: number) => {
    if (score >= 80) return { color: 'bg-emerald-500', label: 'Excellent' }
    if (score >= 60) return { color: 'bg-blue-500', label: 'Bon' }
    if (score >= 40) return { color: 'bg-amber-500', label: 'Moyen' }
    return { color: 'bg-red-500', label: 'Faible' }
  }

  const getMarginColor = (margin: number) => {
    if (margin >= 50) return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', textValue: 'text-emerald-900' }
    if (margin >= 30) return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', textValue: 'text-blue-900' }
    if (margin >= 15) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', textValue: 'text-amber-900' }
    return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', textValue: 'text-red-900' }
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Bon'
    if (score >= 40) return 'Moyen'
    return 'Faible'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="w-12 h-12 border-2 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>
            <p className="mt-6 text-lg text-gray-700 font-light">Chargement de l'analyse...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analysis || !analysisWithMargin) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-light text-black mb-6">Analyse non trouvée</h1>
            <Link href="/dashboard">
              <Button className="bg-black text-white hover:bg-gray-800 font-medium tracking-wide">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour au dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Layout horizontal comme le dashboard */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            {/* Logo - Compact */}
            <div className="flex-shrink-0">
              <Logo size="md" variant="icon" showText={false} />
            </div>
            
            {/* Informations produit - Centre */}
            <div className="text-center lg:flex-1">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
                <h1 className="text-2xl sm:text-3xl font-light text-black tracking-tight break-words">{analysis.productName}</h1>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    getPerformanceIndicator(analysis.finalScore || 0).color
                  }`}></div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    getScoreBadgeColor(analysis.finalScore || 0)
                  }`}>
                    {analysis.finalScore ? Math.round(analysis.finalScore) : 'N/A'}/100
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-2 text-gray-700 font-light">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {analysis.category}
                </span>
                <span className="flex items-center gap-2 text-gray-700 font-light">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Analysé le {new Date(analysis.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            {/* Actions - Droite */}
            <div className="flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full sm:w-auto h-10 border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium tracking-wide flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Dashboard
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto h-10 border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium tracking-wide flex items-center gap-2"
                  onClick={handleExportPDF}
                  disabled={exportingPDF}
                >
                  {exportingPDF ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  Export PDF
                </Button>
                
                <Link href={`/analyze?edit=${analysis.id}`}>
                  <Button variant="outline" className="w-full sm:w-auto h-10 border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium tracking-wide flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modifier
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Score Overview - Mobile Optimized */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Score Card - Mobile Optimized */}
            <Card className={`lg:col-span-2 p-8 border transition-all duration-300 ${
              (analysis.finalScore ?? 0) >= 80 ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200'
              : (analysis.finalScore ?? 0) >= 60 ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
              : (analysis.finalScore ?? 0) >= 40 ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200'
              : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
            }`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left flex-1">
                  <div className="flex items-center gap-3 justify-center sm:justify-start mb-4">
                    <svg className={`w-6 h-6 ${
                      (analysis.finalScore ?? 0) >= 80 ? 'text-emerald-600'
                      : (analysis.finalScore ?? 0) >= 60 ? 'text-blue-600'
                      : (analysis.finalScore ?? 0) >= 40 ? 'text-amber-600'
                      : 'text-red-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h2 className="text-2xl font-light text-black tracking-tight">Score Global</h2>
                  </div>
                  <p className={`text-base mb-4 font-light ${
                    (analysis.finalScore ?? 0) >= 80 ? 'text-emerald-700'
                    : (analysis.finalScore ?? 0) >= 60 ? 'text-blue-700'
                    : (analysis.finalScore ?? 0) >= 40 ? 'text-amber-700'
                    : 'text-red-700'
                  }`}>
                    Évaluation complète basée sur 7 critères de viabilité commerciale
                  </p>
                  <div className="flex justify-center sm:justify-start">
                    {analysis.finalScore && (
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getPerformanceIndicator(analysis.finalScore).color}`}></div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getScoreBadgeColor(analysis.finalScore)}`}>
                          {getScoreLabel(analysis.finalScore)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center flex-shrink-0">
                  {analysis.finalScore ? (
                    <>
                      <div className={`text-5xl lg:text-6xl font-light ${
                        (analysis.finalScore ?? 0) >= 80 ? 'text-emerald-900'
                        : (analysis.finalScore ?? 0) >= 60 ? 'text-blue-900'
                        : (analysis.finalScore ?? 0) >= 40 ? 'text-amber-900'
                        : 'text-red-900'
                      }`}>
                        {Math.round(analysis.finalScore)}
                      </div>
                      <div className={`text-sm mb-4 font-light ${
                        (analysis.finalScore ?? 0) >= 80 ? 'text-emerald-600'
                        : (analysis.finalScore ?? 0) >= 60 ? 'text-blue-600'
                        : (analysis.finalScore ?? 0) >= 40 ? 'text-amber-600'
                        : 'text-red-600'
                      }`}>sur 100 points</div>
                      {/* Progress bar - Mobile Responsive */}
                      <div className="w-32 h-2 bg-gray-200 rounded-full mx-auto">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            (analysis.finalScore ?? 0) >= 80 ? 'bg-emerald-500' :
                            (analysis.finalScore ?? 0) >= 60 ? 'bg-blue-500' :
                            (analysis.finalScore ?? 0) >= 40 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${analysis.finalScore ?? 0}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="text-3xl sm:text-4xl font-bold text-gray-400">N/A</div>
                  )}
                </div>
              </div>
            </Card>

            {/* Key Metrics */}
            <div className="space-y-4">
              <Card className={`p-6 border transition-all duration-300 ${
                getMarginColor(analysisWithMargin.grossMarginPercentage || 0).bg
              } ${getMarginColor(analysisWithMargin.grossMarginPercentage || 0).border}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm font-medium tracking-wide ${
                      getMarginColor(analysisWithMargin.grossMarginPercentage || 0).text
                    }`}>Marge Brute</div>
                    <div className={`text-2xl font-light ${
                      getMarginColor(analysisWithMargin.grossMarginPercentage || 0).textValue
                    }`}>
                      {analysisWithMargin.grossMarginPercentage ? `${Math.round(analysisWithMargin.grossMarginPercentage)}%` : 'N/A'}
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    (analysisWithMargin.grossMarginPercentage || 0) >= 50 ? 'bg-emerald-200'
                    : (analysisWithMargin.grossMarginPercentage || 0) >= 30 ? 'bg-blue-200'
                    : (analysisWithMargin.grossMarginPercentage || 0) >= 15 ? 'bg-amber-200'
                    : 'bg-red-200'
                  }`}>
                    <svg className={`w-6 h-6 ${
                      (analysisWithMargin.grossMarginPercentage || 0) >= 50 ? 'text-emerald-700'
                      : (analysisWithMargin.grossMarginPercentage || 0) >= 30 ? 'text-blue-700'
                      : (analysisWithMargin.grossMarginPercentage || 0) >= 15 ? 'text-amber-700'
                      : 'text-red-700'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </Card>

              <Card className={`p-6 border transition-all duration-300 ${
                (analysis.googleTrends12MonthAverage || 0) >= 70 ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200'
                : (analysis.googleTrends12MonthAverage || 0) >= 50 ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
                : (analysis.googleTrends12MonthAverage || 0) >= 30 ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200'
                : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm font-medium tracking-wide ${
                      (analysis.googleTrends12MonthAverage || 0) >= 70 ? 'text-emerald-600'
                      : (analysis.googleTrends12MonthAverage || 0) >= 50 ? 'text-blue-600'
                      : (analysis.googleTrends12MonthAverage || 0) >= 30 ? 'text-amber-600'
                      : 'text-red-600'
                    }`}>Tendance</div>
                    <div className={`text-2xl font-light ${
                      (analysis.googleTrends12MonthAverage || 0) >= 70 ? 'text-emerald-900'
                      : (analysis.googleTrends12MonthAverage || 0) >= 50 ? 'text-blue-900'
                      : (analysis.googleTrends12MonthAverage || 0) >= 30 ? 'text-amber-900'
                      : 'text-red-900'
                    }`}>
                      {analysis.googleTrends12MonthAverage ? `${Math.round(analysis.googleTrends12MonthAverage)}/100` : 'N/A'}
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    (analysis.googleTrends12MonthAverage || 0) >= 70 ? 'bg-emerald-200'
                    : (analysis.googleTrends12MonthAverage || 0) >= 50 ? 'bg-blue-200'
                    : (analysis.googleTrends12MonthAverage || 0) >= 30 ? 'bg-amber-200'
                    : 'bg-red-200'
                  }`}>
                    <svg className={`w-6 h-6 ${
                      (analysis.googleTrends12MonthAverage || 0) >= 70 ? 'text-emerald-700'
                      : (analysis.googleTrends12MonthAverage || 0) >= 50 ? 'text-blue-700'
                      : (analysis.googleTrends12MonthAverage || 0) >= 30 ? 'text-amber-700'
                      : 'text-red-700'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </Card>

              <Card className={`p-6 border transition-all duration-300 ${
                (analysis.competitionLevel || 0) <= 2 ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200'
                : (analysis.competitionLevel || 0) <= 3 ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
                : (analysis.competitionLevel || 0) <= 4 ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200'
                : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm font-medium tracking-wide ${
                      (analysis.competitionLevel || 0) <= 2 ? 'text-emerald-600'
                      : (analysis.competitionLevel || 0) <= 3 ? 'text-blue-600'
                      : (analysis.competitionLevel || 0) <= 4 ? 'text-amber-600'
                      : 'text-red-600'
                    }`}>Concurrence</div>
                    <div className={`text-2xl font-light ${
                      (analysis.competitionLevel || 0) <= 2 ? 'text-emerald-900'
                      : (analysis.competitionLevel || 0) <= 3 ? 'text-blue-900'
                      : (analysis.competitionLevel || 0) <= 4 ? 'text-amber-900'
                      : 'text-red-900'
                    }`}>
                      {analysis.competitorCount !== null ? `${analysis.competitorCount}` : 'N/A'}
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    (analysis.competitionLevel || 0) <= 2 ? 'bg-emerald-200'
                    : (analysis.competitionLevel || 0) <= 3 ? 'bg-blue-200'
                    : (analysis.competitionLevel || 0) <= 4 ? 'bg-amber-200'
                    : 'bg-red-200'
                  }`}>
                    <svg className={`w-6 h-6 ${
                      (analysis.competitionLevel || 0) <= 2 ? 'text-emerald-700'
                      : (analysis.competitionLevel || 0) <= 3 ? 'text-blue-700'
                      : (analysis.competitionLevel || 0) <= 4 ? 'text-amber-700'
                      : 'text-red-700'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Detailed Metrics Grid - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="text-xs text-gray-500 mb-1">Volume Recherche</div>
              <div className="text-xl font-bold text-gray-900">
                {analysis.monthlySearchVolume ? `${(analysis.monthlySearchVolume / 1000).toFixed(1)}K` : 'N/A'}
              </div>
              <div className="text-xs text-gray-500">par mois</div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="text-xs text-gray-500 mb-1">Prix de Vente</div>
              <div className="text-xl font-bold text-gray-900">
                {analysis.desiredSellingPrice ? `${analysis.desiredSellingPrice}€` : 'N/A'}
              </div>
              <div className="text-xs text-gray-500">prix souhaité</div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="text-xs text-gray-500 mb-1">Niveau Concurrence</div>
              <div className="text-xl font-bold text-gray-900">
                {analysis.competitionLevel ? `${analysis.competitionLevel}/5` : 'N/A'}
              </div>
              <div className="text-xs text-gray-500">intensité</div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="text-xs text-gray-500 mb-1">Note Moyenne</div>
              <div className="text-xl font-bold text-gray-900">
                {analysis.averageRating ? `${analysis.averageRating}/5` : 'N/A'}
              </div>
              <div className="text-xs text-gray-500">produits similaires</div>
            </Card>
          </div>

          {/* Product Details - Mobile Optimized */}
          <Card className="p-4 sm:p-6 mb-6 sm:mb-8 bg-white">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">📋</span>
              Informations Produit
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {analysis.productDescription}
                  </p>
                </div>

                {analysis.sourcingUrl && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Fournisseur</h4>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600">🔗</span>
                        <a 
                          href={analysis.sourcingUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline font-medium"
                        >
                          Voir la source du produit
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Caractéristiques & Logistique</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium text-gray-700">Stock Minimum</div>
                      <div className="text-gray-600">{analysis.minimumStock ? `${analysis.minimumStock} unités` : 'N/A'}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium text-gray-700">Délai Livraison</div>
                      <div className="text-gray-600">{analysis.deliveryTime ? `${analysis.deliveryTime} jours` : 'N/A'}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium text-gray-700">Fragile</div>
                      <div className="text-gray-600">{analysis.isFragile ? 'Oui' : 'Non'}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium text-gray-700">Variantes</div>
                      <div className="text-gray-600">{Array.isArray(analysis.availableVariants) ? analysis.availableVariants.join(', ') : analysis.availableVariants || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Product Image Display - Enhanced */}
                {analysis.productImageUrl && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Image Produit</h4>
                    <div className="relative group">
                      <img
                        src={analysis.productImageUrl}
                        alt={analysis.productName}
                        className="w-full max-w-sm mx-auto h-64 object-cover rounded-2xl border-2 border-gray-200 shadow-lg transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-xl"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      {/* Fallback */}
                      <div className="hidden w-full max-w-sm mx-auto h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-2 border-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm">Image non disponible</p>
                        </div>
                      </div>
                      {/* Elegant hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-all duration-300"></div>
                      {/* View full size hint */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/70 text-white px-2 py-1 rounded-lg text-xs">
                          Aperçu
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Analyse Financière</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Prix unitaire</span>
                      <span className="font-medium">{analysis.unitPrice}€</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Frais de livraison</span>
                      <span className="font-medium">{analysis.shippingCost || 0}€</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Coût branding</span>
                      <span className="font-medium">{analysis.brandingCost || 0}€</span>
                    </div>
                    {analysis.storageCostPerUnit && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Coût stockage/unité</span>
                        <span className="font-medium">{analysis.storageCostPerUnit}€</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Prix de vente</span>
                      <span className="font-medium text-green-600">{analysis.desiredSellingPrice}€</span>
                    </div>
                    <div className="flex justify-between items-center py-2 bg-green-50 px-3 rounded-lg">
                      <span className="font-medium text-green-800">Marge brute</span>
                      <span className="font-bold text-green-800">{analysisWithMargin.grossMarginPercentage ? `${Math.round(analysisWithMargin.grossMarginPercentage)}%` : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Performance Marché</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Saisonnalité</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        analysis.isSeasonalProduct 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {analysis.isSeasonalProduct ? 'Saisonnier' : 'Toute l\'année'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Croissance marché</span>
                      <span className="font-medium">{analysis.marketGrowthRate ? `${analysis.marketGrowthRate}%` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Engagement social</span>
                      <span className="font-medium">{analysis.socialEngagementRate ? `${analysis.socialEngagementRate}%` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Force preuve sociale</span>
                      <span className="font-medium">{analysis.socialProofStrength ? `${analysis.socialProofStrength}/5` : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Strategic Analysis Section */}
                {(analysis.initialInvestment || analysis.marketingBudget || analysis.legalBarriersLevel || analysis.strategicNotes) && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Analyse Stratégique</h4>
                    <div className="space-y-3">
                      {analysis.initialInvestment && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Investissement initial</span>
                          <span className="font-medium text-blue-600">{analysis.initialInvestment}€</span>
                        </div>
                      )}
                      {analysis.marketingBudget && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Budget marketing</span>
                          <span className="font-medium text-purple-600">{analysis.marketingBudget}€</span>
                        </div>
                      )}
                      {analysis.legalBarriersLevel && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Barrières légales</span>
                          <span className={`font-medium ${analysis.legalBarriersLevel <= 2 ? 'text-green-600' : analysis.legalBarriersLevel <= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {analysis.legalBarriersLevel}/5
                          </span>
                        </div>
                      )}
                    </div>
                    {analysis.strategicNotes && (
                      <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                        <div className="font-medium text-gray-700 mb-1">Notes stratégiques</div>
                        <p className="text-sm text-gray-600">{analysis.strategicNotes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Competition Analysis */}
          {(analysis.competitionLevel || analysis.competitorCount || analysis.competitorAdsAnalysis || analysis.differentiationPoints) && (
            <Card className="p-6 bg-white mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">⚔️</span>
                Analyse de la Concurrence
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {analysis.competitionLevel && (
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="text-sm font-medium text-red-600 mb-1">Niveau de Concurrence</div>
                        <div className={`text-2xl font-bold ${
                          analysis.competitionLevel <= 2 ? 'text-green-600' : 
                          analysis.competitionLevel <= 3 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {analysis.competitionLevel}/5
                        </div>
                        <div className="text-xs text-red-500">
                          {analysis.competitionLevel <= 2 ? 'Faible' : 
                           analysis.competitionLevel <= 3 ? 'Modérée' : 'Intense'}
                        </div>
                      </div>
                    )}
                    
                    {analysis.competitorCount && (
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="text-sm font-medium text-purple-600 mb-1">Concurrents Directs</div>
                        <div className="text-2xl font-bold text-purple-900">
                          {analysis.competitorCount}
                        </div>
                        <div className="text-xs text-purple-500">identifiés</div>
                      </div>
                    )}
                  </div>

                  {analysis.differentiationPoints && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">Points de Différenciation</h4>
                      <p className="text-sm text-blue-700 leading-relaxed">{analysis.differentiationPoints}</p>
                    </div>
                  )}
                </div>

                {analysis.competitorAdsAnalysis && (
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">Analyse des Publicités Concurrentes</h4>
                    <p className="text-sm text-orange-700 leading-relaxed">{analysis.competitorAdsAnalysis}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Professional AI Report Section */}
          <Card className="p-6 bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  Rapport d'Analyse Stratégique Professionnel
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Analyse complète avec stratégies marketing, test produit, sourcing et plan d'action
                </p>
              </div>
              {!report && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={useProfessionalReport}
                      onChange={(e) => setUseProfessionalReport(e.target.checked)}
                      className="rounded"
                    />
                    <span>Rapport Professionnel</span>
                  </label>
                  <Button 
                    onClick={generateReport} 
                    disabled={generating}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    {generating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">✨</span>
                        Générer le rapport IA
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {report ? (
              report.reportVersion === 'v2.0-professional' ? (
                <ProfessionalReport 
                  report={report}
                  analysis={analysis}
                  onRegenerate={regenerateReport}
                  regenerating={regenerating}
                />
              ) : (
              <div className="space-y-8">
                {/* Customer Persona */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">👤</span>
                    Persona Client Cible
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{report.customerPersona}</p>
                </div>

                {/* SWOT Analysis */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    Analyse SWOT Complète
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
                      <h5 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                        <span>💪</span>
                        Forces
                      </h5>
                      <ul className="text-sm text-emerald-700 space-y-2">
                        {report.swotAnalysis?.strengths?.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-emerald-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        )) || (
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500 mt-1">•</span>
                            <span>Données non disponibles</span>
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                      <h5 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                        <span>⚠️</span>
                        Faiblesses
                      </h5>
                      <ul className="text-sm text-red-700 space-y-2">
                        {report.swotAnalysis?.weaknesses?.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        )) || (
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>Données non disponibles</span>
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <span>🚀</span>
                        Opportunités
                      </h5>
                      <ul className="text-sm text-blue-700 space-y-2">
                        {report.swotAnalysis?.opportunities?.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        )) || (
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>Données non disponibles</span>
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                      <h5 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                        <span>🛡️</span>
                        Menaces
                      </h5>
                      <ul className="text-sm text-orange-700 space-y-2">
                        {report.swotAnalysis?.threats?.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        )) || (
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            <span>Données non disponibles</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Competitive Analysis */}
                {report.competitiveAnalysis && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-xl">⚔️</span>
                      Analyse Concurrentielle
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-purple-800 mb-2">Positionnement</h5>
                        <p className="text-sm text-purple-700">{report.competitiveAnalysis.positioning}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-purple-800 mb-2">Stratégie de Prix</h5>
                        <p className="text-sm text-purple-700">{report.competitiveAnalysis.priceStrategy}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-purple-800 mb-2">Avantages Concurrentiels</h5>
                        <ul className="text-sm text-purple-700 space-y-1">
                          {report.competitiveAnalysis.advantages.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-purple-800 mb-2">Différenciation</h5>
                        <ul className="text-sm text-purple-700 space-y-1">
                          {report.competitiveAnalysis.differentiation.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Marketing Strategy */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">📈</span>
                    Stratégie Marketing Multi-Canal
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                      <h5 className="font-semibold text-green-800 mb-3">Canaux Prioritaires</h5>
                      <ul className="text-sm text-green-700 space-y-2">
                        {report.marketingStrategy?.channels?.map((channel: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            {channel}
                          </li>
                        )) || (
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Données non disponibles</span>
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
                      <h5 className="font-semibold text-indigo-800 mb-3">Angles Créatifs</h5>
                      <ul className="text-sm text-indigo-700 space-y-2">
                        {report.marketingStrategy?.angles?.map((angle: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                            {angle}
                          </li>
                        )) || (
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                            <span>Données non disponibles</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                  
                  {report.marketingStrategy?.contentStrategy && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-2">Stratégie de Contenu</h5>
                      <p className="text-sm text-gray-700">{report.marketingStrategy?.contentStrategy}</p>
                    </div>
                  )}
                </div>

                {/* Financial Projections */}
                {report.financialProjection && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-xl">💰</span>
                      Projections Financières
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h5 className="font-medium text-green-800 mb-2">Scénario Optimiste</h5>
                        <p className="text-sm text-green-700">{report.financialProjection.optimistic}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h5 className="font-medium text-blue-800 mb-2">Scénario Réaliste</h5>
                        <p className="text-sm text-blue-700">{report.financialProjection.realistic}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h5 className="font-medium text-orange-800 mb-2">Scénario Pessimiste</h5>
                        <p className="text-sm text-orange-700">{report.financialProjection.pessimistic}</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h5 className="font-medium text-purple-800 mb-2">Investissement Initial</h5>
                        <p className="text-sm text-purple-700">{report.financialProjection.initialInvestment}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h5 className="font-medium text-indigo-800 mb-2">ROI Attendu</h5>
                        <p className="text-sm text-indigo-700">{report.financialProjection.roi}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Operational Recommendations */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">⚙️</span>
                    Recommandations Opérationnelles
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <h5 className="font-semibold text-blue-800 mb-2">Quantité de Test</h5>
                        <p className="text-2xl font-bold text-blue-900">{report.operationalRecommendations?.testQuantity || report.productTesting?.quantity || 100} unités</p>
                      </div>
                      {(report.operationalRecommendations?.inventoryStrategy || report.operationalPlan?.inventory) && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-green-800 mb-2">Stratégie d'Inventaire</h5>
                          <p className="text-sm text-green-700">{report.operationalRecommendations?.inventoryStrategy || JSON.stringify(report.operationalPlan?.inventory)}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3">Points de Vigilance</h5>
                      <ul className="space-y-2">
                        {(report.operationalRecommendations?.vigilancePoints || report.riskAssessment ? ['Surveillance continue requise'] : [])?.map((point: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-red-500 mt-1">⚠️</span>
                            <span className="text-gray-700">{point}</span>
                          </li>
                        )) || (
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-red-500 mt-1">⚠️</span>
                            <span className="text-gray-700">Aucun point de vigilance défini</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                  
                  {(report.operationalRecommendations?.kpis || report.kpiDashboard) && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-2">KPIs à Surveiller</h5>
                      <div className="flex flex-wrap gap-2">
                        {(report.operationalRecommendations?.kpis || Object.values(report.kpiDashboard || {}).flat())?.map((kpi: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {kpi}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Plan */}
                {report.actionPlan90Days && (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-xl">🗓️</span>
                      Plan d'Action 90 Jours
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h5 className="font-medium text-blue-800 mb-2">Semaines 1-4</h5>
                        <p className="text-sm text-gray-700">{report.actionPlan90Days.weeks1to4}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h5 className="font-medium text-green-800 mb-2">Semaines 5-8</h5>
                        <p className="text-sm text-gray-700">{report.actionPlan90Days.weeks5to8}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h5 className="font-medium text-purple-800 mb-2">Semaines 9-12</h5>
                        <p className="text-sm text-gray-700">{report.actionPlan90Days.weeks9to12}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              )
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Rapport d'Analyse Stratégique</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Générez un rapport complet avec analyse SWOT, persona client, stratégie marketing multi-canal, 
                  projections financières et plan d'action détaillé sur 90 jours.
                </p>
                <div className="flex justify-center">
                  <Button 
                    onClick={generateReport} 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                  >
                    <span className="mr-2">✨</span>
                    Générer le rapport complet
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  )
}