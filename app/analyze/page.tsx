'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductWizard } from '@/components/forms/ProductWizard'

function AnalyzePageContent() {
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const [editData, setEditData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editId) {
      fetchAnalysisData(editId)
    }
  }, [editId])

  const fetchAnalysisData = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analyses/${id}`)
      if (response.ok) {
        const data = await response.json()
        setEditData(data)
      } else {
        console.error('Failed to fetch analysis data')
      }
    } catch (error) {
      console.error('Error fetching analysis data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des données du produit...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Product Wizard */}
        <ProductWizard editData={editData} />
      </div>
    </div>
  )
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    }>
      <AnalyzePageContent />
    </Suspense>
  )
}