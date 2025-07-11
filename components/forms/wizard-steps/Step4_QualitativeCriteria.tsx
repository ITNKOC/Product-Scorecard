'use client'

import { useProductFormStore } from '@/store/productFormStore'
import { Label } from '@/components/ui/label'
import { AIAssistancePanel } from '@/components/ui/ai-assistance-panel'
import { useState } from 'react'
import { HelpCircle, Star, Lightbulb, Wrench, Heart, Zap, Sparkles } from 'lucide-react'

export function Step4_QualitativeCriteria() {
  const { formData, updateFormData } = useProductFormStore()
  const [activeAssistance, setActiveAssistance] = useState<string | null>(null)

  const handleAssistanceClick = (field: string) => {
    setActiveAssistance(activeAssistance === field ? null : field)
  }

  const handleRatingChange = (field: string, value: number) => {
    updateFormData({ [field]: value })
  }

  const handleBooleanChange = (field: string, value: boolean) => {
    updateFormData({ [field]: value })
  }

  const RatingInput = ({ 
    field, 
    label, 
    description,
    icon 
  }: { 
    field: string
    label: string
    description: string
    icon: React.ReactNode
  }) => {
    const currentValue = formData[field as keyof typeof formData] as number
    
    return (
      <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium flex items-center gap-2">
            {icon}
            {label}
          </Label>
          <button
            type="button"
            onClick={() => handleAssistanceClick(field)}
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleRatingChange(field, rating)}
                className={`w-10 h-10 rounded-full border-2 text-sm font-medium transition-all duration-200 ${
                  currentValue === rating
                    ? 'bg-blue-500 text-white border-blue-500 scale-110'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
          {currentValue && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">{currentValue}/5</span>
              <span className="text-muted-foreground">
                {currentValue === 5 ? 'Excellent' : 
                 currentValue === 4 ? 'Très bon' :
                 currentValue === 3 ? 'Bon' :
                 currentValue === 2 ? 'Moyen' : 'Faible'}
              </span>
            </div>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground">{description}</p>
        
        {activeAssistance === field && (
          <AIAssistancePanel
            section="qualitative"
            field={field}
            context={{
              productName: formData.productName,
              category: formData.category,
              description: formData.productDescription
            }}
            onClose={() => setActiveAssistance(null)}
          />
        )}
      </div>
    )
  }

  const BooleanInput = ({ 
    field, 
    label, 
    description,
    icon 
  }: { 
    field: string
    label: string
    description: string
    icon: React.ReactNode
  }) => {
    const currentValue = formData[field as keyof typeof formData] as boolean
    
    return (
      <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium flex items-center gap-2">
            {icon}
            {label}
          </Label>
          <button
            type="button"
            onClick={() => handleAssistanceClick(field)}
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleBooleanChange(field, true)}
            className={`px-6 py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
              currentValue === true
                ? 'bg-green-500 text-white border-green-500 shadow-lg'
                : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
            }`}
          >
            ✅ Oui
          </button>
          <button
            type="button"
            onClick={() => handleBooleanChange(field, false)}
            className={`px-6 py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
              currentValue === false
                ? 'bg-red-500 text-white border-red-500 shadow-lg'
                : 'border-gray-300 hover:border-red-400 hover:bg-red-50'
            }`}
          >
            ❌ Non
          </button>
        </div>
        
        <p className="text-xs text-muted-foreground">{description}</p>
        
        {activeAssistance === field && (
          <AIAssistancePanel
            section="qualitative"
            field={field}
            context={{
              productName: formData.productName,
              category: formData.category,
              description: formData.productDescription
            }}
            onClose={() => setActiveAssistance(null)}
          />
        )}
      </div>
    )
  }

  const calculateQualitativeScore = () => {
    const ratings = [
      formData.wowFactor,
      formData.simplicity,
      formData.easeOfUse,
      formData.beforeAfterPotential
    ].filter(Boolean)
    
    const booleans = [
      formData.solvesProblem,
      formData.isInnovative
    ].filter(val => val === true).length
    
    const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0
    const totalScore = (avgRating + booleans) / 3 * 5 // Normalize to 0-5 scale
    
    return totalScore
  }

  const qualitativeScore = calculateQualitativeScore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          ⭐ Critères Qualitatifs
        </h2>
        <p className="text-muted-foreground text-sm">
          Évaluons les aspects qualitatifs qui influencent l'attractivité de votre produit
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Facteur WOW */}
        <RatingInput
          field="wowFactor"
          label="Facteur WOW *"
          description="Le produit suscite-t-il une réaction immédiate positive ? Fait-il dire 'Wow, c'est génial !' ?"
          icon={<Sparkles className="w-4 h-4 text-yellow-500" />}
        />

        {/* Simplicité */}
        <RatingInput
          field="simplicity"
          label="Simplicité *"
          description="Le produit est-il simple à comprendre et à expliquer en quelques mots ?"
          icon={<Lightbulb className="w-4 h-4 text-blue-500" />}
        />

        {/* Facilité d'utilisation */}
        <RatingInput
          field="easeOfUse"
          label="Facilité d'utilisation *"
          description="Le produit est-il intuitif et facile à utiliser sans formation particulière ?"
          icon={<Wrench className="w-4 h-4 text-green-500" />}
        />

        {/* Potentiel avant/après */}
        <RatingInput
          field="beforeAfterPotential"
          label="Potentiel avant/après"
          description="Le produit permet-il une transformation visible et démontrable ?"
          icon={<Zap className="w-4 h-4 text-purple-500" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Résout un problème */}
        <BooleanInput
          field="solvesProblem"
          label="Résout un vrai problème *"
          description="Le produit adresse-t-il un problème réel et fréquent de votre cible ?"
          icon={<Heart className="w-4 h-4 text-red-500" />}
        />

        {/* Innovation */}
        <BooleanInput
          field="isInnovative"
          label="Innovation"
          description="Le produit apporte-t-il une innovation notable par rapport à l'existant ?"
          icon={<Star className="w-4 h-4 text-indigo-500" />}
        />
      </div>

      {/* Score qualitatif */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
          🎯 Score Qualitatif Global
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-purple-800">
              {qualitativeScore.toFixed(1)}/5.0
            </div>
            <div className="text-sm text-purple-600">
              {qualitativeScore >= 4.5 ? '🏆 Exceptionnel' :
               qualitativeScore >= 4.0 ? '🥇 Excellent' :
               qualitativeScore >= 3.5 ? '🥈 Très bon' :
               qualitativeScore >= 3.0 ? '🥉 Bon' :
               qualitativeScore >= 2.0 ? '⚠️ Moyen' : '❌ Faible'}
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div>Critères notés: {[formData.wowFactor, formData.simplicity, formData.easeOfUse, formData.beforeAfterPotential].filter(Boolean).length}/4</div>
            <div>Questions répondues: {[formData.solvesProblem, formData.isInnovative].filter(val => val !== undefined).length}/2</div>
          </div>
        </div>
      </div>

      {/* Conseils contextuels */}
      {qualitativeScore > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Conseils d'amélioration</h4>
          <div className="text-sm text-blue-800 space-y-1">
            {qualitativeScore < 3 && (
              <p>• Votre produit pourrait bénéficier d'améliorations significatives pour séduire le marché.</p>
            )}
            {!formData.solvesProblem && (
              <p>• Assurez-vous que votre produit résout un vrai problème client avant de continuer.</p>
            )}
            {(formData.wowFactor || 0) < 3 && (
              <p>• Travaillez sur l'aspect "wow" - qu'est-ce qui rend votre produit spécial ?</p>
            )}
            {(formData.simplicity || 0) < 3 && (
              <p>• Simplifiez votre concept - il doit être compréhensible en 10 secondes.</p>
            )}
          </div>
        </div>
      )}

      {/* Progress indicator */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progression de l'étape</span>
          <span className="font-medium">
            {[formData.wowFactor, formData.simplicity, formData.easeOfUse, formData.solvesProblem]
              .filter(value => value !== undefined && value !== null).length} / 4 champs obligatoires
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${([formData.wowFactor, formData.simplicity, formData.easeOfUse, formData.solvesProblem]
                .filter(value => value !== undefined && value !== null).length / 4) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  )
}