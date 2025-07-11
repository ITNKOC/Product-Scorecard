'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface AIAssistanceButtonProps {
  section: string
  field: string
  onSuggestion?: (suggestion: string) => void
  disabled?: boolean
  productName?: string
  category?: string
  unitPrice?: number
  desiredSellingPrice?: number
  className?: string
  size?: 'sm' | 'default' | 'lg'
}

export function AIAssistanceButton({ 
  section, 
  field, 
  onSuggestion, 
  disabled,
  productName,
  category,
  unitPrice,
  desiredSellingPrice,
  className,
  size = 'sm'
}: AIAssistanceButtonProps) {
  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [showSuggestion, setShowSuggestion] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/assistance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          field,
          context: {
            productName,
            category,
            unitPrice,
            desiredSellingPrice
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération de la suggestion')
      }

      const data = await response.json()
      setSuggestion(data.suggestion)
      setShowSuggestion(true)
      
      if (onSuggestion) {
        onSuggestion(data.suggestion)
      }
    } catch (error) {
      console.error('Error getting AI suggestion:', error)
      setSuggestion('Erreur lors de la génération de la suggestion. Veuillez réessayer.')
      setShowSuggestion(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size={size}
        onClick={handleClick}
        disabled={disabled || loading}
        className={cn(
          "ai-assistance-button gap-2 border-primary/20 text-primary hover:bg-primary/10 shrink-0",
          className
        )}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
      </Button>
      
      {showSuggestion && suggestion && (
        <div className="absolute z-10 mt-2 w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-lg right-0">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-sm">💡 Suggestion IA</h4>
            <button
              onClick={() => setShowSuggestion(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="text-sm text-gray-700 whitespace-pre-wrap">
            {suggestion}
          </div>
        </div>
      )}
    </div>
  )
}