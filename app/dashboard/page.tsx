'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import Logo from '@/components/ui/Logo'
import { ProductAnalysisWithUser } from '@/types/product'
import { downloadAnalysisPDF } from '@/lib/pdf-generator'
import Link from 'next/link'

export default function DashboardPage() {
  const [analyses, setAnalyses] = useState<ProductAnalysisWithUser[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'date'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchAnalyses()
  }, [])

  const fetchAnalyses = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/analyses')
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des analyses')
      }
      
      const data = await response.json()
      setAnalyses(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching analyses:', error)
      setError('Erreur lors du chargement des analyses')
      setAnalyses([])
    } finally {
      setLoading(false)
    }
  }

  const deleteAnalysis = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette analyse ? Cette action est irréversible.')) {
      return
    }

    setDeletingId(id)
    try {
      const response = await fetch(`/api/analyses/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      // Refresh the analyses list
      await fetchAnalyses()
    } catch (error) {
      console.error('Error deleting analysis:', error)
      alert('Erreur lors de la suppression de l\'analyse')
    } finally {
      setDeletingId(null)
    }
  }

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const selectAllItems = () => {
    if (selectedItems.length === filteredAndSortedAnalyses.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredAndSortedAnalyses.map(item => item.id))
    }
  }

  const deleteBulkAnalyses = async () => {
    if (selectedItems.length === 0) return

    const count = selectedItems.length
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${count} analyse${count > 1 ? 's' : ''} ? Cette action est irréversible.`)) {
      return
    }

    setBulkDeleting(true)
    try {
      const deletePromises = selectedItems.map(id => 
        fetch(`/api/analyses/${id}`, { method: 'DELETE' })
      )
      
      await Promise.all(deletePromises)
      setSelectedItems([])
      await fetchAnalyses()
    } catch (error) {
      console.error('Error bulk deleting analyses:', error)
      alert('Erreur lors de la suppression des analyses')
    } finally {
      setBulkDeleting(false)
    }
  }

  const handleExportSelected = async () => {
    if (selectedItems.length === 0) {
      alert('Veuillez sélectionner au moins un produit à exporter')
      return
    }

    setExporting(true)
    try {
      // Export each selected analysis
      for (const analysisId of selectedItems) {
        const analysis = analyses.find(a => a.id === analysisId)
        if (analysis) {
          await downloadAnalysisPDF(analysisId, analysis.productName)
          // Add a small delay between downloads to avoid overwhelming the browser
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
      
      // Clear selections after successful export
      setSelectedItems([])
      alert(`${selectedItems.length} rapport(s) exporté(s) avec succès !`)
    } catch (error) {
      console.error('Error exporting PDFs:', error)
      alert('Erreur lors de l\'exportation. Veuillez réessayer.')
    } finally {
      setExporting(false)
    }
  }

  // Calculate gross margin for each analysis
  const analysesWithMargin = analyses.map(analysis => {
    const totalCost = (analysis.unitPrice || 0) + (analysis.shippingCost || 0) + (analysis.brandingCost || 0)
    const sellingPrice = analysis.desiredSellingPrice || 0
    const grossMarginPercentage = sellingPrice > 0 ? ((sellingPrice - totalCost) / sellingPrice) * 100 : 0
    return {
      ...analysis,
      grossMarginPercentage: Math.max(0, grossMarginPercentage) // Ensure positive value
    }
  })

  const filteredAndSortedAnalyses = analysesWithMargin
    .filter(analysis => {
      const matchesSearch = analysis.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analysis.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || analysis.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'name':
          aValue = a.productName.toLowerCase()
          bValue = b.productName.toLowerCase()
          break
        case 'score':
          aValue = a.finalScore || 0
          bValue = b.finalScore || 0
          break
        case 'date':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        default:
          return 0
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-400'
    if (score >= 80) return 'text-emerald-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-amber-600'
    return 'text-red-600'
  }

  const getScoreBadgeColor = (score: number | null) => {
    if (!score) return 'border-gray-300 text-gray-600 bg-gray-50'
    if (score >= 80) return 'border-emerald-200 text-emerald-700 bg-emerald-50'
    if (score >= 60) return 'border-blue-200 text-blue-700 bg-blue-50'
    if (score >= 40) return 'border-amber-200 text-amber-700 bg-amber-50'
    return 'border-red-200 text-red-700 bg-red-50'
  }

  const getPerformanceIndicator = (score: number | null) => {
    if (!score) return { color: 'bg-gray-400', label: 'N/A' }
    if (score >= 80) return { color: 'bg-emerald-500', label: 'Excellent' }
    if (score >= 60) return { color: 'bg-blue-500', label: 'Bon' }
    if (score >= 40) return { color: 'bg-amber-500', label: 'Moyen' }
    return { color: 'bg-red-500', label: 'Faible' }
  }

  const categories = Array.from(new Set(analysesWithMargin.map(a => a.category)))
  const topPerformers = analysesWithMargin
    .filter(a => a.finalScore && a.finalScore >= 80)
    .sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0))
    .slice(0, 3)

  const avgScore = analyses.length > 0 
    ? analyses.reduce((acc, a) => acc + (a.finalScore || 0), 0) / analyses.length
    : 0

  const avgMargin = analysesWithMargin.length > 0 
    ? analysesWithMargin.reduce((acc, a) => acc + (a.grossMarginPercentage || 0), 0) / analysesWithMargin.length
    : 0

  const totalRevenuePotential = analyses.reduce((acc, a) => {
    const price = a.desiredSellingPrice || 0
    const volume = a.monthlySearchVolume || 0
    return acc + (price * volume * 0.01) // Estimation conservative
  }, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>
            </div>
            <p className="mt-6 text-lg text-gray-700 font-light">Chargement de votre tableau de bord...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 border-2 border-gray-400 rounded-sm"></div>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 mb-6 max-w-md mx-auto">
              <div className="text-gray-800 font-medium">{error}</div>
            </div>
            <Button onClick={fetchAnalyses} className="bg-black text-white hover:bg-gray-800 font-medium tracking-wide">
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Same Line Layout */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Layout horizontal - Logo, Titre, Bouton */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="block sm:hidden">
                <Logo size="md" variant="icon" showText={false} />
              </div>
              <div className="hidden sm:block">
                <Logo size="lg" variant="horizontal" showText={false} />
              </div>
            </div>
            
            {/* Titre et description - Centre */}
            <div className="text-center lg:flex-1">
              <h1 className="text-2xl sm:text-3xl font-light text-black tracking-tight">
                Tableau de bord
              </h1>
              <p className="text-sm sm:text-base text-black mt-2 font-light">
                Analyse et gestion de vos produits e-commerce
              </p>
            </div>
            
            {/* Action principale - Droite */}
            <div className="flex-shrink-0">
              <Link href="/analyze">
                <Button className="bg-black text-white hover:bg-gray-800 h-10 sm:h-10 text-sm font-medium tracking-wide px-6">
                  Nouvelle analyse
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Actions de gestion - conditionnelles en dessous */}
          {selectedItems.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 pt-6 border-t border-gray-200">
              <Button 
                onClick={handleExportSelected}
                disabled={exporting}
                variant="outline"
                className="w-full sm:w-auto h-10 border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium px-6 flex items-center gap-2"
              >
                {exporting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                <span className="hidden sm:inline">Exporter</span>
                <span className="sm:hidden">Exporter les données</span>
                {` (${selectedItems.length})`}
              </Button>
              
              <Button 
                onClick={deleteBulkAnalyses}
                disabled={bulkDeleting}
                variant="outline"
                className="w-full sm:w-auto h-10 border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium px-6 flex items-center gap-2"
              >
                {bulkDeleting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
                Supprimer ({selectedItems.length})
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Quick Stats Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:border-blue-300 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 tracking-wide">Total Produits</p>
                <p className="text-3xl font-light text-blue-900">{analyses.length}</p>
                <p className="text-xs text-blue-600 mt-1 font-light">Analyses complètes</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className={`p-6 border transition-all duration-300 ${
            avgScore >= 80 ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:border-emerald-300'
            : avgScore >= 60 ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300'
            : avgScore >= 40 ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:border-amber-300'
            : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:border-red-300'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium tracking-wide ${
                  avgScore >= 80 ? 'text-emerald-700'
                  : avgScore >= 60 ? 'text-blue-700'
                  : avgScore >= 40 ? 'text-amber-700'
                  : 'text-red-700'
                }`}>Score Moyen</p>
                <p className={`text-3xl font-light ${
                  avgScore >= 80 ? 'text-emerald-900'
                  : avgScore >= 60 ? 'text-blue-900'
                  : avgScore >= 40 ? 'text-amber-900'
                  : 'text-red-900'
                }`}>{Math.round(avgScore)}<span className="text-lg">/100</span></p>
                <p className={`text-xs mt-1 font-light ${
                  avgScore >= 80 ? 'text-emerald-600'
                  : avgScore >= 60 ? 'text-blue-600'
                  : avgScore >= 40 ? 'text-amber-600'
                  : 'text-red-600'
                }`}>Performance globale</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                avgScore >= 80 ? 'bg-emerald-200'
                : avgScore >= 60 ? 'bg-blue-200'
                : avgScore >= 40 ? 'bg-amber-200'
                : 'bg-red-200'
              }`}>
                <svg className={`w-6 h-6 ${
                  avgScore >= 80 ? 'text-emerald-700'
                  : avgScore >= 60 ? 'text-blue-700'
                  : avgScore >= 40 ? 'text-amber-700'
                  : 'text-red-700'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className={`p-6 border transition-all duration-300 ${
            avgMargin >= 50 ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:border-emerald-300'
            : avgMargin >= 30 ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300'
            : avgMargin >= 15 ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:border-amber-300'
            : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:border-red-300'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium tracking-wide ${
                  avgMargin >= 50 ? 'text-emerald-700'
                  : avgMargin >= 30 ? 'text-blue-700'
                  : avgMargin >= 15 ? 'text-amber-700'
                  : 'text-red-700'
                }`}>Marge Moyenne</p>
                <p className={`text-3xl font-light ${
                  avgMargin >= 50 ? 'text-emerald-900'
                  : avgMargin >= 30 ? 'text-blue-900'
                  : avgMargin >= 15 ? 'text-amber-900'
                  : 'text-red-900'
                }`}>{analysesWithMargin.length > 0 ? Math.round(avgMargin) : 0}<span className="text-lg">%</span></p>
                <p className={`text-xs mt-1 font-light ${
                  avgMargin >= 50 ? 'text-emerald-600'
                  : avgMargin >= 30 ? 'text-blue-600'
                  : avgMargin >= 15 ? 'text-amber-600'
                  : 'text-red-600'
                }`}>Rentabilité globale</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                avgMargin >= 50 ? 'bg-emerald-200'
                : avgMargin >= 30 ? 'bg-blue-200'
                : avgMargin >= 15 ? 'bg-amber-200'
                : 'bg-red-200'
              }`}>
                <svg className={`w-6 h-6 ${
                  avgMargin >= 50 ? 'text-emerald-700'
                  : avgMargin >= 30 ? 'text-blue-700'
                  : avgMargin >= 15 ? 'text-amber-700'
                  : 'text-red-700'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:border-purple-300 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 tracking-wide">Potentiel CA</p>
                <p className="text-3xl font-light text-purple-900">{(totalRevenuePotential / 1000).toFixed(0)}<span className="text-lg">K€</span></p>
                <p className="text-xs text-purple-600 mt-1 font-light">Estimation mensuelle</p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Top Performers */}
        {topPerformers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">Meilleures performances</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topPerformers.map((product, index) => (
                <Card key={product.id} className="p-6 bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                      </div>
                      <span className="font-medium text-black">{product.productName}</span>
                    </div>
                    <span className="px-3 py-1 border border-gray-300 rounded-full text-xs font-medium text-gray-700">
                      {Math.round(product.finalScore || 0)}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 font-light">{product.category}</p>
                  <div className="flex justify-between text-xs text-gray-500 font-light">
                    <span>Marge: {Math.round(product.grossMarginPercentage || 0)}%</span>
                    <span>Volume: {product.monthlySearchVolume || 0}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Search - Mobile Optimized */}
        <Card className="p-6 sm:p-8 mb-8 bg-white border border-gray-200">
          <div className="space-y-6">
            {/* Search Bar - Full Width on Mobile */}
            <div className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <Input
                  placeholder="Rechercher par nom de produit ou catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 sm:h-10 w-full border-gray-300 focus:border-black focus:ring-1 focus:ring-black rounded-lg transition-all duration-200 hover:border-gray-400 text-base sm:text-sm font-light"
                />
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end justify-between">
              {/* Bulk Selection */}
              <div className="w-full sm:w-auto">
                <div className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg h-12 sm:h-auto">
                  <input
                    type="checkbox"
                    id="selectAll"
                    checked={selectedItems.length === filteredAndSortedAnalyses.length && filteredAndSortedAnalyses.length > 0}
                    onChange={selectAllItems}
                    className="w-5 h-5 sm:w-4 sm:h-4 text-black border-gray-300 rounded focus:ring-black transition-colors"
                  />
                  <label htmlFor="selectAll" className="text-sm sm:text-xs font-medium text-gray-700 select-none">
                    {selectedItems.length > 0 ? `${selectedItems.length} sélectionné${selectedItems.length > 1 ? 's' : ''}` : 'Tout sélectionner'}
                  </label>
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide hidden sm:block">Catégorie</label>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full sm:min-w-[140px] h-12 sm:h-auto"
                  >
                    <option value="all">Toutes les catégories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Select>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide hidden sm:block">Trier par</label>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'name' | 'score' | 'date')}
                      className="w-full sm:min-w-[120px] h-12 sm:h-auto"
                    >
                      <option value="date">Date</option>
                      <option value="name">Nom</option>
                      <option value="score">Score</option>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide hidden sm:block">Ordre</label>
                    <Select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                      className="w-full sm:min-w-[110px] h-12 sm:h-auto"
                    >
                      <option value="desc">↓ Desc</option>
                      <option value="asc">↑ Asc</option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Products Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredAndSortedAnalyses.length === 0 ? (
            <div className="col-span-full">
              <Card className="p-12 text-center bg-white border border-gray-200">
                <div className="w-16 h-16 border border-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-black mb-4">
                  {searchTerm ? 'Aucun produit trouvé' : 'Commencez votre première analyse'}
                </h3>
                <p className="text-gray-600 mb-8 font-light">
                  {searchTerm 
                    ? 'Essayez de modifier vos critères de recherche'
                    : 'Analysez vos produits pour obtenir des insights précieux'
                  }
                </p>
                {!searchTerm && (
                  <Link href="/analyze">
                    <Button className="bg-black text-white hover:bg-gray-800 font-medium tracking-wide">
                      Analyser un produit
                    </Button>
                  </Link>
                )}
              </Card>
            </div>
          ) : (
            filteredAndSortedAnalyses.map((analysis) => (
              <Card key={analysis.id} className={`overflow-hidden hover:border-gray-300 transition-all duration-300 bg-white group relative border ${
                selectedItems.includes(analysis.id) ? 'border-black bg-gray-50' : 'border-gray-200'
              }`}>
                <div className="p-6">
                  {/* Selection checkbox - Larger touch target */}
                  <div className="absolute top-4 left-4">
                    <div className="p-1">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(analysis.id)}
                        onChange={() => toggleSelectItem(analysis.id)}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                    </div>
                  </div>
                  
                  {/* Header avec Menu Actions - Mobile Optimized */}
                  <div className="flex items-start justify-between mb-6 ml-8 sm:ml-6">
                    <div className="flex-1 pr-4">
                      <h3 className="font-medium text-lg text-black group-hover:text-gray-700 transition-colors">
                        {analysis.productName}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 font-light">{analysis.category}</p>
                    </div>
                    
                    {/* Menu Actions - Mobile Touch Optimized */}
                    <div className="relative group">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="px-3 py-2 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 min-h-[44px] sm:min-h-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </Button>
                      
                      {/* Dropdown Menu - Mobile Touch Optimized */}
                      <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-[180px] sm:min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                        <Link 
                          href={`/analysis/${analysis.id}`}
                          className="flex items-center px-4 py-3 sm:py-2 text-base sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors min-h-[44px] sm:min-h-0"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Voir détails
                        </Link>
                        
                        <Link 
                          href={`/analyze?edit=${analysis.id}`}
                          className="flex items-center px-4 py-3 sm:py-2 text-base sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors min-h-[44px] sm:min-h-0"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Modifier
                        </Link>
                        
                        <button 
                          onClick={async () => {
                            try {
                              await downloadAnalysisPDF(analysis.id, analysis.productName)
                              alert('Rapport PDF exporté avec succès !')
                            } catch (error) {
                              alert('Erreur lors de l\'exportation du PDF')
                            }
                          }}
                          className="w-full flex items-center px-4 py-3 sm:py-2 text-base sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors min-h-[44px] sm:min-h-0"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Export PDF
                        </button>
                        
                        <div className="border-t border-gray-200 my-1"></div>
                        
                        <button 
                          onClick={() => deleteAnalysis(analysis.id)}
                          disabled={deletingId === analysis.id}
                          className="w-full flex items-center px-4 py-3 sm:py-2 text-base sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[44px] sm:min-h-0"
                        >
                          {deletingId === analysis.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-3"></div>
                              Suppression...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Supprimer
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics - Mobile Optimized */}
                  <div className="grid grid-cols-2 gap-4 mb-6 ml-8 sm:ml-6">
                    <div className={`border rounded-lg p-4 min-h-[60px] sm:min-h-0 flex flex-col justify-center transition-all duration-200 ${
                      (analysis.grossMarginPercentage || 0) >= 50 ? 'border-emerald-200 bg-emerald-50'
                      : (analysis.grossMarginPercentage || 0) >= 30 ? 'border-blue-200 bg-blue-50'
                      : (analysis.grossMarginPercentage || 0) >= 15 ? 'border-amber-200 bg-amber-50'
                      : 'border-red-200 bg-red-50'
                    }`}>
                      <p className={`text-xs mb-2 font-medium tracking-wide ${
                        (analysis.grossMarginPercentage || 0) >= 50 ? 'text-emerald-700'
                        : (analysis.grossMarginPercentage || 0) >= 30 ? 'text-blue-700'
                        : (analysis.grossMarginPercentage || 0) >= 15 ? 'text-amber-700'
                        : 'text-red-700'
                      }`}>Marge Brute</p>
                      <p className={`text-lg font-light ${
                        (analysis.grossMarginPercentage || 0) >= 50 ? 'text-emerald-900'
                        : (analysis.grossMarginPercentage || 0) >= 30 ? 'text-blue-900'
                        : (analysis.grossMarginPercentage || 0) >= 15 ? 'text-amber-900'
                        : 'text-red-900'
                      }`}>
                        {analysis.grossMarginPercentage ? `${Math.round(analysis.grossMarginPercentage)}%` : 'N/A'}
                      </p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 min-h-[60px] sm:min-h-0 flex flex-col justify-center">
                      <p className="text-xs text-gray-600 mb-2 font-medium tracking-wide">Volume Recherche</p>
                      <p className="text-lg font-light text-black">
                        {analysis.monthlySearchVolume ? `${(analysis.monthlySearchVolume / 1000).toFixed(1)}K` : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Trend and Competition - Mobile Optimized */}
                  <div className="space-y-4 mb-6 ml-8 sm:ml-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-medium tracking-wide">Tendance Google</span>
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              (analysis.googleTrends12MonthAverage || 0) >= 70 ? 'bg-emerald-500'
                              : (analysis.googleTrends12MonthAverage || 0) >= 50 ? 'bg-blue-500'
                              : (analysis.googleTrends12MonthAverage || 0) >= 30 ? 'bg-amber-500'
                              : 'bg-red-500'
                            }`}
                            style={{ width: `${analysis.googleTrends12MonthAverage || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-light min-w-[32px] text-right text-black">{Math.round(analysis.googleTrends12MonthAverage || 0)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-medium tracking-wide">Concurrence</span>
                      <span className="text-sm font-light text-black">
                        {analysis.competitorCount || 0} concurrents
                      </span>
                    </div>
                  </div>

                  {/* Date et Score - Mobile Optimized */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200 ml-8 sm:ml-6">
                    <span className="text-xs text-gray-500 font-light">
                      {new Date(analysis.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    
                    {/* Score déplacé en bas à droite - Mobile Touch Optimized */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          getPerformanceIndicator(analysis.finalScore ?? 0).color
                        }`}></div>
                        <span className={`px-3 py-2 rounded-full text-sm font-medium min-w-[70px] text-center ${
                          getScoreBadgeColor(analysis.finalScore ?? 0)
                        }`}>
                          {analysis.finalScore ? Math.round(analysis.finalScore) : 'N/A'}/100
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

    </div>
  )
}