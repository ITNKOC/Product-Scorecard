'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, Sparkles } from 'lucide-react'
import { Button } from './button'

interface AIAssistancePanelProps {
  section: string
  field: string
  context: {
    productName?: string
    category?: string
    description?: string
    [key: string]: any
  }
  onClose: () => void
}

export function AIAssistancePanel({ section, field, context, onClose }: AIAssistancePanelProps) {
  const [assistance, setAssistance] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAssistance()
  }, [section, field, context])

  const fetchAssistance = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/ai/assistance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          field,
          context,
          requestType: 'contextual_guidance' // Nouveau type pour les prompts dynamiques
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'assistance')
      }

      const data = await response.json()
      setAssistance(data.assistance)
    } catch (err) {
      console.error('Error fetching assistance:', err)
      setError('Impossible de charger l\'assistance IA pour le moment.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatAssistance = (text: string) => {
    // Formatage basique pour améliorer la lisibilité
    return text
      .split('\n')
      .map((line, index) => {
        // Gras pour les titres
        if (line.includes('Action Guidée') || line.includes('💡') || line.includes('🎯')) {
          return <strong key={index} className="text-blue-600 block mb-2">{line}</strong>
        }
        // Listes à puces
        if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
          return <li key={index} className="ml-4 mb-1">{line.replace(/^[-•]\s*/, '')}</li>
        }
        // Numérotation
        if (/^\d+\./.test(line.trim())) {
          return <div key={index} className="ml-2 mb-2 font-medium">{line}</div>
        }
        // Paragraphe normal
        return line.trim() ? <p key={index} className="mb-2">{line}</p> : <br key={index} />
      })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900">
              Assistant IA - {getFieldDisplayName(field)}
            </h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
              <span className="text-muted-foreground">L'IA analyse votre contexte...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">{error}</div>
              <Button onClick={fetchAssistance} variant="outline">
                Réessayer
              </Button>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Conseil personnalisé</strong> basé sur votre produit "{context.productName || 'votre produit'}"
                      {context.category && ` dans la catégorie ${context.category}`}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-gray-700 leading-relaxed">
                {formatAssistance(assistance)}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-3 flex justify-end">
          <Button onClick={onClose} variant="default">
            Compris, merci !
          </Button>
        </div>
      </div>
    </div>
  )
}

function getFieldDisplayName(field: string): string {
  const fieldNames: Record<string, string> = {
    productName: 'Nom du produit',
    category: 'Catégorie',
    description: 'Description',
    sourcing: 'Sourcing fournisseur',
    unitPrice: 'Prix unitaire',
    sellingPrice: 'Prix de vente',
    googleTrends: 'Tendance Google',
    // Ajoutez d'autres mappings selon vos besoins
  }
  
  return fieldNames[field] || field
}