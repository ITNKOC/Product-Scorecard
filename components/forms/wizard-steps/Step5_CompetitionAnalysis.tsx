'use client'

import { useProductFormStore } from '@/store/productFormStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AIAssistancePanel } from '@/components/ui/ai-assistance-panel'
import { useState } from 'react'
import { HelpCircle, Target, TrendingDown, Users, AlertTriangle } from 'lucide-react'

export function Step5_CompetitionAnalysis() {
  const { formData, updateFormData } = useProductFormStore()
  const [activeAssistance, setActiveAssistance] = useState<string | null>(null)

  const handleAssistanceClick = (field: string) => {
    setActiveAssistance(activeAssistance === field ? null : field)
  }

  const getCompetitionLevel = (level: number) => {
    if (level >= 4) return { label: 'Très faible', color: 'text-green-600', icon: '🟢' }
    if (level >= 3) return { label: 'Faible', color: 'text-blue-600', icon: '🔵' }
    if (level >= 2) return { label: 'Modérée', color: 'text-orange-600', icon: '🟡' }
    return { label: 'Élevée', color: 'text-red-600', icon: '🔴' }
  }

  const competitionInfo = formData.competitionLevel ? getCompetitionLevel(formData.competitionLevel) : null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          🎯 Analyse Concurrence
        </h2>
        <p className="text-muted-foreground text-sm">
          Évaluons l'intensité concurrentielle et votre positionnement sur le marché
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Niveau de concurrence */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="competitionLevel" className="text-sm font-medium flex items-center gap-1">
              <Target className="w-4 h-4" />
              Niveau de concurrence *
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('competitionLevel')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {[
              { value: 5, label: 'Très faible (< 5 concurrents directs)', color: 'bg-green-500' },
              { value: 4, label: 'Faible (5-15 concurrents directs)', color: 'bg-blue-500' },
              { value: 3, label: 'Modérée (15-30 concurrents directs)', color: 'bg-yellow-500' },
              { value: 2, label: 'Élevée (30-50 concurrents directs)', color: 'bg-orange-500' },
              { value: 1, label: 'Très élevée (50+ concurrents directs)', color: 'bg-red-500' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateFormData({ competitionLevel: option.value })}
                className={`w-full p-3 text-left rounded-lg border transition-all duration-200 ${
                  formData.competitionLevel === option.value
                    ? `${option.color} text-white border-transparent shadow-lg`
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    formData.competitionLevel === option.value ? 'bg-white' : option.color
                  }`} />
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>

          {competitionInfo && (
            <div className={`text-sm ${competitionInfo.color} flex items-center gap-1 mt-2`}>
              <span>{competitionInfo.icon}</span>
              Concurrence {competitionInfo.label.toLowerCase()}
            </div>
          )}

          {activeAssistance === 'competitionLevel' && (
            <AIAssistancePanel
              section="competition"
              field="competitionLevel"
              context={{
                productName: formData.productName,
                category: formData.category,
                description: formData.productDescription
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>

        {/* Nombre de concurrents estimé */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="competitorCount" className="text-sm font-medium flex items-center gap-1">
              <Users className="w-4 h-4" />
              Nombre de concurrents (estimation)
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('competitorCount')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <Input
            id="competitorCount"
            type="number"
            min="0"
            value={formData.competitorCount !== undefined ? formData.competitorCount : ''}
            onChange={(e) => {
              const value = e.target.value;
              updateFormData({ competitorCount: value === '' ? undefined : Number(value) });
            }}
            placeholder="Ex: 25"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-muted-foreground">
            Nombre approximatif de concurrents directs trouvés sur Amazon.ca, Google Shopping, etc.
          </p>
          {activeAssistance === 'competitorCount' && (
            <AIAssistancePanel
              section="competition"
              field="competitorCount"
              context={{
                productName: formData.productName,
                category: formData.category,
                competitionLevel: formData.competitionLevel
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>

        {/* Analyse pub concurrents */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="competitorAds" className="text-sm font-medium flex items-center gap-1">
              <TrendingDown className="w-4 h-4" />
              Activité publicitaire des concurrents
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('competitorAds')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <Input
            id="competitorAds"
            type="text"
            value={formData.competitorAdsAnalysis || ''}
            onChange={(e) => updateFormData({ competitorAdsAnalysis: e.target.value })}
            placeholder="Ex: 3 concurrents actifs sur Meta Ads, budgets estimés 500-2000$/mois"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-muted-foreground">
            Observations depuis Meta Ads Library, Google Ads, etc.
          </p>
          {activeAssistance === 'competitorAds' && (
            <AIAssistancePanel
              section="competition"
              field="competitorAds"
              context={{
                productName: formData.productName,
                category: formData.category,
                competitionLevel: formData.competitionLevel
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>

        {/* Points de différenciation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="differentiation" className="text-sm font-medium flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Vos points de différenciation
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('differentiation')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <Input
            id="differentiation"
            type="text"
            value={formData.differentiationPoints || ''}
            onChange={(e) => updateFormData({ differentiationPoints: e.target.value })}
            placeholder="Ex: Design premium, matériaux écologiques, garantie 2 ans"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-muted-foreground">
            Ce qui vous distingue de la concurrence (prix, qualité, design, service, etc.)
          </p>
          {activeAssistance === 'differentiation' && (
            <AIAssistancePanel
              section="competition"
              field="differentiation"
              context={{
                productName: formData.productName,
                category: formData.category,
                description: formData.productDescription,
                competitionLevel: formData.competitionLevel
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>
      </div>

      {/* Analyse concurrentielle */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-medium text-red-900 mb-3 flex items-center gap-2">
          ⚔️ Analyse Concurrentielle
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl mb-1">
              {formData.competitionLevel 
                ? formData.competitionLevel >= 4 ? '🟢' 
                  : formData.competitionLevel >= 3 ? '🔵' 
                  : formData.competitionLevel >= 2 ? '🟡' : '🔴'
                : '❓'
              }
            </div>
            <div className="font-semibold text-gray-700">Intensité</div>
            <div className="text-muted-foreground">
              {competitionInfo?.label || 'Non définie'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">
              {formData.competitorCount 
                ? formData.competitorCount < 10 ? '😌' 
                  : formData.competitorCount < 30 ? '😐' 
                  : formData.competitorCount < 50 ? '😰' : '😱'
                : '❓'
              }
            </div>
            <div className="font-semibold text-gray-700">Concurrents</div>
            <div className="text-muted-foreground">
              {formData.competitorCount ? `${formData.competitorCount} identifiés` : 'Non défini'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">
              {formData.differentiationPoints ? '🎯' : '❓'}
            </div>
            <div className="font-semibold text-gray-700">Différenciation</div>
            <div className="text-muted-foreground">
              {formData.differentiationPoints ? 'Points identifiés' : 'À définir'}
            </div>
          </div>
        </div>
      </div>

      {/* Alertes concurrence */}
      {formData.competitionLevel && formData.competitionLevel <= 2 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
            ⚠️ Alerte Concurrence Élevée
          </h4>
          <div className="text-sm text-red-800 space-y-1">
            <p>• Marché très concurrentiel - différenciation cruciale pour réussir</p>
            <p>• Budget marketing plus important nécessaire pour percer</p>
            <p>• Vérifiez que vos points de différenciation sont réellement uniques</p>
            <p>• Considérez une niche plus spécialisée pour réduire la concurrence directe</p>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progression de l'étape</span>
          <span className="font-medium">
            {[formData.competitionLevel]
              .filter(value => value !== undefined && value !== null).length} / 1 champ obligatoire
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${([formData.competitionLevel]
                .filter(value => value !== undefined && value !== null).length / 1) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  )
}