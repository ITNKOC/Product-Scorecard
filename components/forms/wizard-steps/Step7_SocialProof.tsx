'use client'

import { useProductFormStore } from '@/store/productFormStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AIAssistancePanel } from '@/components/ui/ai-assistance-panel'
import { useState } from 'react'
import { HelpCircle, Star, Users, ThumbsUp, MessageSquare } from 'lucide-react'

export function Step7_SocialProof() {
  const { formData, updateFormData } = useProductFormStore()
  const [activeAssistance, setActiveAssistance] = useState<string | null>(null)

  const handleAssistanceClick = (field: string) => {
    setActiveAssistance(activeAssistance === field ? null : field)
  }

  const getSocialProofLevel = (strength: number) => {
    if (strength >= 4) return { label: 'Très forte', color: 'text-green-600', icon: '🔥' }
    if (strength >= 3) return { label: 'Forte', color: 'text-blue-600', icon: '💪' }
    if (strength >= 2) return { label: 'Modérée', color: 'text-orange-600', icon: '👍' }
    return { label: 'Faible', color: 'text-red-600', icon: '👎' }
  }

  const socialProofInfo = formData.socialProofStrength ? getSocialProofLevel(formData.socialProofStrength) : null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          👥 Preuve Sociale & Avis
        </h2>
        <p className="text-muted-foreground text-sm">
          Évaluons la crédibilité et l'engagement autour de votre produit
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Force de la preuve sociale */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="socialProofStrength" className="text-sm font-medium flex items-center gap-1">
              <Users className="w-4 h-4" />
              Force de la preuve sociale *
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('socialProofStrength')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {[
              { value: 5, label: 'Excellente (viral, millions de vues)', color: 'bg-green-500' },
              { value: 4, label: 'Très bonne (centaines de milliers)', color: 'bg-blue-500' },
              { value: 3, label: 'Bonne (dizaines de milliers)', color: 'bg-indigo-500' },
              { value: 2, label: 'Modérée (quelques milliers)', color: 'bg-orange-500' },
              { value: 1, label: 'Faible (centaines ou moins)', color: 'bg-red-500' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateFormData({ socialProofStrength: option.value })}
                className={`w-full p-3 text-left rounded-lg border transition-all duration-200 ${
                  formData.socialProofStrength === option.value
                    ? `${option.color} text-white border-transparent shadow-lg`
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    formData.socialProofStrength === option.value ? 'bg-white' : option.color
                  }`} />
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>

          {socialProofInfo && (
            <div className={`text-sm ${socialProofInfo.color} flex items-center gap-1 mt-2`}>
              <span>{socialProofInfo.icon}</span>
              Preuve sociale {socialProofInfo.label.toLowerCase()}
            </div>
          )}

          {activeAssistance === 'socialProofStrength' && (
            <AIAssistancePanel
              section="social-proof"
              field="socialProofStrength"
              context={{
                productName: formData.productName,
                category: formData.category,
                description: formData.productDescription
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>

        {/* Nombre d'avis moyen */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="avgReviews" className="text-sm font-medium flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              Nombre d'avis moyen (concurrents)
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('avgReviews')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <Input
            id="avgReviews"
            type="number"
            min="0"
            value={formData.averageReviewCount || ''}
            onChange={(e) => updateFormData({ averageReviewCount: Number(e.target.value) })}
            placeholder="Ex: 250"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-muted-foreground">
            Nombre moyen d'avis des 5 premiers concurrents sur Amazon.ca
          </p>
          {activeAssistance === 'avgReviews' && (
            <AIAssistancePanel
              section="social-proof"
              field="avgReviews"
              context={{
                productName: formData.productName,
                category: formData.category,
                competitionLevel: formData.competitionLevel
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>

        {/* Note moyenne concurrents */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="avgRating" className="text-sm font-medium flex items-center gap-1">
              <Star className="w-4 h-4" />
              Note moyenne concurrents (/5)
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('avgRating')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <Input
            id="avgRating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={formData.averageRating || ''}
            onChange={(e) => updateFormData({ averageRating: Number(e.target.value) })}
            placeholder="Ex: 4.2"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          {formData.averageRating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">{formData.averageRating}/5</span>
              <span className="text-muted-foreground">
                {formData.averageRating >= 4.5 ? 'Excellent' : 
                 formData.averageRating >= 4.0 ? 'Très bon' :
                 formData.averageRating >= 3.5 ? 'Bon' :
                 formData.averageRating >= 3.0 ? 'Moyen' : 'Faible'}
              </span>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Note moyenne des concurrents directs
          </p>
          {activeAssistance === 'avgRating' && (
            <AIAssistancePanel
              section="social-proof"
              field="avgRating"
              context={{
                productName: formData.productName,
                category: formData.category,
                averageReviewCount: formData.averageReviewCount
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>

        {/* Taux d'engagement */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="engagementRate" className="text-sm font-medium flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              Taux d'engagement réseaux sociaux (%)
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('engagementRate')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <Input
            id="engagementRate"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.socialEngagementRate || ''}
            onChange={(e) => updateFormData({ socialEngagementRate: Number(e.target.value) })}
            placeholder="Ex: 3.5"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          {formData.socialEngagementRate && (
            <div className={`text-sm ${
              formData.socialEngagementRate >= 5 ? 'text-green-600' :
              formData.socialEngagementRate >= 3 ? 'text-blue-600' :
              formData.socialEngagementRate >= 1 ? 'text-orange-600' : 'text-red-600'
            }`}>
              {formData.socialEngagementRate >= 5 ? '🔥 Excellent engagement' :
               formData.socialEngagementRate >= 3 ? '👍 Bon engagement' :
               formData.socialEngagementRate >= 1 ? '👌 Engagement moyen' : '👎 Faible engagement'}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            (Likes + Comments + Shares) / Followers × 100
          </p>
          {activeAssistance === 'engagementRate' && (
            <AIAssistancePanel
              section="social-proof"
              field="engagementRate"
              context={{
                productName: formData.productName,
                category: formData.category,
                socialProofStrength: formData.socialProofStrength
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>
      </div>

      {/* Observation UGC */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="ugcObservations" className="text-sm font-medium">
            Observations sur le contenu généré par les utilisateurs
          </Label>
          <button
            type="button"
            onClick={() => handleAssistanceClick('ugcObservations')}
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
        <Input
          id="ugcObservations"
          type="text"
          value={formData.ugcObservations || ''}
          onChange={(e) => updateFormData({ ugcObservations: e.target.value })}
          placeholder="Ex: Posts TikTok fréquents, unboxing populaires, utilisations créatives"
          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-muted-foreground">
          Présence sur TikTok, Instagram, YouTube, etc. - contenu non sponsorisé
        </p>
        {activeAssistance === 'ugcObservations' && (
          <AIAssistancePanel
            section="social-proof"
            field="ugcObservations"
            context={{
              productName: formData.productName,
              category: formData.category,
              socialProofStrength: formData.socialProofStrength
            }}
            onClose={() => setActiveAssistance(null)}
          />
        )}
      </div>

      {/* Analyse preuve sociale */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
          🌟 Analyse Preuve Sociale
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl mb-1">
              {formData.socialProofStrength 
                ? formData.socialProofStrength >= 4 ? '🔥' 
                  : formData.socialProofStrength >= 3 ? '💪' 
                  : formData.socialProofStrength >= 2 ? '👍' : '👎'
                : '❓'
              }
            </div>
            <div className="font-semibold text-gray-700">Force</div>
            <div className="text-muted-foreground">
              {socialProofInfo?.label || 'Non définie'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">💬</div>
            <div className="font-semibold text-gray-700">Avis moy.</div>
            <div className="text-muted-foreground">
              {formData.averageReviewCount ? `${formData.averageReviewCount} avis` : 'Non défini'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">⭐</div>
            <div className="font-semibold text-gray-700">Note moy.</div>
            <div className="text-muted-foreground">
              {formData.averageRating ? `${formData.averageRating}/5` : 'Non définie'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">📱</div>
            <div className="font-semibold text-gray-700">Engagement</div>
            <div className="text-muted-foreground">
              {formData.socialEngagementRate ? `${formData.socialEngagementRate}%` : 'Non défini'}
            </div>
          </div>
        </div>
      </div>

      {/* Alertes preuve sociale */}
      {formData.socialProofStrength && formData.socialProofStrength <= 2 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-medium text-orange-900 mb-2 flex items-center gap-2">
            ⚠️ Preuve Sociale Limitée
          </h4>
          <div className="text-sm text-orange-800 space-y-1">
            <p>• La preuve sociale actuelle est faible - cela peut impacter les conversions</p>
            <p>• Considérez investir dans du marketing d'influence pour générer du contenu</p>
            <p>• Encouragez les premiers clients à partager leur expérience</p>
            <p>• Créez du contenu de démonstration attractif pour lancer la dynamique</p>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progression de l'étape</span>
          <span className="font-medium">
            {[formData.socialProofStrength]
              .filter(value => value !== undefined && value !== null).length} / 1 champ obligatoire
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${([formData.socialProofStrength]
                .filter(value => value !== undefined && value !== null).length / 1) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  )
}